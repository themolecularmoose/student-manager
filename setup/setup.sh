function update() {
  sudo apt-get update -y
}

function common() {
  update
  export LANGUAGE=en_US.UTF-8
  export LANG=en_US.UTF-8
  export LC_ALL=en_US.UTF-8
  sudo locale-gen en_US.UTF-8
  sudo dpkg-reconfigure locales
  sudo apt-get install curl -y
  sudo apt-get install vim -y
  sudo apt-get install git -y
}

function node() {
  sudo apt-get install python-software-properties python python-pip g++ make -y
  sudo apt-get install software-properties-common -y
  sudo add-apt-repository ppa:chris-lea/node.js -y
  update
  sudo apt-get install nodejs -y
  sudo apt-get -yqq remove coffeescript -y
  sudo apt-get install libpq-dev build-essential -y
  sudo npm install -g grunt-cli bower
}

function mongodb() {
  sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
  echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
  update
  sudo apt-get -y install mongodb-org
}

function lineSep() {
  for n in {1..20}
  do
    printf "="
  done
  printf "\n"
}

function title() {
  lineSep
  echo "$1"
  lineSep
}

set -e
title "Installing Everything"
update
common

title "Installing Node"
node

title "Installing Mongodb"
mongodb

title "Finished Everything"