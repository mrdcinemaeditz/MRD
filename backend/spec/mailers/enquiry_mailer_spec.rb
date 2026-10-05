require "rails_helper"

RSpec.describe EnquiryMailer, type: :mailer do
  let!(:enquiry) do
    Enquiry.create!(
      name: "Denis Villeneuve",
      brand_name: "Legendary Pictures",
      email: "denis@legendary.com",
      phone: "+1987654321",
      budget_range: "$5,000+",
      service_type: "Commercial Ads & Product Films",
      message: "Need desert sand color grading and atmospheric sound design."
    )
  end

  describe "admin_notification_email" do
    let(:mail) { EnquiryMailer.admin_notification_email(enquiry) }

    it "renders the headers properly" do
      expect(mail.subject).to eq("New enquiry from Denis Villeneuve - Legendary Pictures")
      expect(mail.to).to include("admin@mrdcinemaeditz.com")
      expect(mail.reply_to).to include("denis@legendary.com")
    end

    it "renders the body with enquiry details" do
      expect(mail.body.encoded).to match("Denis Villeneuve")
      expect(mail.body.encoded).to match("Legendary Pictures")
      expect(mail.body.encoded).to match("Need desert sand color grading")
    end
  end

  describe "visitor_confirmation_email" do
    let(:mail) { EnquiryMailer.visitor_confirmation_email(enquiry) }

    it "renders the headers properly" do
      expect(mail.subject).to match(/Thanks for contacting MRD CINEMA EDITZ/)
      expect(mail.to).to include("denis@legendary.com")
    end

    it "renders the auto-reply body" do
      expect(mail.body.encoded).to match("Hi Denis Villeneuve")
      expect(mail.body.encoded).to match("within 24 hours")
    end
  end
end
