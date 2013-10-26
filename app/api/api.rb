class API < Grape::API
    format :json
    rescue_from :all, :backtrace => true

    helpers do
        def logger
          logger = Logger.new(File.expand_path("../../../log/grape.log", __FILE__))
        end

        def current_user   
          # for app 
          if request.headers["Authorization"] && result = request.headers["Authorization"].match(/Bearer (?<token>.+)/)
            token = result[:token]
            @current_user = User.find_for_facebook_access_token(token)

          # for web site
          elsif env['warden'].user 
            @current_user = env['warden'].user

          # for swagger api demo
          elsif params[:api_key].present?
            @current_user = User.find_for_facebook_access_token(params[:api_key])
          end
          
          @current_user
        end

        def authenticate!
          error!('401 Unauthorized', 401) unless current_user
        end

        def clean_params(params)
          ActionController::Parameters.new(params)
        end
    end

    get 'ping' do
        {pong: Time.now}
    end

    mount UserAPI
    mount TopicAPI
    mount CommentAPI
end

