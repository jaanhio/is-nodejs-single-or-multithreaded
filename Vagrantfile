VAGRANTFILE_API_VERSION = "2"
NUMBER_OF_MASTER_NODES = 1

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    # 16.04
    #config.vm.box = "ubuntu/xenial64"

    # 18.04
    #config.vm.box = "ubuntu/bionic64"

    # 20.04
    config.vm.box = "ubuntu/focal64"

    # 21.04
    #config.vm.box = "ubuntu/hirsute64"

    config.ssh.insert_key = false
    config.vm.synced_folder ".", "/vagrant", disabled: true

    # for syncing nodejs application code
    config.vm.synced_folder "server/", "/tmp/server"

    config.vm.provider :virtualbox do |v|
        v.memory = 2048
        v.cpus = 2
        v.linked_clone = true
    end

    config.vm.provision "shell", path: "./setup-nodejs.sh", privileged: false
    config.vm.provision "shell", path: "./setup-node-exporter.sh", privileged: true

    (1..NUMBER_OF_MASTER_NODES).each do |i|
      config.vm.define "nodejs#{i}" do |node|
          node.vm.hostname = "nodejs#{i}"
          node.vm.network :private_network, ip: "192.168.60.#{20 + i}"
      end
    end
end
