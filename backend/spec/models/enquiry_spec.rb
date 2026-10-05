require "rails_helper"

RSpec.describe Enquiry, type: :model do
  describe "validations and read state" do
    it "creates an enquiry with default unread state" do
      enquiry = Enquiry.create!(
        name: "James Cameron",
        brand_name: "Lightstorm Entertainment",
        email: "jc@lightstorm.com",
        phone: "+1234567890",
        budget_range: "$5,000+",
        service_type: "Commercial Ads & Product Films",
        message: "We need high-end cinematic color grading and editing for our next project."
      )

      expect(enquiry.read).to be false
      expect(enquiry.read_at).to be_nil
      expect(enquiry.status).to eq("new")
      expect(Enquiry.unread).to include(enquiry)
    end

    it "requires a valid email" do
      enquiry = Enquiry.new(name: "Test", email: "invalid-email", message: "Hello world")
      expect(enquiry.valid?).to be false
      expect(enquiry.errors[:email]).to be_present
    end

    it "marks an enquiry as read properly" do
      enquiry = Enquiry.create!(
        name: "Christopher Nolan",
        email: "nolan@syncopy.com",
        message: "Looking for an IMAX 70mm style trailer cut."
      )

      expect { enquiry.mark_as_read! }.to change { enquiry.reload.read }.from(false).to(true)
      expect(enquiry.read_at).to be_present
      expect(enquiry.status).to eq("read")
      expect(Enquiry.unread).not_to include(enquiry)
      expect(Enquiry.read_items).to include(enquiry)
    end
  end
end
