-- Creation of user table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL,
  username varchar(250) NOT NULL,
  pwd varchar(250) NOT NULL,
  refresh_token varchar(250),
  PRIMARY KEY (id)
);
