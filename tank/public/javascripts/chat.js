
/**********************************************************************************************
* 创建对话功能
* creatMap:
***********************************************************************************************/
!function( root ){
	
	var Model = Backbone.Model.extend();

	var Collection = Backbone.Collection.extend( {
	
		model: Model
	
	} );

	var models = new Collection();

	var View = function( config ){
	
		this.initConfig = {};
		this.hidden = true;
		this.initialize();

	};

	_.extend( View.prototype, {
	
		defaults: {},

		initialize: function(){
		
			this.create();
			this.createMsg();
			this.handler();

		},

		create: function(){
			
			this.main = $( '<div>' ).addClass( 'chat hide' );
			this.el = $( '<input>' ).attr( { type: 'text' ,maxlength: 20 } );
			this.main.append( this.el );
			$( 'body' ).append( this.main );

		},

		createMsg: function(){
			
			this.msgUl = $( '<ul>' );
			this.msgBox = $( '<div>' ).addClass( 'msgBox' );
			this.msgBox.append( this.msgUl );
			$( 'body' ).append( this.msgBox );

		},

		handler: function(){
			
			var me = this;
			$( 'body' ).on( 'keyup', function( event ){
			
				switch ( event.keyCode ){
					case  13: 
						if( !me.hidden ){
							me.trigger( 'sendMsg', me.el.val() );
							me.el.val() && me.addMsg( user.get( 'name' ) + ': ' + me.el.val() );
							me.main.hide();
							me.hidden = true;
						} else if( event.ctrlKey ){
							me.el.val('');
							me.main.show();
							me.el[0].focus();
							me.hidden = false;
						};
						break;
				}
			
			} );

		},

		sendMsg: function(){
		
		},

		addMsg: function( msg ){
		
			this.msgUl.append( $( '<li>' ).html( msg ) );
			this.msgBox[0].scrollTop = 100000;
		
		}

	}, Backbone.Events );

	course.on( 'tankSelf', function(){
	
		root.chat = new View();

		chat.on( 'sendMsg', function( msg ){
		
			sio.emit( 'sendChat', { id: user.get( 'id' ), chat: msg });

		} );

		sio.on( 'toSendChat', function( data ){
		
			chat.addMsg( '系统 ' + users.get( data.id ).get( 'name' ) + ' ' + data.chat );

		} );

		course.trigger( 'afterChat' );
		course.afterChated = true;

	} );

}( window );