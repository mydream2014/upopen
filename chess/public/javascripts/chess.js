/*
中国象棋  -- 【代码详细见附件，本版本暂只支持 谷歌的 chrome 浏览器，其它浏览器后续支持 】
作者： 江潇
Version: 0.0.1 
前段时间做了个跳棋，【见跳棋游戏—backbone框架开发】网友反馈功能还好，但棋子跳较简单，且可玩性不高。
建议可以做个象棋看看。于是上周日写了这个游戏，未用图片，美观差了些。
依然使用backbone框架管理MVC，目的交流backbone的使用【见透过源码学前端 之 Backbone 一】及二部分。
下载附件包，使用chrome浏览器运行 chess.html。业务代码在 core/chess.js

目前支持的功能有
1、生成棋盘

2、点击开始，生成双方玩家棋子

3、任一方可率先开始，规则同象棋规则

4、一方走过后，另一方底边线显彩色表示轮到该玩家进行

5、一方“将”被吃后，提示另一方获胜

尚待完善部分：
1、悔棋

2、操作声音提示

3、代码优化

4、欢迎指正其它bug

从结构上讲，参照跳棋，分为以下类：
chess  -- [view] app
coords -- [collection] 所有坐标点
coord  -- [model] 单个坐标点模型
pieces -- [collection] 所有棋子
pieceEl-- [view] 单个棋子视图
piece  -- [model] 单个棋子模型
parts  -- [collection] 某个棋子所有可跳点
partEl -- [view] 可跳点视图
part   -- [model] 单个可跳点模型
相比而言多了RULE，因跳棋难点在于画非矩阵棋盘及找出每个坐标与周围一圈坐标的关联，在此基础上跳子相对容易，
因为每个子跳法都是一样。
而象棋则棋盘及坐标规整画出来较容易，难点在于每个棋子的关联及吃子算法不一样，所有先在 RULE里定义
好规则，选中每个子时再据其规则，计算可走点及可吃点

另外 诚心求教 如何才能实现两个玩家在线实时对战功能，据说可以用 socket IO 进行实时消息推送，
我没用过，不明白如何着手，欢迎指教
*/

