class CreateCareers < ActiveRecord::Migration
  def change
    create_table :careers do |t|
        t.belongs_to :user
        t.text :title
        t.text :organization
        t.text :employer
        t.text :description
        t.datetime :start_at
        t.datetime :end_at
        
        t.timestamps
    end
  end
end
