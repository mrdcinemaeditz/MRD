Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Authentication
      post "auth/login", to: "auth#login"
      post "auth/register", to: "auth#register"
      get "auth/me", to: "auth#me"
      put "auth/profile", to: "auth#update_profile"

      # Public Videos & Reels
      resources :videos, only: [:index, :show] do
        collection do
          get :featured
        end
        resources :comments, only: [:index, :create]
        post "like", to: "likes#toggle"
      end

      delete "comments/:id", to: "comments#destroy"
      post "comments/:id/report", to: "comments#report"

      # Public Metadata
      resources :categories, only: [:index]
      resources :enquiries, only: [:create]
      resources :brands, only: [:index]
      resources :testimonials, only: [:index]
      get "site_settings", to: "site_settings#index"

      # Admin Namespace
      namespace :admin do
        get "dashboard", to: "dashboard#index"

        resources :videos do
          collection do
            patch :reorder
          end
          member do
            patch :toggle_featured
          end
        end

        resources :categories do
          collection do
            patch :reorder
          end
        end

        resources :comments, only: [:index, :destroy] do
          collection do
            get :reports
          end
          member do
            patch :approve
            patch :flag
            post :block_user
          end
        end

        resources :enquiries, only: [:index, :show, :update, :destroy] do
          collection do
            get :unread_count
            patch :mark_all_read
          end
          member do
            patch :mark_read
          end
        end
        resources :brands
        resources :testimonials

        get "site_settings", to: "site_settings#index"
        put "site_settings", to: "site_settings#update_bulk"

        # Firebase Push Notifications
        post "push/register", to: "push_notifications#register"
        delete "push/unregister", to: "push_notifications#unregister"
        post "push/test", to: "push_notifications#test"
      end
    end
  end
end
