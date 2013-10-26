class TopicAPI < Grape::API
    format :json
    namespace :topics do

        desc 'get topic list'
        get '/' do
            topics = Topic.all
            present topics, with: Entities::TopicEntity
        end

        desc 'create topic'
        post '/' do
            safe_params = clean_params(params).permit(:title, :content, :authorname)
            user = JSON.parse(cookies[:ab_user])['data']
            user = User.find(user['id'])
            topic = user.topics.create(safe_params)
            present topic, with: Entities::TopicEntity
        end

        desc 'get topic'
        get '/:id' do
            topic = Topic.find(params[:id])
            present topic, with: Entities::TopicEntity
        end
    end
end