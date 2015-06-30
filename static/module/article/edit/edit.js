
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

	
	//var ue = UE.getContent();
	ue.ready(function(){
	    //设置编辑器的内容
	    ue.setContent('hello');
	    //获取html内容，返回: <p>hello</p>
	    var html = ue.getContent();
	    //获取纯文本内容，返回: hello
	    var txt = ue.getContentTxt();
	});

	var kind = $( '#kind' ),
		title = $( '#title' ),
		description  = $( '#description' ),
		author = $( '#author' ),
		tag = $( '#tag' ),
		disabled  = $( '#disabled' ),
		sort = $( '#sort' ),
		hot = $( '#hot' ),
		content = $( '#content' );

	function renderKind( items ){
		var els = [];
		$.each( items, function( k, v ){
			els.push( new Option( v.index, v.name ) );
		})
		kind.append( els );
	}

	function fetchKind( ){
		var data = {};

		$.ajax( {
			url: basePath + '/fetchKind',
			type: 'get',
			dataType: 'json',
			data: data,
			success: function( ret ){
				if( ret.code == '0' ){
					renderKind( ret.data );
				}
			}
		} );
		
	};

	$( '#form' ).on( 'submit', function(){
		
		var data = {
			kind: kind.val(),
			title:  title.val(),
			description: description.val(),
			author: author.val(),
			tag: tag.val().split(','),
			disabled: disabled.get(0).disabled,
			sort: sort.val(),
			hot: hot.val(),
			content: ue.getContent(),
			link: '',
		};
		$.ajax( {
			url: basePath + '/addArticle',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function( ret ){
				if( ret.code == '0' ){
					//render( ret.data, talkBox );
					console.log( ret );
				}
			}
		} );
		return false;
	} );

	!function(){
		fetchKind();
	}()

});

