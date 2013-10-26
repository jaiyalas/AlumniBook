class UserAPI < Grape::API
    format :json
    namespace :users do

        desc 'user login'
        post '/login' do
            safe_params = clean_params(params).permit(:main_id, :password)   
            user = User.find_by main_id: safe_params[:main_id]
            if user
                if user.valid_password?(safe_params[:password])
                    present user, with: Entities::UserEntity
                else
                    error!({'message' => 'Password incorrect.'}, 401)
                end
                
            else
                error!({'message' => 'Cannot find this user.'}, 401)
            end
        end

        desc 'user sign up'
        post '/sign_up' do
            safe_params = clean_params(params).permit(:main_id, :password, :password_confirmation, :email)
            safe_params[:main_id] = safe_params[:main_id].strip
            if safe_params[:main_id].length != 9 ||  safe_params[:main_id][0] =~ /[[:digit:]]/
                error!({'message' => 'ID format error.'}, 401)
            end


            user = User.where('main_id = ? or email = ?', safe_params[:main_id], safe_params[:email])
            if user.any?
                error!({'message' => 'User exist.'}, 401)
            else
                user = User.new(:email => safe_params[:email], :password => safe_params[:password], :password_confirmation => safe_params[:password_confirmation], :main_id => safe_params[:main_id])
                user.save
                unless user.errors.blank?
                    error!({'message' => user.errors.full_messages[0]}, 401)
                end
                present user, with: Entities::UserEntity
            end
        end

        desc 'user logout'
        post '/logout' do
        end


        desc 'user profile'
        get '/profile/:id' do
            current_user = JSON.parse(cookies[:ab_user])['data']
            user = User.find_by main_id: params[:id]
            if current_user['id'] == user.id
                present user, with: Entities::UserfullEntity
            else
                present user, with: Entities::UserEntity
            end
        end

        desc 'user profile edit'
        post '/profile' do
            safe_params = clean_params(params).require(:user).permit(:id, :main_id, :second_id, :email, :username, 
                                                                     {:profile => [:first_name, :last_name, :location, :phone, :address]}, 
                                                                     {:careers => [ [:id, :organization, :title, :description] ]}, 
                                                                     :autobiography, :user_type)
            safe_params[:careers_attributes] = safe_params.delete :careers if safe_params[:careers]
            puts safe_params.inspect
            user = JSON.parse(cookies[:ab_user])['data']
            user = User.find(user['id'])
            user.update_attributes(safe_params)
            present user, with: Entities::UserEntity  
        end
    end
end