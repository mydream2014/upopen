
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
		validate: 'public/validate',
		all: 'public/all',
		doc: 'public/zhdoc'
	}
})

require( ['base', 'dialog', 'doc', 'validate', 'all'],function( base, Dialog, DOC, validate ){ 
	
	/******************************************
	定义变量
	********************************************/
	var dialog = new Dialog.Dialog();
    
	var phone    = $( '#phone' ),
		smsCode  = $( '#smsCode' ),
		fetchSms = $( '#fetchSms' );
	
	/******************************************
	验证规则
	********************************************/
	var phoneRule = [
			{ 
				'noBlank'  : '请输入手机号',
				'typePhone': '手机格式不正确'
			}, function( prompt){
				$( '.findPwd_prompt_phone' ).html( prompt );
			}	
		],
		smsCodeRule = [
			{ 
				'noBlank': '请输入手机验证码', 
				'typeNum': '请输入数字', 
				'min'    : [6, '不能少于6位'], 
				'max'    : [6, '不能多于6位'] 
			}, function( prompt){
				$( '.findPwd_prompt_smsCode' ).html( prompt );
			} 
		];
	
	validate( phone,   [ 'change' ], phoneRule );

	validate( smsCode, [ 'change' ], smsCodeRule );

	function validateAll(){
		
		return validate( phone, phoneRule ) 		
		&& validate( smsCode, smsCodeRule );

	}

	/******************************************
	获取手机验证码
	********************************************/
	function fetchSmsCode(){

		if( validate( phone, phoneRule ) !== true ){
			return false;
		}
		
		var data = {
			phone: phone.val(),
			source: 'findPwd'
		}
				
		$.ajax({
			url: basePath + '/user/fetchSmsCode',
			type: 'get',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if( ret.code == 0 ){
					countdown( 60 )
					return;
				}

				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
				
			}
		});

	}

	fetchSms.on( 'click', function(){
	
		if( btnSmsCode.onLine ){
			return;
		} else {
			fetchSmsCode();
		}

	} );

	function countdown( n ){
		
		if( n ){
			fetchSms.html( n + '秒后重新获取' ).attr( 'disabled', true );
			setTimeout( countdown, 1000, --n )
		} else {
			fetchSms.html( '点击获取验证码' ).attr( 'disabled', false );
		}

	}

	/******************************************
	验证手机验证码
	********************************************/
	$( '#findPwd' ).on( 'submit', function(){

		if( validateAll() !== true ){
			return false;
		}
		
		var data = {
			phone: phone.val(),
			smsCode: smsCode.val()
		}
				
		$.ajax({
			url: basePath + '/user/checkSmsCode',
			type: 'post',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if( ret.code == 0 ){
					window.location.href = window.location.protocol + '//' + window.location.host + '/user/resetPwd';
					return;
				}

				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
				
			}
		});

		return false;

	});

});

