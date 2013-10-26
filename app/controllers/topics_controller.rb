class TopicsController < ApplicationController
    after_filter :cors_set_access_control_headers

    # For all responses in this controller, return the CORS access control headers.
    def cors_set_access_control_headers
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
      headers['Access-Control-Allow-Headers'] = '*'
      headers['Access-Control-Max-Age'] = "1728000"
    end

    def index
        @topics = Topic.all
    end

    def create
        @topic = Topic.create(title: params[:title], content: params[:content], authorname: params[:authorname])
    end

    def new
        @topic = Topic.create(title: params[:title], content: params[:content], authorname: params[:authorname])
    end

    def show
        @topic = Topic.find(params[:id])
    end
end
