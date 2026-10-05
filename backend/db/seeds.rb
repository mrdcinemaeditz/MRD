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
  name: "Alex Rivera",
  email: "alex@example.com",
  password: "Password123!",
  password_confirmation: "Password123!",
  role: "user",
  avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
)

user2 = User.create!(
  name: "Elena Rostova",
  email: "elena@example.com",
  password: "Password123!",
  password_confirmation: "Password123!",
  role: "user",
  avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80"
)

# 3. Categories
categories_data = [
  { name: "Cinematic Reels", description: "High impact 9:16 vertical edits tailored for Instagram & TikTok viral growth.", position: 1 },
  { name: "Commercial & Ads", description: "Product launches, high fashion commercials, and luxury brand promotional visual edits.", position: 2 },
  { name: "Color Grading & VFX", description: "Before & after color science transformations, film emulations, and 3D visual effects.", position: 3 },
  { name: "Music Videos & Teasers", description: "Dynamic beat-synced music edits, kinetic typography, and fast-paced sound design.", position: 4 },
  { name: "Travel & Documentaries", description: "4K cinematic travel films, drone pacing, and immersive documentary storytelling.", position: 5 }
]

categories = {}
categories_data.each do |cat|
  categories[cat[:name]] = Category.create!(cat)
end
puts "✅ #{Category.count} Categories created"

# 4. Tags
tags_list = ["4K 60FPS", "Color Graded", "Sound Design", "After Effects", "Film Emulation", "Viral Reel", "Commercial", "3D VFX", "Speed Ramp", "Sound Effects"]
tags = tags_list.map { |t| Tag.create!(name: t, slug: t.parameterize) }

# 5. Portfolio Videos
videos_data = [
  {
    title: "NEON VELOCITY - Cyberpunk Automotive Commercial",
    description: "High-octane commercial reel edit for a supercar campaign featuring neon light trails, custom sound design, and aggressive color grading.",
    category: categories["Commercial & Ads"],
    aspect_ratio: "9:16",
    video_type: "youtube",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
    duration: "00:32",
    is_featured: true,
    status: "published",
    published_at: 2.days.ago,
    views_count: 14250,
    position: 1,
    tag_names: ["4K 60FPS", "Commercial", "Sound Design", "Speed Ramp"]
  },
  {
    title: "GOLDEN HOUR IN TOKYO - Cinematic Street Reel",
    description: "Vertical storytelling reel capturing the golden hour atmosphere in Shibuya and Shinjuku with warm film grain and nostalgic LUT grading.",
    category: categories["Cinematic Reels"],
    aspect_ratio: "9:16",
    video_type: "youtube",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    duration: "00:45",
    is_featured: true,
    status: "published",
    published_at: 4.days.ago,
    views_count: 28900,
    position: 2,
    tag_names: ["Viral Reel", "Film Emulation", "4K 60FPS"]
  },
  {
    title: "ARCTIC HORIZONS - Nordic Landscape Documentary",
    description: "16:9 widescreen cinema showcase featuring breathtaking drone shots across Iceland and Norway with atmospheric sound design.",
    category: categories["Travel & Documentaries"],
    aspect_ratio: "16:9",
    video_type: "youtube",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
    duration: "02:15",
    is_featured: true,
    status: "published",
    published_at: 1.week.ago,
    views_count: 9800,
    position: 3,
    tag_names: ["4K 60FPS", "Sound Design", "Color Graded"]
  },
  {
    title: "BEFORE & AFTER: Hollywood Film LUT Breakdown",
    description: "Side-by-side color grading breakdown demonstrating log footage transformation into rich Kodachrome 35mm warmth.",
    category: categories["Color Grading & VFX"],
    aspect_ratio: "9:16",
    video_type: "youtube",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80",
    duration: "00:28",
    is_featured: true,
    status: "published",
    published_at: 8.days.ago,
    views_count: 34100,
    position: 4,
    tag_names: ["Color Graded", "Film Emulation", "After Effects"]
  },
  {
    title: "PULSE & BEAT - Electronic Festival Teaser",
    description: "Frenetic bass-synced rhythm edit with strobe transitions, 3D typography, and custom motion graphics.",
    category: categories["Music Videos & Teasers"],
    aspect_ratio: "9:16",
    video_type: "youtube",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    duration: "00:38",
    is_featured: false,
    status: "published",
    published_at: 10.days.ago,
    views_count: 18400,
    position: 5,
    tag_names: ["3D VFX", "Speed Ramp", "Sound Design"]
  },
  {
    title: "MONOCHROME LUXE - High Fashion Apparel Campaign",
    description: "Minimalist, luxury editorial aesthetic featuring high contrast black and gold accents with bespoke orchestral scoring.",
    category: categories["Commercial & Ads"],
    aspect_ratio: "9:16",
    video_type: "youtube",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    duration: "00:30",
    is_featured: false,
    status: "published",
    published_at: 12.days.ago,
    views_count: 12100,
    position: 6,
    tag_names: ["Commercial", "Color Graded", "4K 60FPS"]
  }
]

