@author RAPHAEL COLBOC
@package LIZY 1.0.1

DESCRIPTION
-----------

A PIM really fast in I/O treatment. Just one channel for the moment, but more will come soon.

GENERALITY
-----------

1. PIM : Product Information Management
2. Job : Provide import/export of data functionnality
3. Shell : Command line to execute in a terminal (be carefull of rights !)
4. Family : Type of product that you can associate specific attributes
5. Attribute : Type of field that you could administer to a related product to a family (Media, Choice, Text, etc)

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

Install default jobs with this shell command

`nodejs console.js connector:install`

TEST
------------

By default, LIZY running on port 3000, so you can access to it by this address : `http://localhost:3000/`

If you want to run LIZY on different port, you can override core module in config folder.

HOW TO USE
------------

LIZY provide an interface to manage your product but also some shell commands to export your data.

With a terminal, you can lunch commands above (where "ENV" can be `env`, 'dev', 'preprod' or 'prod') :

/PROJECT_LOCATION/nodejs console.js connector:job code=export_attribute_csv env=ENV
/PROJECT_LOCATION/nodejs console.js connector:job code=export_attribute_option_csv env=ENV
/PROJECT_LOCATION/nodejs console.js connector:job code=export_category_csv env=ENV
/PROJECT_LOCATION/nodejs console.js connector:job code=export_family_csv env=ENV

It will generated CSV file in "modules/pim/export" folder.





