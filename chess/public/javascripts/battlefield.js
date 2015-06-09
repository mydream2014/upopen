!function(){

    var Room = Backbone.Model.extend({
	
	});
	
	var RoomEl = Backbone.View.extend({
		
		template: ['<div class="_h"></div>',
				   '<div class="_v"><%- id%></div>'].join(''),

		render: function(){
			this.$el.addClass('room').html(_.template( this.template, this.model.toJSON()));
			return this;
		},

		events: {
			'click': 'knock'
		},

		knock: function(){
			window.location.href = window.location.href + 'room/' + this.model.id
		}

	});

	var Rooms = Backbone.Collection.extend({
		
		model: Room

	});

	var rooms = new Rooms;

	var Battlefield = Backbone.View.extend({
		
		el: '#container',

		initialize: function(){
			this.create();
		},

		create: function(){
			
			for( var i = 1; i < 25; i++ ){
				var model = new Room({
					id: i
				});
				rooms.add( model );
				var view = new RoomEl({ model: model });
				this.$el.append( view.render().el );
			}

		}
	});

	var battlefield = new Battlefield;

}( window )