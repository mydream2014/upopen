
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
		doc: 'public/zhdoc'
	}
})

require( ['base', 'dialog', 'doc', 'validate', 'all'],function( base, Dialog, DOC, validate, All ){

    /******************************************
	定义变量
	********************************************/
	var dialog = new Dialog.Dialog();
	var password                    = $( '#password' ),
		confirmPassword             = $( '#confirmPassword' ),
		findPwd_password_level      = $( '#findPwd_password_level' ),
		findPwd_password_level_text = $( '#findPwd_password_text' ),
		passwordlevelText           = { 'weak': '弱', 'well': '中', 'better': '强' };
	
	/******************************************
	密码级别
	********************************************/
	function getPasswordLevel( v ){
		var n = 0;
		if( /[a-z]/.test( v ) ){
			n += 1;
		}
		if( /[0-9]/.test( v ) ){
			n += 1;
		}
		if( /[A-Z]/.test( v ) ){
			n += 1;
		}
		if( /[\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\?|\<|\>|\,|\.|\-|\'|\"]/.test( v ) ){
			n += 1;
		}
		return [ '', 'weak', 'well', 'better', 'better' ]
	}
	
	/******************************************
	验证规则
	********************************************/
	var passwordRule = [
			{ 
				'noBlank': '请输入密码',
				'min'    : [6, '不能少于6位'], 
				'max'    : [16, '不能多于16位'] 
			}, function( prompt){
				$( '.findPwd_prompt_password' ).html( prompt );
			}	
		],
		confirmPasswordRule = [
			{ 
				'noBlank': '请再次输入密码',
				'self'   : function( cb ){
					return ( this.value.trim() !==  password.val() ) ? cb( '两次输入密码不一致' ) : true ;
				}
			}, function( prompt){
				$( '.findPwd_prompt_confirmPassword' ).html( prompt );
			} 
		];
	
	validate( password, [ 'change' ], passwordRule );

	validate( confirmPassword, [ 'change' ], confirmPasswordRule );

	password.on( 'keyup', function(){
		var level = All.getPasswordLevel( this.value );
		if( this.value.length < 6 ){
			findPwd_password_level.removeClass( 'password_level_weak password_level_well password_level_better' ).css( 'visibility', 'hidden' );
			return;
		}
		$( '.findPwd_prompt_password' ).html( '' );
		findPwd_password_level.removeClass( 'password_level_weak password_level_well password_level_better' ).addClass( 'password_level_' + level ).css( 'visibility', 'visible' );
		findPwd_password_level_text.html( '密码强度：' + passwordlevelText[ level ] );
	});

	function validateAll(){
		
		return validate( password, passwordRule ) 		
		&& validate( confirmPassword, confirmPasswordRule );

	}

	/******************************************
	验证手机验证码
	********************************************/
	$( '#resetPwd' ).on( 'submit', function(){

		if( validateAll() !== true ){
			return false;
		}
		
		var data = {
			password: password.val()
		}
				
		$.ajax({
			url: basePath + '/user/resetPwd',
			type: 'post',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if( ret.code == 0 ){
					window.location.href = window.location.protocol + '//' + window.location.host + '/user/resetPwdSuccess';
					return;
				}

				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
				
			}
		});

		return false;

	});

});

