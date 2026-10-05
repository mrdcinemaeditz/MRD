require "rails_helper"

RSpec.describe Video, type: :model do
  describe "validations and source requirements" do
    it "automatically generates slug from title" do
      video = Video.create!(
        title: "My Amazing Reel",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        status: "published",
        video_type: "youtube",
        aspect_ratio: "9:16"
      )
      expect(video.slug).to eq("my-amazing-reel")
    end

    it "requires either an uploaded video file or an external video URL" do
      video = Video.new(
        title: "No Source Video",
        status: "published",
        video_type: "youtube",
        aspect_ratio: "9:16"
      )
      expect(video.valid?).to be false
      expect(video.errors[:base]).to include("Video must have either an uploaded video file or an external video URL")
    end

    it "is valid with an external video URL" do
      video = Video.new(
        title: "External Video",
        video_url: "https://www.youtube.com/watch?v=12345",
        status: "published",
        video_type: "youtube",
        aspect_ratio: "9:16"
      )
      expect(video.valid?).to be true
    end

    it "is valid with an attached video file" do
      video = Video.new(
        title: "Uploaded Video",
        status: "published",
        video_type: "upload",
        aspect_ratio: "9:16"
      )
      video.video_file.attach(
        io: StringIO.new("fake mp4 content"),
        filename: "test.mp4",
        content_type: "video/mp4"
      )
      expect(video.valid?).to be true
    end

    it "rejects video file with invalid content type" do
      video = Video.new(
        title: "Invalid File Video",
        status: "published",
        video_type: "upload",
        aspect_ratio: "9:16"
      )
      video.video_file.attach(
        io: StringIO.new("fake text content"),
        filename: "test.txt",
        content_type: "text/plain"
      )
      expect(video.valid?).to be false
      expect(video.errors[:video_file]).to be_present
    end

    it "records unique views properly" do
      video = Video.create!(
        title: "Test Reel",
        video_url: "https://www.youtube.com/watch?v=test",
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
