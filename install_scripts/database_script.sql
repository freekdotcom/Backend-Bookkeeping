# @Author: Frederick van der Meulen
# @Date:   2018-05-29 09:53:42
# @Last Modified by:   Frederick van der Meulen
# @Last Modified time: 2018-06-07 16:52:06

createdb cern
psql cern

CREATE TABLE log_entry(
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