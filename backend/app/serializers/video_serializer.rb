class VideoSerializer
  def self.render(video, current_user: nil, detailed: false)
    return nil unless video

    helpers = Rails.application.routes.url_helpers
    default_host = ENV.fetch("BACKEND_URL", "http://127.0.0.1:3001")

    # Resolve Video URL
    video_attachment = video.active_video_attachment
    video_url = if video_attachment&.attached?
      helpers.rails_blob_url(video_attachment, host: default_host)
    else
      video.video_url
    end

    # Resolve Thumbnail URL
    thumb_attachment = video.active_thumbnail_attachment
    thumbnail_url = if thumb_attachment&.attached?
      helpers.rails_blob_url(thumb_attachment, host: default_host)
    else
      video.thumbnail_url
    end

    data = {
      id: video.id,
      title: video.title,
      slug: video.slug,
      description: video.description,
      aspect_ratio: video.aspect_ratio || "9:16",
      video_type: video.video_type || "upload",
      source_type: video.source_type.presence || (video_attachment&.attached? ? "file" : "external"),
      video_url: video_url,
      thumbnail_url: thumbnail_url,
      has_custom_video: video_attachment&.attached? || false,
      has_custom_thumbnail: thumb_attachment&.attached? || false,
      duration: video.duration,
      width: video.width,
      height: video.height,
      views_count: video.views_count,
      likes_count: video.likes_count,
      comments_count: video.comments_count,
      is_featured: video.is_featured,
      position: video.position,
      status: video.status,
      published_at: video.published_at,
      created_at: video.created_at,
      category: video.category ? { id: video.category.id, name: video.category.name, slug: video.category.slug } : nil,
      tags: video.tags.map { |t| { id: t.id, name: t.name, slug: t.slug } },
      liked_by_current_user: current_user ? current_user.liked?(video) : false
    }

    if detailed
      data[:seo_title] = video.seo_title.presence || "#{video.title} | MRD CINEMA EDITZ"
      data[:seo_description] = video.seo_description.presence || video.description.to_s.truncate(160)
    end

    data
  end

  def self.render_collection(videos, current_user: nil)
    videos.map { |v| render(v, current_user: current_user) }
  end
end
