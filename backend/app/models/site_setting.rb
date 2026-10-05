class SiteSetting < ApplicationRecord
  CATEGORIES = %w[general contact social hero media_kit seo notifications].freeze

  validates :key, presence: true, uniqueness: true

  def self.get(key, default = nil)
    setting = find_by(key: key.to_s)
    return default unless setting

    case setting.setting_type
    when "json"
      JSON.parse(setting.value) rescue default
    when "boolean"
      ActiveModel::Type::Boolean.new.cast(setting.value)
    else
      setting.value.presence || default
    end
  end

  def self.set(key, value, category = "general", type = "text")
    setting = find_or_initialize_by(key: key.to_s)
    setting.category = category
    setting.setting_type = type
    setting.value = type == "json" && !value.is_a?(String) ? value.to_json : value.to_s
    setting.save!
    setting
  end

  def self.all_hash
    all.each_with_object({}) do |s, hash|
      hash[s.key] = s.setting_type == "json" ? (JSON.parse(s.value) rescue s.value) : s.value
    end
  end
end
