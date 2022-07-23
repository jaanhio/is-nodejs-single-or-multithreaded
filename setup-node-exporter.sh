#!/bin/bash

NODE_EXPORTER_VERSION=1.3.1

# Installs and initialize node-exporter
(cd /tmp && curl -OL https://github.com/prometheus/node_exporter/releases/download/v$NODE_EXPORTER_VERSION/node_exporter-$NODE_EXPORTER_VERSION.linux-amd64.tar.gz)
(cd /tmp && tar -xvf /tmp/node_exporter-$NODE_EXPORTER_VERSION.linux-amd64.tar.gz)

# for running node-exporter process as non-root user
sudo useradd -m node_exporter
sudo groupadd node_exporter
sudo usermod -a -G node_exporter node_exporter

sudo mv /tmp/node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64/node_exporter /usr/local/bin/
sudo chown node_exporter:node_exporter /usr/local/bin/node_exporter

sudo bash -c 'cat <<EOF > /etc/systemd/system/node_exporter.service
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
EOF'

sudo systemctl daemon-reload
sudo systemctl start node_exporter