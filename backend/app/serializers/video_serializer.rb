class VideoSerializer
  def self.render(video, current_user: nil, detailed: false)
    return nil unless video

    data = {
      id: video.id,
      title: video.title,
      slug: video.slug,
      description: video.description,
      aspect_ratio: video.aspect_ratio || "9:16",
      video_type: video.video_type || "upload",
      video_url: video.media_file.attached? ? Rails.application.routes.url_helpers.rails_blob_url(video.media_file, only_path: true) : video.video_url,
      thumbnail_url: video.thumbnail_image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(video.thumbnail_image, only_path: true) : video.thumbnail_url,
      duration: video.duration,
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
