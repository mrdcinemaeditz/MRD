module Api
  module V1
    class SiteSettingsController < ApplicationController
      def index
        settings = SiteSetting.all_hash
        render json: {
          settings: settings
        }, status: :ok
      end
    end
  end
end
