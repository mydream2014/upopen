
require.config({
	map: {
		'*': {
			'css': './core/css.min'
		}
	},
	baseUrl: basePath,
	paths: {
		base: 'core/base',
		all: 'public/all'
	}
})

define( [ 'base', 'all' ],function( base ){

});

