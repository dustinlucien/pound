Vagrant::Config.run do |config|

  # Configure the backend environment in its own VM
  config.vm.define :backend do |backend_config|

    # Every Vagrant virtual environment requires a box to build off of.
    backend_config.vm.box = "lucid32"

    # The url from where the 'config.vm.box' box will be fetched if it
    # doesn't already exist on the user's system.
    backend_config.vm.box_url = "http://files.vagrantup.com/lucid32.box"

    # Assign this VM to a host only network IP, allowing you to access it
    # via the IP.
    backend_config.vm.network "192.168.2.10"

    # Forward a port from the guest to the host, which allows for outside
    # computers to access the VM, whereas host only networking does not.
    backend_config.vm.forward_port "http", 3000, 3000 

    # Enable provisioning with chef solo, specifying a cookbooks path (relative
    # to this Vagrantfile), and adding some recipes and/or roles.

    backend_config.vm.provision :chef_solo do |chef|
      chef.cookbooks_path = "cookbooks"
      chef.add_recipe "redis"
      chef.add_recipe "mongodb-debs"
      chef.add_recipe "nodejs"
      chef.add_recipe "nodejs::npm"
      chef.add_recipe "nodejs::backend"
    end

  end

end
