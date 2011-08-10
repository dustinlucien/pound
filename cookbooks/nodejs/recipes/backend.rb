include_recipe "nodejs"
include_recipe "nodejs::npm"
include_recipe "redis"
include_recipe "mongodb-debs"

nodejs_server "backend" do
  script_file "app.js"
  script_dir "/vagrant/restful-backend/"
  user "vagrant"
  action :start
end
