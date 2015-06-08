
var http = require( 'http' ),
	util = require( 'util' ),
	tool = require( '../controls/tool' ),
	fs   = require( 'fs' ),
	redis = require( './redis' ),
	qs         = require( 'querystring'),
	formidable = require( 'formidable' );

var uploadSource = {};

function upload( req, res, callback ){
	
	var form = new formidable.IncomingForm(),
		_end = false;
	
    form.parse( req, function( err, fields, files ) {
		
	   req.body.id = fields.id;

	   if( files.upload.size >= 5 * 1024 * 1024 ){
		   _end = true;
		  return res.send( { code: 100006016 , msg: '附件超出限定大小', data: null } );
	   } 
	   var s = files.upload.name.split('.'),
		   type = s[s.length -1];
	   if( ['jpg','jpeg','gif','bmp','png'].indexOf(s[s.length -1].toLowerCase()) < 0 ){
		   _end = true;
		  return res.send( { code: 100006015 , msg: '上传资料格式不正确', data: null } );
	   }
	   /*
	   var ip = tool.getClientIp( req );
		if( uploadSource[ ip ] ){
			res.send( { code: 100006014 , msg: '资料上传过于频繁，请一分钟后再试', data: null } );
			_end = true;
			return;
		}
		if( hostsDay[ ip ] && hostsDay[ip] > 20 ){
			res.send( {
				resultCode: 1105,
				msg: '今天可申请岗位已达上线'
			} );
			_end = true;
			return;
		} else {
			hostsDay[ ip ] ? hostsDay[ ip ]++ : hostsDay[ ip ] = 1;
		}
		hosts[ ip ] = tool.getTime( { type: 'millis' } );
		*/
	   req.body.authFile = files.upload.path;
	   
    });

	form.on('error', function( e ){
		console.log( e + '===============' );
	});
	form.encoding = 'utf-8';
	form.maxFieldsSize = 5 * 1024 * 1024;
	form.uploadDir = global.hostConfig.uploadDir;
	form.keepExtensions = true;
	form.on('progress', function(bytesReceived, bytesExpected) {
		console.log( bytesReceived + ':' + bytesExpected );
	});
	form.on('end', function( a, b, c ) {
		console.log( 'end' );
		if( _end ){
			return;
		}
		callback( req, res );
	});
    return;
}

function uploadFile( req, res ){

	upload( req, res , function(req, res){
		
		res.send( { code: 0, msg: '', data: { authFile: req.body.authFile } } );
		
	});
}

function partnerFile( req, res ){
	var config = {
			path: '/cif/front/partner/updAuthFile'
		},
		callback = function( ret ){
			var ret = JSON.parse( ret );
			console.log( ret );
			res.send( ret );
		};
	tool.reqConfig( config, req, res, callback );
}

/***********************************************

user

G - fetchUserParters:   获取合作厂家
P - register:           注册
P - login:              登录
G - logout:             退出
G - fetchPartners:      获取合作厂家
P - addPartners:        增加合作厂家
G - fetchSmsCode:       获取手机验证码
P - checkSmsCode:       验证手机验证码
P - resetPwd:           重置密码
P - apply:              申请会员
G - fetchInfo:          获取信息信息

************************************************/

function fetchPartners( req, res ){

	var config = {
			path: '/cif/front/partner/list',
			method: 'get'
		},
		callback = function( ret ){
			
			res.send( JSON.parse( ret ) );

		};

	tool.reqConfig( config, req, res, callback );

}

function addPartners( req, res ){

	var config = {
			path: '/cif/front/partner/add'
		},
		callback = function( ret ){

			res.send( JSON.parse( ret ) );

		};

	tool.reqConfig( config, req, res, callback );

}

function register( req, res ){
	
	var config = {
			path: '/cif/front/user/register',
		},
		callback = function( ret ){

			ret = JSON.parse( ret );
			if( ret.code == 0 ){
				res.setHeader( 'Set-Cookie', 'username=' + req.body.phone + ';path=/;' );
				res.setHeader( 'Set-Cookie', 'corpname=' + req.body.phone + ';path=/;' );
			}
			res.send( ret );

		};
	
	tool.reqConfig( config, req, res, callback );

}


function getVerifyCode( req, res ){

	var config = {
			path: '/cif/front/verify/getImgCode',
			method: 'get'
		},
		callback = function( ret ){
			
		};
	
	tool.reqConfig( config, req, res, callback, true );
}

