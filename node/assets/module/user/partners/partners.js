
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
	var dialog = new Dialog.Dialog(),
		promptDialog = new Dialog.Dialog( { type: 'prompt', content: '合作厂家添加成功' } ),
		addNewPartner = $( '#addNewPartner' ),
		addPartnerForm = $( '#addPartner' );

	var partnersGrid = $( '#partnersGrid' ),
		model        = $( '#partnerModel' ),
		company      = $( '#partnerCompany' ),
		MODEL        = DOC.parterModelNum;
	
	/******************************************
	获取合作厂家
	********************************************/
	function fetchPartners(){
		
		var data = {}

		$.ajax({
			url: basePath + '/user/fetchPartners',
			type: 'get',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if( ret.code == 0 ){
					render( ret.data );
					return;
				}

				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
				
			}
		});

	}

	function render( data ){
		
		var els = [],
			i   = 0,
			l   = data.length;
		while( i < l ){
			els.push( create( data[i++] ) );
		}
		partnersGrid.append( els );

	}
	
	function create( config ){
		
		return $( '<tr>' ).append( [ $( '<td>' ).html( MODEL[ config.categoryCode ] ), $( '<td>' ).html( config.factoryName ), $( '<td>' ).html( config.status ), $( '<td>' ).html( config.date )])

	}
	
	/******************************************
	创建品类下拉框
	********************************************/
	function createModel( items ){
		
		var v,
			os = [];
		for( v in items ){
			os.push( $( '<option>' ).attr( 'value', v ).html( items[ v ] ) );
		}
		model.append( os );

	}

	var companyRule = [
			{ 
				'noBlank': '请输入公司名称',
				'typeZh': '请输入中文', 
				'min': [8, '不能少于8位'], 
				'max': [25, '不能多于25位'] 
			}, function( prompt){
				$( '.partner_company_prompt' ).html( prompt );
			}	
		];
	
	validate( company, [ 'change' ], companyRule );

	/******************************************
	新增合作厂家
	********************************************/
	$( '#addPartner' ).on( 'submit', function(){

		if( validate( company, companyRule ) !== true ){
			return false;
		}

		var data = {
			categoryCode : model.val(),
			factoryName  : company.val(),
		};
				
		$.ajax({
			url: basePath + '/user/addPartners',
			type: 'post',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if( ret.code == 0 ){
					partnersGrid.append( create( data ) );
					promptDialog.show();
					addNewPartnerHide();
					return;
				}

				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
				
			}
		});

		return false;

	});

	addNewPartner.on( 'click', function(){
		addNewPartner.hide();
		addPartnerForm.show();
	});

	$( '.btn_cancel' ).on( 'click', function(){
		addNewPartnerHide();
	})

	function addNewPartnerHide(){
		addNewPartner.show();
		addPartnerForm.hide();
		model.val( 1 );
		company.val( '' );
		$( '.partner_company_prompt' ).html( '' );
	}
	
	/******************************************
	初始化
	********************************************/
	!function(){
		
		createModel( MODEL );

		fetchPartners();

	}()


});

