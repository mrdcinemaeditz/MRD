class Comment < ApplicationRecord
  STATUSES = %w[approved pending flagged deleted].freeze

  belongs_to :user
  belongs_to :video, counter_cache: true
  has_many :reports, dependent: :destroy

  validates :body, presence: true, length: { minimum: 1, maximum: 1000 }
  validates :status, inclusion: { in: STATUSES }

  scope :approved, -> { where(status: "approved") }
  scope :flagged, -> { where(status: "flagged") }
  scope :recent, -> { order(created_at: :desc) }
end
