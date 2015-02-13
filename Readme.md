#M&S Styleguide

## Requirements
- Git
- Node.js
- Stylus
- Gulp.js

##Getting Started

	git clone https://github.com/gargantuan/ms_styleguide.git
	npm install
	gulp serve
	
## About
This project uses [Jeet](http://www.jeet.gs) for the responsive grid. 

##Tips
If you need to batch rename a bunch of files to lower case (as I had to with the icons), paste this into terminal

	cd /path/to/files
	for FILE in `ls -A1 *.png`; do FILENAME=`echo ${FILE} | sed 's/ /\\ /g'`; echo mv ${FILENAME}`echo ${FILENAME} | tr [A-Z] [a-z]`; done
	
That will give you a list of `mv` commands. If everything looks ok, change `echo mv ${FILENAME}` to `mv ${FILENAME}`