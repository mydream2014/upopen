
/**********************************************************************************************
* 创建坦克
* BULLTE: 炮弹
* Cartridge: 弹夹
* TANK: 坦克
***********************************************************************************************/

!function( root ){

	var dae;

	var SOUNDS = { 
		walk: 'walk', 
		fire: 'fire', 
		bomb: 'bomb' 
	};

	var audio = {};
	
	$.each( SOUNDS, function( v, i ){
		
		audio[ v ] = new Audio();
		audio[ v ].src = './sounds/' + v + '.mp3';
		audio[ v ].type = "audio/mp3";

	} );
	

	Array.prototype.remove = Array.prototype.remove || function( v ){

		if( this.indexOf( v ) > -1 ){
			return this.splice( this.indexOf( v ), 1 )[0];
		}

	};

	/*
	* BULLTE- 炮弹
	*/
	var BULLTE = function(){
	
		this.initialize();
	
	};

	_.extend( BULLTE.prototype, {
	
		initialize: function(){

			this.el = new THREE.Mesh(
				new THREE.CylinderGeometry( 8, 8, 40, 16, 1 ),
				new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( '/images/bullte.jpg' ) } )
			);
			this.el.rotation.x = Math.PI * 2 / 4;
		
		}

	} );
	
	/*
	* Cartridge- 弹夹
	*/
	var Cartridge = function( config ){
		
		this.initConfig = {};
		_.extend( this.initConfig, this.defaults, config );
		this.initialize();
		return this;

	};

	_.extend( Cartridge.prototype, {

		defaults: { num: 3 } ,		
	
		initialize: function(){
			this.num = this.initConfig.num
			this.create();
		},

		create: function(){
		
			this.box = $( '<div>' ).addClass( 'cartridge' );
			this.els = [];
			var i = this.num;
			while( i-- ){
				this.els.push( $( '<div>' ).addClass( 'hide full' ).html( '<div class="catr"><div class="catra"></div><div class="catrc"></div><div class="catrb"></div></div>' ) );
				
			}
			this.box.append( this.els );
			$( 'body' ).append( this.box );

		},

		add: function(){
			
			var me = this;
			if( this.num < this.initConfig.num ){
				$( this.els[ this.num ] ).addClass( 'full_anmi' );
				setTimeout( function(){
					
					$( me.els[ me.num ] ).removeClass( 'full_anmi' ).addClass( 'full' );
					me.num++;

				}, 2000 )
			}
		
		},

		remove: function(){

			if( this.num ){
				$( this.els[ --this.num ] ).removeClass( 'full' );
				this.add();
			}

		}
	
	} );

	/*
	* TANK- 坦克
	*/
    var Model = Backbone.Model.extend( {
	
	} );

	root.TANK = function( config ){
		
		this.initConfig = {};
		_.extend( this.initConfig, this.defaultConfig, config || {} );
		this.initialize();

	}

	_.extend( TANK.prototype, {
		
		/*
		* defaultConfig- 默认配置项
		*/
		defaultConfig: {
			role: 1
		},
		
		/*
		* optic- 坦克视角
		*/
		optic: 1,
		
		/*
		* model- 数据模型
		*/
		model: new Model(),
	
		/*
		* initialize- 初始化
		*/
		initialize: function(){

			var me = this;
			
			if( this.initConfig.load ) {
				
				this.loadModel();

			} else {
			
				this.el = dae.clone( this.el );
				this.el.position.x = Math.floor( Math.random() * 500 + 7500 ) * [ -1, 1 ][ this.initConfig.role - 1 ];
				this.el.rotation.y = Math.PI / 2 * [ -1, 1 ][ this.initConfig.role - 1 ];
				this.el.position.z = Math.floor( Math.random() * 2000 - 1000 );
				scene.add( this.el );
			
				if( this.initConfig.current ){
					
					this.createLife();
					this.handler();
					this.cartridge = new Cartridge();
					this.createRadar();
					this.createWrap();
					course.on( 'render', function(){
						me.action();
					} );

				}
				
				for( var i = 0, c; c = this.el.children[i]; i++ ){
					c.castShadow = true;
					c.receiveShadow = true;
				}
					
				this.cube = this.el.children[0];
				this.el.children[0].belongTo = this;
				if( this.initConfig.role != user.get( 'role' ) ){
					THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( this.el.children[0] ) );
				}
				
			}

		},
	
		/*
		* createWrap- 坦克碰撞点
		*/
		createWrap: function(){
			
			var el = this.el
				i = 0;

			function _create(){

				return new THREE.Mesh(
							new THREE.CubeGeometry( 50, 100, 50 ),               
							new THREE.MeshLambertMaterial( {color: 0x0000ff})  
						);
			}

			while( ++i < 7 ){
				el[ 'wrap' + i ] = _create();
			}

		},
		
		/*
		* loadModel- 加载坦克模型
		*/
		loadModel: function( ){		
			
			var me = this;
			if( dae ){
				scene.remove( dae );
			}
			if( jiggsaws.length > 0){
				for( var i = 0; i < jiggsaws.length; i++){
					scene.remove( jiggsaws[i] );
				}				
			}
			jiggsaws.length = 0;
			model_meshes.length = 0;

			var loader = new THREE.ColladaLoader();
			loader.options.convertUpAxis = true;
			loader.options.centerGeometry = true;
			loader.load( 'javascripts/T-90/T-90.dae', function ( collada ) {
				
				dae = collada.scene;


			}, function( progress ){
				course.trigger( 'loading', progress );
			});

		},
		
		/*
		* createRadar- 创建雷达
		*/
		createRadar: function(){
			
			var tmp = [ '<div class="radar">',
						'<div class="line"></div>',
						'<div class="line2"></div>',
						'<div class="cricle"></div>',
						'<div class="cricle2"></div>',
						'<div class="highlight "></div>',
						'<div class="result">',
						'</div>',
						'<div class="sense rotate">',
						'<div class="sensein"></div>',
						'</div><div class="radarin"></div></div>' ].join('');
			this.radar = $( '<div>' ).addClass( 'radarBox' ).html( tmp );
			this.radars = {};
			$( 'body' ).append( this.radar );
			this.range = this.radar.find( '.result' );

		},
		
		/*
		* setRadar- 在雷达上创建所有其它玩家点
		*/
		setRadar: function( config ){
			
			var me = this;
			users.map( function( v ){
				
				if( v.get( 'current' ) ){
					return;
				};
				if( !me.radars[ v.get( 'id' ) ] ){
					me.createRadarEl( v );
				}
				me.radarPos(v.get( 'el' ).el.position, v.get( 'id' ) );

			} );

		},
		
		/*
		* createRadarEl- 分敌我在雷达上创建某个其它玩家点
		*/
		createRadarEl: function( v ){
			
			var _el = $( '<tt>' ).addClass( 'goal' );
			if( v.get( 'role' ) !== user.get( 'role' ) ){
				_el.addClass( 'enemy' );
			}
			this.range.append( _el );
			this.radars[ v.get( 'id' ) ] = { el: _el };

		},
		
		/*
		* radarPosSelf- 自身移动后，重新计算雷达上扫描位置
		*/
		radarPosSelf: function( position, id ){
			
			if( position === true ){

				$( '.result' ).css( { '-webkit-transform': 'rotate( ' + Math.floor(  user.get( 'el' ).el.rotation.y * 360 / 2 / Math.PI ) + 'deg)' } );

			} else {

				for( id in this.radars ){
					this.radarPos( users.get( id ).get( 'el' ).el.position, id );
				}
			
			}
		
		},
		
		/*
		* radarPos- 计算雷达上某侦测点位置
		*/
		radarPos: function( position, id ){
			
			var el = user.get( 'el' ).el,
				pos = position.split ? position.split( '_' ) : position;

			var l,
				t;
			var x1 = pos.x - el.position.x;
			if( x1 >= 0 ){
				l = true;
			};
			x1 = Math.abs( x1 );
			var z1 = pos.z - el.position.z;
			if( z1 >= 0 ){
				t = true;
			}
			z1 = Math.abs( z1 );

			var y1 = Math.atan( z1 / x1 ),
				radius1 = z1 / Math.sin( y1 ),
				_r = radius1 * 100 / 15000,
				x2 = Math.cos( y1 ) * _r,
				z2 = Math.sin( y1 ) * _r;
			
			if( !l ){
				x2 = -x2;
			}
			if( !t ){
				z2 = -z2;
			}

			this.radars[ id ].el.css( { left: x2 + 100, top: z2 + 100 } );

			$( '.result' ).css( { '-webkit-transform': 'rotate( ' + Math.floor( el.rotation.y * 360 / 2 / Math.PI ) + 'deg)' } );
		
		},
		
		/*
		* radarDel- 删除雷达某检测点
		*/
		radarDel: function( id ){
			
			if( this.radars[ id ] ){
				this.radars[ id ].el.remove();
				delete this.radars[ id ];
			}

		},
		
		/*
		* sound- 坦克各音效
		*/
		sound: function( type ){
			
			audio[ type ].play();

		},
		
		/*
		* createLife- 创建坦克生命值
		*/
		createLife: function( ){

			var me = this;
			var _html = ['<div class="reset hide">猛击这里，满状态复活!</div>',
						 '<ul>',
						 '<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>',
						 '</ul>'].join('');
			var _wrap = $( '<div>' ).addClass( 'life' );
			_wrap.html( _html );
			$( 'body' ).append( _wrap );
			this.lifes = _wrap.find( 'li' );

			_wrap.on( 'click', function(){
				
				if( !me.belongTo.get( 'life' ) ){
					
					me.reset();
					me.cube.material.color.setHex( 0xffffff );
					me.lifes.css( 'background','#f00' );;
					sio.emit( 'sendChat', { id: user.get( 'id' ), chat: ' 号外！号外！ ' + user.get('name') + '已重生！！ ' } );
				
				}

			} );

			me.on( 'over', function(){

				_wrap.find( 'ul' ).hide();
				_wrap.find( '.reset' ).show();

			});

			me.on( 'reset', function(){

				_wrap.find( 'ul' ).show();
				_wrap.find( '.reset' ).hide();

			});

		},
		
		/*
		* reset- 坦克状态重置
		*/
		reset: function(){
		
			this.belongTo.set( { life: 10 } );
			this.el.position.x = Math.floor( Math.random() * 500 + 7500 ) * [ -1, 1 ][ this.initConfig.role - 1 ];
			this.el.position.z = Math.floor( Math.random() * 2000 - 1000 );
			this.trigger( 'reset' );

		},
		
		/*
		* move- 非主机坦克移动
		*/
		move: function( config, v ){
			
			var position = config.position.split( '_' ),
				rotation = config.rotation.split( '_' );
			this.el.position = { x: position[0], y: position[1], z: position[2]};
			this.el.rotation = { x: rotation[0], y: rotation[1], z: rotation[2]};
			
			user.get( 'el' ).radarPos( v.get( 'el' ).el.position, v.get( 'id' ) );

		},
	
		/*
		* moveMobile- 通过手机控件坦克方向
		*/
		moveMobile: function( forward, turn ){
		
			var me = this,
				el = this.el;
			if( turn == 1 ){
				el.turnRight = false;
				el.turnLeft = true;
			} else if( turn == -1 ){
				el.turnLeft = false;
				el.turnRight = true;
			} else {
				el.turnLeft = false;
				el.turnRight = false;
			}

			if( forward == 1 ){
				el.moveBackward = false;
				el.moveForward = true;
			} else if( forward == -1 ){
				el.moveForward = false;
				el.moveBackward = true;
			} else {
				el.moveForward = false;
				el.moveBackward = false;
			}

		},
		
		/*
		* handler- 键盘事件定义
		*/
		handler: function(){

			var me = this,
				el = this.el,
				
				_l,
				_f,
				_r,
				_b;

			$( 'body' ).on( 'keydown', function( event ){
				if( !user.get( 'life' ) || !chat.hidden ){
					return;
				}
				switch ( event.keyCode ){
					case 37 : 
					case 65 : 
						el.turnRight = false;
						el.turnLeft = true;
						break;
					case 38 : 
					case 87 :
						el.moveBackward = false;
						el.moveForward = true;
						break;
					case 39 : 
					case 68 :
						el.turnLeft = false;
						el.turnRight = true;
						break;
					case 40 : 
					case 83 :
						el.moveForward = false;
						el.moveBackward = true;
						break;
					case 32 :
						me.optic = ( ++me.optic % 3 );
						break;
				
				}

			} );

			$( 'body' ).on( 'keyup', function( event ){

				if( !user.get( 'life' ) ){
					return;
				}
				switch ( event.keyCode ){

					case 37 : 
					case 65 : 
						el.turnLeft = false;
						break;
					case 38 : 
					case 87 :
						el.moveForward = false;
						break;
					case 39 : 
					case 68 :
						el.turnRight = false;
						break;
					case 40 : 
					case 83 :
						el.moveBackward = false;
						break;
				
				}

			} );

			var _x = WIDTH / 2;

			$( 'canvas' ).on( 'mousedown', function( event ){

				if( event.which == 1 ){
					me.shot();
				}

			} );
		
		},

		/*
		* action- 主机坦克移动、旋转
		*/
		action: function(){
		
			var me = this,
				el = this.el;

			if( !el.turnLeft && !el.turnRight && !el.moveForward && !el.moveBackward ){
				return;
			}

			me.trigger( 'move', me );

			if( el.turnLeft ){
				el.rotation.y += 0.01;
			}
			if( el.turnRight ){
				el.rotation.y -= 0.01;
			}

			var _z = Math.cos( el.rotation.y ) * 10,
				_x = Math.sin( el.rotation.y ) * 10;
			
			if( el.moveForward ){
				el.position.z += ( -_z );
				el.position.x += ( -_x );
			};
			if( el.moveBackward ){
				el.position.z += ( _z );
				el.position.x += ( _x );
			}

			if( el.turnLeft || el.turnRight ){
				me.radarPosSelf( true );
			}{
				me.radarPosSelf( false );
			}

			if( el.turnLeft || el.turnRight || el.moveForward || el.moveBackward ){
				this.sound( 'walk' );
			}
			
			el.wrap1.position = { 
				x: el.position.x - Math.sin( Math.atan( 9 / 25 ) + el.rotation.y ) * 531, 
				y: el.position.y, 
				z: el.position.z - Math.cos( Math.asin( 9 / 25 ) + el.rotation.y ) * 531 }
			
			el.wrap2.position = { 
				x: el.position.x + Math.sin( Math.atan( 9 / 25 ) - el.rotation.y ) * 531, 
				y: el.position.y, 
				z: el.position.z - Math.cos( Math.atan( 9 / 25 ) - el.rotation.y ) * 531 }
			
			el.wrap3.position = { 
				x: el.position.x + Math.sin( Math.atan( 9 / 20 ) + el.rotation.y ) * 438, 
				y: el.position.y, 
				z: el.position.z + Math.cos( Math.atan( 9 / 20 ) + el.rotation.y ) * 438 }
			
			el.wrap4.position = { 
				x: el.position.x - Math.sin( Math.atan( 9 / 20 ) - el.rotation.y ) * 438, 
				y: el.position.y, 
				z: el.position.z + Math.cos( Math.atan( 9 / 20 ) - el.rotation.y ) * 438 }

			el.wrap5.position = { 
				x: el.position.x - Math.sin( Math.asin( 0 / 5 ) - el.rotation.y ) * 400, 
				y: el.position.y, 
				z: el.position.z + Math.cos( Math.asin( 0 / 5 ) - el.rotation.y ) * 400 }

			el.wrap6.position = { 
				x: el.position.x - Math.sin( Math.asin( 0 / 5 ) + el.rotation.y ) * 500, 
				y: el.position.y, 
				z: el.position.z - Math.cos( Math.asin( 0 / 5 ) + el.rotation.y ) * 500 }
			
			if ( pass( el, [ 0, 0, 0 ] ) === false ){

				if( el.moveForward ){
					el.position.z -= ( -_z );
					el.position.x -= ( -_x );
				};
				if( el.moveBackward ){
					el.position.z -= ( _z );
					el.position.x -= ( _x );
				}

			}

			me.setCamera();

		},
		
		/*
		* beHit- 坦克被打中
		*/
		beHit: function( config ){
			
			var me = this;
			var _i = this.belongTo.get( 'life' );
			if( !_i ){
				return;
			}

			this.sound( 'bomb' );

			if( --_i > 0 ){

				this.cube.material.color.setHex( 0xff0000 );
				var _v = $( this.lifes[ _i ] );
				_v.addClass( 'color_3d' );
				setTimeout( function(){
					_v.removeClass( 'color_3d' );
					_v.css( { background: '#6E7849' } );
					me.cube.material.color.setHex( 0xffffff );
				}, 500 );

			} else if( _i == 0 ){

				this.trigger( 'over' );
				sio.emit( 'sendChat', { id: user.get( 'id' ), chat: '已死，有事烧纸！ ' + users.get( config.byId ).get( 'name' ) + ' 完胜！' } );
				sio.emit( 'win', { id: user.get( 'id' ), byId: config.byId } );
				this.cube.material.color.setHex( 0xff0000 );
				alert( '壮烈了!' );

			}

			this.belongTo.set( { life: _i } );

			return this;

		},

		/*
		* setCamera- 调视频角度
		*/
		setCamera: function(){
			
			var el = this.el,
				config = this.initConfig,
				_view = [ [ 200, 300 ], [ 700, 400 ], [ 1000, 700 ] ][ this.optic ];
			
			camera.lookAt( { x: el.position.x + Math.cos( Math.PI * 2 / 4 + el.rotation.y ) * 400, y: el.position.y + 200, z: el.position.z - Math.sin( Math.PI * 2 / 4 - el.rotation.y ) * 400 } );
			camera.position = { x: el.position.x - Math.cos( Math.PI * 2 / 4 + el.rotation.y ) * _view[0], y: el.position.y + _view[1], z: el.position.z + Math.sin( Math.PI * 2 / 4 - el.rotation.y ) * _view[0] };			

		},
		
		/*
		* shot- 射击
		*/
		shot: function(){

			if( !user.get( 'life' ) ){
				return;
			}

			if( !this.cartridge.num ){
				return;
			} else {
				this.cartridge.remove();
			}

			var me = this,
				bullte = new BULLTE();
			this.bullte = bullte;
			bullte.tank = this;
			_.extend( bullte.el.position, this.el.position, { y: 153 } );
			bullte.el.rotation.z = -this.el.rotation.y;
			var _v = [ bullte.el.position.x, bullte.el.position.y, bullte.el.position.z ];

			scene.add( bullte.el );
			this.sound( 'fire' );

			var i = 0;

			function _shot(){

				bullte.el.position.z -= Math.cos( -bullte.el.rotation.z ) * 150 ;
				bullte.el.position.x -= Math.sin( -bullte.el.rotation.z ) * 150 ;
				
				if( !shoting( bullte, _v, me.belongTo.get( 'id' ) ) || i++ > 150 ){
					course.off( 'animate', _shot );
					scene.remove( bullte.el );
				}	
			
			}

			course.on( 'animate', _shot );			
		
		}
	
	}, Backbone.Events );

	/*
	* shoting- 弹道射击过程碰撞检测
	*/
	function shoting( v, _v, id ){
	
		var el = v.el;

		if( id === false ){
			el = v;
		}

		var ray = new THREE.Ray( el.position, new THREE.Vector3( _v[0], _v[1], _v[2] ) ),
			c = THREE.Collisions.rayCastNearest( ray );

		if ( c && c.distance == -1 ) {
			
			if( c.mesh.hard ){
				return false;
			}
			c.mesh.material.color.setHex( 0xff0000 );
			var _user = users.where( { el: c.mesh.belongTo } )[0];
			sio.emit( 'hit', { id: _user.get( 'id' ), id: _user.get( 'id' ), byId: id } );
			setTimeout( function(){
				c.mesh.material.color.setHex( 0xffffff );
			}, 300 );

		}

		return true;

	}
	
	/*
	* pass- 坦克行进过程碰撞检测
	*/
	function pass( el, _v ){
	
		var i = 0;

		while( ++i < 7 ){

			var ray = new THREE.Ray( el[ 'wrap' + i ].position, new THREE.Vector3( _v[0], _v[1], _v[2] ) ),
				c = THREE.Collisions.rayCastNearest( ray );

			if ( c && c.distance == -1 ) {
				return false;

			}
		}
	}

	course.on( 'afterScene', function(){

		new TANK( { load: true } );

	} );

}( window );



