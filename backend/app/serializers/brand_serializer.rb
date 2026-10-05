class BrandSerializer
  def self.render(brand)
    return nil unless brand

    {
      id: brand.id,
      name: brand.name,
      logo_url: brand.logo_image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(brand.logo_image, only_path: true) : brand.logo_url,
      website_url: brand.website_url,
      position: brand.position,
      is_active: brand.is_active
    }
  end

  def self.render_collection(brands)
    brands.map { |b| render(b) }
  end
end
