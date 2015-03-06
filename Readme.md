#M&S Styleguide

## Requirements
- [Git](http://git-scm.com/)
- [Node.js](http://nodejs.org/)
- Stylus: `sudo npm install stylus -g`
- Gulp.js: `sudo npm install gulp -g`

##Getting Started
Forgive the verbosity - this is written for non-developers too. 

### Node setup
This will not build with Node 0.12 or above. Check your Node version by typing the following into the terminal...

	node -v

Ideally, you want `0.11.16` but anything above `0.10.25` (and less than `0.12`) should work. You can easily change you Node version with the `n` npm. 

	sudo npm cache clean -f
	sudo npm install n -g
	sudo n 0.11
	
It's easy to change Node verisons this way so you've not nuked any other projects that rely on a different Node version. 

### Download, install, build
	git clone https://github.com/gargantuan/ms_styleguide.git
	cd ms_styleguide
	npm install
	gulp serve
	
#####Note: There's something wrong with the build process at the moment. If you get an error like this...

	stream.js:94
      throw er; // Unhandled stream error in pipe.
      Error: ENOENT, stat '~/Development/MS_Styleguide/build/fonts/00a50b07-c2e0-458a-9958-26d6b05d0d8e.woff'
    at Error (native)
      
#####Just call `gulp serve` a second time and it should work. I've not had chance to diagnose it yet. If you're having any other troubles with the build process, [email me](mailto: him@tomelders.com)

Unless you're a server admin and hosts.conf whizz, I'd reccomend using:

- [OS X Server](https://itunes.apple.com/gb/app/os-x-server/id883878097) To set up [http://ms-styleguide.dev](http://ms-styleguide.dev) on localhost  
- [hosts.prefpane](https://github.com/specialunderwear/Hosts.prefpane) to make [http://ms-styleguide.dev](http://ms-styleguide.dev) resolve to localhost.  
	
## Gulp Tasks

- `gulp serve` - Build and serve the app with live reload
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

I've tried out a couple of conventions that may or may not be familiar to you. 

##### HTML Custom Elements
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

##### Sparse use of classes
Where possible, this project tries to avoid classes and favours semantic markup. So you won't see any classes relating to the grid system for example. In addition, it is preferable to use the `data-role` attibute convention (which is just a custom attribute) when specifying the role of an element that is ancillary to it's tag name. 

However, only use this where it makes sense. You'll notice that the `color-swatch` example above uses a class to specify a color. There it makes sense. Buttons are a use case where `data-role` makes sense. 

	<button data-role="seondary">This is a button</button>
	
It's a judgement call. To be fair, this kind of broke down at the later stages and calls for a refactor. 

###CSS/Stylus
This project uses Stylus is the CSS preprocessor. In addition, it uses [Jeet](http://jeet.gs/) for grid framework and [Rupture](https://github.com/jenius/rupture) for the media queries.


###Icons

##### Impotant
The `css-sprite` package that handles resizing the retina icons to standard definition defaults to an interpolation alogrith that results is janky looking sprites. There's a pending pull request that [fixes this issue here](https://github.com/aslansky/css-sprite/pull/52). If it's not been merged by the time you read this, here's the [patch](https://github.com/aslansky/css-sprite/pull/52.patch)

To generate icons, simply add new icon images to the `icons` folder and run the `gulp icons` task.

The images should be at retina resolution since the gulp task takes care of genertating standard-def sprites. 

The icons are bas64 encoded into the stylesheet.

#### Batch renaming icon files
If you need to batch rename a bunch of files to lower case (typically icon files), paste this into terminal

	cd /path/to/files
	for FILE in `ls -A1 *.png`; do FILENAME=`echo ${FILE} | sed 's/ /\\ /g'`; echo mv ${FILENAME} `echo ${FILENAME} | tr [A-Z] [a-z]`; done
	
That will give you a list of `mv` commands. If everything looks ok, change `echo mv ${FILENAME}` to `mv ${FILENAME}` and run again. 


## Todo

- Use `gulp-watch` to observe new files
- Refactor class names