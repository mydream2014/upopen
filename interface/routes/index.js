var serviceTest = require( './serviceTest' ),
	tool        = require( '../controls/tool' );

exports.all = function( app ){

	app.use( function(req,res,next){
		next();
	})


	app.get( '/interface/index', function( req, res ){

        res.render( 'index.ejs' );

	});

	app.get( '/interface/addServiceTest', function( req, res ){
		serviceTest.addServiceTest( req.query, res );

	});

	app.get( '/interface/findServiceTest', function( req, res ){
		serviceTest.findServiceTest( req.query, res );

	});

	app.get( '/interface/updateServiceTest', function( req, res ){
		serviceTest.updateServiceTest( req.query, res );

	});

	app.get( '/interface/delServiceTest', function( req, res ){
		serviceTest.delServiceTest( req.query, res );

	});
		
};

