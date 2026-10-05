module Api
  module V1
    class EnquiriesController < ApplicationController
      def create
        enquiry = Enquiry.new(enquiry_params)

        if enquiry.save
          render json: {
            message: "Thank you for reaching out! We will get back to you shortly.",
            enquiry: EnquirySerializer.render(enquiry)
          }, status: :created
        else
          render json: { error: enquiry.errors.full_messages.to_sentence, errors: enquiry.errors.messages }, status: :unprocessable_entity
        end
      end

      private

      def enquiry_params
        params.require(:enquiry).permit(:name, :brand_name, :email, :phone, :budget_range, :service_type, :message)
      end
    end
  end
end
