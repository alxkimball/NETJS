/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
		options: {
			// define a string to put between each file in the concatenated output
			separator: '\n',
            stripBanners: true,
            banner: '/**' + grunt.util.linefeed
                + ' * <%= pkg.name %> <%= pkg.description %> v<%= pkg.version %>'
                + grunt.util.linefeed
                + ' * Copyright (c) <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>'
                + grunt.util.linefeed
                + ' * Licensed: <%= _.pluck(pkg.licenses, "type").join(", ") %>'
                + grunt.util.linefeed
                + ' * Date: <%= grunt.template.today("yyyy-mm-dd") %>'
                + grunt.util.linefeed
                + ' */'
                + grunt.util.linefeed
		},
        core: {
           src: ['src/netjs/PreReqs.js',
                 'src/netjs/NetJs.js',
                 'src/netjs/util/Util.js',
                 'src/netjs/util/Enumeration.js',
				 'src/netjs/Interface.js',
				 'src/netjs/IComparable.js',
				 'src/netjs/IDisposable.js',
				 'src/netjs/Abstract.js',
                 'src/netjs/Class.js',
                 'src/netjs/Enumeration.js',
                 'src/netjs/Exception.js',
                 'src/netjs/ApplicationException.js',
                 'src/netjs/SystemException.js',
                 'src/netjs/NotImplementedException.js',
                 'src/netjs/InvalidOperationException.js',
                 'src/netjs/util/IEventObserver.js',
                 'src/netjs/util/Observer.js',				 
                 'src/netjs/util/Bus.js'
                 ],
           dest: 'dist/netjs.js'
        },
        collections: {
          src:['src/netjs/collections/Collections.js',
				'src/netjs/collections/IComparer.js',
				'src/netjs/collections/IEqualityComparer.js',
				'src/netjs/collections/IEnumerator.js',
				'src/netjs/collections/IEnumerable.js',
				'src/netjs/collections/ICollection.js',
				'src/netjs/collections/IList.js',
				'src/netjs/collections/IDictionary.js',
				'src/netjs/collections/IDictionaryEnumerator.js',
				'src/netjs/collections/ArrayEnumerator.js',
				'src/netjs/collections/Comparer.js',
				'src/netjs/collections/EqualityComparer.js',
                'src/netjs/collections/CollectionBase.js',
                'src/netjs/collections/ArrayList.js',
				'src/netjs/collections/Hashtable.js',
				'src/netjs/collections/DictionaryEntry.js',
				'src/netjs/collections/DictionaryBase.js'
				],
          dest: 'dist/netjs.collections.js'
      },
	  collections_ext: {
	    src:['src/netjs/collections/ext/Ext.js',
		     'src/netjs/collections/ext/IEnumerable.js',
			 'src/netjs/linq/Linq.js',
		     'src/netjs/linq/IGrouping.js',
			 'src/netjs/linq/ILookup.js',
			 'src/netjs/linq/IOrderedEnumerable.js',
			 'src/netjs/linq/Enumerable.js',
			 'src/netjs/collections/ext/ArrayList.js'
		],
		dest: 'dist/netjs.collections.ext.js'
	  },
	  full: {
	    src:['dist/netjs.js',
		     'dist/netjs.collections.js',
			 'dist/netjs.collections.ext.js'
		],
		dest: 'dist/netjs.full.js'
	  }
    },
    qunit: {
      files: ['test/**/*.html']
      //files: ['test/html/NetJS.Util.html']
    },
    uglify: {
		options: {},
		dist: {
			files: {
				'dist/netjs.min.js': ['dist/netjs.js'],
				'dist/netjs.collections.min.js': ['dist/netjs.collections.js'],
				'dist/netjs.collections.ext.min.js': ['dist/netjs.collections.ext.js'],
				'dist/netjs.full.min.js': ['dist/netjs.full.js']
			}
		}
	}
  });
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task.
  grunt.registerTask('default', ['concat', 'qunit', 'uglify']);
};
