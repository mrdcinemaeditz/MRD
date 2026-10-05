class JsonWebToken
  SECRET_KEY = ENV.fetch("JWT_SECRET_KEY") { Rails.application.secret_key_base || "mrd_cinema_editz_default_secret_key" }

  def self.encode(payload, exp = 72.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY, "HS256")
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: "HS256" })[0]
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::ExpiredSignature, JWT::DecodeError
    nil
  end
end
