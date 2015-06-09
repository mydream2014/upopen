var scene,
	renderer,
	camera;

var BODY       = $( 'body' ),
	WIDTH      = window.innerWidth,
	HEIGHT     = window.innerHeight;

var cubes      = [];

var range      = 400, 
	speed      = 1, 
	sphereSize = 4;

var light,
	sun,
	light2,
	sun2,
	light3,
	sun3,
	sunR = 0;

var clock = new THREE.Clock();

var container, stats;

//Scene


//Camera
var contorls;

//Model
var model_meshes = [];
var tempPos;

//Jiggsaw
var jiggsaws = [];
var click_number = 0;

//Camera
var down = false;
var sx = 0, sy = 0;
var rotation = Math.PI/2;
var vertical_move = 100;

var pinsFormation = [];
var pins = [6];

pinsFormation.push( pins );

pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
pinsFormation.push( pins );

pins = [ 0 ];
pinsFormation.push( pins );

pins = []; // cut the rope ;)
pinsFormation.push( pins );

pins = [ 0, cloth.w ]; // classic 2 pins
pinsFormation.push( pins );

pins = pinsFormation[ 1 ];


function togglePins() {

	pins = pinsFormation[ ~~( Math.random() * pinsFormation.length ) ];

}

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();




/*
* socket
*/
var sio = io.connect('/');

/*
* 页面加载动画
*/
!function(){
	
	var i = 0,
		_settime;

	course.on( 'loading', function( progress ){
		if( progress.total == progress.loaded ){
			course.trigger( 'tankLoaded' );
			clearInterval( _settime );
			drop();
		} else {
			screw( Math.floor( progress.loaded / progress.total * 100 ) );
		}
		

	} );

	function screw( i ){
		$( '.progress' ).html( i );
		$( '.box' ).find( '.screw' ).removeClass( 'screw_rotate' );
		$( $( '.box' ).find( '.screw' )[ Math.floor( i / 25 ) ] ).addClass( 'screw_rotate' );
	}

	function drop(){
		$( '.box' ).find( '.screw' ).removeClass( 'screw_rotate' );
		$( '.box' ).addClass( 'swing' );
		setTimeout( function(){
			$( '.box' ).addClass( 'fadeOutDownBig' );
			setTimeout( function(){
				$( '.load' ).hide();
			}, 1000 );
			
		}, 1000 );
	}
}();

myio();
init();

/*
* myio- 与服务器通信事件定义
*/
function myio(){

	/*
	 * io
	 */
	sio.on( 'toknock', function( data ){
		
		tankOther( data );

	} );

	sio.on( 'toHavedUsers', function( data ){

		for( var _id in data ){
		
			tankOther( JSON.parse( data[ _id ] ) );
			
		}
		
	} );

	sio.on( 'toMoveM', function( data ){
		
		if( !user.get( 'el' ) || user.get( 'id' ) != data.cid ){
			return;
		}
		user.get( 'el' ).moveMobile( data.forward, data.turn );
	
	} );


	sio.on( 'toTankMove', function( data ){
		
		users.where( { id: data.id } )[0].get( 'el' ).move( JSON.parse( data.tank ), users.where( { id: data.id } )[0] );
	
	} );

	sio.on( 'toHit', function( data ){
		
		if( user.get( 'id' ) == data.id ){
			user.get( 'el' ).beHit( data );
		}

	} );

	sio.on( 'toHitMobile', function( data ){
		
		if( user.get( 'id' ) == data.id ){
			user.get( 'el' ).shot();
		}

	} );

	sio.on( 'toWin', function( data ){
		
		var _user = users.where( { id: data.id } )[0];
		if( _user ){
			_user.get( 'nameEl' ).html( _user.get( 'name' ) + ' 【' + data.score + '】' );
		}

	} );

	sio.on( 'toLeave', function( data ){
	
		users.remove( users.where( { id: data.id } ) );
		user.get( 'el' ).radarDel( data.id );
		chat.addMsg( '系统: ' + [ 'Counter Terrorists', 'Terrorists' ][ data.role - 1 ] + '方，' + data.name + ' 已离开！' );
	
	} );

	sio.on( 'toUserNum', function( data ){
	
		$( '#usernum' ).html( data.num );
	
	} );

};

