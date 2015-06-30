
/*


*/
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
		validate: 'public/validate',
		doc: 'public/zhdoc'
	}
})

define( ['base', 'dialog', 'doc', 'validate'],function( base, Dialog, DOC, validate ){
	
	
	$.ajaxSetup( { cache: false } );

	try{
		var path = {
			'/index': '2',
			'/article/info': '1',
			'/article/list': '1',
			'/article/edit': '3'
		}[$( 'body' ).attr( 'page' ).replace( /(\/[a-z]+)$/,'')]
	
		//navigator current status
		$( $( '.nav a' )[ path ] ).addClass( 'current' );
	} catch(e){}
});
