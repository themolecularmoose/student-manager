student-manager
================

Api Server/Account Management for the Molecular Mission Game

Technology Info
===============
This server is built off the [Drywall](https://github.com/jedireza/drywall) account management biolerplate. The biolerplate uses the following technologies:

| On The Server | On The Client  | Development |
| ------------- | -------------- | ----------- |
| Express       | Bootstrap      | Grunt       |
| Jade          | Backbone.js    | Bower       |
| Mongoose      | jQuery         |             |
| Passport      | Underscore.js  |             |
| Async         | Font-Awesome   |             |
| EmailJS       | Moment.js      |             |

Local Dev Setup Instructions
=============================

1. Download and install both [Vagrant](https://www.vagrantup.com/downloads.html) and [virtualbox](https://www.virtualbox.org/wiki/Downloads)
2. Create a user environment variable called VBOX_USER_HOME and set it to a folder where you want virtualbox to store its config files. 
3. Open up the newly installed virtualbox GUI. Go to file and then preferences. In the general tab change the "Default Machine Folder" location to a directory where you want to store your VMs.
4. Clone this repo
5. Open a terminal (command line for windows) in the directory of the repo you just cloned.
6. Run: `vagrant up`, which will download a vm image and install all of the dependencies of this project.
7. Once the installation is complete run: `vagrant ssh`, and this will ssh you into the new box. (If you run into issues here you may not have openssh in your path. Add the git bin tools to your system path to fix this.) 
8. Now you can create the db with the command `createdb molecular`.
9. In the terminal that is ssh-ed into the vagrant box `cd app` and run `npm install`. This will install all of the node dependencies for the project. 
10. To setup the root account and database follow the instructions on the instructions [here](https://github.com/jedireza/drywall#setup)
11. You can now run the server by `cd app` and `node app.js'. 
12. If everything went well the account management website will be available through localhost:3000 and the api server should be available through localhost:3000/api/<endpoint> 

For a full list of vagrant commands go [here](https://docs.vagrantup.com/v2/cli/index.html)

Heroku Production Deployment
============================
First you need a heroku account. Acounts are free and VMs with only 1 dyno can run free forever. [heroku website](https://www.heroku.com/)

In order to deploy the server to heroku follow the basic instrcutions provided [here](https://devcenter.heroku.com/articles/git)
**NOTE** the repository already has a heroku proc file for deployment. After setting up a remote of the repo on heroku all you need to do is a `git push heroku master` (If you lable the remote heroku). 
