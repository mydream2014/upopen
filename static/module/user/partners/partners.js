
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

	$( '#corpName' ).html( corpName );
	
	/******************************************
	获取合作厂家
	********************************************/
	function fetchPartners(){
		
		var data = {}

		$.ajax({
			url: basePath + '/user/fetchPartners?' + Math.random(),
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

	var uploadEl = [ '<form class="partnerFileForm" method="post" enctype="multipart/form-data" role="form">',
					 '<input type="file" name="upload" class="uploadFilePath" multiple="multiple">',
					 '<button type="submit" class="btnGreen partnerFileUpload">上传证书</button>',
					 '</form>'].join( '' );
	
	function create( config ){
		var status = '',
			expire = $( uploadEl );
	
		if( config.authFile ){
			config.status = '上传成功';
			expire.find( 'button' ).html( '重新上传' );
		} else {
			config.status = '未上传证书';
		}
		var tds = [
			$( '<td>' ).html( MODEL[ config.categoryCode ] ), 
			$( '<td>' ).html( config.factoryName ), 
			$( '<td>' ).html( config.status ), 
			$( '<td>' ).html( expire )
		];
		var progress = new Progress( { renderTo: expire } );
		expire.find( 'input' ).on( 'change', function(){
			upload( expire, config.id, this.value, tds[2], progress );
		});
		
		
		return $( '<tr>' ).append( tds );

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
				'typeZEI' : '只允许输入中英文',
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
					data.id = ret.data.id;
					partnersGrid.append( create( data ) );
					promptDialog.show( '合作厂家添加成功' );
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
	附件上传
	********************************************/
	
	function upload( form, id, value, td, progress ){
		var data = {
			id: id,
			file: value
		};
		
		var options = {
			url: basePath + '/user/uploadFile',
			type:'POST',
			dataType:'json',
			processData: true,
			data: data,
			uploadProgress: function(event, position, total, percentComplete){ 
				progress.show();
				progress.animate( percentComplete );
			}, 
			success: function(ret){
				if ( ret.code == 0 ){
					partnerFile( form, id, ret.data.authFile, td );
					promptDialog.show( '证书上传成功', ret.code || 0 );
					return;
				}
				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
			},
			error: function( ret ){
				if( ret.status == 413 || ret.responseText.indexOf( '413' ) > -1 ){
					ret.code = 100006016;
					dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
				}
				progress.hide();
			}
		};
		
		form.ajaxSubmit(options);
	}

	function partnerFile( form, id, authFile, td ){
	
		var data = {
			id : id,
			authFile  : authFile,
		};
		
		//sio.emit( 'uploadFile', { id: id } );

		$.ajax({
			url: basePath + '/user/partnerFile',
			type: 'post',
			data: data,
			dataType: 'json',
			success: function( ret ){
				if ( ret.code == 0 ){
					td.html( '上传成功' );
					form.find( 'button' ).html( '重新上传' );
					return;
				}

				dialog.show( DOC.errorCode[ ret.code ] || '系统错误: ' + ret.code, ret.code || 0 );
				
			}
		});

	}

	$( '.uploadFile' ).on( 'submit', function(){

		upload();
		return false;

	});

	function Progress( config ){
		this.init( config );
	};

	base.extend( Progress.prototype, {

		defaults: {
		
		},

		init: function( config ){
		
			this.render( config )

		},
	
		render: function( config ){
		
			this.el = $( '<div>' ).addClass( 'progressBar' );
			this.aniel = $( '<p>' ).addClass( 'progressBarIn' );
			this.el.append( this.aniel );
			config.renderTo.append( this.el );
		
		},

		show: function(){
		
			this.el.show();
		
		},

		hide: function(){
		
			this.el.hide();

		},

		animate: function( value ){
			var me = this;
			this.aniel.animate( { width: value*4/5 }, function(){
				if( value == 100 ){
					me.hide();
					me.aniel.width( 0 );
				}
			} );

		}
	
	})

	/*
	* socket
	
	var sio = io.connect('/');

	sio.emit( 'uploadFile', { id: 111111111111 } );

	sio.on( 'toWin', function( data ){
		console.log( '==============' );
	})

	sio.on( 'uploadFileProgress', function( data ){
		console.log( data );
	});

	sio.on( 'uploadStart', function( data ){
		console.log( data );
	})
	*/
	/******************************************
	初始化
	********************************************/
	!function(){
		
		createModel( MODEL );

		fetchPartners();

	}()


});

