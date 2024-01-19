# Introduction
API and database for a news post and blogging website. Sign up, access the latest news and connect with other users. Publish articles, read articles, interact and comment on articles posted by other users.

# Instructions 
- Clone the repo: 'git clone https://github.com/ramemes/nc-news'

- Install dependencies: 
    -> 'npm install --save--dev jest'
    -> 'npm install jest-extended supertest express fs jest-sorted pg pg-format husky'

- Database setup:
    -> Set-up database with 'npm run setup-dbs'

- *Testing:
    -> Seed database with 'npm run seed'
    -> npm run test [FILENAME/PATH]

- *Production / Hosting:
    -> 'npm run seed-prod'


# Create .env files

- Add file '.env.test' for the test database environment
    -> Initialise with 'PGDATABASE=nc_news_test' to connect .env.test file to test database

- Add file '.env.development' for the development database environment
    -> Initialise with 'PGDATABASE=nc_news' to connect .env.development to development database

- Add file '.env.production' for the test database environment
    -> Initialise with 'DATABASE_URL=[your-elephantsql-url]' to connect .env.test file to test database


# Link to hosted version
https://render-nc-news.onrender.com/


# Dependency version requirements
node: "^21.2.0"
postgres: "^8.11.3"