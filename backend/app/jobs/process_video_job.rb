require "open3"
require "json"

class ProcessVideoJob < ApplicationJob
  queue_as :default

  def perform(video_id)
    video = Video.find_by(id: video_id)
    return unless video

    target_attachment = video.video_file.attached? ? video.video_file : (video.media_file.attached? ? video.media_file : nil)
    return unless target_attachment

    target_attachment.open do |temp_video|
      extract_metadata(video, temp_video.path)
      generate_thumbnail_if_missing(video, temp_video.path)
    end
  rescue StandardError => e
    Rails.logger.error("[ProcessVideoJob] Error processing video #{video_id}: #{e.message}\n#{e.backtrace.first(5).join("\n")}")
  end

  private

  def extract_metadata(video, file_path)
    ffprobe_bin = `which ffprobe`.strip.presence || "/usr/local/bin/ffprobe"
    return unless File.exist?(ffprobe_bin)

    cmd = [
      ffprobe_bin,
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height,duration:format=duration",
      "-of", "json",
      file_path
    ]

    stdout, stderr, status = Open3.capture3(*cmd)
    if status.success?
      data = JSON.parse(stdout) rescue {}
      stream = data.dig("streams", 0) || {}
      
      width = stream["width"]&.to_i
      height = stream["height"]&.to_i
      
      duration_val = (stream["duration"] || data.dig("format", "duration")).to_f
      
      updates = {}
      updates[:width] = width if width && width > 0
      updates[:height] = height if height && height > 0

      if duration_val > 0 && (video.duration.blank? || video.duration == "00:30")
        total_seconds = duration_val.round
        mins = total_seconds / 60
        secs = total_seconds % 60
        updates[:duration] = sprintf("%02d:%02d", mins, secs)
      end

      # Determine aspect ratio if standard
      if width && height && width > 0 && height > 0
        if height > width
          updates[:aspect_ratio] = "9:16" if video.aspect_ratio.blank?
        else
          updates[:aspect_ratio] = "16:9" if video.aspect_ratio.blank?
        end
      end

      video.update_columns(updates) if updates.any?
    else
      Rails.logger.warn("[ProcessVideoJob] ffprobe failed: #{stderr}")
    end
  end

  def generate_thumbnail_if_missing(video, file_path)
    has_thumb = video.thumbnail.attached? || video.thumbnail_image.attached? || video.thumbnail_url.present?
    return if has_thumb

    ffmpeg_bin = `which ffmpeg`.strip.presence || "/usr/local/bin/ffmpeg"
    return unless File.exist?(ffmpeg_bin)

    thumb_temp = Tempfile.new(["video_thumb", ".jpg"])
    thumb_path = thumb_temp.path
    thumb_temp.close

    # Seek to 1 second (or 0.5s) and extract 1 frame
    cmd = [
      ffmpeg_bin,
      "-y",
      "-ss", "00:00:01.000",
      "-i", file_path,
      "-vframes", "1",
      "-q:v", "2",
      thumb_path
    ]

    stdout, stderr, status = Open3.capture3(*cmd)
    
    # Fallback to 0.0s if 1s failed
    unless status.success? && File.exist?(thumb_path) && File.size(thumb_path) > 0
      cmd_fallback = [
        ffmpeg_bin,
        "-y",
        "-ss", "00:00:00.100",
        "-i", file_path,
        "-vframes", "1",
        "-q:v", "2",
        thumb_path
      ]
      Open3.capture3(*cmd_fallback)
    end

    if File.exist?(thumb_path) && File.size(thumb_path) > 0
      video.thumbnail.attach(
        io: File.open(thumb_path),
        filename: "#{video.slug || 'video'}-thumb.jpg",
        content_type: "image/jpeg"
      )
    end
  ensure
    thumb_temp&.unlink
  end
end
