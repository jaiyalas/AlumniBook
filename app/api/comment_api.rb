class CommentAPI < Grape::API
    format :json
    namespace :comments do

        desc 'create comment to specific topic'
        post '/' do
            safe_params = clean_params(params).permit(:topic_id, :comment)
            current_user = JSON.parse(cookies[:ab_user])['data']
            safe_params[:user_id] = current_user['id']

            topic_id = safe_params.delete :topic_id if safe_params[:topic_id]
            topic = Topic.find(topic_id)
            comment = topic.comments.create(safe_params)
            present comment, with: Entities::CommentEntity
        end
    end
end