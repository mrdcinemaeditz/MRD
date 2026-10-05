class SendFirebasePushJob < ApplicationJob
  queue_as :default

  def perform(enquiry_id_or_options)
    # Check site setting
    setting = SiteSetting.find_by(key: "push_notifications_enabled")
    if setting && setting.value == "false"
      Rails.logger.info("[SendFirebasePushJob] Push notifications disabled in SiteSettings. Skipping.")
      return
    end

    unless FirebaseMessagingService.configured?
      Rails.logger.info("[SendFirebasePushJob] Firebase credentials not configured. Skipping.")
      return
    end

    if enquiry_id_or_options.is_a?(Hash)
      # Custom / Test notification payload
      title = enquiry_id_or_options[:title] || enquiry_id_or_options["title"] || "MRD CINEMA EDITZ Notification"
      body  = enquiry_id_or_options[:body]  || enquiry_id_or_options["body"]  || "Test push notification"
      data  = enquiry_id_or_options[:data]  || enquiry_id_or_options["data"]  || {}
      url   = enquiry_id_or_options[:url]   || enquiry_id_or_options["url"]   || "/admin/enquiries"
      tokens = if (target_user_id = enquiry_id_or_options[:user_id] || enquiry_id_or_options["user_id"])
                 DeviceToken.where(user_id: target_user_id)
               else
                 DeviceToken.joins(:user).where(users: { role: "admin" })
               end
    else
      enquiry = Enquiry.find_by(id: enquiry_id_or_options)
      return unless enquiry

      brand_prefix = enquiry.brand_name.present? ? "[#{enquiry.brand_name}] " : ""
      title = "New enquiry from #{enquiry.name}"
      body = "#{brand_prefix}#{enquiry.message.to_s.strip.truncate(80)}"
      url = "/admin/enquiries"
      data = {
        enquiry_id: enquiry.id.to_s,
        name: enquiry.name.to_s,
        email: enquiry.email.to_s,
        url: url
      }
      tokens = DeviceToken.joins(:user).where(users: { role: "admin" })
    end

    if tokens.empty?
      Rails.logger.info("[SendFirebasePushJob] No active admin device tokens found.")
      return
    end

    service = FirebaseMessagingService.new
    tokens.find_each do |token_record|
      service.send_to_token(token_record, title: title, body: body, data: data, url: url)
    end
  rescue StandardError => e
    Rails.logger.error("[SendFirebasePushJob] Error executing push job: #{e.class} - #{e.message}")
  end
end
