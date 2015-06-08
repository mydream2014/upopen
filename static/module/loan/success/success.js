
require.config({
	map: {
		'*': {
			'css': './core/css.min'
		}
	},
	baseUrl: window.basePath || './',
	paths: {
		base: 'core/base',
		all: 'public/all'
	}
})

define( [ 'base', 'all' ],function( base ){
    
	$( '#toLoanApplyStatus' ).attr( 'href', '/loan/status' + window.location.search )

});

