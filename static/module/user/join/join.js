
require.config({
	map: {
		'*': {
			'css': './core/css.min'
		}
	},
	baseUrl: basePath,
	paths: {
		base    : 'core/base',
		dialog  : 'widget/dialog/dialog',
		validate: 'public/validate',
		all     : 'public/all',
		area    : 'widget/complexArea/complexArea',
		doc     : 'public/zhdoc'
	}
})

require( ['base', 'dialog', 'doc', 'validate', 'area', 'all'],function( base, Dialog, DOC, validate, area ){
    
	/******************************************
	定义变量
	********************************************/
	var dialog = new Dialog.Dialog();

	var corpName     = $( '#corpName' ),
		registerYear = $( '#registerYear' ),
		size         = $( '#size' ),
		province     = $( '#province' ),
		city         = $( '#city' ),
		strict       = $( '#strict' ),
		address      = $( '#address' ),
		businessId   = $( '#businessId' ),
		legalPerson  = $( '#legalPerson' ),
		idCard       = $( '#idCard' ),
		contact      = $( '#contact' ),
		mobile       = $( '#mobile' ),
		email        = $( '#email' );
	
	/******************************************
	创建验证规则
	********************************************/
	var corpNameRule = [
			{ 
				'noBlank': '请输入公司名称',
				'typeZEI' : '只允许输入中英文',
				'min'    : [8, '不能少于8位'], 
				'max'    : [25, '不能多于25位'] 
			}, function( prompt){
				$( '.join_prompt_corpName' ).html( prompt );
			}	
		],
		addressRule = [
			{ 
				'noBlank': '请输入公司地址',
				'min'    : [1, '不能少于1位'], 
				'max'    : [30, '不能多于30位'] 
			}, function( prompt){
				$( '.join_prompt_address' ).html( prompt );
			}	
		],
		businessIdRule = [
			{ 
				'noBlank': '请输入工作注册号', 
				'typeNum': '请输入数字', 
				'min'    : [13, '不能少于13位'], 
				'max'    : [13, '不能多于13位'] 
			}, function( prompt){
				$( '.join_prompt_businessId' ).html( prompt );
			} 
		],
		partnerRule = [
			{ 
				'noBlank': '请输入合作厂家名称', 
				'typeZEI' : '只允许输入中英文',
				'min'    : [8, '不能少于8位'], 
				'max'    : [25, '不能多于25位'] 
			}, function( prompt){
				$( '.join_prompt_partner' ).html( prompt );
			} 
		],
		legalPersonRule = [
			{ 
				'noBlank': '请输入法定代表人', 
				'typeZh' : '请输入中文', 
				'min'    : [2, '不能少于2位'], 
				'max'    : [5, '不能多于5位'] 
			}, function( prompt){
				$( '.join_prompt_legalPerson' ).html( prompt );
			} 
		],
		idCardRule = [
			{ 
				'noBlank'   : '请输入身份证号', 
				'typeIdCard': '身份证号无效'
			}, function( prompt){
				$( '.join_prompt_idCard' ).html( prompt );
			} 
		],
		contactRule = [
			{ 
				'noBlank': '请输入常用联系人', 
				'typeZh' : '请输入中文', 
				'min'    : [2, '不能少于2位'], 
				'max'    : [5, '不能多于5位'] 
			}, function( prompt){
				$( '.join_prompt_contact' ).html( prompt );
			} 
		],
		mobileRule = [
			{ 
				'noBlank': '请输入手机号码', 
				'typePhone': '手机格式不正确', 
				'min'    : [11, '不能少于11位'], 
				'max'    : [11, '不能多于11位'] 
			}, function( prompt){
				$( '.join_prompt_mobile' ).html( prompt );
			} 
		],
		emailRule = [
			{ 
				'noBlank'  : '请输入邮箱', 
				'typeEmail': '邮箱格式不正确'
			}, function( prompt){
				$( '.join_prompt_email' ).html( prompt );
			} 
		];
	
	validate( corpName,    [ 'change' ], corpNameRule );

	validate( address,     [ 'change' ], addressRule );

	validate( businessId,  [ 'change' ], businessIdRule );

	validate( legalPerson, [ 'change' ], legalPersonRule );

	validate( idCard,      [ 'change' ], idCardRule );

	validate( contact,     [ 'change' ], contactRule );

	validate( mobile,      [ 'change' ], mobileRule );

	validate( email,       [ 'change' ], emailRule );

	province.on( 'change', function(){
		setTimeout( validateCity, 1 );
	});

	city.on( 'change', function(){
		setTimeout( validateCity, 1 );
	});

	strict.on( 'change', function(){
		setTimeout( validateCity, 1 );
	});

	function validateCity(){
		if( province.val() == '0' || city.val() == '0' ||  ( strict.css( 'display' ) != 'none' && strict.val() == '0' ) ){
			$( '.join_prompt_city' ).html( '地址不能为空' );
			return false;
		}
		$( '.join_prompt_city' ).html( '' );
	}

	function validateAll(){
		
		return validate( corpName,    corpNameRule )
			&& validate( address,     addressRule )
			&& validate( businessId,  businessIdRule )
			&& validate( legalPerson, legalPersonRule )
			&& validate( idCard,      idCardRule )
			&& validate( contact,     contactRule )
			&& validate( mobile,      mobileRule )
			&& validate( email,       emailRule );

	}

	/******************************************
	申请会员提交
	********************************************/
	$( '#joinForm' ).on( 'submit', function(){

		var models   = $( '.join_model' ),
			partners = $( '.join_partner' ),
			cats = [],
			i = 0,
			l = models.length;

		if( validateAll() !== true ){
			return false;
		}

		if( validateCity() === false ){
			return false;
		}

		for ( ; i < l ; i++ ){
			if( validate( partners.eq( i ), partnerRule ) !== true ){
				return false;
			}
			cats.push( models.eq( i ).val() + ':' + partners.eq( i ).val() );
		}

		
		
		var data = {
			corpName          : corpName.val(),
			corpRegisterYear  : registerYear.val(),
			corpEmpNum        : size.val(),
			provinceCode      : province.val(),
			cityCode          : city.val(),
			areaCode          : strict.val(),
			address           : address.val(),
			regCode           : businessId.val(),
			legalPersonName   : legalPerson.val(),
			legalPersonCertId : idCard.val(),
			contactName       : contact.val(),
			mobile            : mobile.val(),
			email             : email.val(),
			cats              : cats.join( ';' )
		};
				
		$.ajax({
			url: basePath + '/user/apply',
			type: 'post',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if( ret.code == 0 ){
					$.cookies.set( 'corpname', corpName.val() );
					window.location.href = window.location.protocol + '//' + window.location.host + '/user/info';
					return;
				}

				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
				
			}
		});

		return false;

	});

	/******************************************
	创建经营品类
	********************************************/
	var joinPartnerPrompt = $( '#joinPartnerPrompt' );

	var pn = 0,
		partnersTmp = ['<span class="join_text" style="visibility: hidden">经营品类：</span>&nbsp;',
				'<select class="join_select join_model"></select>&nbsp;',
				'<input type="text" maxLength="25" class="input_text join_partner" />&nbsp;',
				'<a href="javascript:void(0)" class="partner_handler partner_add"></a>&nbsp;',
				'<a href="javascript:void(0)" class="partner_handler partner_del"></a>&nbsp;'].join('');

	function createPartner( renderTo ){
	
		var label = $( '<label>' ).addClass( 'join_label join_partner_box' );
		label.append( partnersTmp );
		pn++;
		partnerHandler( label );
		if( renderTo ){
			renderTo.after( label );
		} else {
			label.find( '.join_text' ).css( 'visibility', 'visible' );
			joinPartnerPrompt.before( label );
		}
	
	}

	function partnersFirst( el ){

		$( '.join_partner_box' ).first().find( '.join_text' ).css( 'visibility', 'visible' );

	}

	function partnerHandler( el ){

		el.find( '.partner_add' ).on( 'click', function(){ createPartner( el ) } );
		el.find( '.partner_del' ).on( 'click', function(){ 
			if( pn > 1 ){
				el.remove();
				pn--;
				partnersFirst();
			}
		} );
		createModel( el.find( '.join_select' ), DOC.parterModelNum );
		validate( el.find( '.input_text' ), [ 'change' ], partnerRule );

	}

	function createModel( model, items ){
		
		var v,
			os = [];
		for( v in items ){
			os.push( $( '<option>' ).attr( 'value', v ).html( items[ v ] ) );
		}
		model.append( os );

	}

	/******************************************
	创建年份
	********************************************/
	function createYear(){
		
		var i = 2015,
			ys = [];

		while( i > 1990 ){
			ys.push( $( '<option>' ).attr( 'value', i ).html( i-- ) );
		}
		registerYear.append( ys );

	}

	/******************************************
	入口
	********************************************/
	!function(){

		//区域联动框
		area.initComplexArea( 'province', 'city', 'strict', '33', '3301', '330106' );

		createYear();

		createPartner();

	}();

});

