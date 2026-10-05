class Brand < ApplicationRecord
  has_one_attached :logo_image

  validates :name, presence: true, length: { maximum: 100 }

  scope :active, -> { where(is_active: true) }
  scope :ordered, -> { order(position: :asc, created_at: :asc) }
end
