require "rails_helper"

RSpec.describe "Api::V1::Videos", type: :request do
  let!(:category) { Category.create!(name: "Commercials", slug: "commercials") }
  let!(:video) do
    Video.create!(
      title: "Commercial Reel",
      slug: "commercial-reel",
      category: category,
      status: "published",
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      video_type: "youtube",
      aspect_ratio: "9:16",
      is_featured: true
    )
  end

  describe "GET /api/v1/videos" do
    it "returns list of published videos" do
      get "/api/v1/videos"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["videos"].length).to be >= 1
      expect(json["videos"][0]["title"]).to eq("Commercial Reel")
    end
  end

  describe "GET /api/v1/videos/featured" do
    it "returns featured videos" do
      get "/api/v1/videos/featured"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["videos"].length).to eq(1)
      expect(json["videos"][0]["is_featured"]).to be true
    end
  end

  describe "GET /api/v1/videos/:id" do
    it "returns video detail by slug" do
      get "/api/v1/videos/#{video.slug}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["video"]["id"]).to eq(video.id)
      expect(json["related_videos"]).to be_an(Array)
    end
  end
end
