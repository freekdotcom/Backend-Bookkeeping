# @Author: Frederick van der Meulen
# @Date:   2018-06-04 14:56:36
# @Last Modified by:   Frederick van der Meulen
# @Last Modified time: 2018-06-08 13:51:36

#First install NodeJs
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
apt-get install -y nodejs

#Then install Git
add-apt-repository ppa:git-core/ppa
apt-get update
apt install git

#With Git, pulling from the repository
git clone https://github.com/SoftwareForScience/Backend-Bookkeeping.git /home/Documents/Bookkeeping

#installing all the packages
cd ../Documents/Bookkeeping/
npm install

#Get the postgres database
apt-get install postgresql postgresql-contrib

#run the sql script
cd install_scripts
bash database_script.sql 
