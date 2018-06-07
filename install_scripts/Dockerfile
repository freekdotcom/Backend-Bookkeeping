# Use node 9.4.0 LTS
FROM node:9.4.0

#Install Nodejs and git
RUN apt-get install git

#Downloads the most recent version from git
RUN git clone https://github.com/SoftwareForScience/Backend-Bookkeeping.git

#Change the Working directory
WORKDIR /Backend-Bookkeeping

#Install the dependencies
RUN npm install

#Expose API port to the outside world
EXPOSE 8080

#Run the database script
RUN ls
RUN bash ./install_scripts/database_script.sh

#Launch the application with sudo docker build - < Dockerfile
RUN npm start