/*
* chooseRole- 角色选择及命名
*/
function chooseRole(){

	var setPlane = $( '.plane' );

	course.trigger( 'needUser' );

	BODY.on( 'keyup', function( event ){
	
		switch ( event.keyCode ){
			case 49:
			case 97:
				if( !user.get( 'role' ) ){
					user.set( 'role', 1 );
					afterRoled();
				}
				break;
			case 50:
			case 98:
				if( !user.get( 'role' ) ){
					user.set( 'role', 2 );
					afterRoled();
				}
				break;
			case 13:
				if( !user.get( 'name' ) ){
					user.set( 'name', setPlane.find( '.username' ).val() || ( [ 'Counter Terrorists', 'Terrorists' ][ user.role ] + 
						users.where( { role: user.get( 'role' ) } ).length ) );
					afterNamed();
				}
				break;
		}

	});

	function afterRoled(){
	
		setPlane.addClass( 'animate_3d' );

		setTimeout( function(){
			setPlane.removeClass( 'animate_3d' );
		}, 500)

		setTimeout( function(){
			setPlane.find( '.role' ).hide();
			setPlane.find( '.setName' ).show();
		}, 250)
	
	}

	function afterNamed(){

		setPlane.hide( 200 );
		$( '.mask' ).hide( 200 );
		$( '#info' ).show( 200 );
		var nameEl = $( '<dd>' ).html( '&nbsp;&nbsp;' + user.get( 'name' ) );
		user.set( 'nameEl', nameEl )
		$( '#info' ).find( '#role_' + user.get( 'role' ) ).append( nameEl );
		
		tankSelf();

		sio.emit( 'knock', {
			name: user.get( 'name' ),
			id: user.get( 'id' ),
			role: user.get( 'role' )
		} );

		setTimeout( function(){
			$( '#guide' ).show( 500 );
			$( '#qrcode' ).qrcode( window.location.href + 'mobile:'  + user.get( 'id' ) );
			
			$( '#guide .gui_close' ).on( 'click', function(){
				$( '#guide' ).hide( 500 );
			} );
		}, 500)
	
	}

};

/*
* tankSelf- 创建自己的坦克
*/
function tankSelf(){

	var tank = new TANK( { role: user.get( 'role' ), current: true } );
	user.set( { role: user.get( 'role' ), current: true, name: user.get( 'name' ), nameEl: user.get( 'nameEl' ), el: tank } );
	tank.belongTo = user;
	user.on( 'remove', function( model ){
		scene.remove( model.get( 'el').el )
		model.get( 'nameEl' ).remove();
	})
	scene.add( tank.el );
	users.add( user );

	tank.on( 'move', function( tank ){

		sio.emit( 'tankMove', { tank: getInfo( tank ), id: tank.belongTo.get( 'id' ) } );
	
	});
	course.trigger( 'tankSelf' );

	function getInfo( tank ){
		
		var position = tank.el.position,
			rotation = tank.el.rotation;
		return '{ "position": "' + position.x + '_' + position.y + '_' + position.z
			   + '", "rotation": "' + rotation.x + '_' + rotation.y + '_' + rotation.z + '" }';

	}

};

/*
* tankOther- 创建其他玩家的坦克
*/
function tankOther( data ){

	var _user = new User( data );
	users.add( _user );
	
	var tank = new TANK( { role: data.role } ),
		nameEl;
	_user.set( { el: tank ,id: data.id } );
	_user.on( 'remove', function( model ){
		scene.remove( model.get( 'el').el )
		model.get( 'nameEl' ).remove();
	})
	scene.add( tank.el );
	
	$( '#info' ).find( '#role_' + data.role ).append( nameEl = $( '<dd>' ).html( '&nbsp;&nbsp;' + data.name ) );

	_user.set( { nameEl: nameEl } );
	chat.addMsg( '系统: ' + [ 'Counter Terrorists', 'Terrorists' ][ data.role - 1 ] + '方，' + data.name + ' 进入游戏 ' );
	user.get( 'el' ).setRadar();
	data.tank && tank.move( JSON.parse( data.tank ), _user );

};

