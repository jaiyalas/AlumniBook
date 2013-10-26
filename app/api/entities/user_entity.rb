module Entities
  class UserEntity < Grape::Entity
    expose :id
    expose :main_id
    expose :second_id
    expose :email
    expose :username
  end
end
