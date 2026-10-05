require "rails_helper"

RSpec.describe Video, type: :model do
  describe "validations and slug generation" do
    it "automatically generates slug from title" do
      video = Video.create!(
        title: "My Amazing Reel",
        status: "published",
        video_type: "youtube",
        aspect_ratio: "9:16"
      )
      expect(video.slug).to eq("my-amazing-reel")
    end

    it "records unique views properly" do
      video = Video.create!(
        title: "Test Reel",
        status: "published",
        video_type: "youtube",
        aspect_ratio: "9:16"
      )

      expect {
        video.record_view!(ip_hash: "hash123", session_token: "token_abc")
      }.to change { video.reload.views_count }.by(1)

      # Duplicate view within 24h should NOT increment views_count
      expect {
        video.record_view!(ip_hash: "hash123", session_token: "token_abc")
      }.not_to change { video.reload.views_count }
    end
  end
end
