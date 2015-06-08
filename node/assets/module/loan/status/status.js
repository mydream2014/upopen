
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
		validate: 'public/validate',
		doc: 'public/zhdoc',
		area: 'widget/complexArea/areaData'
	}
})

define( ['base', 'dialog', 'doc','validate','area', 'all', 'css!./public/userManager'],function( base, Dialog, DOC, validate, area ){
	
	/**************************************
	定义变量
	***************************************/
	var id = window.location.search.slice(1).split('=')[1];

	var dialog = new Dialog.Dialog();
	
	/**************************************
	获取贷款状态
	***************************************/
	function fetchLoanApplyInfo( id ){
		$.ajax({
			type: 'get',
			url: '/loan/info',
			dataType: 'json',
			data: {
				loanApplyId: id  //loanApplyId
			},
			success: function( ret ){

				if( ret.code == 0 ){
					
					var LASPT5 = $( '.LASPT5' ),
						status = ret.data.status.slice( 0, 1 ),
						loanStatusHis = ret.data.loanStatusHis;
					
					$( '.loanApplyStatusProject' ).html( ret.data.projectName );
					$( '#loanApplyStatusCompany' ).html( ret.data.propertyDeveloper );
					$( '#loanApplyStatusCity' ).html( area.area_array[ ret.data.provinceCode ] + area.sub_array[ ret.data.provinceCode ][ ret.data.cityCode ] )
					$( '.content' ).addClass( [ 'acceptApply','fileApply','verifyApply','verifyFailed','applyFailed','applySuccess' ][ status ] );
					expressName.val( ret.data.expressCorp );
					expressNo.val( ret.data.expressNum );
					if( status == 3 ){
						LASPT5[2].innerHTML = '审核未通过<br />';
					} else if ( status == 4 ){
						LASPT5[4].innerHTML = '未成功<br />';
					}
					return;
				}

				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
			}
		})
	}

	/**************************************
	快递单号提交
	***************************************/
	
	var expressName = $( '#expressName' ),
		expressNo   = $( '#expressNo' );

	var expressNameRule = [
			{ 
				'noBlank': '请输入快递公司名', 
				'typeZE': '请输入中文或英文', 
				'min': [2, '不能少于2位'], 
				'max': [6, '不能多于6位'] 
			}, function( prompt){
				$( '.expressPrompt' ).html( prompt );
			}	
		],
		expressNoRule = [
			{ 
				'typeEN': '请输入数字或英文字母', 
				'noBlank': '请输入快递单号', 
				'min': [8, '不能少于8位'], 
				'max': [15, '不能多于15位'] 
			}, function( prompt){
				$( '.expressPrompt' ).html( prompt );
			} 
		];
	
	validate( expressName, [ 'change' ], expressNameRule );

	validate( expressNo, [ 'change' ], expressNoRule );

	function validateAll(){
		
		return validate( expressName, expressNameRule ) 		
		&& validate( expressNo, expressNoRule );

	}

	$( '.expressMain' ).on( 'submit', function(){
		
		if( validateAll() !== true ){
			return false;
		};

		var data = {
			id: id,
			expressCorp: expressName.val(),
			expressNum: expressNo.val()
		};

		$.ajax({
			url: '/loan/LoanApplyExpress',
			type: 'post',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if( ret.code == 0 ){
					dialog.show( '保存成功', ret.code || 0 );
				} else {
					dialog.show( DOC.errorCode[ ret.code ] || '未知错误[' + ret.code + ']', ret.code || 0 );
				}
				
			}
		});

		return false;

	});

	/******************************************
	入口
	********************************************/
	!function(){

		fetchLoanApplyInfo( id );

	}();

});

