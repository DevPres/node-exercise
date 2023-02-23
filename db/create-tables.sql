-- Creation of user table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL,
  username varchar(250) NOT NULL,
  pwd varchar(250) NOT NULL,
  refresh_token varchar(250),
  PRIMARY KEY (id)
);

-- Creation of products table
create table if not exists products (
  id serial,
  code varchar(250) not null,
  name varchar(250) not null,
  price decimal not null,
  discount_id integer default null,  
  PRIMARY KEY (id)
);

-- Create join table for cart and user user
create table if not exists cart_session (
  id serial, 
  user_id integer not null,
  total decimal not null default 0.00, 
  PRIMARY KEY (id)
);

-- Create join table for cart and product
create table if not exists cart_product (
  id serial,
  session_id integer not null,
  product_id integer not null,
  quantity varchar(250) not null,
  current_price decimal not null,
  PRIMARY KEY (id)
);

-- create table for discounts
create table if not exists discounts (
  id serial,
  code varchar(250) not null,
  PRIMARY KEY (id)
);


