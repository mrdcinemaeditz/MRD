class AddReadAndReadAtToEnquiries < ActiveRecord::Migration[8.1]
  def change
    add_column :enquiries, :read, :boolean, default: false, null: false unless column_exists?(:enquiries, :read)
    add_column :enquiries, :read_at, :datetime unless column_exists?(:enquiries, :read_at)
    
    add_index :enquiries, :read unless index_exists?(:enquiries, :read)
  end
end
