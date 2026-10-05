class ApplicationController < ActionController::API
  include Pundit::Authorization

  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  attr_reader :current_user

  def authenticate_user!
    header = request.headers["Authorization"]
    token = header.split(" ").last if header.present?

    if token.present?
      decoded = JsonWebToken.decode(token)
      if decoded && decoded[:user_id]
        @current_user = User.active.find_by(id: decoded[:user_id])
      end
    end

    unless @current_user
      render json: { error: "You must be logged in to perform this action" }, status: :unauthorized
    end
  end

  def authenticate_admin!
    authenticate_user!
    return if performed?

    unless @current_user&.admin?
      render json: { error: "Access denied. Admin privileges required." }, status: :forbidden
    end
  end

  def optional_current_user
    header = request.headers["Authorization"]
    token = header.split(" ").last if header.present?

    if token.present?
      decoded = JsonWebToken.decode(token)
      if decoded && decoded[:user_id]
        @current_user = User.active.find_by(id: decoded[:user_id])
      end
    end
  end

  def pagination_dict(collection)
    {
      current_page: collection.current_page,
      next_page: collection.next_page,
      prev_page: collection.prev_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count
    }
  end

  private

  def record_not_found(error)
    render json: { error: error.message || "Record not found" }, status: :not_found
  end

  def record_invalid(error)
    render json: { error: error.record.errors.full_messages.to_sentence, errors: error.record.errors.messages }, status: :unprocessable_entity
  end

  def user_not_authorized
    render json: { error: "You are not authorized to perform this action" }, status: :forbidden
  end
end
