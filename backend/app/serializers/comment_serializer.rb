class CommentSerializer
  def self.render(comment, current_user: nil)
    return nil unless comment

    {
      id: comment.id,
      body: comment.body,
      status: comment.status,
      created_at: comment.created_at,
      user: {
        id: comment.user.id,
        name: comment.user.name,
        role: comment.user.role,
        avatar_url: comment.user.avatar.attached? ? Rails.application.routes.url_helpers.rails_blob_url(comment.user.avatar, only_path: true) : comment.user.avatar_url
      },
      can_delete: current_user ? (current_user.admin? || current_user.id == comment.user_id) : false
    }
  end

  def self.render_collection(comments, current_user: nil)
    comments.map { |c| render(c, current_user: current_user) }
  end
end
