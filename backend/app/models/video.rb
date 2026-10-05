class Video < ApplicationRecord
  STATUSES = %w[draft published scheduled].freeze
  VIDEO_TYPES = %w[upload youtube instagram vimeo].freeze
  ASPECT_RATIOS = %w[9:16 16:9 1:1 4:5].freeze

  belongs_to :category, optional: true
  has_many :video_tags, dependent: :destroy
  has_many :tags, through: :video_tags
  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :video_views, dependent: :destroy

  has_one_attached :media_file
  has_one_attached :thumbnail_image

  validates :title, presence: true, length: { maximum: 200 }
  validates :slug, presence: true, uniqueness: { case_sensitive: false }
  validates :status, inclusion: { in: STATUSES }
  validates :video_type, inclusion: { in: VIDEO_TYPES }
  validates :aspect_ratio, inclusion: { in: ASPECT_RATIOS }

  before_validation :generate_slug, on: :create
  before_save :set_published_at_if_published

  scope :published, -> {
    where(status: "published")
      .where("published_at IS NULL OR published_at <= ?", Time.current)
  }
  scope :featured, -> { published.where(is_featured: true) }
  scope :ordered, -> { order(position: :asc, published_at: :desc, created_at: :desc) }
  scope :by_category, ->(category_id) { where(category_id: category_id) if category_id.present? }
  scope :search_query, ->(q) {
    if q.present?
      term = "%#{q.downcase}%"
      where("LOWER(title) LIKE ? OR LOWER(description) LIKE ?", term, term)
    end
  }

  def record_view!(ip_hash:, session_token:)
    return false if session_token.blank? && ip_hash.blank?

    recent_view = video_views.where(
      "session_token = ? OR ip_hash = ?", session_token, ip_hash
    ).where("created_at >= ?", 24.hours.ago).exists?

    unless recent_view
      video_views.create!(
        ip_hash: ip_hash,
        session_token: session_token,
        viewed_at: Time.current
      )
      increment!(:views_count)
      true
    else
      false
    end
  end

  def sync_tags!(tag_names)
    return unless tag_names.is_a?(Array)

    new_tags = tag_names.map(&:strip).reject(&:blank?).map do |name|
      Tag.find_or_create_by!(slug: name.parameterize) do |t|
        t.name = name
      end
    end
    self.tags = new_tags
  end

  private

  def generate_slug
    self.slug = title.to_s.parameterize if slug.blank? && title.present?
  end

  def set_published_at_if_published
    self.published_at ||= Time.current if status == "published"
  end
end
