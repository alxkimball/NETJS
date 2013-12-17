# NetJS JavaScript Library

JavaScript implementation of .NET's Linq to Objects

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/alxkimball/NETJS/master/netjs.full.min.js
[max]: https://raw.github.com/alxkimball/NETJS/master/netjs.full.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="underscore.js"></script>
<script src="netjs.full.min.js"></script>
<script>
jQuery(function($) {
  var list2 = new netjs.collections.ext.ArrayList([{a:"bob", b:["bob jr", "joe bob"]}, {a:"sally", b:["sally jr", "sally joe"]}, {a:"frank", b:["frank jr"]}]);
		var project = function(x) {
			return x.b;
		};
		var flatten = function (x, y){
			return y;
		}
		var selectMany = list2.selectMany(project, flatten).toArray();
		//and much much more, SEE tests for by function examples.
});
</script>
```

## Documentation
The library closely mirrors Microsoft's .Net framework library (http://msdn.microsoft.com/en-us/library/system.collections.generic(v=vs.110).aspx).

## Examples
See tests for full functionality and usage examples.

## Release History
2013-12-17 v0.0.1 The project has been incubating for a while and is due a release. Planning has started for the next release. Let me know if there are any wish lists.

## Road Map
v0.1 - Remove dependencies on Underscore and jQuery.

v0.2 - Refactor to AMD for RequiresJS or NodeJS.

v0.8 - ECMA Script 6 support version to use built in generators and yield.

## License
Copyright (c) 2012-2014 Alex Kimball
Licensed under the MIT, GPL licenses.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

### Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

While grunt can run the included unit tests via PhantomJS, this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers.

### Installing grunt
_This assumes you have [node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed already._

1. Test that grunt is installed globally by running `grunt --version` at the command-line.
1. If grunt isn't installed globally, run `npm install -g grunt` to install the latest version. _You may need to run `sudo npm install -g grunt`._
1. From the root directory of this project, run `npm install` to install the project's dependencies.

### Installing PhantomJS

In order for the qunit task to work properly, [PhantomJS](http://www.phantomjs.org/) must be installed and in the system PATH (if you can run "phantomjs" at the command line, this task should work).

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt, so you need to install it yourself. There are a number of ways to install PhantomJS.

* [PhantomJS and Mac OS X](http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html)
* [PhantomJS Installation](http://code.google.com/p/phantomjs/wiki/Installation) (PhantomJS wiki)

Note that the `phantomjs` executable needs to be in the system `PATH` for grunt to see it.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)
