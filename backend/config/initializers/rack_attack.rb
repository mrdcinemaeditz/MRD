class Rack::Attack
  # Rate limit login attempts: 10 requests per minute per IP
  throttle("logins/ip", limit: 10, period: 1.minute) do |req|
    if req.path == "/api/v1/auth/login" && req.post?
      req.ip
    end
  end

  # Rate limit registration: 5 per hour per IP
  throttle("registrations/ip", limit: 5, period: 1.hour) do |req|
    if req.path == "/api/v1/auth/register" && req.post?
      req.ip
    end
  end

  # Rate limit enquiries/contact messages: 5 per hour per IP
  throttle("enquiries/ip", limit: 5, period: 1.hour) do |req|
    if req.path == "/api/v1/enquiries" && req.post?
      req.ip
    end
  end

  # Rate limit comments: 20 per minute per IP
  throttle("comments/ip", limit: 20, period: 1.minute) do |req|
    if req.path.match(%r{^/api/v1/videos/[^/]+/comments}) && req.post?
      req.ip
    end
  end

  # Custom response for throttled requests
  self.throttled_responder = lambda do |_env|
    [429, { "Content-Type" => "application/json" }, [{ error: "Rate limit exceeded. Please try again later." }.to_json]]
  end
end
