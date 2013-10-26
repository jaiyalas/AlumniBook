class CreateTopics < ActiveRecord::Migration
  def change
    create_table :topics do |t|
        t.references :user
        t.string :title
        t.text :content
        t.string :authorname
        t.timestamps
    end
  end
end
