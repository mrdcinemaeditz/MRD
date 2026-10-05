module Api
  module V1
    class LikesController < ApplicationController
      before_action :authenticate_user!

      def toggle
        video = Video.published.find_by(slug: params[:video_id]) || Video.published.find_by(id: params[:video_id])

        unless video
          render json: { error: "Video not found" }, status: :not_found
          return
        end

        like = Like.find_by(user_id: current_user.id, video_id: video.id)

        if like
          like.destroy
          video.reload
          render json: {
            liked: false,
            likes_count: video.likes_count,
            message: "Unliked"
          }, status: :ok
        else
          video.likes.create!(user: current_user)
          video.reload
          render json: {
            liked: true,
            likes_count: video.likes_count,
            message: "Liked!"
          }, status: :ok
        end
      end
    end
  end
end
