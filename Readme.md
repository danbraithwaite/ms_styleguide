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
	
## Gulp Tasks

- `gulp serve` - Build and serve the app with live reload
- `gulp deploy` - Create a deployment build
- `gulp html` - Build the HTML files
- `gulp icons` - Precoess the icon files and generate the stylus file
- `gulp images` - Process and optimize image files
- `gulp fonts` - Moves the font files to the build/deploy folder
	
## About
Running `gulp serve` should be the only gulp task you need to run. However, the default `gulp watch` doesn't observe new files, so you'll need to cancel and run that task again whenever you add a new file. I have experimented with the `gulp-watch` package which does observe new files, but I ran into problems with stylus. This is in the todo list

This project uses [Jeet](http://www.jeet.gs) for the responsive grid. 

### Deployment
Running `gulp deploy` will create a deployment build with compressed source files.

### PSD Downloads
I've not included the downloadable PSDs in the git repo because they're too big. You'll need to source these from else where (Dan Brathwaite most likely). 

### HTML

The HTML files are split into partials and the output HTML is generated with the `gulp html` task. 

I've adopted a couple of conventions that may or may not be familiar to you. 

#### HTML Custom Elements
For better semantics and readability, this project makes liberal use of [HTML5's Custom tags](http://www.html5rocks.com/en/tutorials/webcomponents/customelements/) rather than pollute the code with divs and classes. One example of that would be

	<color-swatch-group>
		<color-swatch class="black">
			<color-swatch-name>Black</color-swatch-name>
			<color-swatch-hex>#000000</color-swatch-hex>
		</color-swatch>

		<color-swatch class="dark-grey">
			<color-swatch-name>Dark grey</color-swatch-name>
			<color-swatch-hex>#333333</color-swatch-hex>
		</color-swatch>
	</color-swatch-group>

#### Sparse use of classes
Where possible, this project tries to avoid classes and favours semantic markup. So you won't see any classes relating to the grid system for example. In addition, it is preferable to use the `data-role` attibute convention (which is just a custom attribute) when specifying the role of an element that is ancillary to it's tag name. 

However, only use this where it makes sense. You'll notice that the `color-swatch` example above uses a class to specify a color. There it makes sense. Buttons are a use case where `data-role` makes sense. 

	<button data-role="seondary">This is a button</button>
	
It's a judgement call. To be fair, this kind of broke down at the later stages and calls for a refactor. 

###Icons

To generate icons, simply add new icon images to the `icons` folder and run the `gulp icons` task.

The images should be at retina resolution since the gulp task takes care of genertating standard-def sprites. 

The icons are bas64 encoded into the stylesheet.

#### Batch renaming icon files
If you need to batch rename a bunch of files to lower case (as I had to with the icons), paste this into terminal

	cd /path/to/files
	for FILE in `ls -A1 *.png`; do FILENAME=`echo ${FILE} | sed 's/ /\\ /g'`; echo mv ${FILENAME}`echo ${FILENAME} | tr [A-Z] [a-z]`; done
	
That will give you a list of `mv` commands. If everything looks ok, change `echo mv ${FILENAME}` to `mv ${FILENAME}` and run again. 


## Todo

- Use `gulp-watch` to observe new files
- Refactor class names