
var http = require( 'http' ),
	util = require( 'util' ),
	qs   = require( 'querystring' ),
	user = require( '../controls/user' );

/***********************************************
user

G - info:               企业信息
P - fetchUserParters:   获取合作厂家
G - loanApply:          贷款申请页面
P - LoanApply:          贷款申请接口
G - loanApplySuccess:   贷款申请成功页面
G - loanApplyFailed:    贷款申请失败页面
G - loanApplyStatus:    贷款状态页面
P - fetchLoanApplyInfo: 单条贷款详情

************************************************/

function info( req, res ){
	
	res.render( 'user/info.ejs', global.webConfig.resSetting( req ) );
	
}

function partners( req, res ){
	
	res.render( 'user/partners.ejs', global.webConfig.resSetting( req ) );
	
}

function findPwd( req, res ){
	
	res.render( 'user/findPwd.ejs', global.webConfig.resSetting( req ) );
	
}

function resetPwdE( req, res ){
	
	res.render( 'user/resetPwd.ejs', global.webConfig.resSetting( req ) );
	
}

function resetPwdSuccess( req, res ){
	
	res.render( 'user/resetPwdSuccess.ejs', global.webConfig.resSetting( req ) );
	
}

function join( req, res ){
	
	res.render( 'user/join.ejs', global.webConfig.resSetting( req ) );
	
}

function joinSuccess( req, res ){
	
	res.render( 'user/joinSuccess.ejs', global.webConfig.resSetting( req ) );
	
}

function fetchUserParters( req, res ){
	
	user.fetchUserParters( req, res );

}

function register( req, res ){
	
	user.register( req, res );

}

function login( req, res ){

	user.login( req, res );

}

function logout( req, res ){
	
	user.logout( req, res );

}

function fetchSmsCode( req, res ){

	user.fetchSmsCode( req, res );

}

function checkSmsCode( req, res ){

	user.checkSmsCode( req, res );

}

function resetPwd( req, res ){

	user.resetPwd( req, res );

}

function apply( req, res ){

	user.apply( req, res );

}

function fetchInfo( req, res ){

	user.fetchInfo( req, res );

}

function fetchPartners( req, res ){

	user.fetchPartners( req, res );

}

function addPartners( req, res ){

	user.addPartners( req, res );

}

function uploadFile( req, res ){

	user.uploadFile( req, res );

}

function partnerFile( req, res ){

	user.partnerFile( req, res );

}

function getVerifyCode( req, res ){

	user.getVerifyCode( req, res );

}

module.exports = {
	info:               info,
	partners:           partners,
	fetchUserParters:   fetchUserParters,
	findPwd:            findPwd,
	resetPwdE:          resetPwdE,
	resetPwdSuccess:    resetPwdSuccess,
	join:               join,
	joinSuccess:        joinSuccess,
	register:           register,
	login:              login,
	logout:             logout,
	fetchSmsCode:       fetchSmsCode,
	checkSmsCode:       checkSmsCode,
	resetPwd:           resetPwd,
	apply:              apply,
	fetchInfo:          fetchInfo,
	fetchPartners:      fetchPartners,
	addPartners:        addPartners,
	uploadFile:         uploadFile,
	partnerFile:        partnerFile,
	getVerifyCode:      getVerifyCode
};