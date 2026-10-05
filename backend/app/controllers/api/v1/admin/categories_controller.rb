module Api
  module V1
    module Admin
      class CategoriesController < ApplicationController
        before_action :authenticate_admin!
        before_action :set_category, only: [:update, :destroy]

        def index
          categories = Category.ordered.all
          render json: {
            categories: CategorySerializer.render_collection(categories)
          }, status: :ok
        end

        def create
          category = Category.new(category_params)

          if category.save
            render json: {
              category: CategorySerializer.render(category),
              message: "Category created successfully"
            }, status: :created
          else
            render json: { error: category.errors.full_messages.to_sentence, errors: category.errors.messages }, status: :unprocessable_entity
          end
        end

        def update
          if @category.update(category_params)
            render json: {
              category: CategorySerializer.render(@category),
              message: "Category updated successfully"
            }, status: :ok
          else
            render json: { error: @category.errors.full_messages.to_sentence, errors: @category.errors.messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @category.destroy
          render json: { message: "Category deleted successfully" }, status: :ok
        end

        def reorder
          if params[:ordered_ids].is_a?(Array)
            params[:ordered_ids].each_with_index do |id, index|
              Category.where(id: id).update_all(position: index)
            end
          end
          render json: { message: "Categories reordered successfully" }, status: :ok
        end

        private

        def set_category
          @category = Category.find(params[:id])
        end

        def category_params
          params.require(:category).permit(:name, :slug, :description, :position)
        end
      end
    end
  end
end
