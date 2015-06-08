
/*


*/
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
		doc: 'public/zhdoc'
	}
})

define( ['base', 'dialog', 'doc', 'validate'],function( base, Dialog, DOC, validate ){

	var dialog = new Dialog.Dialog();
	
	$.ajaxSetup( { cache: false } );

	//$( 'input, textarea' ).placeholder();

	/**********************************************
	用户登录前后，顶部导航条 及 登录框状态
	**********************************************/
	!function(){

		var name  = window.corpName = $.cookies.get( 'corpname' ) || '',
			phone = window.userName = $.cookies.get( 'username' ) || '',
			sso_cookie = $.cookies.get( 'sso_cookie' );
		if( sso_cookie == 'undefined' ){
			$.cookies.set( 'sso_cookie', '' );
			sso_cookie = null;
		}
		window.userId = $.cookies.get( 'userId' ) || '';

		$(' #uname' ).val( name );
		if( sso_cookie ){
			$( '.afterLogin' ).show();
			$( '.touser' ).html( phone );
			$( '.showcorpname' ).html( name );
		} else {
			$( '.beforeLogin' ).show();
			if( $( 'body' ).attr( 'page' ) == '/index/index' ){
				$( '.toLogin' ).attr( 'href', 'javascript:void(0)' );
				$( '.toLogin' ).on( 'click', function(){
					$('#phone')[0].focus();
				})
			}
		}
		
		//mininav dropdown list
		$( '.toUserList' ).on( 'mouseover', function(){
			$( '.toUserList dd' ).show();
		}).on( 'mouseout', function(){
			$( '.toUserList dd' ).hide();
		});
		
		try{
			var path = {
				'/index': '0',
				'/issue/product': '1',
				'/issue/wiki': '2',
				'/issue/introduction': '3',
				'/issue/news': '3',
				'/issue/aboutus': '3',
				'/issue/legal': '2',
				'/issue/protocol': '2',
				'/user/findPwd': '0',
				'/user/resetPwd': '0',
				'/user/resetPwdSuccess': '0',
				'/user/info': '4',
				'/user/join': '4',
				'/user/partners': '4',
				'/loan/list': '4',
				'/loan/apply': '4',
				'/loan/success': '4',
				'/loan/failed': '4',
				'/loan/status': '4'
			}[$( 'body' ).attr( 'page' ).replace( /(\/[a-z]+)$/,'')]
		
			//navigator current status
			$( $( '.nav li' )[ path ] ).addClass( 'current' );
		} catch(e){}
		

	}();


	/***************************************************************
	register
	***************************************************************/
	//registerBox show
	$( '.toReg' ).on( 'click', function(){
		registerBox.fadeIn();
		regixterMask.fadeIn();
	});
	
	//registerBox hide
	$( '.register_close' ).on( 'click', function(){
		registerBox.fadeOut();
		regixterMask.fadeOut();
	})
	
	var registerBox                  = $( '#register' ),
		regixterMask                 = $( '.register_mask' ),
		r_phone                      = $( '#r_phone' ),
		r_smsCode                    = $( '#r_smsCode' ),
		r_password                   = $( '#r_password' ),
		r_confirmPassword            = $( '#r_confirmPassword' ),
		r_submit                     = $( '#r_submit' ),
		r_agree                      = $( '#r_agree' ),
		register_password_level      = $( '#register_password_level' ),
		register_password_level_text = $( '#register_password_level_text'),
		passwordlevelText            = { 'weak': '弱', 'well': '中', 'better': '强' },
		btnSmsCode                   = $( '#btnSmsCode' );
	
	//agree is or not
	r_agree.on( 'change', function(){
		r_submit.attr( 'disabled', !this.checked ).removeClass( 'btnDisabled' ).addClass( !!this.checked ? '' : 'btnDisabled' );
	});

	var RPhoneRule = [
			{ 
				'noBlank': '请输入手机号码', 
				'typePhone': '手机格式不正确'
			}, function( prompt){
				$( '.register_prompt_phone' ).html( prompt );
			}	
		],
		RSmsCodeRule = [
			{ 
				'noBlank': '请输入手机验证码', 
				'typeNum': '请输入数字', 
				'min': [6, '不能少于6位'], 
				'max': [6, '不能多于6位'] 
			}, function( prompt){
				$( '.register_prompt_smsCode' ).html( prompt );
			} 
		],
		RPasswordRule = [
			{ 
				'noBlank': '请输入密码',
				'min': [6, '密码不能少于6位'], 
				'max': [16, '密码不能多于16位']
			}, function( prompt){
				$( '.register_prompt_password' ).html( prompt );
			} 	
		],
		RConfirmPasswordRule = [
			{ 
				'self': function( cb ){
					return ( this.value.trim() !==  r_password.val() ) ? cb( '两次输入密码不一致' ) : true ;
				}
			}, function( prompt){
				$( '.register_prompt_confirmPassword' ).html( prompt );
			} 
		];

	validate( r_phone, [ 'change' ], RPhoneRule );

	validate( r_smsCode, [ 'change' ], RSmsCodeRule );

	validate( r_password, [ 'change' ], RPasswordRule );

	validate( r_confirmPassword, [ 'change' ], RConfirmPasswordRule);

	r_password.on( 'keyup', function(){
		if( this.value.length < 6 ){
			register_password_level.removeClass( 'password_level_weak password_level_well password_level_better' ).css( 'visibility', 'hidden' );
			return;
		}
		var level = getPasswordLevel( this.value );
		$( '.register_prompt_password' ).html( '' );
		register_password_level.removeClass( 'password_level_weak password_level_well password_level_better' ).addClass( 'password_level_' + level ).css( 'visibility', 'visible' );
		register_password_level_text.html( '密码强度：' + passwordlevelText[ level ] );
	});

	function validateAll(){
		
		return validate( r_phone, RPhoneRule ) 		
		&& validate( r_smsCode, RSmsCodeRule )
		&& validate( r_password, RPasswordRule)
		&& validate( r_confirmPassword, RConfirmPasswordRule );

	}

	//获取验证码
	
	btnSmsCode.on( 'click', function(){
		fetchsmsCode();
	});

	var n = 60;
	function countdown(){
		
		if( n-- ){
			btnSmsCode.html( n + '秒后重新获取' ).attr( 'disabled', true );
			setTimeout( countdown, 1000 )
		} else {
			n = 60;
			btnSmsCode.html( '点击获取验证码' ).attr( 'disabled', false );
		}

	}

	function fetchsmsCode(){

		if( validate( r_phone, RPhoneRule ) !== true ){
			return false;
		}

		var data = {
				phone: r_phone.val(),
				source: 'register'
			};
		
		$.ajax({
			url: '/user/fetchSmsCode',
			type: 'get',
			dataType: 'json',
			data: data,
			success: function( ret ){
				if( ret.code == 0 ){
					countdown()
					return;
				}
				dialog.show( DOC.errorCode[ ret.code ] || '未知错误[' + ret.code + ']' );
			}
		});

	}
	
	//注册
	$( '#register' ).on( 'submit', function(){

		if( validateAll() !== true ){
			return false;
		};

		var data = {
			phone:    r_phone.val(),
			password: r_password.val(),
			smsCode:  r_smsCode.val()
		};
	
		$.ajax({
			url: basePath + '/user/register',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function( ret ){
				if( ret.code == 0 ){
					window.location.href = window.location.protocol + '//' + window.location.host + '/user/info';
					return;
				}
				dialog.show( DOC.errorCode[ ret.code ] || '未知错误[' + ret.code + ']' );
			}
		});

		return false;
	
	});

	/***/
	
	var password_level = $( '.password_level' );

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
		return [ '', 'weak', 'well', 'better', 'better' ][ n ];
	}

	function footerFixed(){
		if( $( 'body').height() + 100 >= $(window).height() ){
			$( '.footer' ).css( 'position', 'relative' );
		}
	}

	//footerFixed()

	//setTimeout( footerFixed, 100 );

	return {
		getPasswordLevel: getPasswordLevel
	}

});