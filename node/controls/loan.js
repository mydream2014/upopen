
var http = require( 'http' ),
	util = require( 'util' ),
	tool = require( '../controls/tool' );

/***********************************************
loan

G - fetchLoanList:      获取贷款列表接口
P - LoanApply:          贷款申请接口
G - fetchLoanApplyInfo: 单条贷款详情
P - LoanApplyExpress    提交快递单号

************************************************/

function fetchLoanList( req, res ){
	
	var config = {
			path: '/clms/front/loan/list',
			method: 'get'
		},
		callback = function( ret ){
		
			res.send( JSON.parse( ret ) );

		};

	tool.reqConfig( config, req, res, callback );

}

function LoanApply( req, res ){

	var config = {
			path: '/clms/front/loan/apply'
		},
		callback = function( ret ){
			
			res.send( JSON.parse( ret ) );

		};

	tool.reqConfig( config, req, res, callback );

}

function fetchLoanApplyInfo( req, res, callback ){

	var config = {
			path: '/clms/front/loan/info',
			method: 'get'
		},
		callback = function( ret ){
			
			res.send( JSON.parse( ret ) );

		};

	tool.reqConfig( config, req, res, callback );

}

function LoanApplyExpress( req, res, callback ){

	var config = {
			path: '/clms/front/loan/express'
		},
		callback = function( ret ){
			
			res.send( JSON.parse( ret ) );

		};

	tool.reqConfig( config, req, res, callback );

}


module.exports = {

	fetchLoanList:      fetchLoanList,
	LoanApply:          LoanApply,
	fetchLoanApplyInfo: fetchLoanApplyInfo,
	LoanApplyExpress:   LoanApplyExpress

}