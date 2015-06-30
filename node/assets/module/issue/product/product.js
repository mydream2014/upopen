
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
    // Stuff to do as soon as the DOM is ready;

	var dialog = new Dialog.Dialog()

    $('.login .qrcode').click(function() {
                $('.loginTextBox').css('display', 'none');
                $('.loginQrcodeBox').css('display', 'block');
    });
    $('.tcode .qrcode').click(function() {
                $('.loginTextBox').css('display', 'block');
                $('.loginQrcodeBox').css('display', 'none');
    });
    $("#loginForm").each(function() {
    //  !getCookieValue("phone") || (this.phone.value = getCookieValue("phone"));
    //  !getCookieValue("password") || (this.phone.value = getCookieValue("password"));
    });

	$('#uname').val( $.cookies.get('username') || '' );

	$('#icodeImg').on('click',function(){
		$(this).attr('src','http://dev.qjdchina.com/front/user/verifyCode/getVerifyGgCode.htm?time=' + Math.random())
	})

    /********************************************************/
	//首页焦点图

	function Slider( config ){
		
		this.current = 0;
		this.auto = true;
		this.init( config );
		
	}

	base.extend( Slider.prototype, {

		defaults: {
		
		},
		
		init: function( config ){
			this.render( config );
		},

		render: function( config ){
			this.createItems( config );
			this.createPointer( config );
			this.animAuto();
			this.handler( config );
		},

		createItems: function( config ){
			var ul = $('<ul>').addClass('slide-box clearfix').css('height','360'),
				item;
			this.items = [];
			while( item = config.items.shift() ){
				this.items.push( this.create( item, config.path ) );
			};
			this.items[0].css('opacity',1).css('z-index','11');
			ul.append( this.items );
			config.renderTo.append( ul );
		},

		createPointer: function( config ){
			var ul = $('<div>').addClass('slide-pointer clearfix'),
				len = this.items.length,
				n = 0,
				pointer,
				me = this;
			this.pointers = [];
			var first = $('<a>').addClass('slide-arrow').html('&lt');
			first.on('click',function(){
				me.anim( me.current - 1 );
			})
			this.pointers.push(first);
			while( n++ < len ){
				pointer = $('<a>').addClass('slide-pointerel');
				!function(n){
					pointer.on('click',function(){
						me.anim(n);
					})
				}(n-1);
				this.pointers.push(pointer );
			};
			var last = $('<a>').addClass('slide-arrow').html('&gt');
			last.on('click',function(){
				me.anim( me.current + 1 );
			});
			this.pointers.push(last);
			ul.css({width: 20*(len+2), 'margin-left':-20*(len+2)/2});
			ul.append( this.pointers );
			this.pointerAnim(0);
			config.renderTo.append( ul );
		},

		create: function( config, path ){
			var li = $('<li style="height: 360px;background: url(' + path + config.src + ') center no-repeat">');
			li.append( $('<a>').attr( {'href': config.href || 'javascript:void(0)','target': '_blank'} ).addClass('slide-box-link') );
			return li;
		},

		handler: function( config ){
			var me = this;
			$('.banner').on('mouseover', function(){
				me.auto = false;
			}).on('mouseout',function(){
				me.auto = true;
			})
		},

		anim: function(n){
			if( n >= this.items.length ){
				n = 0;
			} else if( n < 0 ){
				n = this.items.length - 1;
			}
			this.lastel = this.lastel || this.items[n];
			this.lastel.animate({opacity:0}).css('z-index','10');
			this.current = n;
			this.pointerAnim(n);
			this.lastel = this.items[n].animate({opacity:1}).css('z-index','11');
		},

		pointerAnim: function( n ){
			$.each( this.pointers, function( k, v ){
				v.removeClass( 'slide-pointerel-cur' )
			});
			this.pointers[n+1].addClass( 'slide-pointerel-cur' );
		},

		animAuto: function( n ){
			var me = this,
				n = n || this.current;
			this.lastel = me.items[n];
			setInterval(function(){
				if( !me.auto ){
					return false;
				}
				me.lastel.animate({opacity:0}).css('z-index','10');
				if( ++n >=  me.items.length ){
					n = 0;
				}
				me.current = n;
				me.pointerAnim(n);
				me.lastel = me.items[n].animate({opacity:1}).css('z-index','11');
				
			},5000)
		}
	
	});
	var slider = new Slider({
		path: '/module/index/imgs/',
		items: [
				{src: 'banner1.png'},
				{src: 'banner2.jpg'},
				{src: 'banner3.jpg'}
			],
		renderTo: $('.slideWrap')
	});

	

	/********************************************************/
	//登录验证
	function loginpro(a) {
		$('#loginPro').show().addClass('loginPro');
		///$('.login .qrcode').css('margin-bottom', '10px');
		$('#loginPro').html(a);
	}
	$('#phone').on('change',function( event ){
		var value = this.value.trim();
		if( !value ){
			loginpro( '请输入手机号' );
		} else if (!/1\d{10}/.test( value )){
			loginpro( '请输入正确的手机号' );
		} else {
			$('#loginPro').html('&nbsp;').removeClass('loginPro');
		}
	});

	$('#password').on('change',function( event ){
		var value = this.value.trim();
		if( !value ){
			loginpro( '请输入密码' );
		} else if (!/.{6,16}/.test( value )){
			loginpro( '登录密码必须由6-16位字符组成' );
		} else {
			$('#loginPro').html('&nbsp;').removeClass('loginPro');
		}
	});

	var phone = $('#phone'),
		password = $('#password');

	var csrf = {
		parameterName: '',
		token: ''
	}

	$('#loginForm').on('submit',function(){
		
		var data = {
				userName: phone.val(),
				password: password.val()
			};

		data[ csrf['parameterName']] = csrf['token'];

		$.ajax({
			type: 'post',
			url: 'login',
			data:data,
			success: function( ret ){
				if( ret.code == 1 ){
					csrf['parameterName'] = ret.message.parameterName;
					csrf['token'] = ret.message.token;
					//window.location.href = '/parters';
				}
				dialog.show( DOC.errorCode[ ret.code ] || '未知错误[' + ret.code + ']' );
			},
			error: function(ret){
			
			}
		});
		return false;
	})

	/**** index time *****/
	$('#time').html( 17 - (new Date).getDate() );
});

