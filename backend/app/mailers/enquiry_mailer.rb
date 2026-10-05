class EnquiryMailer < ApplicationMailer
  default from: ENV.fetch("MAILER_SENDER", "notifications@mrdcinemaeditz.com")

  def admin_notification_email(enquiry)
    @enquiry = enquiry
    
    # Resolve admin email from SiteSetting, fallback to ENV or default
    setting_email = SiteSetting.find_by(key: "contact_email")&.value
    admin_email = setting_email.presence || ENV.fetch("ADMIN_EMAIL", "admin@mrdcinemaeditz.com")
    frontend_url = ENV.fetch("FRONTEND_URL", "http://localhost:5173")
    @admin_enquiry_url = "#{frontend_url}/admin/enquiries"

    brand_text = @enquiry.brand_name.presence || "Individual Creator"
    subject = "New enquiry from #{@enquiry.name} - #{brand_text}"

    mail(
      to: admin_email,
      reply_to: @enquiry.email,
      subject: subject
    )
  end

  def visitor_confirmation_email(enquiry)
    @enquiry = enquiry
    mail(
      to: @enquiry.email,
      subject: "Thanks for contacting MRD CINEMA EDITZ - We received your message"
    )
  end
end
