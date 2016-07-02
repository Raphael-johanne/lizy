@author RAPHAEL COLBOC
@package LIZY 1.0.1

DESCRIPTION
-----------

A little PIM really fast in I/O treatment. Just one channel for the moment, but more will come soon.

GENERALITY
-----------

1. PIM : Product Information Management
2. Job : Provide import/export of data functionnality

INSTALLATION
------------

1. Install nodejs https://nodejs.org/en/download/package-manager/
2. Install mongoDb https://docs.mongodb.com/manual/installation/
3. Download LIZY PIM sources from GIT : 
`git clone https://github.com/Raphael-johanne/lizy`
Or get sources directly.
4. Start nodejs server from the project directory : `nodejs app.js`

If you go to `http://localhost:3000/`, you must see the LIZY login page.

PREPARATION 
------------

1. Create a user

`nodejs console.js pim:user username="YOUR_USERNAME_TO_LOG_WITH" email="YOUR_EMAIL" password="YOUR_PASSWORD_TO_LOG_WITH" env="YOUR_ENV"`

`env` can be 'dev', 'preprod' or 'prod'.
`password` is of course encrypted in LIZY for security reason.

2. Install default Import/Export Job

`nodejs console.js connector:install`

TEST
------------

By default, LIZY running on port 3000, so you can access to it by this address : `http://localhost:3000/`

If you want to run LIZY on different port, you can override core module, in config folder, depend on your env.

That's it, enjoy :)



