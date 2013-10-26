module Entities
  class UserfullEntity < Grape::Entity
    expose :id
    expose :main_id
    expose :second_id
    expose :email
    expose :username
    expose :profile
    expose :autobiography
    expose :careers, using: Entities::CareerEntity
  end
end
