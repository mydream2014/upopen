
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
		doc: 'public/zhdoc'
	}
})

define( ['base', 'dialog', 'doc', 'all'],function( base, Dialog, DOC ){

	var belong = 'thisismessage',
		content = $( '#content' ),
		talkBox = $( '#talkBox' ),
		data = [],
		tmp = [ '{num} -- {content} -- {date} ' ].join('');

	function renderAll( items ){
		
		var els = [];
		$.each( items, function( k, v ){
			els.push( render( v ) );
		});	
		talkBox.append( els );

	}

	function render( item, talkBox ){
		
		item.num = data.length + 1;
		var el =  tmp.replace( /\{(.*?)\}/g, function( $1, $2 ){
				return item[ $2 ];
			}) ;
		el = $( '<div>' ).append( el ).addClass( 'talkItem');
		item.el = el
		data.push( item );
		talkBox && talkBox.append( el );
		return el;

	}

	$( '#form' ).on( 'submit', function(){
		
		var data = {
			content: content.val(),
			belong:         belong
		};
		$.ajax( {
			url: basePath + '/addTalk',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function( ret ){
				if( ret.code == '0' ){
					render( ret.data, talkBox );
				}
			}
		} );
		return false;
	} );
   	
	function fetchTalk(){
		
		var data = {
			belong: belong
		};

		$.ajax( {
			url: basePath + '/fetchTalk',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function( ret ){
				if( ret.code == '0' ){
					renderAll( ret.data );
				}
			}
		} );
		
	};

	!function(){
		fetchTalk();
	}();
	

});