redis.set( 'VerifyLoginTime', '{}');

function checkVerifyCode( req, res ){
	
	var config = {
			path: '/cif/front/verify/checkImgCode'
		},
		callback = function( ret ){
			ret = JSON.parse( ret );
			if( ret.code != '0' ){
				res.send( ret );
			} else {
				login( req, res, true );
			}

		};
	
	tool.reqConfig( config, req, res, callback);
	
}

function redisVerifyLoginTime( method, name, cb ){

	redis.get( 'VerifyLoginTime', function( reply ){
		if( method == 'get' ){
			
		} else if( method == 'set' ){
			if( reply[name] ){
				reply[name] += 1;
			} else {
				reply[name] = 1;
			}
		} else if( method == 'del' ){
			delete reply[name];
		}
		
		redis.set( 'VerifyLoginTime', JSON.stringify( reply ) );
		cb && cb( reply[name] );
	});

}

function login( req, res, flag ){
	if( !flag ){
		redisVerifyLoginTime( 'get', req.body.phone, function( value ){
			if( value > 2 ){
				if( !req.body.verifyCode ){
					res.send( { code: 1021 } );
					return;
				} else {
					checkVerifyCode( req, res );
					return;
				}
			}
			loginConfig( req, res );
		})
		
	} else {
		loginConfig( req, res );
	}
	

}

function loginConfig( req, res ){
	var config = {
			path: '/cif/front/user/login',
		},
		callback = function( ret, result, fields ){
			ret = JSON.parse( ret );
			if( ret.code == 0 ){
				res.setHeader( 'Set-Cookie', 'username=' + req.body.phone + ';path=/;' );
				res.setHeader( 'Set-Cookie', 'corpname=' + req.body.phone  + ';path=/;' );
				redisVerifyLoginTime( 'del', req.body.phone );
				res.send( ret );
			} else if( ret.code == '100000020' ){
				redisVerifyLoginTime( 'set', req.body.phone, function( value ){
					if( value > 2 ){
						ret.code = 1022;
					}
					res.send( ret );
				})
			}
		};
	
	tool.reqConfig( config, req, res, callback );
}

function logout( req, res ){
	
	var config = {
			path: '/cif/front/user/logout',
			method: 'get'
		},
		callback = function( ret ){
			
			ret = JSON.parse( ret );
			res.setHeader( 'Set-Cookie', 'sso_cookie=;path=/;' );
			res.redirect( '/' );

		};
	
	tool.reqConfig( config, req, res, callback );
	res.setHeader( 'Set-Cookie', 'sso_cookie=;path=/;' );

}

function fetchSmsCode( req, res ){

	var config = {
			path: '/cif/front/user/fetchSmsCode',
			method: 'get'
		},
		callback = function( ret ){

			res.send( JSON.parse( ret ) );

		};
	
	tool.reqConfig( config, req, res, callback );

}

function checkSmsCode( req, res ){

	var config = {
			path: '/cif/front/user/checkSmsCode',
			type: 'get'
		},
		callback = function( ret ){

			res.send( JSON.parse( ret ) );

		};
	
	tool.reqConfig( config, req, res, callback );

}

function resetPwd( req, res ){

	var config = {
			path:'/cif/front/user/resetPwd',
		},
		callback = function( ret ){

			res.send( JSON.parse( ret ) );

		};
	
	tool.reqConfig( config, req, res, callback );

}

function apply( req, res ){

	var config = {
			path:'/cif/front/member/apply',
		},
		callback = function( ret ){

			res.send( JSON.parse( ret ) );

		};
	
	tool.reqConfig( config, req, res, callback );

}

function fetchInfo( req, res ){

	var config = {
			path:'/cif/front/member/info',
			method: 'get'
		},
		callback = function( ret ){
			
			ret = JSON.parse( ret );
			res.send( ret );
			
		};
	
	tool.reqConfig( config, req, res, callback );

}

module.exports = {
	register:         register,
	login:            login,
	logout:           logout,
	fetchPartners:    fetchPartners,
	addPartners:      addPartners,
	fetchSmsCode:     fetchSmsCode,
	checkSmsCode:     checkSmsCode,
	resetPwd:         resetPwd,
	apply:            apply,
	fetchInfo:        fetchInfo,
	uploadFile:       uploadFile,
	partnerFile:      partnerFile,
	getVerifyCode:    getVerifyCode
}