class CreatePortfolioTables < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :role, default: "user", null: false
      t.string :avatar_url
      t.boolean :is_blocked, default: false, null: false

      t.timestamps
    end
    add_index :users, :email, unique: true

    create_table :categories do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.integer :position, default: 0, null: false

      t.timestamps
    end
    add_index :categories, :slug, unique: true

    create_table :tags do |t|
      t.string :name, null: false
      t.string :slug, null: false

      t.timestamps
    end
    add_index :tags, :slug, unique: true

    create_table :videos do |t|
      t.string :title, null: false
      t.string :slug, null: false
      t.text :description
      t.references :category, foreign_key: true, null: true
      t.string :video_url
      t.string :video_type, default: "upload" # upload, youtube, instagram, vimeo
      t.string :thumbnail_url
      t.string :aspect_ratio, default: "9:16" # 9:16, 16:9
      t.string :duration
      t.boolean :is_featured, default: false, null: false
      t.string :status, default: "published", null: false # draft, published, scheduled
      t.datetime :published_at
      t.integer :views_count, default: 0, null: false
      t.integer :likes_count, default: 0, null: false
      t.integer :comments_count, default: 0, null: false
      t.integer :position, default: 0, null: false
      t.string :seo_title
      t.text :seo_description

      t.timestamps
    end
    add_index :videos, :slug, unique: true
    add_index :videos, [:status, :published_at]
    add_index :videos, :is_featured

    create_table :video_tags do |t|
      t.references :video, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end
    add_index :video_tags, [:video_id, :tag_id], unique: true

    create_table :likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :video, null: false, foreign_key: true

      t.timestamps
    end
    add_index :likes, [:user_id, :video_id], unique: true

    create_table :comments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :video, null: false, foreign_key: true
      t.text :body, null: false
      t.string :status, default: "approved", null: false # approved, pending, flagged, deleted

      t.timestamps
    end
    add_index :comments, [:video_id, :created_at]
    add_index :comments, :status

    create_table :reports do |t|
      t.references :user, null: false, foreign_key: true
      t.references :comment, null: false, foreign_key: true
      t.text :reason, null: false
      t.string :status, default: "pending", null: false # pending, reviewed, resolved

      t.timestamps
    end

    create_table :video_views do |t|
      t.references :video, null: false, foreign_key: true
      t.string :ip_hash
      t.string :session_token
      t.datetime :viewed_at

      t.timestamps
    end
    add_index :video_views, [:video_id, :session_token]

    create_table :enquiries do |t|
      t.string :name, null: false
      t.string :brand_name
      t.string :email, null: false
      t.string :phone
      t.string :budget_range
      t.string :service_type
      t.text :message, null: false
      t.string :status, default: "new", null: false # new, read, replied, archived

      t.timestamps
    end
    add_index :enquiries, :status
    add_index :enquiries, :created_at

    create_table :brands do |t|
      t.string :name, null: false
      t.string :logo_url
      t.string :website_url
      t.integer :position, default: 0, null: false
      t.boolean :is_active, default: true, null: false

      t.timestamps
    end

    create_table :testimonials do |t|
      t.string :client_name, null: false
      t.string :client_title
      t.string :brand_name
      t.string :client_avatar_url
      t.text :content, null: false
      t.integer :rating, default: 5, null: false
      t.integer :position, default: 0, null: false
      t.boolean :is_featured, default: true, null: false

      t.timestamps
    end

    create_table :site_settings do |t|
      t.string :key, null: false
      t.text :value
      t.string :setting_type, default: "text" # text, json, boolean, file
      t.string :category, default: "general" # general, contact, social, hero, media_kit, seo

      t.timestamps
    end
    add_index :site_settings, :key, unique: true
  end
end