videos = []
videos_data.each do |v_data|
  tag_names = v_data.delete(:tag_names)
  v = Video.create!(v_data)
  v.sync_tags!(tag_names)
  videos << v
end
puts "✅ #{Video.count} Portfolio Videos created"

# 6. Likes and Comments
videos.each do |v|
  Like.create!(user: user1, video: v)
  Like.create!(user: user2, video: v) if [true, false].sample

  Comment.create!(
    user: user1,
    video: v,
    body: "The sound design and pacing in this cut are on another level! 🔥",
    status: "approved"
  )
  Comment.create!(
    user: user2,
    video: v,
    body: "That color grading at the 0:15 mark is pure cinema gold. Outstanding work!",
    status: "approved"
  )
end

# 7. Brands
brands_data = [
  { name: "Sony Music", logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80", position: 1 },
  { name: "Red Bull Media", logo_url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80", position: 2 },
  { name: "Nike Vision", logo_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80", position: 3 },
  { name: "Canon Creators", logo_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=80", position: 4 },
  { name: "Spotify Studios", logo_url: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=200&auto=format&fit=crop&q=80", position: 5 }
]

brands_data.each { |b| Brand.create!(b) }
puts "✅ #{Brand.count} Brand partners created"

# 8. Testimonials
testimonials_data = [
  {
    client_name: "Marcus Vance",
    client_title: "Head of Marketing",
    brand_name: "Aura Luxury Apparel",
    client_avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    content: "MRD transformed our raw product footage into viral Instagram gold. Our engagement rate jumped 340% in 30 days after launching the campaign reels.",
    rating: 5,
    position: 1,
    is_featured: true
  },
  {
    client_name: "Sarah Lin",
    client_title: "Creative Director",
    brand_name: "Neon Horizon Records",
    client_avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    content: "The cinematic pacing and attention to micro-beats is unmatched. MRD doesn't just edit videos; he builds immersive visual experiences.",
    rating: 5,
    position: 2,
    is_featured: true
  },
  {
    client_name: "David Sterling",
    client_title: "Founder & Producer",
    brand_name: "Apex Motion Media",
    client_avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    content: "Fast turnaround, pristine color accuracy, and master-grade sound design. MRD is our go-to creator for all high-stakes commercial ads.",
    rating: 5,
    position: 3,
    is_featured: true
  }
]

testimonials_data.each { |t| Testimonial.create!(t) }
puts "✅ #{Testimonial.count} Testimonials created"

# 9. Site Settings
SiteSetting.set("site_title", "MRD CINEMA EDITZ | Filmmaker & Video Editor", "general")
SiteSetting.set("hero_tagline", "CRAFTING HIGH-IMPACT CINEMATIC VISUALS & VIRAL REELS", "hero")
SiteSetting.set("hero_subheadline", "Elevating brands, artists, and creators through master-class video editing, Hollywood color science, and dynamic sound design.", "hero")
SiteSetting.set("whatsapp_number", "+919876543210", "contact")
SiteSetting.set("whatsapp_default_message", "Hi MRD! I loved your portfolio and would like to discuss a video project.", "contact")
SiteSetting.set("contact_email", "contact@mrdcinemaeditz.com", "contact")
SiteSetting.set("instagram_url", "https://instagram.com/mrdcinemaeditz", "social")
SiteSetting.set("youtube_url", "https://youtube.com/@mrdcinemaeditz", "social")
SiteSetting.set("twitter_url", "https://twitter.com/mrdcinemaeditz", "social")
SiteSetting.set("media_kit_stats", {
  total_followers: "350K+",
  monthly_views: "18.5M+",
  engagement_rate: "9.2%",
  completed_projects: "420+",
  top_demographics: "18-34 Yrs (78% US, UK, IN)"
}, "media_kit", "json")
SiteSetting.set("whatsapp_alert_enabled", "false", "notifications", "boolean")
SiteSetting.set("admin_notification_email", "admin@mrdcinemaeditz.com", "notifications")

puts "✅ Site settings initialized"
puts "🎉 Seeding finished successfully!"
