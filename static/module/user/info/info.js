
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
		area: 'widget/complexArea/areaData',
		all: 'public/all',
		doc: 'public/zhdoc'
	}
})

require( ['base', 'dialog', 'doc', 'area', 'all'],function( base, Dialog, DOC, area ){
	
	/******************************************
	定义变量
	********************************************/
	var dialog = new Dialog.Dialog();

	var corpName    = $( '#corpName' ),
		businessId  = $( '#businessId' ),
		legalPerson = $( '#legalPerson' ),
		idCard      = $( '#idCard' ),
		address     = $( '#address' ),
		contact     = $( '#contact' ),
		mobile      = $( '#mobile' );
    
	/******************************************
	获取用户信息
	********************************************/
	function render( config ){
		corpName.html( config.corpName );
		businessId.html( config.regCode );
		legalPerson.html( config.legalPersonName );
		idCard.html( config.legalPersonCertId );
		address.html( area.area_array[ config.provinceCode ] + area.sub_array[ config.provinceCode ][ config.cityCode] + ( area.sub_arr[ config.cityCode ] ? area.sub_arr[ config.cityCode][ config.areaCode ] : '' ) + config.address );
		contact.html( config.contactName );
		mobile.html( config.mobile );
	}

	function fetchUserInfo(){

		var data = {}

		$.ajax({
			url: basePath + '/user/fetchInfo',
			type: 'get',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if( ret.code == 0 ){
					$.cookies.set( 'corpname', ret.data.corpName)
					render( ret.data );
					return;
				} else if( ret.code == '101001002' ){
					window.location.href = window.location.protocol + '//' + window.location.host + '/user/join';
				}
				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
				
			}
		});
	}

	/******************************************
	入口
	********************************************/
	!function(){

		fetchUserInfo()

	}();
	
	

});

