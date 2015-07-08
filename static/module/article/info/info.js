
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

	var type = $( '#type' ),
		title = $( '#title' ),
		description  = $( '#description' ),
		author = $( '#author' ),
		tag = $( '#tag' ),
		date  = $( '#date' ),
      kind  = $( '#kind' ),
		sort = $( '#sort' ),
		hot = $( '#hot' ),
		content = $( '#content' );

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
		var data = {
			"_id": param.id || '',
		};
		$.ajax( {
			url: basePath + '/fetchArticleInfo',
			type: 'get',
			dataType: 'json',
			data: data,
			success: function( ret ){
				if( ret.code == '0' ){
					//render( ret.data, talkBox );
					title.html( ret.data.title );
					date.html( ret.data.date.split('T')[0] );
                kind.html( ret.data.kind );
					content.html( ret.data.content );
					author.html( ret.data.author );
				}
			}
		} );
		return false;
	}

	!function(){
		fetchArticle();
	}()

});

