class Tag < ApplicationRecord
  has_many :video_tags, dependent: :destroy
  has_many :videos, through: :video_tags

  validates :name, presence: true, length: { maximum: 50 }
  validates :slug, presence: true, uniqueness: { case_sensitive: false }

  before_validation :generate_slug, on: :create

  private

  def generate_slug
    self.slug = name.to_s.parameterize if slug.blank? && name.present?
  end
end
