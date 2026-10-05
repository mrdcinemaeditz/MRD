require "googleauth"
require "json"
require "net/http"
require "uri"

class FirebaseMessagingService
  FCM_SCOPE = "https://www.googleapis.com/auth/firebase.messaging".freeze

  def self.configured?
    return false if ENV["FIREBASE_PROJECT_ID"].blank?
    return true if ENV["FIREBASE_CREDENTIALS_PATH"].present? && File.exist?(ENV["FIREBASE_CREDENTIALS_PATH"])
    return false if ENV["FIREBASE_CREDENTIALS_JSON"].blank?

    begin
      parsed = JSON.parse(ENV["FIREBASE_CREDENTIALS_JSON"])
      parsed.is_a?(Hash) && (parsed["private_key"].present? || parsed[:private_key].present?)
    rescue StandardError
      false
    end
  end

  def self.send_to_device(device_token_record, title:, body:, data: {}, url: "/admin/enquiries")
    new.send_to_token(device_token_record, title: title, body: body, data: data, url: url)
  end

  def send_to_token(device_token_record, title:, body:, data: {}, url: "/admin/enquiries")
    token = device_token_record.is_a?(DeviceToken) ? device_token_record.token : device_token_record.to_s
    return { success: false, error: "Firebase not configured" } unless self.class.configured?

    project_id = ENV["FIREBASE_PROJECT_ID"]
    fcm_url = URI("https://fcm.googleapis.com/v1/projects/#{project_id}/messages:send")
    access_token = fetch_access_token

    frontend_url = ENV.fetch("FRONTEND_URL", "http://localhost:5173")
    full_url = url.start_with?("http") ? url : "#{frontend_url}#{url}"
    icon_url = "#{frontend_url}/icons/icon-192x192.png"

    payload = {
      message: {
        token: token,
        notification: {
          title: title,
          body: body
        },
        data: data.transform_values(&:to_s),
        webpush: {
          headers: {
            Urgency: "high"
          },
          fcm_options: {
            link: full_url
          },
          notification: {
            title: title,
            body: body,
            icon: icon_url,
            badge: icon_url
          }
        }
      }
    }

    req = Net::HTTP::Post.new(fcm_url)
    req["Authorization"] = "Bearer #{access_token}"
    req["Content-Type"] = "application/json; UTF-8"
    req.body = payload.to_json

    http = Net::HTTP.new(fcm_url.host, fcm_url.port)
    http.use_ssl = true
    http.open_timeout = 5
    http.read_timeout = 10

    res = http.request(req)

    if res.is_a?(Net::HTTPSuccess)
      if device_token_record.is_a?(DeviceToken)
        device_token_record.update_column(:last_used_at, Time.current)
      end
      { success: true, response: (JSON.parse(res.body) rescue {}) }
    else
      handle_fcm_error(res, device_token_record)
    end
  rescue StandardError => e
    Rails.logger.error("[FirebaseMessagingService] Error sending push: #{e.class} - #{e.message}")
    { success: false, error: e.message }
  end

  private

  def fetch_access_token
    credentials_json = ENV["FIREBASE_CREDENTIALS_JSON"]
    credentials_path = ENV["FIREBASE_CREDENTIALS_PATH"]

    io = if credentials_json.present? && File.exist?(credentials_json)
           File.open(credentials_json)
         elsif credentials_json.present?
           StringIO.new(credentials_json)
         elsif credentials_path.present? && File.exist?(credentials_path)
           File.open(credentials_path)
         else
           raise "No Firebase credentials found in ENV"
         end

    authorizer = Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: io,
      scope: FCM_SCOPE
    )
    token_hash = authorizer.fetch_access_token!
    token_hash["access_token"]
  end

  def handle_fcm_error(res, device_token_record)
    body = (JSON.parse(res.body) rescue {})
    error_details = body.dig("error", "details") || []
    error_status = body.dig("error", "status") || res.code

    # Check for invalid / unregistered token error codes (e.g. UNREGISTERED, INVALID_ARGUMENT, 404, 410)
    is_unregistered = error_status == "UNREGISTERED" ||
                      res.code.to_i == 404 ||
                      res.code.to_i == 410 ||
                      error_details.any? { |d| d["errorCode"] == "UNREGISTERED" || d["errorCode"] == "INVALID_ARGUMENT" }

    if is_unregistered && device_token_record.is_a?(DeviceToken)
      Rails.logger.warn("[FirebaseMessagingService] Removing unregistered/invalid token: #{device_token_record.token.to_s.truncate(20)}")
      device_token_record.destroy
    end

    Rails.logger.error("[FirebaseMessagingService] FCM HTTP #{res.code}: #{res.body}")
    { success: false, status: error_status, code: res.code, error: body }
  end
end
