module Entities
  class TopicEntity < Grape::Entity
    expose :id
    expose :title
    expose :content
    expose :authorname
    expose :user, using: Entities::UserEntity
    expose :comments_count do |topic, options|
        topic.comments.count
    end
    expose :comments, using: Entities::CommentEntity
    expose :created_at
  end
end
