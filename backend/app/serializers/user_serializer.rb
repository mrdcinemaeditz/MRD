class UserSerializer
  def self.render(user)
    return nil unless user

    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_blocked: user.is_blocked,
      avatar_url: user.avatar.attached? ? Rails.application.routes.url_helpers.rails_blob_url(user.avatar, only_path: true) : user.avatar_url,
      created_at: user.created_at
    }
  end
end
