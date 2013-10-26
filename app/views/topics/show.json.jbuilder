json.(@topic, :id, :title, :content, :authorname, :created_at)

json.comments @topic.comments do |comment|
  json.(comment, :id, :authorname, :comment, :created_at)
end