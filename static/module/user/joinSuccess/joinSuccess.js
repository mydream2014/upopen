
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

require( ['base', 'dialog', 'doc', 'all'],function( base, Dialog, DOC ){
    
	var loanList_items = $( '#loanList_items' ),
		loanList_nothing = $( '#loanList_nothing' ),
		tmp = ['<div>',
				'<span class="loanList_index">{index}</span>',
				'<span class="loanList_no">{applyCode}</span>',
				'<span class="loanList_project">{projectName}</span>',
				'<span class="loanList_status">{status}</span>',
				'<span class="loanList_parter">{partner}</span>',
				'<span class="loanList_model">{category}</span>',
				'<span class="loanList_contractAmount">贷款金额：{loanAmount}万</span>',
				'<a class="btn_yellow loanList_info" href="/loan/loanApplyStatus?id={id}">查看进度详情</a>',
			   '</div>'].join('');

	var data = [
		{
			provinceCode: 33,
			cityCode: 3301,
			projectName: '明月江南',
			propertyDeveloper: '绿城建设',
			contractAmount: '1000',
			loanAmount:'100',
			loanLimit: 4,
			loanNo: '2015051501',
			model: '电梯',
			partner: '日立电梯'
		}
	]; 

	$( '#userName' ).html( corpName );

	//var data = [];

	//获取贷款申请列表
	function fetchLoanApplyItems(){
		
		var data = {
			phone: userPhone
		}
				
		$.ajax({
			url: basePath + '/loan/fetchLoanList',
			type: 'post',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if( ret.code == 0 ){
					if( ret.data.length ){
						renderItems( ret.data );
					} else {
						loanList_nothing.show();
						if( corpName == userPhone ){
							$( '.toLoanApply' ).attr( 'href', '/front/member/apply.htm' );
						}
					}
					return;
				}

				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
				
			}
		});

	}
	
	//渲染列表
	function renderItems( data ){
		
		var els = [];
		$.each( data, function( k, item ){
			item.category = DOC.parterModelNum[item.category];
			item.status = [ '资料寄送中','审核中','合同签约中','审核失败','贷款取消','贷款成功' ][ item.status ];
			els.push( renderItem( k, item ) );
		});

		loanList_items.show().append( els );

	}
	
	//渲染单条数据
	function renderItem( k, item ){

		item.index = k + 1;
		var el = $( '<div>' ).addClass( 'loanList_item clearfix' ),
			html = tmp.replace( /\{(.*?)\}/g, function( $1, $2 ){
				return item[ $2 ];
			});
		
		return el.append( html );

	}

	//入口
	!function(){

		fetchLoanApplyItems();

	}();

	

});

