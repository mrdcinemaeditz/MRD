require "rails_helper"

RSpec.describe DeviceToken, type: :model do
  let(:user) do
    User.create!(
      name: "Admin User",
      email: "admin_push@mrdcinemaeditz.com",
      password: "Password123!",
      role: "admin"
    )
  end

  it "is valid with a user, unique token, and valid platform" do
    device_token = DeviceToken.new(user: user, token: "fcm_test_token_123", platform: "web")
    expect(device_token).to be_valid
  end

  it "is invalid without a token" do
    device_token = DeviceToken.new(user: user, token: nil)
    expect(device_token).not_to be_valid
    expect(device_token.errors[:token]).to include("can't be blank")
  end

  it "enforces token uniqueness" do
    DeviceToken.create!(user: user, token: "unique_token_abc", platform: "web")
    duplicate = DeviceToken.new(user: user, token: "unique_token_abc", platform: "android")
    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:token]).to include("has already been taken")
  end

  it "validates platform inclusion" do
    invalid_device = DeviceToken.new(user: user, token: "token_xyz", platform: "smartwatch")
    expect(invalid_device).not_to be_valid
    expect(invalid_device.errors[:platform]).to be_present
  end

  it "belongs to a user and cascades on delete" do
    DeviceToken.create!(user: user, token: "cascade_test_token", platform: "web")
    expect { user.destroy }.to change(DeviceToken, :count).by(-1)
  end
end
