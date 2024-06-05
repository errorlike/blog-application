CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer default 0
);
insert into blogs (author,url,title) values ('Alice','http://example.com','first post');
insert into blogs (author,url,title,likes) values ('Bob','http://example.com','second post',10);