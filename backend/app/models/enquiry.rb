class Enquiry < ApplicationRecord
  STATUSES = %w[new read replied archived].freeze

  validates :name, presence: true, length: { maximum: 100 }
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP, message: "must be a valid email address" }
  validates :message, presence: true, length: { minimum: 5, maximum: 3000 }
  validates :status, inclusion: { in: STATUSES }

  scope :recent, -> { order(created_at: :desc) }
  scope :unread, -> { where(status: "new") }
end