!function( root ){	

	/*
	* 棋子 行走 和 吃子 规则定义
	*/
	var RULE = {
		
		'che': {
			pos: ['0_0', '8_0'],
			text: '车',
			key: 'che',
			path: function( pos, type ){
				var x = pos.split('_')[0]-0,
					y = pos.split('_')[1]-0,
					_c,
					_x,
					_y,
					_step = [],
					_eat = [];
				_x = x;
				_y = y;
				while(  _y++ < 9 ){
					_c = _x + '_' + _y;
					if( coords.get( _c ) ){
						if( !coords.get( _c ).get( 'belong') ){
							_step.push( _c );
						} else if( coords.get( _c ).get( 'belong').get( 'belong') != type ) {
							_eat.push( _c );
							break;
						} else {
							break;
						}
					} else {
						break;
					}
				}
				_x = x;
				_y = y;
				while(  _y-- > 0 ){
					_c = _x + '_' + _y;
					if( coords.get( _c ) ){
						if( !coords.get( _c ).get( 'belong') ){
							_step.push( _c );
						} else if( coords.get( _c ).get( 'belong').get( 'belong') != type ) {
							_eat.push( _c );
							break;
						} else {
							break;
						}
					} else {
						break;
					}
				}

				_x = x;
				_y = y;
				while(  _x-- > 0 ){
					_c = _x + '_' + _y;
					if( coords.get( _c ) ){
						if( !coords.get( _c ).get( 'belong') ){
							_step.push( _c );
						} else if( coords.get( _c ).get( 'belong').get( 'belong') != type ) {
							_eat.push( _c );
							break;
						} else {
							break;
						}
					} else {
						break;
					}
				}

				_x = x;
				_y = y;
				while(  _x++ < 8 ){
					_c = _x + '_' + _y;
					if( coords.get( _c ) ){
						if( !coords.get( _c ).get( 'belong') ){
							_step.push( _c );
						} else if( coords.get( _c ).get( 'belong').get( 'belong') != type ) {
							_eat.push( _c );
							break;
						} else {
							break;
						}
					} else {
						break;
					}
				}

				return [ _step, _eat ];
			}
		},
		'ma': {
			pos: ['1_0', '7_0'],
			text: '马',
			key: 'ma',
			path: function( pos, type ){
				var x = pos.split('_')[0]-0,
					y = pos.split('_')[1]-0,
					_c,
					_x,
					_y,
					_step = [],
					_eat = [];
				var part = [
					[(x+2) + '_' + (y+1), (x+1) + '_' + (y)],
					[(x+1) + '_' + (y+2), (x) + '_' + (y+1)],
					[(x-1) + '_' + (y+2), (x) + '_' + (y+1)],
					[(x-2) + '_' + (y+1), (x-1) + '_' + (y)],
					[(x+2) + '_' + (y-1), (x+1) + '_' + (y)],
					[(x+1) + '_' + (y-2), (x) + '_' + (y-1)],
					[(x-1) + '_' + (y-2), (x) + '_' + (y-1)],
					[(x-2) + '_' + (y-1), (x-1) + '_' + (y)]
				];
				while( _c = part.pop() ){
					if( coords.get( _c[0] ) && !coords.get( _c[1] ).get( 'belong') ){
						if( !coords.get( _c[0] ).get( 'belong') ){
							_step.push( _c[0] );
						} else if( coords.get( _c[0] ).get( 'belong').get( 'belong') != type ) {
							_eat.push( _c[0] );
						}
					}
				}
				return [_step, _eat];
			}
		},
		'xiang': {
			pos: ['2_0', '6_0'],
			text: '相',
			key: 'ma',
			path: function( pos, type ){
				var x = pos.split('_')[0]-0,
					y = pos.split('_')[1]-0,
					_c,
					_x,
					_y,
					_step = [],
					_eat = [],
					part = [
					[(x+2) + '_' + (y+2), (x+1) + '_' + (y+1)],
					[(x+2) + '_' + (y-2), (x+1) + '_' + (y-1)],
					[(x-2) + '_' + (y+2), (x-1) + '_' + (y+1)],
					[(x-2) + '_' + (y-2), (x-1) + '_' + (y-1)]
				];
				while( _c = part.pop() ){
					if( coords.get( _c[0] ) && !coords.get( _c[1] ).get( 'belong')){
						if( !coords.get( _c[0] ).get( 'belong') ){
							_step.push( _c[0] );
						} else if( coords.get( _c[0] ).get( 'belong').get( 'belong') != type ) {
							_eat.push( _c[0] );
						}
					}
				}
				return [ _step, _eat ];
			}
		},
		'shi': {
			pos: ['3_0','5_0'],
			text: '士',
			key: 'shi',
			path: function( pos, type ){
				var x = pos.split('_')[0]-0,
					y = pos.split('_')[1]-0,
					_c,
					_x,
					_y,
					_step = [],
					_eat = [],
					part;
				var part = [
					(x+1) + '_' + (y+1),
					(x+1) + '_' + (y-1),
					(x-1) + '_' + (y+1),
					(x-1) + '_' + (y-1)
				];
				while( _c = part.pop() ){
					if( coords.get( _c ) && ( 3 <= _c[0] ) && ( _c[0] <= 5 ) ){
						if( (type == 'blue') && ( 0 <= _c[2] ) && ( _c[2] <= 2 ) ){
							if( !coords.get( _c ).get( 'belong') ){
								_step.push( _c );
							} else if( coords.get( _c ).get( 'belong').get( 'belong') != type ) {
								_eat.push( _c );
							}
						} else if (( 7 <= _c[2] ) && ( _c[2] <= 9 )){
							if( !coords.get( _c ).get( 'belong') ){
								_step.push( _c );
							} else if( coords.get( _c ).get( 'belong').get( 'belong') != type ) {
								_eat.push( _c );
							}
						}
					}
				}
				return [ _step, _eat ];
			}
		},
		'jiang': {
			pos: ['4_0'],
			text: '将',
			key: 'jiang',
			path: function( pos, type ){
				var x = pos.split('_')[0]-0,
					y = pos.split('_')[1]-0,
					_c,
					_x,
					_y,
					_step = [],
					_eat = [],
					part;
				var part = [
					(x) + '_' + (y+1),
					(x) + '_' + (y-1),
					(x+1) + '_' + (y),
					(x-1) + '_' + (y)
				];
				while( _c = part.pop() ){
					if( coords.get( _c ) && ( 3 <= _c[0] ) && ( _c[0] <= 5 ) ){
						if( (type == 'blue') && ( 0 <= _c[2] ) && ( _c[2] <= 2 ) ){
							if( !coords.get( _c ).get( 'belong') ){
								_step.push( _c );
							} else if( coords.get( _c ).get( 'belong').get( 'belong') != type ) {
								_eat.push( _c );
							}
						} else if (( 7 <= _c[2] ) && ( _c[2] <= 9 )){
							if( !coords.get( _c ).get( 'belong') ){
								_step.push( _c );
							} else if( coords.get( _c ).get( 'belong').get( 'belong') != type ) {
								_eat.push( _c );
							}
						}
					}
				}
				return [ _step, _eat ];
			}
		},
		'pao': {
			pos: ['1_2', '7_2'],
			text: '炮',
			key: 'pao',
			path: function( pos, type ){
				var x = pos.split('_')[0]-0,
					y = pos.split('_')[1]-0,
					_c,
					_x,
					_y,
					_step = [],
					_eat = [],
					_s = false;
				_x = x;
				_y = y;
				_s = false;
				_d = false;
				while(  _y++ < 9 ){
					_c = _x + '_' + _y;
					if( coords.get( _c ) ){
						if( !_s && !coords.get( _c ).get( 'belong') ){
							_step.push( _c );
						} else if( !_d && coords.get( _c ).get( 'belong') ){
							_s = true;
							_d = true;
						} else if ( _d && _s && coords.get( _c ).get( 'belong') && (coords.get( _c ).get( 'belong').get( 'belong') != type )){
							_eat.push( _c );
							break;
						} else {
							_s = true;
						}
					} else {
						break;
					}
				}
				_x = x;
				_y = y;
				_s = false;
				_d = false;
				while(  _y-- > 0 ){
					_c = _x + '_' + _y;
					if( coords.get( _c ) ){
						if( !_s && !coords.get( _c ).get( 'belong') ){
							_step.push( _c );
						} else if( !_d && coords.get( _c ).get( 'belong') ){
							_s = true;
							_d = true;
						} else if ( _d && _s && coords.get( _c ).get( 'belong') && (coords.get( _c ).get( 'belong').get( 'belong') != type )){
							_eat.push( _c );
							break;
						} else {
							_s = true;
						}
					} else {
						break;
					}
				}

				_x = x;
				_y = y;
				_s = false;
				_d = false;
				while(  _x-- > 0 ){
					_c = _x + '_' + _y;
					if( coords.get( _c ) ){
						if( !_s && !coords.get( _c ).get( 'belong') ){
							_step.push( _c );
						} else if( !_d && coords.get( _c ).get( 'belong') ){
							_s = true;
							_d = true;
						} else if ( _d && _s && coords.get( _c ).get( 'belong') && (coords.get( _c ).get( 'belong').get( 'belong') != type )){
							_eat.push( _c );
							break;
						} else {
							_s = true;
						}
					} else {
						break;
					}
				}

				_x = x;
				_y = y;
				_s = false;
				_d = false;
				while(  _x++ < 8 ){
					_c = _x + '_' + _y;
					if( coords.get( _c ) ){
						if( !_s && !coords.get( _c ).get( 'belong') ){
							_step.push( _c );
						} else if( !_d && coords.get( _c ).get( 'belong') ){
							_s = true;
							_d = true;
						} else if ( _d && _s && coords.get( _c ).get( 'belong') && (coords.get( _c ).get( 'belong').get( 'belong') != type )){
							_eat.push( _c );
							break;
						} else {
							_s = true;
						}
					} else {
						break;
					}
				}

				return [ _step, _eat ];
			}
		},
		'zhu': {
			pos: [ '0_3', '2_3', '4_3','6_3','8_3'],
			text: '卒',
			key: 'zhu',
			path: function( pos, type ){
				var x = pos.split('_')[0]-0,
					y = pos.split('_')[1]-0,
					_c,
					_x,
					_y,
					_step = [],
					_eat = [];
				
				if( type == 'blue' ){
					if( y < 5 ){
						part = [
							(x) + '_' + (y+1)
						];
					} else {
						part = [
							(x) + '_' + (y+1),
							(x+1) + '_' + (y),
							(x-1) + '_' + (y)
						];
					}
				} else {
					if( y < 5 ){
						part = [
							(x) + '_' + (y-1),
							(x+1) + '_' + (y),
							(x-1) + '_' + (y)
						];
					} else {
						part = [
							(x) + '_' + (y-1)
						];
					}
				}
				
				while( _c = part.pop() ){
					if( coords.get( _c ) ){
						if( !coords.get( _c ).get( 'belong') ){
							_step.push( _c );
						} else if( coords.get( _c ).get( 'belong').get( 'belong') != type ) {
							_eat.push( _c );
						}
					}
				}
				return [ _step, _eat ];
			}
		}
	};

	/*
	* Part 可走点，选中一个棋子后，计算哪些坐标点可走
	*/
	var Part = Backbone.Model.extend({});

	/*
	* PartEl 可走点视图
	*/
	var PartEl = Backbone.View.extend({
			
		render: function(){
			this.$el.addClass( 'part' );
			var coord = this.model.get('coord').get('coord');
			this.$el.css( {top: coord[1], left: coord[0]});
			return this;
		},
		
		events: {
			'click': 'walk'
		},

		initialize: function(){
			this.listenTo( this.model, 'remove', this.remove );
		},

		walk: function(){
			if( this.model.get('eat') ){
				var piece = this.model.get('coord').get('belong');
				function _over(){
					chess.trigger('over', piece);
				}
				setTimeout( _over, 600 );
				piece.die();
				this.model.get('coord').unset('belong');
			}
			this.model.get('referTo').walk( this.model.get( 'coord' ));
			parts.clear();
		}

	});

	/*
	* Parts 可走点集合
	*/
	var Parts = Backbone.Collection.extend({

		clear: function(){
			while( this.length ){
				this.pop();
			}
		}
	})
	
	var parts = new Parts;
	/*
	* piece 棋子
	*/
	var Piece = Backbone.Model.extend({
		
		//据该子规则计算出可走路径及可吃子
		path: function(){
			var pos = this.get('coord').get('id');
			var _path = this.get( 'path' );

			
			var ret = _path( pos, this.get('belong') ),
				_part;
			while( _part = ret[0].shift() ){
				var model = new Part({
					pos: _part,
					coord: coords.get( _part ),
					referTo: this
				});
				parts.add( model );
				var view = new PartEl({ model: model });
				chess.$el.append( view.render().el );
			}
			while( ret[1] && (_part = ret[1].shift()) ){
				var model = new Part({
					pos: _part,
					eat: true,
					coord: coords.get( _part ),
					referTo: this
				});
				parts.add( model );
				var view = new PartEl({ model: model });
				chess.$el.append( view.render().el );
			}
			
		},

		die: function(){
			this.unset('coord');
			this.set( 'die', true );
			this.trigger('die');
		},

		reset: function(){
			this.unset('coord');
		},

		//走子，修改棋子坐标到新指定点，并调用修改玩家状态
		walk: function( coord ){
			_getPath( coord, this );
			this.get('coord').unset('belong');
			coord.set( 'belong', this );
			this.set( {coord: coord });
			this.collection.lastActive = this;
			chess.turn( this.get( 'belong' ));
		},
		
		_walk: function( coord ){
			if( coord.get( 'belong' )){
				coord.get( 'belong' ).die();;
			}
			this.get('coord').unset('belong');
			coord.set( 'belong', this );
			this.set( {coord: coord });
			this.collection.lastActive = this;
			chess.turn( this.get( 'belong' ));
			chess._enable = true;
		},
		
		back: function(){
			parts.clear();
			var coord = this._previousAttributes.coord;
			this.get('coord').unset('belong');
			coord.set( 'belong', this );
			this.set( {coord: coord, pos: coord.id });
			this.collection.lastActive = this.get('belong');
		},

		init: function(){
			this.set('coord', coords.get( this.get('pos')));
			coords.get( this.get('pos')).set( 'belong', this );
			this.trigger('init');
		}
	});

	/*
	* PieceEl 棋子视图
	*/
	var PieceEl = Backbone.View.extend({
		
		template: _.template('<div class="pieceIn"><%- text %></div>'),

		render: function( xy ){
			var coord = coords.get(this.model.get('pos')).get('coord');
			var num = ( this.model.collection.length - 1 ) % 16;
			this.$el.addClass( 'piece' ).addClass( this.model.get( 'belong' )).html(this.template( this.model.toJSON()));
			this.$el.css({
				top: xy[1] + ( 30 * ( Math.floor( num / 4 )) * 1.1 ), 
				left: xy[0] + ( 30 * ( num % 4) * 1.1 ),
				'transition-duration': '.5s'
			});
			return this;
		},

		initialize: function(){
			this.listenTo( this.model, 'change', this.walk );
			this.listenTo( this.model, 'die', this.die );
			this.listenTo( this.model, 'init', this.init );
		},

		events: {
			'click': 'getPath'
		},

		die: function(){
			var x = 615,
				y = ( this.model.get( 'belong' ) == 'blue' ) ? 125 : 345,
				num = this.model.collection.where({die: true, belong: this.model.get( 'belong' )}).length - 1;
			this.$el.css({
				top: y + ( 30 * ( Math.floor( num / 4 )) * 1.1 ), 
				left: x + ( 30 * ( num % 4) * 1.1 )
			});
			return this;
		},

		walk: function(){
			try{
				var coord = this.model.get('coord').get('coord');
			} catch(e){
				return;
			}
			this.$el.css( {top: coord[1], left: coord[0]});
			this.$el.removeClass('current');
			delete this.model.collection.lastChoose;
			(chess._enable === true) && (chess._enable = false);
		},

		init: function( ){
			var coord = coords.get(this.model.get('pos')).get('coord');
			this.$el.css({
				top: coord[1], 
				left: coord[0]
			});
		},

		getPath: function(){
			if( !chess._enable ){
				return;
			} 
			chess._enable = true;
			var lastActive = this.model.collection.lastActive;
			if( typeof lastActive == 'string' ){
				if( this.model.get('belong') !== lastActive ){
					return;
				}
			} else 	if( lastActive && lastActive.get('belong') === this.model.get('belong') ){
				return;
			}
			this.model.collection.lastChoose && this.model.collection.lastChoose.removeClass('current');
			this.$el.addClass( 'current' );
			this.model.collection.lastChoose = this.$el;
			parts.clear();
			this.model.path();
		}

	});

	/*
	* pieces 玩家
	*/
	
	var Pieces = Backbone.Collection.extend({
		
		model: Piece,

		restart: function(){
			this.forEach(function(v){
				v.reset();
			})
			delete this.lastActive;
		}

	});

	var pieces = window.pieces = new Pieces;

	/*
	* coord 棋盘单个点
	*/
	var Coord = Backbone.Model.extend({

	});

	/*
	* coords 棋盘点集合
	*/
	var Coords = Backbone.Collection.extend({
	
		model: Coord,

		restart: function(){
			this.forEach(function(v){
				v.unset('belong');
			});		
		}

	});

	var coords = window.coords = new Coords;

	/*
	* Chess 棋盘
	*/
	var Chess = Backbone.View.extend({

		_enable: 1,

		el: '#container',

		events: {
			'click #start': '_start',
			'click #restart': '_restart',
			'click #back': 'back'
		},

		back: function(){
			pieces.lastActive && pieces.lastActive.back();
		},

		_start: function(){
			this.isStart = true;
			if( this._isStart ){
				prompt.html('比赛正式开始');
				chess.start();
				_buttonAble( true );
			} else {
				prompt.html('等待对方开始');
			}
			sio.emit('isstart', {roomId: roomId});
		},

		_restart: function(){
			sio.emit('isrestart', {roomId: roomId});
		},
		
		start: function(){
			this.reset();
			pieces.forEach( function( model ){
				model.init();
			})
		},

		rebox: function(){

		},

		init: function(){
			this.reset();
			var me = this;

			//据 RULE 生成双方棋子
			function render( toggle ){
				for( var key in RULE ){
					var value = RULE[key],
						_value;
					for( var i = 0, c; c = value.pos[i]; i++ ){
						_value = _.clone( value );
						if( toggle ){
							_value.pos = c.replace( /^(.{2})(\d)$/,function($1,$2,$3){return $2+ (9 - c.slice(-1))});
							_value.belong = 'red';
							_value.text = (_value.key == 'zhu') ? '兵' :  (_value.key == 'jiang') ? '帅' : _value.text;
						} else {
							_value.pos = c;
							_value.belong = 'blue';
						}
						var model = new Piece( _value );
						pieces.add( model );
						var view = new PieceEl( { model: model });
						me.$el.append( view.render( toggle ? [615, 345] : [615, 125] ).el );
					}
				}
			}
			render();
			render( true )
		},

		reset: function(){
			coords.restart();
			pieces.restart();
			parts.clear();
			this.turn( true );
			this._enable = 1;
		},
		
		defaults: {
			width: 600,
			cls: 'chess'
		},

		initialize: function(){
			this.createCanvas();
			this.createCoords();
			this.createLine();
			this.init();
		},

		createCanvas: function(){
			this.canvas = $('<canvas>').attr({ 'width': this.defaults.width - 86, 'height': this.defaults.width - 26 }).addClass( this.defaults.cls );
			this.cxt = this.canvas[0].getContext('2d');
			this.$el.append( this.canvas );
		},
		
		//创建棋盘所有坐标点
		createCoords: function(){
			var me = this,
				_lit = this.defaults.width / 10,
				y = 0,
				_coord;
			function _create( y ){
				var x = 0;
				while( x < 9 ){
					coords.add({
						id    : x + '_' + y,
						x     : x,
						y     : y,
						coord : [ x * _lit + 20, y * _lit + 20 ]
					});
					x++;
				}
			}
			while( y < 10  ){
				_create( y++ );
				
			}
		},
		
		//据点画棋盘线
		createLine: function(){
			var _lit = this.defaults.width / 10;
			this.cxt.fillStyle = '#f3c89c';
			this.cxt.fillRect( 10, 10, _lit * 8 + 20, _lit* 9 + 20 );
			for( var i = 0; i < 10; i++ ){
				this.line( 8 * _lit + 20, 0 * _lit + 20, i * _lit + 20, i * _lit + 20 );
				if( i < 9 ){
					this.line( i * _lit + 20, i * _lit + 20,  9 * _lit + 20, 20 );
				}
				if( i > 0 && i < 8 ){
					this.line( i * _lit + 20, i * _lit + 20,  5 * _lit + 20, 4 * _lit + 20, '#f3c89c' );
				}
			}
			this.line( 5 * _lit + 20, 3 * _lit + 20,  2 * _lit + 20, 0 * _lit + 20  );
			this.line( 5 * _lit + 20, 3 * _lit + 20,  0 * _lit + 20, 2 * _lit + 20  );
			this.line( 5 * _lit + 20, 3 * _lit + 20,  9 * _lit + 20, 7 * _lit + 20  );
			this.line( 5 * _lit + 20, 3 * _lit + 20,  7 * _lit + 20, 9 * _lit + 20  );
			this.cxt.lineWidth = 8;
			this.cxt.strokeRect(10, 10, _lit * 8 + 20, _lit* 9 + 20 );
			this.text();
		},

		line: function( x, x1, y, y1, color ){
			var cxt = this.cxt;
			color =  color || '#6b3d28';
			cxt.lineWidth=2;
			cxt.strokeStyle = color;
			cxt.beginPath();
			cxt.moveTo( x1, y1 );	
			cxt.lineTo( x, y);	
			cxt.stroke();
		},

		text: function(){
			this.strokeStyle = '#f00';
			this.cxt.lineWidth = 1;
			this.cxt.font = 'normal 30px 隶书';
			this.cxt.strokeText('楚  河', 50, 300 );
			this.cxt.strokeText('汉  界', 380, 300 );
		},

		turn: function( type ){
			var _lit = this.defaults.width / 10;
			this.cxt.lineWidth = 8;
			this.cxt.beginPath();
			this.cxt.strokeStyle = '#6b3d28';
			this.cxt.strokeRect(10, 10, _lit * 8 + 20, _lit* 9 + 20 );
			this.cxt.beginPath();
			if( typeof type == 'string' ){
				if( type === 'blue' ){
					this.cxt.beginPath();
					this.cxt.strokeStyle = '#f00';
					this.cxt.moveTo( 10, this.defaults.width / 10 * 9 + 30 );
					this.cxt.lineTo( this.defaults.width / 10 * 8 + 20 , this.defaults.width / 10 * 9 + 30 );
					this.cxt.stroke();
				} else {
					this.cxt.beginPath();
					this.cxt.strokeStyle = '#00f';
					this.cxt.moveTo( 10, 10 );
					this.cxt.lineTo( this.defaults.width / 10 * 8 + 20 , 10 );
					this.cxt.stroke();
				}
			}
		}
	});

	var chess = window.chess = new Chess;

	

	//监听游戏结束
	chess.on( 'over', function( piece ){
		if( piece.get('key') == 'jiang' ){
			sio.emit('iswin', {roomId: roomId, player: piece.get('belong')});
			_buttonAble( false );
			prompt.html( (piece.get('belong') == 'blue' ? '红方' : '蓝方') + '获胜!' );
			alert( (piece.get('belong') == 'blue' ? '红方' : '蓝方') + '获胜!' );
		}
	});

	/*
	* 常用方法提取
	*/
	function _buttonAble( able ){
		if( able ){
			chess._isStart = false;
			chess.isStart = false;
			$('#start').attr('disabled', true).html('已开始').addClass('disable');
		} else {
			$('#start').removeClass('disable').html('开始')[0].removeAttribute('disabled');
		}
	}
	

	/*
	* 连接管理
	*/
	var roomId,
		prompt = $('#prompt');
	if( !/\/\/.*\/(.+)/.exec( href )){
		roomId = Math.floor( Math.random()*100);
		window.location.href = href + '' + roomId;
		return;
	} else {
		roomId = /\/\/.*\/(.+)/.exec( href )[1]
	}
	var sio = root.sio = io.connect( "/" );
	
	//连接服务，加入房间
	sio.on('connect', function( socket ){
		sio.emit('join', {roomId: roomId});
	});
	sio.on('leave', function( socket ){
		prompt.html('对方已离开');
		alert('对方已离开！');
	});
	//玩家一个
	sio.on('oneplayer', function(data){
		prompt.html('暂无其他玩家，将本页面网址发给朋友打开，即可进行游戏连接');
	});

	//玩家两个
	sio.on('twoplayer', function( data ){
		prompt.html('对方已进入，可以开始游戏');
		_buttonAble( false );
	});

	//一方开启
	sio.on('start', function( data ){
		if( chess.isStart ){
			prompt.html('比赛正式开始！');
			chess.start();
			_buttonAble( true );
		} else {
			prompt.html('对方已开始游戏，请点击开始');
			chess._isStart = true;
		}
	});

	sio.on('win', function( data ){
		prompt.html( (data.player == 'blue' ? '红方' : '蓝方') + '获胜!' );
		alert( (data.player == 'blue' ? '红方' : '蓝方') + '获胜!' );
		_buttonAble( false );
	});

	
	sio.on('msg', function( data ){
		prompt.html( data.msg );
	});

	sio.on('setPath', function( data ){
		var coord = coords.get( data.coord );
		var piece = pieces.get( data.piece );
		piece._walk( coord );
	});

	function _getPath( coord, piece ){
		var data = {coord: coord.cid, piece: piece.cid, roomId: roomId};
		sio.emit( 'getPath',  data);
	}

	/*
	* 聊天功能
	*/
	$('.msgbox ._input').on( 'keyup', function( event ){
		if( event.keyCode == 13 ){
			$('.msgbox ._panel').append($('<li>').html( 'me:' + this.value ));
			sio.emit('ischat', { chat: this.value, roomId: roomId } );
			this.value = '';
		}
	});

	sio.on( 'chat', function( data ){
		$('.msgbox ._panel').append($('<li>').html( 'he:' + data.chat ));
	});
	

}( window );