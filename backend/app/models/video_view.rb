class VideoView < ApplicationRecord
  belongs_to :video

  validates :video_id, presence: true
end
