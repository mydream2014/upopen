
var http = require( 'http' ),
	util = require( 'util' ),
	qs   = require( 'querystring' ),
	loan = require( '../controls/loan' );

/***********************************************
loan

G - loanList:           贷款列表页面
P - fetchLoanList:      获取贷款列表接口
G - loanApply:          贷款申请页面
P - LoanApply:          贷款申请接口
G - loanApplySuccess:   贷款申请成功页面
G - loanApplyFailed:    贷款申请失败页面
G - loanApplyStatus:    贷款状态页面
P - fetchLoanApplyInfo: 单条贷款详情

************************************************/

function loanList( req, res ){
	
	res.render( 'loan/list.ejs', global.webConfig.resSetting( req ) );

}

function fetchLoanList( req, res ){
	
	loan.fetchLoanList( req, res );

}

function loanApply( req, res ){
	
	res.render( 'loan/apply.ejs', global.webConfig.resSetting( req ) );
	
}

function LoanApply( req, res ){
	
	loan.LoanApply( req, res );

}

function loanApplySuccess( req, res ){

	console.log( req.path );
	
	res.render( 'loan/success.ejs', global.webConfig.resSetting( req ) );
	
}

function loanApplyFailed( req, res ){
	
	res.render( 'loan/failed.ejs', global.webConfig.resSetting( req ) );
	
}

function loanApplyStatus( req, res ){
	
	res.render( 'loan/status.ejs', global.webConfig.resSetting( req ) );
}

function fetchLoanApplyInfo( req, res ){
	
	loan.fetchLoanApplyInfo( req, res );

}

function LoanApplyExpress( req, res ){
	
	loan.LoanApplyExpress( req, res );

}

module.exports = {
	loanList:           loanList,
	fetchLoanList:      fetchLoanList,
	loanApply:          loanApply,
	LoanApply:          LoanApply,
	loanApplySuccess:   loanApplySuccess,
	loanApplyFailed:    loanApplyFailed,
	loanApplyStatus:    loanApplyStatus,
	fetchLoanApplyInfo: fetchLoanApplyInfo,
	LoanApplyExpress:   LoanApplyExpress
};