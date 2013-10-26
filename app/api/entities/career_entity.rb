module Entities
  class CareerEntity < Grape::Entity
    expose :id
    expose :organization
    expose :title
    expose :description
  end
end
