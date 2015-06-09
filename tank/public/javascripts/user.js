
/**********************************************************************************************
* 创建玩家信息模型
* 
***********************************************************************************************/
!function( root ){

	root.User = Backbone.Model.extend( { 
		
		defaults: { life: 10 } 
		
	} );

	var Users = Backbone.Collection.extend( {

		model: User

	} );

	course.on( 'needUser' , function(){

		root.user = user = new User( { id: Math.floor( Math.random()*1000000000 ) } );

		root.users = new Users;

		course.trigger( 'afterUser' );

	} );

}( window );