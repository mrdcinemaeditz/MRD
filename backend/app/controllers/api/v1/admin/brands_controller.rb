module Api
  module V1
    module Admin
      class BrandsController < ApplicationController
        before_action :authenticate_admin!
        before_action :set_brand, only: [:update, :destroy]

        def index
          brands = Brand.ordered.all
          render json: {
            brands: BrandSerializer.render_collection(brands)
          }, status: :ok
        end

        def create
          brand = Brand.new(brand_params)

          if brand.save
            render json: {
              brand: BrandSerializer.render(brand),
              message: "Brand added successfully"
            }, status: :created
          else
            render json: { error: brand.errors.full_messages.to_sentence }, status: :unprocessable_entity
          end
        end

        def update
          if @brand.update(brand_params)
            render json: {
              brand: BrandSerializer.render(@brand),
              message: "Brand updated successfully"
            }, status: :ok
          else
            render json: { error: @brand.errors.full_messages.to_sentence }, status: :unprocessable_entity
          end
        end

        def destroy
          @brand.destroy
          render json: { message: "Brand deleted successfully" }, status: :ok
        end

        private

        def set_brand
          @brand = Brand.find(params[:id])
        end

        def brand_params
          params.require(:brand).permit(:name, :logo_url, :website_url, :position, :is_active, :logo_image)
        end
      end
    end
  end
end
