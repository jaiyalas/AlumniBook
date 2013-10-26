# == Schema Information
#
# Table name: careers
#
#  id           :integer          not null, primary key
#  user_id      :integer
#  title        :text
#  organization :text
#  employer     :text
#  description  :text
#  start_at     :datetime
#  end_at       :datetime
#  created_at   :datetime
#  updated_at   :datetime
#

class Career < ActiveRecord::Base
    belongs_to :user 
end
