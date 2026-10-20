puts "🌱 Starting MRD CINEMA EDITZ database seeding..."

# 1. Clear existing data
Report.destroy_all
Like.destroy_all
Comment.destroy_all
VideoView.destroy_all
VideoTag.destroy_all
Video.destroy_all
Tag.destroy_all
Category.destroy_all
Enquiry.destroy_all
Brand.destroy_all
Testimonial.destroy_all
SiteSetting.destroy_all
User.destroy_all

# 2. Create Admin & Test Users
admin_email = ENV.fetch("ADMIN_EMAIL", "admin@mrdcinemaeditz.com")
admin_pass = ENV.fetch("ADMIN_PASSWORD", "Password123!")

admin = User.create!(
  name: "MRD Director",
  email: admin_email,
  password: admin_pass,
  password_confirmation: admin_pass,
  role: "admin",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
)
puts "✅ Admin user created: #{admin.email} (Password: #{admin_pass})"

user1 = User.create!(
  name: "Rohit Sharma",
  email: "rohit@example.com",
  password: "Password123!",
  password_confirmation: "Password123!",
  role: "user",
  avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
)

user2 = User.create!(
  name: "Pooja Patel",
  email: "pooja@example.com",
  password: "Password123!",
  password_confirmation: "Password123!",
  role: "user",
  avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80"
)

# 3. 9 Core "Perfect For" Categories / Topics
categories_data = [
  { name: "Weddings", description: "Cinematic wedding films, royal entries, emotional varmala moments, and wedding teasers.", position: 1 },
  { name: "Car & Bike Delivery", description: "Special automotive delivery moments, rolling shots, revving audio sync, and celebration reels.", position: 2 },
  { name: "Brand Shoots", description: "High-impact brand campaigns, commercial promotions, and creative product video edits.", position: 3 },
  { name: "Events", description: "Live stage concerts, college fests, corporate functions, and grand celebration highlights.", position: 4 },
  { name: "Birthdays", description: "Vibrant birthday parties, surprise celebrations, cake-cutting memories, and candid moments.", position: 5 },
  { name: "Interior Shoots", description: "Cinematic real estate walkthroughs, architectural showcase, luxury hotels, and cafe ambiances.", position: 6 },
  { name: "Restaurants", description: "Mouthwatering food cinematography, fine-dining aesthetic reels, and kitchen action shots.", position: 7 },
  { name: "Saloons", description: "Hair styling transformations, luxury grooming rituals, aesthetic salon interiors, and makeover reels.", position: 8 },
  { name: "Clothing", description: "Fashion lookbooks, apparel model shoots, boutique collection launches, and runway styles.", position: 9 }
]

categories = {}
categories_data.each do |cat|
  categories[cat[:name]] = Category.create!(cat)
end
puts "✅ #{Category.count} Categories created"

# 4. Tags
tags_list = ["4K 60FPS", "Gimbal Smooth", "Cinematic Cut", "Fast Turnaround", "Color Graded", "Viral Reel", "Sound Design", "Complimentary Photos", "Rewa"]
tags = tags_list.map { |t| Tag.create!(name: t, slug: t.parameterize) }

