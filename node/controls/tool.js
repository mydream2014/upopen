
var crypto       = require( 'crypto' ),
	md5          = crypto.createHash( 'md5' ),
	fs           = require( 'fs' ),
	//nodemailer = require( 'nodemailer' ),
	//memcache   = require( 'memcache' ),
	log4js       = require( 'log4js' ),
	qs           = require( 'querystring'),
	http         = require( 'http' ),
	config       = require( './config' ),
	domain       = require('domain'),
	BufferHelper = require( 'BufferHelper' );

var Domain = domain.create();

Domain.on( 'error', function( e ){
	logInfo.info( '[tool] http async request error =======================' );
	logInfo.info( e );
});

/******************************* log4js ***************************************/
log4js.configure('controls/log4js.json');
var logInfo = log4js.getLogger('logInfo');

/******************************* getTime *************************************/
function getTime( config ){
	
	config = config || {};
	var date = new Date,
		y = pad( date.getFullYear(), 4 ),
		m = pad( date.getMonth() + 1, 2 ),
		d = pad( date.getDate(), 2 ),
		h = pad( date.getHours(), 2 ),
		mi = pad( date.getMinutes(), 2 ),
		s = pad( date.getSeconds(), 2 );
	if( config.type == 'day' ){
		return [y, m, d].join( config.join || '-' );
	} else if( config.type == 'millis' ){
		return date.getTime();
	}
	return [y, m, d].join( config.join || '-' ) + ' ' + [ h, mi, s].join( config.joinH || ':' );

}

/******************************* pad *************************************/
function pad( str, len, pack ){

	return ( new Array( len - ( str + '' ).length + 1 ).join( pack || '0' ) ) + str;

}

/******************************* md5 *************************************/
var md5 = function(data) { 
	
    return crypto.createHash('md5').update(data).digest('hex').toLowerCase();  

}  

/******************************* emil ************************************
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'QQ',
    auth: {
        user: '2270112418@qq.com',
        pass: 'qqwe321'
    }
});*/

/*
var transporter = nodemailer.createTransport("SMTP",{
	host: "smtp.mxhichina.com", // 主机
	secureConnection: true, // 使用 SSL
	port: 25, // SMTP 端口
	auth: {
		user: "test1@hicloudcam.com", // 账号
		pass: "hik12345+" // 密码
	}
});
*/

function mail( config ){

	var mailOptions = {
		from:        'hr ezviz', // sender address
		to:          config.to || '417589068@qq.com', // list of receivers
		subject:     config.subject || '<h3>招聘邮件</h3>', // Subject line
		text:        config.subject || '<h3>招聘邮件</h3>', // plaintext body
		html:        config.html || '<h3>招聘邮件</h3>', // html body
		attachments: config.annex || []
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Message sent: ' + info.response);
		}
	});

}

//mail({ to: '2270112418@qq.com', subject: '开发测试', html: '招聘测试'});//'likaiyf1@hikvision.com'

/******************************* log ***************************************/
function log( data ){
	
	fs.open( 'log/log_' + getTime( {type: 'day'}) + '.txt', 'a', 0644, function( e, fd ){
		
		if( e ) throw e;
		fs.write( fd, getTime() + ' query[ ' + JSON.stringify( data, 8 ) + ' ]\r\n', 0, 'utf8', function( e ){
			if( e ) throw e;
			fs.closeSync( fd );
		});

	});
}

/******************************* getClientIp ***************************************/
function getClientIp( req ) {

	return req.headers['x-forwarded-for'] ||
	req.connection.remoteAddress ||
	req.socket.remoteAddress ||
	req.connection.socket.remoteAddress;

};

/******************************* escape ***************************************/
function escape( obj ){
	
	if( Object.prototype.toString.call( obj ) == '[object String]' ){
		return obj.replace( /\&/g,'&amp;').replace( /\</g,'&lt;').replace( /\>/g,'&gt;').replace( /\"/g,'&quot;').replace( /\'/g,'&lsquo;').replace( /\\/g,'\\\\');
	}

	var ret = {};
	for( var key in obj ){
		if( obj[ key ].replace ){
			if( key == 'type' ){
				console.log( obj[ key ] );
			}
			ret[ key ] = obj[ key ].replace( /\&/g,'&amp;').replace( /\</g,'&lt;').replace( /\>/g,'&gt;').replace( /\"/g,'&quot;').replace( /\\/g,'\\\\');
			console.log( ret[ key ] );
		} else {
			ret[ key ] = obj[ key ]
		}
	}
	return ret;

}

function emptyFun( str ){
	return str;
}

/******************************* memcache **************************************
var memcache = (function(){

	var port = 11211,
		host = '10.97.101.63';

	var client = new memcache.Client( port, host );

	client.on( 'connect', function(){
		logInfo.info( 'memcache connect')
		console.log( 'connect memcache ======================' );
	});

	client.connect();

	return client;

})();*/

/******************************* getCookie ***************************************/
function getCookie( cookie, name ){
	try{
		var cs = cookie.split(';'),
			c,
			item;
		while( c = cs.pop() ){
			item = c.split('=');
			if( item[0].trim() == name ){
			    return item[1];
			}
		}
	} catch( e ){
		logInfo.warn( 'getcookie error')
		return false;
	}
    
};


/******************************* reqConfig ***************************************/
function reqConfig( config, req, res, callback, flag ){
	
	req.headers.host = global.hostConfig.hostname;
	
	var method = config.method || 'POST';

	var	path   = config.path + ( ( method.toUpperCase() == 'GET' ) ? '?' + qs.stringify( req.query ) : '' );

	var options = {
			host     : global.hostConfig.host,
			//hostname : global.hostConfig.hostname,
			port     : global.hostConfig.port,
			path     : path,
			method   : method,
			headers  : req.headers
		},
		bufferData = new BufferHelper(),
		httpreq;

	Domain.run( function(){
	
		httpreq = http.request( options, function( httpres ) {
			var cookies = httpres.headers['set-cookie'];
			cookies && res.setHeader("Set-Cookie",cookies );
			if( flag ){
				httpres.pipe( res );
				return;
			}
			
			httpres.on( 'data', function ( data ) {
				bufferData.concat( data );
			} );

			httpres.on( 'end', function(){
				callback( bufferData );
			});

		} );
	
	} );
	
	httpreq.on('error', function(e) {

		console.log('problem with request: ' + e.message);
		logInfo.error( '[tool] request error ======================================= ' );
		logInfo.error( e.message );
		callback( '{"code": "-1", "msg": "server error"}' );

	});
	
	httpreq.write( qs.stringify( req.body ) );
	httpreq.end();

	logInfo.info( options );

}

module.exports = {
	getTime:     getTime,
	pad:         pad,
	md5:         md5,
	mail:        mail,
	log:         log,
	getClientIp: getClientIp,
	escape:      escape,
	emptyFun:    emptyFun,
	//memcache:    memcache,
	getCookie:   getCookie,
	logInfo:     logInfo,
	reqConfig:   reqConfig,
	redis:       redisConfig
}
