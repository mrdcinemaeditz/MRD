class DeviceToken < ApplicationRecord
  belongs_to :user

  validates :token, presence: true, uniqueness: true
  validates :platform, inclusion: { in: %w[web android ios] }

  scope :active, -> { order(last_used_at: :desc) }
end
