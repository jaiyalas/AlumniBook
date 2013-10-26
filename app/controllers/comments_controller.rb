class CommentsController < ApplicationController
    after_filter :cors_set_access_control_headers

    # For all responses in this controller, return the CORS access control headers.
    def cors_set_access_control_headers
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
      headers['Access-Control-Allow-Headers'] = '*'
      headers['Access-Control-Max-Age'] = "1728000"
    end

    def new
        topic = Topic.find(params[:topic_id])
        topic.comments.create(:authorname => params[:authorname], :comment => params[:comment])
    end
end
