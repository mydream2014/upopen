
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

require( ['base', 'all'],function( base, DOC ){
	
	/******************************************
	µ¹¼ÆÊ±Ìø×ª
	********************************************/
	var countdown = $( '#countdown' ),
		n = 3;
	countdown.html( n );

	setInterval( function(){

		if( n-- ){
			countdown.html( n );
		} else {
			window.location.href = window.location.protocol + '//' + window.location.host;
		}

	}, 1000 );

});

