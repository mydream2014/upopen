

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
		doc: 'public/zhdoc'
	}
})

define( ['dialog', 'doc', 'base', 'all', 'css!./module/parters/parters'], function( Dialog, DOC ){

	/***********************************************************/
	$('.addItem').on('click',function(){
		dialogShow();
	});

	var type = ['电梯系统','空调设备','厨房电器'];

	$('.dialog_closebtn').on('click', function(){
		dialogHide();
	});

	function errorShow( text ){
		$('.errorTip').html( text );
	}

	function errorHide(){
		$('.errorTip').html( '' );
	}

	function dialogHide(){
		$('.dialog').hide();
		$('.dialog_mask').hide();
		$('#parterType').val('');
		$('#company').val('');
	}

	function dialogShow(){
		$('.dialog').show();
		$('.dialog_mask').show();
	}

	var parterType = $('#parterType'),
		company = $('#company');

	parterType.on('click',function(){
		$('.parterTypeList').toggle();
	});

	$('.parterTypeList a').on('click',function( event ){
		$('#parterType').val( event.target.innerHTML );
		$('.parterTypeList').hide();
	});

	function validateType( text ){
		if( !text.trim() ){
			errorShow('请选择品类')
			return false;
		} else {
			errorHide();
			return true;
		}
	}

	function validateCompany( text ){
		if( !text.trim() ){
			errorShow('请输入厂商')
			return false;
		} else {
			errorHide();
			return true;
		}
	}

	company.on('change', function(){
		validateCompany( this.value );
	});

	function addItem(){
		
		if( !validateType( parterType.val() ) || !validateCompany( company.val() )  ){
			return false;
		}
		$.ajax({
			type: 'post',
			url: '/addParter',
			data: {
				phone: $.cookies.get('username'),
				company: company.val(),
				model: DOC.parterModel[ parterType.val() ],
				status: 0,
				date: '20150415',
				annex: ''
			},
			success: function( ret ){
				if( ret.code == 0 ){
					//正确的操作
					$('.addParterItem').hide();
					$('#parterItems').show();
					addParterItem({ company: company.val(), model: DOC.parterModel[ parterType.val() ], status: 0, date: '20150415' });
					dialogHide();
				}
				dialog.show( DOC.errorCode[ ret.code ] || '未知错误[' + ret.code + ']' );
			} 
		});
		return false;
	}


	$('#formParter').on('submit',addItem);

	$('#dialog_cancel').on('click',function(){
		dialogHide();
	});

	function fetchParters(){
		$.ajax({
			type: 'post',
			url: '/fetchParters',
			data: {
				phone: $.cookies.get('username')
			},
			success: function( ret ){
				if( ret.code == 0 ){
					if( ret.data.length ){
						$('#parterItems').show();
						addParters( ret.data);
					} else {
						$('.addParterItem').show();
					}
					//正确的操作
					
				}
				//dialog.show( DOC.errorCode[ ret.code ] || '未知错误[' + ret.code + ']' );
			} 
		});
	}
	
	fetchParters();

	/***********************************************************/
	
	function addParters( data ){
		$.each( data, function( k, v ){
			addParterItem( v );
		})
	}

	function addParterItem( config ){
		var item = ['<tr>',
					'<td>' + config.company + '</td>',
					'<td>' + DOC.parterModelNum[ config.model ] + '</td>',
					'<td>' + ['未上传','未审核','已通过','未通过'][ config.status ]+ '</td>',
					'<td>' + config.date + '</td>',
					'</tr>'].join('');
			$( item ).insertBefore( $('#addItem') );
	}

	/***********************************************************/

} )