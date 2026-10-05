module Api
  module V1
    module Admin
      class DashboardController < ApplicationController
        before_action :authenticate_admin!

        def index
          total_videos = Video.count
          total_views = Video.sum(:views_count)
          total_likes = Like.count
          total_comments = Comment.count
          pending_enquiries = Enquiry.unread.count
          flagged_comments = Comment.where(status: ["flagged", "pending"]).count
          total_users = User.count

          recent_enquiries = Enquiry.recent.limit(5)
          recent_comments = Comment.recent.includes(:user, :video).limit(5)
          top_videos = Video.order(views_count: :desc).limit(5)

          render json: {
            stats: {
              total_videos: total_videos,
              total_views: total_views,
              total_likes: total_likes,
              total_comments: total_comments,
              pending_enquiries: pending_enquiries,
              flagged_comments: flagged_comments,
              total_users: total_users
            },
            recent_enquiries: EnquirySerializer.render_collection(recent_enquiries),
            recent_comments: CommentSerializer.render_collection(recent_comments, current_user: current_user),
            top_videos: VideoSerializer.render_collection(top_videos, current_user: current_user)
          }, status: :ok
        end
      end
    end
  end
end
