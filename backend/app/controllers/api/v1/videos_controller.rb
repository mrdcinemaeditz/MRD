module Api
  module V1
    class VideosController < ApplicationController
      before_action :optional_current_user, only: [:index, :show, :featured]

      def index
        videos = Video.published.includes(:category, :tags, :media_file_attachment, :thumbnail_image_attachment)
        videos = videos.by_category(params[:category_id]) if params[:category_id].present?
        videos = videos.search_query(params[:q]) if params[:q].present?

        if params[:tag].present?
          tag = Tag.find_by("LOWER(slug) = ? OR LOWER(name) = ?", params[:tag].downcase, params[:tag].downcase)
          videos = videos.joins(:video_tags).where(video_tags: { tag_id: tag.id }) if tag
        end

        videos = videos.ordered.page(params[:page] || 1).per(params[:per_page] || 12)

        render json: {
          videos: VideoSerializer.render_collection(videos, current_user: current_user),
          pagination: pagination_dict(videos)
        }, status: :ok
      end

      def featured
        videos = Video.published.featured
                      .includes(:category, :tags, :media_file_attachment, :thumbnail_image_attachment)
                      .ordered
                      .limit(params[:limit] || 6)

        render json: {
          videos: VideoSerializer.render_collection(videos, current_user: current_user)
        }, status: :ok
      end

      def show
        video = Video.published
                     .includes(:category, :tags, :media_file_attachment, :thumbnail_image_attachment)
                     .find_by(slug: params[:id]) || Video.published.find_by(id: params[:id])

        unless video
          render json: { error: "Video not found" }, status: :not_found
          return
        end

        # Track view (deduplicated by session or IP)
        ip_hash = Digest::SHA256.hexdigest(request.remote_ip.to_s)
        session_token = params[:session_token].presence || request.headers["X-Session-Token"]
        video.record_view!(ip_hash: ip_hash, session_token: session_token)

        # Related videos
        related = Video.published
                       .where.not(id: video.id)
                       .where(category_id: video.category_id)
                       .includes(:category, :tags, :thumbnail_image_attachment)
                       .limit(4)

        render json: {
          video: VideoSerializer.render(video, current_user: current_user, detailed: true),
          related_videos: VideoSerializer.render_collection(related, current_user: current_user)
        }, status: :ok
      end
    end
  end
end