# 5. Portfolio Videos for each of the 9 Topics
videos_data = [
  {
    title: "ROYAL HERITAGE - Grand Indian Wedding Reel",
    description: "Cinematic wedding highlights with gimbal-stabilized movements, warm royal color palette, and emotive traditional sound design.",
    category: categories["Weddings"],
    aspect_ratio: "9:16",
    video_type: "upload",
    video_url: "/videos/weddings.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
    duration: "00:45",
    is_featured: true,
    status: "published",
    published_at: 1.day.ago,
    views_count: 3420,
    position: 1,
    tag_names: ["4K 60FPS", "Gimbal Smooth", "Cinematic Cut", "Color Graded"]
  },
  {
    title: "THAR ROX DELIVERY - Showroom Reveal Celebration",
    description: "High-octane delivery celebration reel featuring smoke blast, smooth gimbal tracking shots, and bass-heavy beat drops.",
    category: categories["Car & Bike Delivery"],
    aspect_ratio: "9:16",
    video_type: "upload",
    video_url: "/videos/car-bike-delivery.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
    duration: "00:30",
    is_featured: true,
    status: "published",
    published_at: 2.days.ago,
    views_count: 5120,
    position: 2,
    tag_names: ["Gimbal Smooth", "Fast Turnaround", "Viral Reel"]
  },
  {
    title: "AURA TIMEPIECES - Luxury Watch Commercial Shoot",
    description: "Macro details, controlled studio lighting, and smooth rotational gimbal motion for luxury product branding.",
    category: categories["Brand Shoots"],
    aspect_ratio: "9:16",
    video_type: "upload",
    video_url: "/videos/brand-shoots.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
    duration: "00:25",
    is_featured: true,
    status: "published",
    published_at: 3.days.ago,
    views_count: 2890,
    position: 3,
    tag_names: ["Color Graded", "Sound Design", "Viral Reel"]
  },
  {
    title: "NEON NIGHTS - Rewa Youth Music Fest Aftermovie",
    description: "Dynamic stage visuals, crowd energy capture, strobe synchronization, and cinematic pacing.",
    category: categories["Events"],
    aspect_ratio: "9:16",
    video_type: "upload",
    video_url: "/videos/events.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    duration: "00:40",
    is_featured: true,
    status: "published",
    published_at: 4.days.ago,
    views_count: 4210,
    position: 4,
    tag_names: ["4K 60FPS", "Viral Reel", "Sound Design"]
  },
  {
    title: "SWEET 21ST - Golden Hour Birthday Bash",
    description: "Candid laughter, emotional moments with friends & family, sparklers, and aesthetic reel cut delivered within hours.",
    category: categories["Birthdays"],
    aspect_ratio: "9:16",
    video_type: "upload",
    video_url: "/videos/birthdays.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80",
    duration: "00:35",
    is_featured: true,
    status: "published",
    published_at: 5.days.ago,
    views_count: 1980,
    position: 5,
    tag_names: ["Gimbal Smooth", "Fast Turnaround", "Complimentary Photos"]
  },
  {
    title: "VILLA SERENA - Modern Architectural Tour",
    description: "Ultra-wide gimbal tracking shots showcasing luxury living spaces, ambient natural light, and interior craftsmanship.",
    category: categories["Interior Shoots"],
    aspect_ratio: "16:9",
    video_type: "upload",
    video_url: "/videos/interior-shoots.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    duration: "01:15",
    is_featured: true,
    status: "published",
    published_at: 6.days.ago,
    views_count: 2450,
    position: 6,
    tag_names: ["4K 60FPS", "Gimbal Smooth", "Color Graded"]
  },
  {
    title: "SPICE & SIZZLE - Gourmet Bistro Culinary Showcase",
    description: "High-speed macro shots of flaming pans, artisanal plating, and vibrant cafe atmosphere.",
    category: categories["Restaurants"],
    aspect_ratio: "9:16",
    video_type: "upload",
    video_url: "/videos/restaurants.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
    duration: "00:28",
    is_featured: false,
    status: "published",
    published_at: 7.days.ago,
    views_count: 3100,
    position: 7,
    tag_names: ["Sound Design", "Viral Reel", "Fast Turnaround"]
  },
  {
    title: "THE GENTLEMAN'S CUT - Luxury Salon Grooming Reel",
    description: "Crisp fade close-ups, scissor ASMR audio sync, and modern salon aesthetic.",
    category: categories["Saloons"],
    aspect_ratio: "9:16",
    video_type: "upload",
    video_url: "/videos/saloons.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
    duration: "00:32",
    is_featured: false,
    status: "published",
    published_at: 8.days.ago,
    views_count: 2750,
    position: 8,
    tag_names: ["Gimbal Smooth", "Viral Reel"]
  },
  {
    title: "URBAN ELEVATION - Streetwear Autumn Collection",
    description: "Fast-paced rhythmic fashion reel showcasing fabrics, textures, and urban street aesthetic.",
    category: categories["Clothing"],
    aspect_ratio: "9:16",
    video_type: "upload",
    video_url: "/videos/clothing.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    duration: "00:30",
    is_featured: false,
    status: "published",
    published_at: 9.days.ago,
    views_count: 3890,
    position: 9,
    tag_names: ["4K 60FPS", "Color Graded", "Cinematic Cut"]
  }
]

videos = []
videos_data.each do |v_data|
  tag_names = v_data.delete(:tag_names)
  v = Video.create!(v_data)
  v.sync_tags!(tag_names)
  videos << v
