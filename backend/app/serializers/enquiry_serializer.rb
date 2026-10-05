class EnquirySerializer
  def self.render(enquiry)
    return nil unless enquiry

    {
      id: enquiry.id,
      name: enquiry.name,
      brand_name: enquiry.brand_name,
      email: enquiry.email,
      phone: enquiry.phone,
      budget_range: enquiry.budget_range,
      service_type: enquiry.service_type,
      message: enquiry.message,
      status: enquiry.status,
      created_at: enquiry.created_at
    }
  end

  def self.render_collection(enquiries)
    enquiries.map { |e| render(e) }
  end
end
