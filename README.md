@author RAPHAEL COLBOC
@package LIZY 1.0.1

DESCRIPTION
-----------

A little PIM really fast in I/O treatment. Just one channel for the moment, but more will come soon.

GENERALITY
-----------

1. PIM : Product Information Management
2. Job : Provide import/export of data functionnality
3. Shell : Command line to execute in a terminal (be carefull of rights !)

INSTALLATION
------------

1. Install nodejs https://nodejs.org/en/download/package-manager/
2. Install mongoDb https://docs.mongodb.com/manual/installation/
3. Download LIZY PIM sources from GIT : 
`git clone https://github.com/Raphael-johanne/lizy`
Or get sources directly.
4. Start nodejs server from the project directory with this shell command: `nodejs app.js`

If you go to `http://localhost:3000/`, you must see the LIZY login page.

PREPARATION 
------------

Create a user with this shell command

`nodejs console.js pim:user username="YOUR_USERNAME_TO_LOG_WITH" email="YOUR_EMAIL" password="YOUR_PASSWORD_TO_LOG_WITH" env="YOUR_ENV"`

	1. `env` can be 'dev', 'preprod' or 'prod'.
	2. `password` is of course encrypted in LIZY for security reason.

Install default Import/Export Job with this shell command

`nodejs console.js connector:install`

TEST
------------

By default, LIZY running on port 3000, so you can access to it by this address : `http://localhost:3000/`

If you want to run LIZY on different port, you can override core module, in config folder, depend on your env.

That's it, enjoy :)



