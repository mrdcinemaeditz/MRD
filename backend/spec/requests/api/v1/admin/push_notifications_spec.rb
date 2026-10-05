require "rails_helper"

RSpec.describe "Api::V1::Admin::PushNotifications", type: :request do
  let!(:admin_user) do
    User.create!(
      name: "Admin User",
      email: "admin@mrdcinemaeditz.com",
      password: "Password123!",
      role: "admin"
    )
  end

  let!(:regular_user) do
    User.create!(
      name: "Regular User",
      email: "user@example.com",
      password: "Password123!",
      role: "user"
    )
  end

  let(:admin_token) { JsonWebToken.encode(user_id: admin_user.id) }
  let(:admin_headers) { { "Authorization" => "Bearer #{admin_token}" } }

  let(:user_token) { JsonWebToken.encode(user_id: regular_user.id) }
  let(:user_headers) { { "Authorization" => "Bearer #{user_token}" } }

  describe "POST /api/v1/admin/push/register" do
    it "registers a new FCM device token for admin" do
      post "/api/v1/admin/push/register",
           params: { token: "fcm_token_sample_123", platform: "web", user_agent: "Mozilla/5.0" },
           headers: admin_headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["message"]).to include("successfully")
      expect(admin_user.device_tokens.count).to eq(1)
      expect(admin_user.device_tokens.first.token).to eq("fcm_token_sample_123")
    end

    it "updates existing token timestamp without duplicating" do
      post "/api/v1/admin/push/register",
           params: { token: "fcm_token_sample_123", platform: "web" },
           headers: admin_headers

      post "/api/v1/admin/push/register",
           params: { token: "fcm_token_sample_123", platform: "web" },
           headers: admin_headers

      expect(response).to have_http_status(:ok)
      expect(admin_user.device_tokens.count).to eq(1)
    end

    it "returns 403 forbidden for non-admin users" do
      post "/api/v1/admin/push/register",
           params: { token: "fcm_token_sample_123" },
           headers: user_headers

      expect(response).to have_http_status(:forbidden)
    end

    it "returns 401 unauthorized when unauthenticated" do
      post "/api/v1/admin/push/register", params: { token: "fcm_token_sample_123" }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /api/v1/admin/push/unregister" do
    before do
      admin_user.device_tokens.create!(token: "token_to_remove", platform: "web")
      admin_user.device_tokens.create!(token: "token_to_keep", platform: "web")
    end

    it "unregisters a specific token" do
      delete "/api/v1/admin/push/unregister",
             params: { token: "token_to_remove" },
             headers: admin_headers

      expect(response).to have_http_status(:ok)
      expect(admin_user.device_tokens.where(token: "token_to_remove")).to be_empty
      expect(admin_user.device_tokens.where(token: "token_to_keep")).to exist
    end

    it "unregisters all admin tokens if token param is blank" do
      delete "/api/v1/admin/push/unregister", headers: admin_headers
      expect(response).to have_http_status(:ok)
      expect(admin_user.device_tokens.count).to eq(0)
    end
  end

  describe "POST /api/v1/admin/push/test" do
    it "returns unconfigured status if Firebase credentials are not present" do
      post "/api/v1/admin/push/test", headers: admin_headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["status"]).to eq("unconfigured")
    end
  end
end
