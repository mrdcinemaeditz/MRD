class User < ApplicationRecord
  has_secure_password

  ROLES = %w[user admin].freeze

  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :liked_videos, through: :likes, source: :video
  has_many :reports, dependent: :destroy

  has_one_attached :avatar

  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP, message: "must be a valid email address" }
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :role, inclusion: { in: ROLES }

  before_save :downcase_email

  scope :active, -> { where(is_blocked: false) }
  scope :admins, -> { where(role: "admin") }

  def admin?
    role == "admin"
  end

  def liked?(video)
    likes.exists?(video_id: video.id)
  end

  private

  def downcase_email
    self.email = email.to_s.strip.downcase
  end
end
