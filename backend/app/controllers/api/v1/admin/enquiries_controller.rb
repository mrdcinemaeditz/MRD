module Api
  module V1
    module Admin
      class EnquiriesController < ApplicationController
        before_action :authenticate_admin!
        before_action :set_enquiry, only: [:show, :update, :destroy]

        def index
          enquiries = Enquiry.all
          enquiries = enquiries.where(status: params[:status]) if params[:status].present?
          enquiries = enquiries.recent.page(params[:page] || 1).per(params[:per_page] || 25)

          render json: {
            enquiries: EnquirySerializer.render_collection(enquiries),
            pagination: pagination_dict(enquiries)
          }, status: :ok
        end

        def show
          @enquiry.update(status: "read") if @enquiry.status == "new"
          render json: {
            enquiry: EnquirySerializer.render(@enquiry)
          }, status: :ok
        end

        def update
          if @enquiry.update(enquiry_params)
            render json: {
              enquiry: EnquirySerializer.render(@enquiry),
              message: "Enquiry status updated"
            }, status: :ok
          else
            render json: { error: @enquiry.errors.full_messages.to_sentence }, status: :unprocessable_entity
          end
        end

        def destroy
          @enquiry.destroy
          render json: { message: "Enquiry deleted successfully" }, status: :ok
        end

        private

        def set_enquiry
          @enquiry = Enquiry.find(params[:id])
        end

        def enquiry_params
          params.require(:enquiry).permit(:status)
        end
      end
    end
  end
end
