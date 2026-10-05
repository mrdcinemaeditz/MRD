class Category < ApplicationRecord
  has_many :videos, dependent: :nullify

  validates :name, presence: true, length: { maximum: 100 }
  validates :slug, presence: true, uniqueness: { case_sensitive: false }

  before_validation :generate_slug, on: :create

  scope :ordered, -> { order(position: :asc, name: :asc) }

  private

  def generate_slug
    self.slug = name.to_s.parameterize if slug.blank? && name.present?
  end
end
