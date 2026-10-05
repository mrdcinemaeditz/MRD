module Api
  module V1
    module Admin
      class EnquiriesController < ApplicationController
        before_action :authenticate_admin!
        before_action :set_enquiry, only: [:show, :update, :destroy, :mark_read]

        def index
          enquiries = Enquiry.all

          if params[:status].present?
            case params[:status].downcase
            when "unread"
              enquiries = enquiries.unread
            when "read"
              enquiries = enquiries.read_items
            else
              enquiries = enquiries.where(status: params[:status])
            end
          end

          enquiries = enquiries.recent.page(params[:page] || 1).per(params[:per_page] || 25)

          render json: {
            enquiries: EnquirySerializer.render_collection(enquiries),
            unread_count: Enquiry.unread.count,
            pagination: pagination_dict(enquiries)
          }, status: :ok
        end

        def show
          @enquiry.mark_as_read!
          render json: {
            enquiry: EnquirySerializer.render(@enquiry),
            unread_count: Enquiry.unread.count
          }, status: :ok
        end

        def unread_count
          count = Enquiry.unread.count
          latest = Enquiry.unread.recent.limit(10)

          render json: {
            unread_count: count,
            latest_unread: EnquirySerializer.render_collection(latest)
          }, status: :ok
        end

        def mark_read
          @enquiry.mark_as_read!
          render json: {
            enquiry: EnquirySerializer.render(@enquiry),
            unread_count: Enquiry.unread.count,
            message: "Enquiry marked as read"
          }, status: :ok
        end

        def mark_all_read
          Enquiry.unread.update_all(read: true, read_at: Time.current, status: "read", updated_at: Time.current)
          render json: {
            unread_count: 0,
            message: "All enquiries marked as read"
          }, status: :ok
        end

        def update
          if @enquiry.update(enquiry_params)
            # If status changed to read, also set read column
            if @enquiry.status == "read" || @enquiry.status == "replied"
              @enquiry.update_columns(read: true, read_at: Time.current) unless @enquiry.read?
            elsif @enquiry.status == "new"
              @enquiry.update_columns(read: false, read_at: nil)
            end

            render json: {
              enquiry: EnquirySerializer.render(@enquiry),
              unread_count: Enquiry.unread.count,
              message: "Enquiry status updated"
            }, status: :ok
          else
            render json: { error: @enquiry.errors.full_messages.to_sentence }, status: :unprocessable_entity
          end
        end

        def destroy
          @enquiry.destroy
          render json: {
            unread_count: Enquiry.unread.count,
            message: "Enquiry deleted successfully"
          }, status: :ok
        end

        private

        def set_enquiry
          @enquiry = Enquiry.find(params[:id])
        end

        def enquiry_params
          params.require(:enquiry).permit(:status, :read)
        end
      end
    end
  end
end
