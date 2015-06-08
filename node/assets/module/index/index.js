
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

define( ['base', 'dialog', 'doc', 'validate', 'all', 'css!./module/index/index'],function( base, Dialog, DOC, validate ){
    // Stuff to do as soon as the DOM is ready;

	var dialog = new Dialog.Dialog()
	
	/******************************************
	登录状态影响页面显示
	********************************************/
	!function(){
		
		$('.login .qrcode').click(function() {
			$('.loginTextBox').css('display', 'none');
			$('.loginQrcodeBox').css('display', 'block');
		});
		$('.tcode .qrcode').click(function() {
			$('.loginTextBox').css('display', 'block');
			$('.loginQrcodeBox').css('display', 'none');
		});

		$('#uname').val( $.cookies.get('username') || '' );

		$('#icodeImg').on('click',function(){
			$(this).attr('src','http://dev.qjdchina.com/front/user/verifyCode/getVerifyGgCode.htm?time=' + Math.random())
		})
	
	}();

	/******************************************
	首页焦点图
	********************************************/
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
			var li = $('<li style="height: 360px;background: url(' + path + config.src + ') center no-repeat">'),
				a = $('<a>').addClass('slide-box-link');
			if( config.href ){
				a.attr( {'href': config.href ,'target': '_blank'} );
			} else {
				a.attr( {'href': 'javascript:void(0)'} );
			}
			li.append( a );
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

	/******************************************
	登录
	********************************************/
	var phone    = $('#phone'),
		password = $('#password');
	
	var PhoneRule = [
			{ 
				'noBlank': '请输入手机号码', 
				'typePhone': '手机格式不正确',
				'min': [11, '不能少于11位'], 
				'max': [11, '不能多于11位'] 
			}, function( prompt){
				$( '#loginPro' ).html( prompt );
			}	
		],
		PasswordRule = [
			{ 
				'noBlank': '请输入注册密码',
				'min': [6, '不能少于6位'], 
				'max': [25, '不能多于25位']
			}, function( prompt){
				$( '#loginPro' ).html( prompt );
			} 	
		];

	validate( phone, [ 'change' ], PhoneRule );

	validate( password, [ 'change' ], PasswordRule );

	function validateAll(){
		
		return validate( phone, PhoneRule ) 		
		&& validate( password, PasswordRule);

	}

	$('#loginForm').on('submit',function(){
		
		if( validateAll() !== true ){
			return false;
		};

		var data = {
			phone:    phone.val(),
			password: password.val()
		};

		$.ajax({
			url: '/user/login',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function( ret ){
				if( ret.code == 0 ){
					window.location.href = window.location.protocol + '//' + window.location.host + '/user/info';
					return;
				} 
				dialog.show( DOC.errorCode[ ret.code ] || '未知错误[' + ret.code + ']', ret.code || 0 );
			},
			error: function(ret){
			
			}
		});
		return false;
	})

});

