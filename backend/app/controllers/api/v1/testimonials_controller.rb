module Api
  module V1
    class TestimonialsController < ApplicationController
      def index
        testimonials = Testimonial.featured.ordered
        render json: {
          testimonials: TestimonialSerializer.render_collection(testimonials)
        }, status: :ok
      end
    end
  end
end
