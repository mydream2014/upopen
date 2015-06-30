

require.config({
	map: {
		'*': {
			'css': './core/css.min'
		}
	},
	baseUrl: basePath,
	paths: {
		base: 'core/base',
		all: 'public/all',
		dialog: 'widget/dialog/dialog',
		complexArea: 'widget/complexArea/complexArea',
		zhdoc: 'public/zhdoc'
	}
})

define( ['dialog', 'complexArea', 'zhdoc', 'base', 'all', 'css!./module/register/register'], function( Dialog, complexArea, DOC ){

	window.dialog = new Dialog.Dialog({
		title: '提示框'
	});
	
	/***************** area *****************/

	complexArea.initComplexArea('province', 'city', 'strict', '33', '3301', '330106');

	/************ form submit *************/

	var phone = $('#phone'),
		password = $('#password'),
		name= $('#name'),
		province = $('#province'),
		city = $('#city'),
		strict = $('#strict'),
		address = $('#address');	

	$('#reg_1').on('submit',function(){
		$.ajax({
			type: 'post',
			url: 'register',
			data:{
				phone: phone.val(),
				password: password.val(),
				name: name.val(),
				province: province.val(),
				city:city.val(),
				strict: strict.val(),
				address: address.val(),
				date: '20150414'
			},
			success: function( ret ){
				if( ret.code == 0 ){
					window.location.href = '/';
				}
				dialog.show( DOC.errorCode[ ret.code ] || '未知错误[' + ret.code + ']' );
			},
			error: function(ret){
			
			}
		});
		return false;
	});

} )