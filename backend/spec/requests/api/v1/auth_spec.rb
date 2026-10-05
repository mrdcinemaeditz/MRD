require "rails_helper"

RSpec.describe "Api::V1::Auth", type: :request do
  let!(:user) { User.create!(name: "Jane Doe", email: "jane@example.com", password: "Password123!", role: "user") }

  describe "POST /api/v1/auth/login" do
    it "logs in with correct credentials and returns JWT" do
      post "/api/v1/auth/login", params: { email: "jane@example.com", password: "Password123!" }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["token"]).to be_present
      expect(json["user"]["email"]).to eq("jane@example.com")
    end

    it "rejects invalid credentials" do
      post "/api/v1/auth/login", params: { email: "jane@example.com", password: "WrongPassword" }

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /api/v1/auth/register" do
    it "registers a new user" do
      post "/api/v1/auth/register", params: {
        user: {
          name: "New Creator",
          email: "creator@example.com",
          password: "Password123!",
          password_confirmation: "Password123!"
        }
      }

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["token"]).to be_present
      expect(json["user"]["name"]).to eq("New Creator")
    end
  end
end
