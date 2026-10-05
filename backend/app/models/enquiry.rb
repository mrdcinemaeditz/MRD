class Enquiry < ApplicationRecord
  STATUSES = %w[new read replied archived].freeze

  validates :name, presence: true, length: { maximum: 100 }
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP, message: "must be a valid email address" }
  validates :message, presence: true, length: { minimum: 5, maximum: 3000 }
  validates :status, inclusion: { in: STATUSES }

  scope :recent, -> { order(created_at: :desc) }
  scope :unread, -> { where(read: false) }
  scope :read_items, -> { where(read: true) }

  after_create_commit :enqueue_notifications

  def mark_as_read!
    return true if read?

    update_columns(
      read: true,
      read_at: Time.current,
      status: (status == "new" ? "read" : status),
      updated_at: Time.current
    )
  end

  private

  def enqueue_notifications
    SendEnquiryNotificationJob.perform_later(id)
    SendWhatsappAlertJob.perform_later(id)
  end
end
