module Api
  module V1
    class CategoriesController < ApplicationController
      def index
        categories = Category.ordered.all
        render json: {
          categories: CategorySerializer.render_collection(categories)
        }, status: :ok
      end
    end
  end
end
