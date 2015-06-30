
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
	
	/******************************************
	定义变量
	********************************************/
	var dialog = new Dialog.Dialog();
    
	var loanList_items   = $( '#loanList_items' ),
		loanGrid         = $( '#loanListGrid' ),
		loanList_nothing = $( '#loanList_nothing' ),
		tmp = ['<td class="loanList_first">',
			   '<tt class="loanList_code">{applyCode}</tt>',
			   '<span class="loanList_project">{projectName}</span>',
		       '</td>',
			   '<td>{partner}</td>',
			   '<td>{category}</td>',
			   '<td><tt class="loanGrid_num">{loanAmount}</tt>万元</td>',
			   '<td><a class="loanGrid_status loanGrid_status{status}" href="/loan/status?id={id}">{statusText}&nbsp;<tt>&gt;</tt></a></td>'].join( '' );

	$( '#userName' ).html( corpName );

	/******************************************
	获取贷款列表
	********************************************/
	function fetchLoanApplyItems(){
		
		var data = {}
				
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
						if( corpName == userName ){
							$( '.toLoanApply' ).attr( 'href', '/user/join' );
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
			item.statusText = [ '资料寄送中','审核中','合同签约中','审核失败','贷款取消','贷款成功' ][ item.status ];
			els.push( renderItem( k, item ) );
		});
		loanGrid.append( els );
		loanList_items.show();

	}
	
	//渲染单条数据
	function renderItem( k, item ){

		item.index = k + 1;
		var el = $( '<tr>' ),
			html = tmp.replace( /\{(.*?)\}/g, function( $1, $2 ){
				return item[ $2 ];
			});
		
		return el.append( html );

	}

	/******************************************
	入口
	********************************************/
	!function(){

		fetchLoanApplyItems();

	}();

	

});

