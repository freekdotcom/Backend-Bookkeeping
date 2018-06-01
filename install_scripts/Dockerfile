# Use node 9.4.0 LTS
FROM node:9.4.0

#Install Nodejs and git
RUN apt-get install git

#Downloads the most recent version from git
RUN git clone https://github.com/SoftwareForScience/Backend-Bookkeeping.git

#Change the Working directory
WORKDIR /Backend-Bookkeeping

#Switch to the development branch
RUN git checkout origin/develop

#Install the dependencies
RUN npm install

#Expose API port to the outside world
EXPOSE 8080

#Launch the application with sudo docker build - < Dockerfile
RUN npm start

