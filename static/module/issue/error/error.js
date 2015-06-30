
require.config({
	map: {
		'*': {
			'css': './core/css.min'
		}
	},
	baseUrl: basePath,
	paths: {
		base: 'core/base',
		dialog: 'widget/dialog/dialog',
		all: 'public/all',
		doc: 'public/zhdoc'
	}
})

define( ['base', 'all'],function( base  ){
    // Stuff to do as soon as the DOM is ready;

	
});

