Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")

  root to: redirect(path: "/en/game")

  scope "(:locale)", locale: /en|es/ do
    get '/game', to: "dashboard#index"
  end

end
