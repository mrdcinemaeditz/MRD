module Api
  module V1
    module Admin
      class CommentsController < ApplicationController
        before_action :authenticate_admin!
        before_action :set_comment, only: [:approve, :flag, :destroy, :block_user]

        def index
          comments = Comment.includes(:user, :video)
          comments = comments.where(status: params[:status]) if params[:status].present?
          comments = comments.recent.page(params[:page] || 1).per(params[:per_page] || 25)

          render json: {
            comments: CommentSerializer.render_collection(comments, current_user: current_user),
            pagination: pagination_dict(comments)
          }, status: :ok
        end

        def approve
          @comment.update!(status: "approved")
          render json: {
            comment: CommentSerializer.render(@comment, current_user: current_user),
            message: "Comment approved"
          }, status: :ok
        end

        def flag
          @comment.update!(status: "flagged")
          render json: {
            comment: CommentSerializer.render(@comment, current_user: current_user),
            message: "Comment flagged"
          }, status: :ok
        end

        def destroy
          video = @comment.video
          @comment.destroy
          video.reload

          render json: { message: "Comment deleted successfully" }, status: :ok
        end

        def block_user
          @comment.user.update!(is_blocked: true)
          @comment.update!(status: "deleted")
          render json: { message: "User #{@comment.user.name} has been blocked and comment removed" }, status: :ok
        end

        def reports
          reports = Report.includes(:user, comment: [:user, :video]).recent.page(params[:page] || 1).per(params[:per_page] || 20)

          rendered_reports = reports.map do |r|
            {
              id: r.id,
              reason: r.reason,
              status: r.status,
              created_at: r.created_at,
              reporter: { id: r.user.id, name: r.user.name, email: r.user.email },
              comment: CommentSerializer.render(r.comment, current_user: current_user),
              video: { id: r.comment.video.id, title: r.comment.video.title, slug: r.comment.video.slug }
            }
          end

          render json: {
            reports: rendered_reports,
            pagination: pagination_dict(reports)
          }, status: :ok
        end

        private

        def set_comment
          @comment = Comment.find(params[:id])
        end
      end
    end
  end
end
