module Api
  module V1
    module Admin
      class VideosController < ApplicationController
        before_action :authenticate_admin!
        before_action :set_video, only: [:show, :update, :destroy, :toggle_featured]

        def index
          videos = Video.includes(:category, :tags, :media_file_attachment, :thumbnail_image_attachment)
          videos = videos.where(status: params[:status]) if params[:status].present?
          videos = videos.where(category_id: params[:category_id]) if params[:category_id].present?
          videos = videos.search_query(params[:q]) if params[:q].present?

          videos = videos.order(position: :asc, created_at: :desc).page(params[:page] || 1).per(params[:per_page] || 20)

          render json: {
            videos: VideoSerializer.render_collection(videos, current_user: current_user),
            pagination: pagination_dict(videos)
          }, status: :ok
        end

        def show
          render json: {
            video: VideoSerializer.render(@video, current_user: current_user, detailed: true)
          }, status: :ok
        end

        def create
          video = Video.new(video_params)

          if video.save
            video.sync_tags!(params[:tag_names]) if params[:tag_names].present?

            render json: {
              video: VideoSerializer.render(video, current_user: current_user, detailed: true),
              message: "Video created successfully"
            }, status: :created
          else
            render json: { error: video.errors.full_messages.to_sentence, errors: video.errors.messages }, status: :unprocessable_entity
          end
        end

        def update
          if @video.update(video_params)
            @video.sync_tags!(params[:tag_names]) if params.key?(:tag_names)

            render json: {
              video: VideoSerializer.render(@video, current_user: current_user, detailed: true),
              message: "Video updated successfully"
            }, status: :ok
          else
            render json: { error: @video.errors.full_messages.to_sentence, errors: @video.errors.messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @video.destroy
          render json: { message: "Video deleted successfully" }, status: :ok
        end

        def toggle_featured
          @video.update!(is_featured: !@video.is_featured)
          render json: {
            is_featured: @video.is_featured,
            message: @video.is_featured ? "Marked as featured" : "Removed from featured"
          }, status: :ok
        end

        def reorder
          if params[:ordered_ids].is_a?(Array)
            params[:ordered_ids].each_with_index do |id, index|
              Video.where(id: id).update_all(position: index)
            end
          end
          render json: { message: "Videos reordered successfully" }, status: :ok
        end

        private

        def set_video
          @video = Video.find(params[:id])
        end

        def video_params
          params.require(:video).permit(
            :title, :slug, :description, :category_id, :video_url, :video_type,
            :thumbnail_url, :aspect_ratio, :duration, :is_featured, :status,
            :published_at, :position, :seo_title, :seo_description,
            :media_file, :thumbnail_image
          )
        end
      end
    end
  end
end
