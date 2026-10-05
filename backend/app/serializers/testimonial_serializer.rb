class TestimonialSerializer
  def self.render(testimonial)
    return nil unless testimonial

    {
      id: testimonial.id,
      client_name: testimonial.client_name,
      client_title: testimonial.client_title,
      brand_name: testimonial.brand_name,
      client_avatar_url: testimonial.avatar_image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(testimonial.avatar_image, only_path: true) : testimonial.client_avatar_url,
      content: testimonial.content,
      rating: testimonial.rating,
      position: testimonial.position,
      is_featured: testimonial.is_featured
    }
  end

  def self.render_collection(testimonials)
    testimonials.map { |t| render(t) }
  end
end
