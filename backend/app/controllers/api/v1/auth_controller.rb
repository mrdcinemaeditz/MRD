module Api
  module V1
    class AuthController < ApplicationController
      before_action :authenticate_user!, only: [:me, :update_profile]

      def login
        user = User.find_by("LOWER(email) = ?", params[:email].to_s.strip.downcase)

        if user&.authenticate(params[:password])
          if user.is_blocked?
            render json: { error: "Your account has been suspended. Please contact support." }, status: :forbidden
            return
          end

          token = JsonWebToken.encode(user_id: user.id)
          render json: {
            token: token,
            user: UserSerializer.render(user),
            message: "Welcome back, #{user.name}!"
          }, status: :ok
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def register
        user = User.new(register_params)
        user.role = "user"

        if user.save
          token = JsonWebToken.encode(user_id: user.id)
          render json: {
            token: token,
            user: UserSerializer.render(user),
            message: "Account created successfully!"
          }, status: :created
        else
          render json: { error: user.errors.full_messages.to_sentence, errors: user.errors.messages }, status: :unprocessable_entity
        end
      end

      def me
        render json: {
          user: UserSerializer.render(current_user)
        }, status: :ok
      end

      def update_profile
        if params[:password].present?
          unless current_user.authenticate(params[:current_password])
            render json: { error: "Current password does not match" }, status: :unprocessable_entity
            return
          end
        end

        if current_user.update(profile_params)
          render json: {
            user: UserSerializer.render(current_user),
            message: "Profile updated successfully"
          }, status: :ok
        else
          render json: { error: current_user.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end

      private

      def register_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end

      def profile_params
        params.require(:user).permit(:name, :password, :password_confirmation, :avatar_url, :avatar)
      end
    end
  end
end
