require "rails_helper"

RSpec.describe "Api::V1::Admin::Enquiries", type: :request do
  let!(:admin_user) do
    User.create!(
      name: "Admin User",
      email: "admin@mrdcinemaeditz.com",
      password: "Password123!",
      role: "admin"
    )
  end

  let(:token) { JsonWebToken.encode(user_id: admin_user.id) }
  let(:headers) { { "Authorization" => "Bearer #{token}" } }

  let!(:enquiry1) do
    Enquiry.create!(
      name: "Client One",
      email: "client1@example.com",
      message: "First inquiry message"
    )
  end

  let!(:enquiry2) do
    Enquiry.create!(
      name: "Client Two",
      email: "client2@example.com",
      message: "Second inquiry message"
    )
  end

  describe "GET /api/v1/admin/enquiries/unread_count" do
    it "returns the accurate unread count and latest unread list" do
      get "/api/v1/admin/enquiries/unread_count", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["unread_count"]).to eq(2)
      expect(json["latest_unread"].length).to eq(2)
    end
  end

  describe "PATCH /api/v1/admin/enquiries/:id/mark_read" do
    it "marks a single enquiry as read" do
      patch "/api/v1/admin/enquiries/#{enquiry1.id}/mark_read", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["enquiry"]["read"]).to be true
      expect(json["unread_count"]).to eq(1)
      expect(enquiry1.reload.read).to be true
    end
  end

  describe "PATCH /api/v1/admin/enquiries/mark_all_read" do
    it "marks all enquiries as read" do
      patch "/api/v1/admin/enquiries/mark_all_read", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["unread_count"]).to eq(0)
      expect(Enquiry.unread.count).to eq(0)
    end
  end

  describe "GET /api/v1/admin/enquiries?status=unread" do
    it "filters unread enquiries properly" do
      enquiry1.mark_as_read!

      get "/api/v1/admin/enquiries?status=unread", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["enquiries"].length).to eq(1)
      expect(json["enquiries"][0]["id"]).to eq(enquiry2.id)
    end
  end
end
