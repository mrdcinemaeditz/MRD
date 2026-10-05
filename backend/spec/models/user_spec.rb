require "rails_helper"

RSpec.describe User, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      user = User.new(name: "Test User", email: "test@example.com", password: "Password123!", role: "user")
      expect(user).to be_valid
    end

    it "requires an email" do
      user = User.new(name: "Test User", email: nil, password: "Password123!")
      expect(user).not_to be_valid
    end

    it "enforces unique lowercase emails" do
      User.create!(name: "Test User", email: "unique@example.com", password: "Password123!", role: "user")
      duplicate = User.new(name: "Other User", email: "UNIQUE@example.com", password: "Password123!", role: "user")
      expect(duplicate).not_to be_valid
    end
  end

  describe "#admin?" do
    it "returns true for admin role" do
      admin = User.new(role: "admin")
      expect(admin.admin?).to be true
    end

    it "returns false for standard user role" do
      user = User.new(role: "user")
      expect(user.admin?).to be false
    end
  end
end
