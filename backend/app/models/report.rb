class Report < ApplicationRecord
  STATUSES = %w[pending reviewed resolved dismissed].freeze

  belongs_to :user
  belongs_to :comment

  validates :reason, presence: true, length: { minimum: 3, maximum: 500 }
  validates :status, inclusion: { in: STATUSES }

  scope :pending, -> { where(status: "pending") }
  scope :recent, -> { order(created_at: :desc) }
end
