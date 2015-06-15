
var db   = require( '../db/sql' ),
	tool = require( '../controls/tool' );

function addServiceTest( data, res ){

	data.date = tool.getTime();
	
	db.addServiceTest( data, function( ret ){
		
		if( ret == null ){
			res.send( { code: 0, msg: 'add success' } );
		} else {	
			res.send( { code: 1001, msg: ret } );
		}

	});
};

function updateServiceTest( data, res ){
	
	data.date = tool.getTime();

	db.updateServiceTest( data.id, data,  function( ret ){
		
		if( ret == null ){
			res.send( { code: 0, msg: 'update success' } );
		} else {
			res.send( { code: 1001, msg: ret } );
		}

	});
};

function findServiceTest( data, res ){

	db.findServiceTest( data, function( ret, docs ){
		
		if( ret == null ){
			res.send( { code: 0, msg: 'find success', data: docs } );
		} else {
			res.send( { code: 1001, msg: ret } );
		}
		
		
	});
}

function delServiceTest( data, res ){

	db.delServiceTest( data, function( ret, docs ){

		res.send( {code: 0, msg: 'delete success', data: docs });
		
	});

}

function outTest( req, res ){
	
	console.log( req.path );
	console.log( req.body );
	var config = {
			path: '/clms/front/loan/list',
			method: req.method
		},
		callback = function( ret ){
		
			res.send( JSON.parse( ret ) );

		};
	
	tool.reqConfig( config, req, res, callback );

}


module.exports = {
	addServiceTest:    addServiceTest,
	findServiceTest:   findServiceTest,
	updateServiceTest: updateServiceTest,
	delServiceTest:   delServiceTest,
	outTest: outTest
}