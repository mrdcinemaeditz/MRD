module Api
  module V1
    module Admin
      class TestimonialsController < ApplicationController
        before_action :authenticate_admin!
        before_action :set_testimonial, only: [:update, :destroy]

        def index
          testimonials = Testimonial.ordered.all
          render json: {
            testimonials: TestimonialSerializer.render_collection(testimonials)
          }, status: :ok
        end

        def create
          testimonial = Testimonial.new(testimonial_params)

          if testimonial.save
            render json: {
              testimonial: TestimonialSerializer.render(testimonial),
              message: "Testimonial added successfully"
            }, status: :created
          else
            render json: { error: testimonial.errors.full_messages.to_sentence }, status: :unprocessable_entity
          end
        end

        def update
          if @testimonial.update(testimonial_params)
            render json: {
              testimonial: TestimonialSerializer.render(@testimonial),
              message: "Testimonial updated successfully"
            }, status: :ok
          else
            render json: { error: @testimonial.errors.full_messages.to_sentence }, status: :unprocessable_entity
          end
        end

        def destroy
          @testimonial.destroy
          render json: { message: "Testimonial deleted successfully" }, status: :ok
        end

        private

        def set_testimonial
          @testimonial = Testimonial.find(params[:id])
        end

        def testimonial_params
          params.require(:testimonial).permit(:client_name, :client_title, :brand_name, :client_avatar_url, :content, :rating, :position, :is_featured, :avatar_image)
        end
      end
    end
  end
end
