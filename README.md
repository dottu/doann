# BLOG_NODEJS
# Learning
**Setting db for dev in .ENV as Sample:** 

NODE_ENV=development
PORT=8686

DB_DIALECT=mysql

DEV_DB_USERNAME=root
DEV_DB_PASSWORD=test
DEV_DB_NAME=atruyenhay
DEV_DB_HOSTNAME=172.21.0.6

CI_DB_USERNAME=
CI_DB_PASSWORD=
CI_DB_NAME=
CI_DB_HOSTNAME=

PROD_DB_USERNAME=
PROD_DB_PASSWORD=
PROD_DB_NAME=
PROD_DB_HOSTNAME=

ENABLE_RESET_DB=1

DEV_CACHE_HOST=test
DEV_CACHE_PORT=6379
ENABLE_CACHE=0
PREFIX_API_CACHE=api_
SESSION_SECRET=abc

**Migrate DB:**
   -- `npm install`
   -- `npm run resetdb`

**RUN as Development:**

	-- `npm run dev`
