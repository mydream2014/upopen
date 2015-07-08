
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
		doc: 'public/zhdoc',
		kind: 'public/kind'
	}
})

define( ['base', 'dialog', 'doc', 'all', 'kind'],function( base, Dialog, DOC ){

	var articleBox = $( '#articleBox' ),
		data = [],
		tmp = [ '<tt class="articleNum">{num}</tt>',
				'<h3 class="articleTitle">{title}</h3>',
				'<span class="articleAuthor">{author}</span>',
                '<span class="articleKind"><a href="/article/list?kind={kind}">{kind}</a></span>',
				'<span class="articleDate">{date}</span>',
				'<p class="articleContent">{description}</p>',
				'<a class="articleLink" href="/article/info?id={_id}">阅读全文</a>'].join('');

	function renderAll( items ){
		
		var els = [];
		$.each( items, function( k, v ){
			els.push( render( v ) );
		});	
		articleBox.append( els );

	}

	var type = $( '#type' ),
		title = $( '#title' ),
		description  = $( '#description' ),
		author = $( '#author' ),
		tag = $( '#tag' ),
		disabled  = $( '#disabled' ),
		sort = $( '#sort' ),
		hot = $( '#hot' ),
		content = $( '#content' );

	function render( item, talkBox ){
		item.date = item.date.split('T')[0];
		item.num = data.length + 1;
		var el =  tmp.replace( /\{(.*?)\}/g, function( $1, $2 ){
				return item[ $2 ];
			}) ;
		el = $( '<div>' ).append( el ).addClass( 'articleItem clearfix' ).attr( 'href', '/article/info?id='+item._id);
		item.el = el
		data.push( item );
		talkBox && talkBox.append( el );
		return el;

	}

   	function getLocal(){
		var param = location.search.slice(1).split('&');
		var p = {};
		for( var i = 0; c = param[i]; i++ ){
			var s = c.split('=');
			p[s[0]] = s[1];
		}
		return p;
	}

	function fetchArticle( ){
		
		var param = getLocal();
		var data = getLocal();

		$.ajax( {
			url: basePath + '/fetchArticle',
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

	!function(){
		fetchArticle();
	}();
	

});

