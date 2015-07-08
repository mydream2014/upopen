
var http = require( 'http' ),
	util = require( 'util' ),
	db   = require( '../db/sql' ),
	tool = require( '../controls/tool' );

/***********************************************
issue
P - addtalk:      添加talk
G - fetchtalk:    获取talk
************************************************/

var hostsDay = {};

function updateHostsDay(){
    var date = tool.getTime( { type: 'millis' } );
    for( var ip in hostsDay ){
        if( date - hostsDay[ ip ].time > 600000 ){
            delete hostsDay[ip]
        }
    }
}

setInterval( updateHostsDay, 1000 );

function addTalk( req, res ){

    var ip = tool.getClientIp( req );
	if( hostsDay[ ip ] && hostsDay[ip].count > 10 ){
		res.send( { code: 1002 , msg: 'talk too often', data: null } );
		return;
	} else {
		if( hostsDay[ ip ] ){
            hostsDay[ ip ].count ++
        } else {
            hostsDay[ ip ] = {};
            hostsDay[ ip ].time = tool.getTime( { type: 'millis' } );
            hostsDay[ ip ].count = 1;
        }
	}
	
	var data = req.body;
    
    if( data.content.length > 200 ){
        res.send( { code: 1001, msg: 'talk content to length', data: null } );
        return;
    }

	data.hot = 0;
	data.date = new Date();
	data.sort = 1;
	data.title = '11';
   	
	db.addTalk( req.body, function( err, docs ){
		if( !err ){
			res.send( { code: 0, msg: 'add talk success', data: docs } );
		}
	} );

}

function fetchTalk( req, res ){

	db.FetchTalk( req.body, function( err, docs ){
		if( !err ){
			res.send( { code: 0, msg: 'find talk success', data: docs } );
		}
	} );

}

module.exports = {
	addTalk:   addTalk,
	fetchTalk: fetchTalk
}
