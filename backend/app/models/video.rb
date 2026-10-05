class Video < ApplicationRecord
  STATUSES = %w[draft published scheduled].freeze
  VIDEO_TYPES = %w[upload youtube instagram vimeo].freeze
  SOURCE_TYPES = %w[file external].freeze
  ASPECT_RATIOS = %w[9:16 16:9 1:1 4:5].freeze

  MAX_VIDEO_SIZE = 500.megabytes
  MAX_THUMBNAIL_SIZE = 5.megabytes

  ALLOWED_VIDEO_TYPES = %w[
    video/mp4 video/quicktime video/webm video/x-matroska video/mpeg
  ].freeze

  ALLOWED_THUMBNAIL_TYPES = %w[
    image/jpeg image/png image/webp image/jpg
  ].freeze

  belongs_to :category, optional: true
  has_many :video_tags, dependent: :destroy
  has_many :tags, through: :video_tags
  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :video_views, dependent: :destroy

  # Active Storage attachments
  has_one_attached :video_file, dependent: :purge_later
  has_one_attached :thumbnail, dependent: :purge_later
  
  # Backward-compatible attachments
  has_one_attached :media_file, dependent: :purge_later
  has_one_attached :thumbnail_image, dependent: :purge_later

  validates :title, presence: true, length: { maximum: 200 }
  validates :slug, presence: true, uniqueness: { case_sensitive: false }
  validates :status, inclusion: { in: STATUSES }
  validates :video_type, inclusion: { in: VIDEO_TYPES }
  validates :source_type, inclusion: { in: SOURCE_TYPES }, allow_blank: true
  validates :aspect_ratio, inclusion: { in: ASPECT_RATIOS }

  validate :must_have_video_source
  validate :validate_video_file_attachment
  validate :validate_thumbnail_attachment

  before_validation :generate_slug, on: :create
  before_validation :set_default_source_type
  before_save :set_published_at_if_published
  after_save_commit :enqueue_processing_if_needed

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

  def video_file_attached?
    video_file.attached? || media_file.attached?
  end

  def thumbnail_attached?
    thumbnail.attached? || thumbnail_image.attached?
  end

  def active_video_attachment
    video_file.attached? ? video_file : (media_file.attached? ? media_file : nil)
  end

  def active_thumbnail_attachment
    thumbnail.attached? ? thumbnail : (thumbnail_image.attached? ? thumbnail_image : nil)
  end

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

  def set_default_source_type
    if video_file_attached?
      self.source_type = "file"
    elsif source_type.blank?
      self.source_type = "external"
    end
  end

  def must_have_video_source
    has_file = video_file_attached?
    has_url = video_url.present?

    unless has_file || has_url
      errors.add(:base, "Video must have either an uploaded video file or an external video URL")
    end
  end

  def validate_video_file_attachment
    attachment = active_video_attachment
    return unless attachment&.attached?

    blob = attachment.blob
    return unless blob

    if blob.byte_size > MAX_VIDEO_SIZE
      errors.add(:video_file, "size (#{blob.byte_size / 1.megabyte}MB) exceeds maximum limit of 500MB")
    end

    unless ALLOWED_VIDEO_TYPES.include?(blob.content_type)
      errors.add(:video_file, "format (#{blob.content_type}) is invalid. Accepted formats: mp4, mov, webm")
    end
  end

  def validate_thumbnail_attachment
    attachment = active_thumbnail_attachment
    return unless attachment&.attached?

    blob = attachment.blob
    return unless blob

    if blob.byte_size > MAX_THUMBNAIL_SIZE
      errors.add(:thumbnail, "size (#{blob.byte_size / 1.megabyte}MB) exceeds maximum limit of 5MB")
    end

    unless ALLOWED_THUMBNAIL_TYPES.include?(blob.content_type)
      errors.add(:thumbnail, "format (#{blob.content_type}) is invalid. Accepted formats: jpg, png, webp")
    end
  end

  def generate_slug
    self.slug = title.to_s.parameterize if slug.blank? && title.present?
  end

  def set_published_at_if_published
    self.published_at ||= Time.current if status == "published"
  end

  def enqueue_processing_if_needed
    if video_file_attached?
      ProcessVideoJob.perform_later(id)
    end
  end
end
