module Api
  module V1
    module Admin
      class PushNotificationsController < ApplicationController
        before_action :authenticate_admin!

        # POST /api/v1/admin/push/register
        def register
          token_str = params[:token].to_s.strip
          if token_str.blank?
            return render json: { error: "Device token is required" }, status: :unprocessable_entity
          end

          platform = params[:platform].presence || "web"
          user_agent = params[:user_agent].presence || request.user_agent

          device_token = current_user.device_tokens.find_or_initialize_by(token: token_str)
          device_token.platform = platform
          device_token.user_agent = user_agent
          device_token.last_used_at = Time.current

          if device_token.save
            render json: {
              message: "Device registered for push notifications successfully",
              device_token: {
                id: device_token.id,
                token: device_token.token,
                platform: device_token.platform,
                created_at: device_token.created_at,
                last_used_at: device_token.last_used_at
              }
            }, status: :ok
          else
            render json: { error: device_token.errors.full_messages.to_sentence }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/admin/push/unregister
        def unregister
          token_str = params[:token].to_s.strip
          if token_str.present?
            current_user.device_tokens.where(token: token_str).destroy_all
          else
            # If no token passed, remove all tokens for current admin device sessions
            current_user.device_tokens.destroy_all
          end

          render json: { message: "Device unregistered successfully" }, status: :ok
        end

        # POST /api/v1/admin/push/test
        def test
          unless FirebaseMessagingService.configured?
            return render json: {
              error: "Firebase Service Account key is missing or invalid in backend/.env. Please generate the private key JSON from Firebase Console > Project Settings > Service Accounts.",
              status: "unconfigured"
            }, status: :unprocessable_entity
          end

          tokens_count = current_user.device_tokens.count
          if tokens_count.zero?
            return render json: {
              error: "No registered device tokens found for this admin account. Please enable push notifications on your browser first."
            }, status: :unprocessable_entity
          end

          service = FirebaseMessagingService.new
          last_result = nil
          current_user.device_tokens.find_each do |token_record|
            last_result = service.send_to_token(
              token_record,
              title: "Test Notification - MRD CINEMA EDITZ",
              body: "Push notification system is connected & operational on this device!",
              url: "/admin/settings"
            )
          end

          if last_result && !last_result[:success]
            render json: {
              error: "Failed to deliver push via Google FCM: #{last_result[:error] || last_result[:status]}",
              details: last_result
            }, status: :unprocessable_entity
          else
            render json: {
              message: "Test push notification dispatched to #{tokens_count} registered device(s)",
              devices_count: tokens_count
            }, status: :ok
          end
        end
      end
    end
  end
end