end
puts "✅ #{Video.count} Portfolio Videos created across 9 topics"

# 6. Sample Likes and Comments
videos.each do |v|
  Like.create!(user: user1, video: v)
  Like.create!(user: user2, video: v) if [true, false].sample

  Comment.create!(
    user: user1,
    video: v,
    body: "The gimbal smoothness and color grading look incredible! 🔥",
    status: "approved"
  )
end

# 7. Site Settings & Reel Packages
SiteSetting.set("site_title", "MRD CINEMA EDITZ | Cinematic Videos & Viral Reels", "general")
SiteSetting.set("hero_tagline", "CINEMATIC VIDEOS THAT TELL YOUR STORY", "hero")
SiteSetting.set("hero_subheadline", "We Don't Just Shoot — We Create Memories. Starting from ₹1499. Reels delivered in few hours with ultra-smooth gimbal quality.", "hero")
SiteSetting.set("whatsapp_number", "7470678511", "contact")
SiteSetting.set("phone_number", "7470678511", "contact")
SiteSetting.set("whatsapp_default_message", "Hi MRD Cinema Editz! I want to book a video shoot / reel package.", "contact")
SiteSetting.set("contact_email", "mrdcinemaeditz@gmail.com", "contact")
SiteSetting.set("instagram_url", "https://instagram.com/mrd_cinemaeditz", "social")
SiteSetting.set("youtube_url", "https://youtube.com/@mrdcinemaeditz", "social")
SiteSetting.set("location", "Rewa, Madhya Pradesh", "contact")
SiteSetting.set("availability", "Available All Over India", "general")
SiteSetting.set("starting_price", "1499", "pricing")

# Reel Packages directly from Flyer Image 2
reel_packages_data = [
  {
    id: 1,
    reels_count: 1,
    price: 1499,
    title: "Professional Reel",
    features: [
      "1 Professional Cinematic Reel",
      "On-Spot Shoot & Professional Coverage",
      "Shoot on Gimbal for Smooth Videos",
      "Expert Editing & Sound Beat Sync",
      "Reels Delivered in Few Hours"
    ],
    highlight: false
  },
  {
    id: 2,
    reels_count: 2,
    price: 2999,
    title: "Advanced Edit",
    features: [
      "2 Advanced Cinematic Reels",
      "On-Spot Shoot & Creative Angles",
      "Shoot on Gimbal for Smooth Videos",
      "Cinematic Color Grading",
      "Reels Delivered in Few Hours",
      "Complimentary High-Quality Photos"
    ],
    highlight: false
  },
  {
    id: 3,
    reels_count: 3,
    price: 4299,
    title: "Cinematic Edit",
    features: [
      "3 Cinematic High-Impact Reels",
      "Dedicated On-Spot Creative Shoot",
      "Ultra-Smooth Gimbal Motion",
      "Dynamic Transitions & Audio SFX",
      "Reels Delivered in Few Hours",
      "Complimentary High-Quality Photos"
    ],
    highlight: true # Most Popular
  },
  {
    id: 4,
    reels_count: 4,
    price: 5499,
    title: "Premium Edit",
    features: [
      "4 Premium Multi-Angle Reels",
      "Extended Shoot Coverage",
      "Shoot on Gimbal for Smooth Videos",
      "Hollywood Grade Color Science",
      "Fast Delivery in Few Hours",
      "Complimentary High-Quality Photos"
    ],
    highlight: false
  },
  {
    id: 5,
    reels_count: 5,
    price: 6999,
    title: "Pro Cinematic Edit",
    features: [
      "5 Pro Cinematic Master Reels",
      "Full Shoot & Directorial Coverage",
      "Ultra-Smooth Gimbal Tracking",
      "Custom Typography & Sound Design",
      "Fast Priority Delivery in Few Hours",
      "Complimentary High-Quality Photos",
      "100% High Quality Guarantee"
    ],
    highlight: false
  }
]
SiteSetting.set("reel_packages", reel_packages_data, "pricing", "json")

SiteSetting.set("whatsapp_alert_enabled", "false", "notifications", "boolean")
SiteSetting.set("push_notifications_enabled", "true", "notifications", "boolean")
SiteSetting.set("admin_notification_email", "admin@mrdcinemaeditz.com", "notifications")

puts "✅ Site settings & Reel Packages initialized"
puts "🎉 Seeding finished successfully!"
