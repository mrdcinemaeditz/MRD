class VideoTag < ApplicationRecord
  belongs_to :video
  belongs_to :tag

  validates :tag_id, uniqueness: { scope: :video_id, message: "has already been added to this video" }
end
