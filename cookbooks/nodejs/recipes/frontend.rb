include_recipe "nodejs"
include_recipe "nodejs::npm"
include_recipe "redis"
include_recipe "mongodb-debs"

nodejs_server "frontend" do
  script_file "app.js"
  script_dir "/vagrant/prototype-frontend/"
  user "vagrant"
  action :start
end
