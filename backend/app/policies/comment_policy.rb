class CommentPolicy < ApplicationPolicy
  def create?
    user.present? && !user.is_blocked?
  end

  def destroy?
    user.present? && (user.admin? || user.id == record.user_id)
  end

  def report?
    user.present? && !user.is_blocked?
  end
end
