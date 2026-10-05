class SendEnquiryNotificationJob < ApplicationJob
  queue_as :default

  def perform(enquiry_id)
    enquiry = Enquiry.find_by(id: enquiry_id)
    return unless enquiry

    # Send admin notification email
    EnquiryMailer.admin_notification_email(enquiry).deliver_now

    # Send visitor confirmation auto-reply email
    EnquiryMailer.visitor_confirmation_email(enquiry).deliver_now
  rescue StandardError => e
    Rails.logger.error("[SendEnquiryNotificationJob] Failed delivering emails for enquiry #{enquiry_id}: #{e.message}")
  end
end
