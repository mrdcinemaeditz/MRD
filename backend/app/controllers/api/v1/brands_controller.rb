module Api
  module V1
    class BrandsController < ApplicationController
      def index
        brands = Brand.active.ordered
        render json: {
          brands: BrandSerializer.render_collection(brands)
        }, status: :ok
      end
    end
  end
end
