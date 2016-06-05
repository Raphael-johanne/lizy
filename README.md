@author RAPHAEL COLBOC
@package LIZY 1.0.0

DESCRIPTION
-----------

A little PIM really fast in I/O treatment. Just one channel for the moment, but more will come soon.

INSTALLATION
------------

1. Install nodejs https://nodejs.org/en/download/package-manager/
2. Install mongoDb https://docs.mongodb.com/manual/installation/
3. Download LIZY PIM sources from GIT : 
`git clone https://github.com/Raphael-johanne/lizy`
Or get sources directly.
4. Start nodejs server from the project directory : `nodejs app.js`
5. Run LIZY PIM install : `nodejs console.js connector:install`

TEST
------------

By default, LIZY PIM running on port 3000, so you can access to it by this address : `http://localhost:3000/dashboard/index`

If you want to run LIZY PIM on different port, you can override `app.js` or waiting for config module (WIP).

That's it, enjoy :)

PS : "TypeError: Cannot read property 'Kerberos' of undefined at Object.<anony..." is not important


