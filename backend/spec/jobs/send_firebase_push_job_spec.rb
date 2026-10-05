require "rails_helper"
require "webmock/rspec"

RSpec.describe SendFirebasePushJob, type: :job do
  let!(:admin_user) do
    User.create!(
      name: "Admin User",
      email: "admin_fcm@mrdcinemaeditz.com",
      password: "Password123!",
      role: "admin"
    )
  end

  let!(:token1) { admin_user.device_tokens.create!(token: "fcm_valid_token_1", platform: "web") }
  let!(:token2) { admin_user.device_tokens.create!(token: "fcm_invalid_token_2", platform: "web") }

  let!(:enquiry) do
    Enquiry.create!(
      name: "Rohan Mehra",
      email: "rohan@example.com",
      brand_name: "Apex Brand",
      message: "Need 4K cinematic editing for commercial product launch."
    )
  end

  before do
    SiteSetting.set("push_notifications_enabled", "true", "notifications", "boolean")
  end

  it "skips execution if push_notifications_enabled is false" do
    SiteSetting.set("push_notifications_enabled", "false", "notifications", "boolean")
    expect_any_instance_of(FirebaseMessagingService).not_to receive(:send_to_token)
    described_class.perform_now(enquiry.id)
  end

  it "skips execution if Firebase is unconfigured" do
    allow(FirebaseMessagingService).to receive(:configured?).and_return(false)
    expect_any_instance_of(FirebaseMessagingService).not_to receive(:send_to_token)
    described_class.perform_now(enquiry.id)
  end

  it "dispatches push notifications to all admin device tokens and removes invalid tokens" do
    allow(FirebaseMessagingService).to receive(:configured?).and_return(true)

    # Mock service instance calls
    mock_service = instance_double(FirebaseMessagingService)
    allow(FirebaseMessagingService).to receive(:new).and_return(mock_service)

    expect(mock_service).to receive(:send_to_token).with(
      token1,
      title: "New enquiry from Rohan Mehra",
      body: "[Apex Brand] Need 4K cinematic editing for commercial product launch.",
      data: hash_including(enquiry_id: enquiry.id.to_s, name: "Rohan Mehra"),
      url: "/admin/enquiries"
    )

    expect(mock_service).to receive(:send_to_token).with(
      token2,
      title: "New enquiry from Rohan Mehra",
      body: "[Apex Brand] Need 4K cinematic editing for commercial product launch.",
      data: hash_including(enquiry_id: enquiry.id.to_s, name: "Rohan Mehra"),
      url: "/admin/enquiries"
    )

    described_class.perform_now(enquiry.id)
  end

  it "automatically deletes unregistered or invalid tokens on error response" do
    service = FirebaseMessagingService.new
    fake_response = instance_double(
      Net::HTTPNotFound,
      is_a?: false,
      code: "404",
      body: { error: { status: "UNREGISTERED", message: "Requested entity was not found." } }.to_json
    )

    service.send(:handle_fcm_error, fake_response, token2)
    expect(DeviceToken.find_by(id: token2.id)).to be_nil
    expect(DeviceToken.find_by(id: token1.id)).to be_present
  end
end
