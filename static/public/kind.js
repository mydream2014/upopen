
define([], function(){

	var kindBox = $( '#kindBox' ),
		data = [],
		tmp = [ '<li><a href="/article/list?kind={index}">{name}&nbsp;({amount})</a></li>'].join('');

	function fetchKind( ){
		
		var data = {};

		$.ajax( {
			url: basePath + '/fetchKind',
			type: 'get',
			dataType: 'json',
			data: data,
			success: function( ret ){
				if( ret.code == '0' ){
					renderAll( ret.data );
				}
			}
		} );
		
	};

	function renderAll( items ){
		
		var els = [];
		$.each( items, function( k, v ){
			els.push( render( v ) );
		});	
		kindBox.append( els );

	}

	function render( item, talkBox ){
		var el =  tmp.replace( /\{(.*?)\}/g, function( $1, $2 ){
				return item[ $2 ];
			}) ;
		talkBox && talkBox.append( el );
		return el;

	}

	!function(){
		fetchKind();
	}();
})