/*
* tankLoaded- 坦克模型文件加载完成
*/
course.on( 'tankLoaded', function(){

	chooseRole();
	$( '.loading' ).fadeOut( 200 );

});

/*
* init- 画面初始化
*/
function init(){

	/*
	* scene
	*/
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xcce0ff, 1000, 20000 );

	/*
	* renderer
	*/
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( WIDTH, HEIGHT );
	renderer.setClearColor( scene.fog.color );
	BODY.append( renderer.domElement );
	renderer.shadowMapEnabled = true;

	/*
	* light
	*/
	scene.add( new THREE.AmbientLight( 0x111111 ) );
	light = new THREE.DirectionalLight( 0xffffff, 1.3 ); 
	light.position.set( 3000, 3000, 3000 );
	light.position.multiplyScalar( 1.3 );
	
	light.castShadow = true;
	light.shadowMapWidth = 2048 ;
	light.shadowMapHeight = 2048 ;
	var d = 8000;

	light.shadowCameraLeft = -d;
	light.shadowCameraRight = d;
	light.shadowCameraTop = d;
	light.shadowCameraBottom = -d;

	light.shadowCameraFar = 100000;
	light.shadowDarkness = 0.5;

	scene.add( light );

	light2 = new THREE.DirectionalLight( 0xffffff, 0.5 ); 
	light2.position.set( 5000, 3000, 3000 );
	light2.position.multiplyScalar( 1.3 );
	scene.add( light2 );

	light3 = new THREE.DirectionalLight( 0xffffff, 0.5 ); 
	light3.position.set( -5000, 3000, 3000 );
	light3.position.multiplyScalar( 1.3 );
	scene.add( light3 );

	sun = new THREE.Mesh( new THREE.SphereGeometry( 100, 16, 8, 1 ), new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) );
	sun.scale.set( 0.05, 0.05, 0.05 );
	sun.position = light.position;

	sun2 = new THREE.Mesh( new THREE.SphereGeometry( 100, 16, 8, 1 ), new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) );
	sun.scale.set( 0.05, 0.05, 0.05 );
	sun2.position = light2.position;

	sun3 = new THREE.Mesh( new THREE.SphereGeometry( 100, 16, 8, 1 ), new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) );
	sun.scale.set( 0.05, 0.05, 0.05 );
	sun3.position = light3.position;

	/*
	* camera
	*/
	camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 1, 15000 );
	camera.position = { x: 0, y: 3000, z: 0 };
	camera.lookAt( { x: 0, y: 50, z: 0 } );
	scene.add( camera );
	camera.lookAt( scene.position );

	course.trigger( 'afterScene', scene );

	animate();
	
	window.addEventListener( 'resize', onWindowResize, false );
	
};

/*
* animate
*/
function animate() {

	requestAnimationFrame( animate );
	course.trigger( 'animate' );
	render();

}

/*
* render
*/
function render() {
	
	/*
	sun.position.z = 10000 * Math.cos( sunR );
	sun.position.y = 10000 * Math.sin( sunR );

	sun2.position.z = 10000 * Math.cos( sunR );
	sun2.position.y = 10000 * Math.sin( sunR );

	sun2.position.z = 10000 * Math.cos( sunR );
	sun2.position.y = 10000 * Math.sin( sunR );
	sunR += 0.001;
	*/

	course.trigger( 'render', scene );
	renderer.render( scene, camera );

}

/*
* onWindowResize- 窗口大小变化时，画面渲染尺寸随之变化
*/
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}




