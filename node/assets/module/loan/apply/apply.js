
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
		area: 'widget/complexArea/complexArea',
		doc: 'public/zhdoc'
	}
})

define( ['base', 'dialog', 'doc', 'area','validate', 'all'],function( base, Dialog, DOC, area, validate ){
    
	/******************************************
	定义变量
	********************************************/
	var dialog = new Dialog.Dialog();

	var loadApplyForm     = $( '#loadApplyForm' ),
		provinceCode      = $( '#provinceCode' ),
		cityCode          = $( '#cityCode' ),
		projectName       = $( '#projectName' ),
		propertyDeveloper = $( '#propertyDeveloper' ),
		contractAmount    = $( '#contractAmount' ),
		loanAmount        = $( '#loanAmount' ),
		loanLimit         = $( '#loanLimit' ),
		partner           = $( '#partner' ),
		category          = {},
		partnerIds        = {};
	
	/******************************************
	验证规则
	********************************************/
	var projectNameRule = [
			{ 
				'noBlank': '请输入项目名称', 
				'min'    : [4, '不能少于4位'], 
				'max'    : [15, '不能多于15位'] 
			}, function( prompt){
				$( '.projectNamePrompt' ).html( prompt );
			}	
		],
		propertyDeveloperRule = [
			{ 
				'noBlank': '请输入开发商名称', 
				'typeZE' : '请输入中文或英文', 
				'min'    : [4, '不能少于4位'], 
				'max'    : [15, '不能多于15位'] 
			}, function( prompt){
				$( '.propertyDeveloperPrompt' ).html( prompt );
			} 
		],
		contractAmountRule = [
			{ 
				'noBlank': '请输入合同金额', 
				'typeNum': '请输入数字', 
				'min'    : [1, '不能少于1位'], 
				'max'    : [4, '不能多于4位'],
				'self': function( cb ){
					return ( this.value.trim() - 0 == 0 ) ? cb( '合同金额不能为0' )  : true ;
				}
			}, function( prompt){
				$( '.contractAmountPrompt' ).html( prompt );
			} 	
		],
		loanAmountRule = [
			{ 
				'noBlank': '请输入贷款金额', 
				'typeNum': '请输入数字', 
				'min'    : [1, '不能少于1位'], 
				'max'    : [4, '不能多于4位'],
				'self': function( cb ){
					if( this.value.trim() - 0 == 0 ){
						return cb( '贷款金额不能为0' );
					}
					return ( this.value.trim() - 0 > contractAmount.val() - 0 ) ? cb( '贷款不能超过合同金额' )  : true ;
				}
			}, function( prompt){
				$( '.loanAmountPrompt' ).html( prompt );
			} 
		];

	validate( projectName,       [ 'change' ], projectNameRule );

	validate( propertyDeveloper, [ 'change' ], propertyDeveloperRule );

	validate( contractAmount,    [ 'change' ], contractAmountRule );

	validate( loanAmount,        [ 'change' ], loanAmountRule);

	function validateAll(){
		
		return validate( projectName, projectNameRule ) 		
		&& validate( propertyDeveloper, propertyDeveloperRule )
		&& validate( contractAmount, contractAmountRule)
		&& validate( loanAmount, loanAmountRule );

	}

	/******************************************
	/获取合作厂家
	********************************************/
	function fetchParters(){
		
		var data = {};

		$.ajax({
			url: basePath + '/user/fetchPartners',
			type: 'get',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if( ret.code == 0 ){
					renderParter( ret.data );
					return;
				}
				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
				
			}
		});

	}

	/******************************************
	创建品类下拉框
	********************************************/
	function renderParter( items ){
		
		var i = 0,
			l = items.length,
			os = [];
		while( i < l ){
			category[i]    = items[ i ].categoryCode;
			partnerIds[i]  = items[ i ].factoryName;
			os.push( $( '<option>' ).attr( 'value', i ).html( items[ i++ ].factoryName ) );
		}
		partner.append( os );

	}

	/******************************************
	申请表单提交
	********************************************/
	loadApplyForm.on( 'submit', function(){
	
		if( validateAll() !== true ){
			return false;
		};

		var data = {
			provinceCode:      provinceCode.val() - 0,
			cityCode:          cityCode.val() - 0,
			projectName:       projectName.val(),
			propertyDeveloper: propertyDeveloper.val(),
			contractAmount:    contractAmount.val() - 0,
			loanAmount:        loanAmount.val() - 0,
			loanLimit:         loanLimit.val() - 0,
			category:          category[ partner.val() ],
			partner:           partnerIds[ partner.val() ],
			phone:             userName
		}

		$.ajax({
			url: '/loan/loanApply',
			type: 'post',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if( ret.code == 0 ){
					window.location.href="/loan/success?id=" + ret.data.id;
					return;
				} else if( DOC.blackList[ ret.code ] ) {
					window.location.href="/loan/failed";
					return;
				}

				dialog.show( DOC.errorCode[ ret.code ] || '未知错误[' + ret.code + ']', ret.code || 0 );
				
			}
		});

		return false;

	});

	/******************************************
	入口
	********************************************/
	!function(){

		//区域联动框
		area.initComplexArea( 'provinceCode', 'cityCode', 'strictCode', '33', '3301', '330106' );

		fetchParters( userName );

	}();

});

