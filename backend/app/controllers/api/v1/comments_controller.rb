module Api
  module V1
    class CommentsController < ApplicationController
      before_action :optional_current_user, only: [:index]
      before_action :authenticate_user!, only: [:create, :destroy, :report]

      def index
        video = Video.published.find_by(slug: params[:video_id]) || Video.published.find_by(id: params[:video_id])

        unless video
          render json: { error: "Video not found" }, status: :not_found
          return
        end

        comments = video.comments.approved.includes(:user).recent.page(params[:page] || 1).per(params[:per_page] || 20)

        render json: {
          comments: CommentSerializer.render_collection(comments, current_user: current_user),
          pagination: pagination_dict(comments)
        }, status: :ok
      end

      def create
        video = Video.published.find_by(slug: params[:video_id]) || Video.published.find_by(id: params[:video_id])

        unless video
          render json: { error: "Video not found" }, status: :not_found
          return
        end

        comment = video.comments.new(body: params[:body], user: current_user, status: "approved")
        authorize comment

        if comment.save
          video.reload
          render json: {
            comment: CommentSerializer.render(comment, current_user: current_user),
            comments_count: video.comments_count,
            message: "Comment posted!"
          }, status: :created
        else
          render json: { error: comment.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end

      def destroy
        comment = Comment.find(params[:id])
        authorize comment

        video = comment.video
        comment.destroy
        video.reload

        render json: {
          comments_count: video.comments_count,
          message: "Comment deleted"
        }, status: :ok
      end

      def report
        comment = Comment.find(params[:id])
        authorize comment, :report?

        report = comment.reports.new(user: current_user, reason: params[:reason].presence || "Flagged as inappropriate")

        if report.save
          # Auto-flag if multiple reports
          if comment.reports.count >= 3
            comment.update(status: "flagged")
          end

          render json: { message: "Thank you. This comment has been reported for moderation." }, status: :ok
        else
          render json: { error: report.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end
    end
  end
end
