# Use node 9.4.0 LTS
FROM node:9.4.0

#Install Nodejs and git
RUN apt-get install git
RUN apt-get install postgresql postgresql-contrib

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
RUN createdb cern
RUN psql cern

RUN CREATE TABLE log_entry(
	run_id SERIAL PRIMARY KEY,
	created TIMESTAMP WITHOUT TIME ZONE, 
	subsystem VARCHAR (25), 
	class VARCHAR (30),
    type VARCHAR(40), 
    run VARCHAR(50), 
    author VARCHAR(255), 
    title VARCHAR(255), 
    log_entry_text VARCHAR(255), 
    follow_ups VARCHAR(255))
);
#Launch the application with sudo docker build - < Dockerfile
RUN npm start

