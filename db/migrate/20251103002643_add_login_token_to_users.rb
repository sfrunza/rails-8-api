class AddLoginTokenToUsers < ActiveRecord::Migration[8.0]
  def change
    # Add login_token column
    add_column :users, :login_token, :string
    add_index :users, :login_token

    # Add login_token_expires_at column
    add_column :users, :login_token_expires_at, :datetime
    # Note: No index on login_token_expires_at - it's only used for time comparisons, not lookups
  end
end
