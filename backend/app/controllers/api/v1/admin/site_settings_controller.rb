module Api
  module V1
    module Admin
      class SiteSettingsController < ApplicationController
        before_action :authenticate_admin!

        def index
          render json: {
            settings: SiteSetting.all_hash
          }, status: :ok
        end

        def update_bulk
          settings_params = params.require(:settings).permit!

          settings_params.each do |key, value|
            type = value.is_a?(Hash) || value.is_a?(Array) ? "json" : "text"
            category = determine_category(key)
            SiteSetting.set(key, value, category, type)
          end

          render json: {
            settings: SiteSetting.all_hash,
            message: "Site settings updated successfully"
          }, status: :ok
        end

        private

        def determine_category(key)
          k = key.to_s
          if k.start_with?("whatsapp_", "email_", "phone_")
            "contact"
          elsif k.start_with?("social_")
            "social"
          elsif k.start_with?("hero_")
            "hero"
          elsif k.start_with?("media_kit_")
            "media_kit"
          elsif k.start_with?("seo_")
            "seo"
          else
            "general"
          end
        end
      end
    end
  end
end
