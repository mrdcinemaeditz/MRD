class AddUploadFieldsToVideos < ActiveRecord::Migration[8.1]
  def change
    add_column :videos, :source_type, :string, default: "external", null: false unless column_exists?(:videos, :source_type)
    add_column :videos, :width, :integer unless column_exists?(:videos, :width)
    add_column :videos, :height, :integer unless column_exists?(:videos, :height)
    
    add_index :videos, :source_type unless index_exists?(:videos, :source_type)
  end
end
