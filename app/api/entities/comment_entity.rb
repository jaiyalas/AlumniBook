module Entities
  class CommentEntity < Grape::Entity
    expose :id
    expose :authorname
    expose :comment
    expose :user, using: Entities::UserEntity
    expose :created_at
  end
end
