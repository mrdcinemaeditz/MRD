require "net/http"
require "uri"

class SendWhatsappAlertJob < ApplicationJob
  queue_as :default

  def perform(enquiry_id)
    # Check if WhatsApp alert setting is enabled
    setting = SiteSetting.find_by(key: "whatsapp_alert_enabled")
    return unless setting&.value.to_s.downcase == "true"

    enquiry = Enquiry.find_by(id: enquiry_id)
    return unless enquiry

    account_sid = ENV["TWILIO_ACCOUNT_SID"]
    auth_token = ENV["TWILIO_AUTH_TOKEN"]
    from_number = ENV["TWILIO_WHATSAPP_FROM"] || "whatsapp:+14155238886"
    
    # Target admin WhatsApp number
    target_phone = SiteSetting.find_by(key: "whatsapp_number")&.value || ENV["ADMIN_WHATSAPP_NUMBER"]
    return if account_sid.blank? || auth_token.blank? || target_phone.blank?

    clean_phone = target_phone.gsub(/[^0-9+]/, "")
    clean_phone = "+#{clean_phone}" unless clean_phone.start_with?("+")
    to_number = clean_phone.start_with?("whatsapp:") ? clean_phone : "whatsapp:#{clean_phone}"

    message_body = "🚨 *NEW MRD CINEMA EDITZ LEAD*\n\n" \
                   "👤 *Client:* #{enquiry.name}\n" \
                   "🏢 *Brand:* #{enquiry.brand_name.presence || 'Individual'}\n" \
                   "📧 *Email:* #{enquiry.email}\n" \
                   "📱 *Phone:* #{enquiry.phone.presence || 'N/A'}\n" \
                   "💰 *Budget:* #{enquiry.budget_range}\n" \
                   "🎬 *Service:* #{enquiry.service_type}\n\n" \
                   "📝 *Message:* #{enquiry.message.to_s.truncate(150)}"

    uri = URI.parse("https://api.twilio.com/2010-04-01/Accounts/#{account_sid}/Messages.json")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth(account_sid, auth_token)
    request.set_form_data({
      "From" => from_number,
      "To" => to_number,
      "Body" => message_body
    })

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    unless response.is_a?(Net::HTTPSuccess)
      Rails.logger.warn("[SendWhatsappAlertJob] Twilio returned #{response.code}: #{response.body}")
    end
  rescue StandardError => e
    Rails.logger.error("[SendWhatsappAlertJob] Skipped WhatsApp notification for enquiry #{enquiry_id}: #{e.message}")
  end
end
