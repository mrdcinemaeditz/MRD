class Testimonial < ApplicationRecord
  has_one_attached :avatar_image

  validates :client_name, presence: true, length: { maximum: 100 }
  validates :content, presence: true, length: { minimum: 5, maximum: 1000 }
  validates :rating, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }

  scope :featured, -> { where(is_featured: true) }
  scope :ordered, -> { order(position: :asc, created_at: :desc) }
end
