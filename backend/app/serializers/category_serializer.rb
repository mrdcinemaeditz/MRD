class CategorySerializer
  def self.render(category)
    return nil unless category

    {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      position: category.position,
      videos_count: category.videos.published.count
    }
  end

  def self.render_collection(categories)
    categories.map { |c| render(c) }
  end
end
