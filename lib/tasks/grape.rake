namespace :grape do
  desc "Grape API Routes"
  task :routes => :environment do
    API.routes.each do |api|
      method = api.route_method.ljust(10)
      path = api.route_path
      puts "     #{method} #{path}"
    end
  end
end