var scene,
	renderer,
	camera;

var BODY       = $( 'body' ),
	WIDTH      = window.innerWidth,
	HEIGHT     = window.innerHeight;

//Scene
var camera, scene, renderer, objects;
var particleLight, pointLight;
var dae, skin;

//Camera
var contorls;

var mesh,
	sphere,
	lightMesh,
	r = 0;

var directionalLight,
	pointLight;

var light;

var foes = [];

init();

var sio = io.connect('/');

sio.on( 'toMoveM', function( data ){
		
	console.log( data );//tankOther( data );

	if( data.beta > 10 && mesh ){
		mesh.moveBackward = false;
		mesh.moveForward = true;
	} else if( data.beta < -10 && mesh)  {
		mesh.moveBackward = true;
		mesh.moveForward = false;
	}

	if( data.gamma > 10 && mesh ){
		mesh.turnRight = true;
		mesh.turnLeft = false;
	} else if( data.gamma < -10 && mesh ){
		mesh.turnRight = false;
		mesh.turnLeft = true;
	}

} );
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

	// LIGHTS

	var ambient = new THREE.AmbientLight( 0x111111 );
	scene.add( ambient );

	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 1, 1, 2 ).normalize();
	scene.add( directionalLight );

	

	directionalLight.castShadow = true;
	directionalLight.shadowMapWidth = 2048 ;
	directionalLight.shadowMapHeight = 2048 ;

	scene.add( pointLight );

	// light representation

	lightMesh = new THREE.Mesh( new THREE.SphereGeometry( 100, 16, 8, 1 ), new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) );
	lightMesh.scale.set( 0.05, 0.05, 0.05 );
	lightMesh.position = directionalLight.position;
	//scene.add( lightMesh );

	/*
	* light
	*/
	
	/*
	* camera
	*/
	camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 1, 15000 );
	camera.position = { x: 0, y: 5000, z: 1000 };
	camera.lookAt( { x: 0, y: 50, z: 0 } );
	scene.add( camera );
	camera.lookAt( scene.position );

	earth = new THREE.Mesh(
		new THREE.CubeGeometry( 10000, 10, 20000 ),               //接受物体点线面的信息   SphereGeometry【球体】, CubeGeometry【方体】 
		new THREE.MeshLambertMaterial( {color: 0xff0000})  //接受物体材质，包括颜色，透明度，反光率信息
	 );

	 earth.position.y = -60;

	 //earth.castShadow = true;
	 earth.receiveShadow = true;

	 scene.add( earth );

	mesh = new THREE.Mesh(
		new THREE.CubeGeometry( 100, 150, 200 ),               //接受物体点线面的信息   SphereGeometry【球体】, CubeGeometry【方体】 
		new THREE.MeshLambertMaterial( {color: 0xff0000})  //接受物体材质，包括颜色，透明度，反光率信息
	 );

	mesh.castShadow = true;
	mesh.receiveShadow = true;

	 mesh.wrap1= new THREE.Mesh(
		new THREE.CubeGeometry( 50, 100, 50 ),               //接受物体点线面的信息   SphereGeometry【球体】, CubeGeometry【方体】 
		new THREE.MeshLambertMaterial( {color: 0x0000ff})  //接受物体材质，包括颜色，透明度，反光率信息
	 );

	 mesh.wrap2= new THREE.Mesh(
		new THREE.CubeGeometry( 50, 100, 50 ),               //接受物体点线面的信息   SphereGeometry【球体】, CubeGeometry【方体】 
		new THREE.MeshLambertMaterial( {color: 0x0000ff})  //接受物体材质，包括颜色，透明度，反光率信息
	 );

	 mesh.wrap3= new THREE.Mesh(
		new THREE.CubeGeometry( 50, 100, 50 ),               //接受物体点线面的信息   SphereGeometry【球体】, CubeGeometry【方体】 
		new THREE.MeshLambertMaterial( {color: 0x0000ff})  //接受物体材质，包括颜色，透明度，反光率信息
	 );

	 mesh.wrap4= new THREE.Mesh(
		new THREE.CubeGeometry( 50, 100, 50 ),               //接受物体点线面的信息   SphereGeometry【球体】, CubeGeometry【方体】 
		new THREE.MeshLambertMaterial( {color: 0x0000ff})  //接受物体材质，包括颜色，透明度，反光率信息
	 );

	 mesh.wrap5= new THREE.Mesh(
		new THREE.CubeGeometry( 50, 100, 50 ),               //接受物体点线面的信息   SphereGeometry【球体】, CubeGeometry【方体】 
		new THREE.MeshLambertMaterial( {color: 0x0000ff})  //接受物体材质，包括颜色，透明度，反光率信息
	 );

	 mesh.wrap6= new THREE.Mesh(
		new THREE.CubeGeometry( 50, 100, 50 ),               //接受物体点线面的信息   SphereGeometry【球体】, CubeGeometry【方体】 
		new THREE.MeshLambertMaterial( {color: 0x0000ff})  //接受物体材质，包括颜色，透明度，反光率信息
	 );

	 mesh.wrap = new THREE.Object3D();
	
	mesh.wrap.add( mesh.wrap1 );
	mesh.wrap.add( mesh.wrap2 );
	mesh.wrap.add( mesh.wrap3 );
	mesh.wrap.add( mesh.wrap4 );

	mesh.wrap.add( mesh.wrap5 );
	mesh.wrap.add( mesh.wrap6 );
	
	scene.add( mesh );

	scene.add( mesh.wrap );
	move();
	createFOE();
	
	window.addEventListener( 'resize', onWindowResize, false );
	
};

animate();

function move(){

	var el = mesh;
	$( 'body' ).on( 'keydown', function( event ){
		
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
		
		}

	} );

	$( 'body' ).on( 'keyup', function( event ){
		
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

}

function createFOE(){

	var el = new THREE.Mesh(
		new THREE.CubeGeometry( 200, 100, 100 ),              
		new THREE.MeshLambertMaterial( { ambient: 0x030303, color: 0x030303, specular: 0x990000, shininess: 30 })
	);
	el.position.set( 300, 0, -300 );
	scene.add( el );
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( el ) );
	el.castShadow = true;
	el.receiveShadow = true;

	var el = new THREE.Mesh(
		new THREE.CubeGeometry( 200, 100, 100 ),              
		new THREE.MeshLambertMaterial( { ambient: 0x030303, color: 0x030303, specular: 0x990000, shininess: 30 })
	);
	el.position.set( -300, 0, -300 );
	el.castShadow = true;
	el.receiveShadow = true;
	scene.add( el );
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( el ) );

}

function action(){
		
	var el = mesh;
	if( el.turnLeft ){
		el.rotation.y += 0.02;
	}
	if( el.turnRight ){
		el.rotation.y -= 0.02;
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
	
	mesh.wrap1.position = { 
		x: mesh.position.x - Math.sin( Math.asin( 3 / 5 ) + mesh.rotation.y ) * 100, 
		y: mesh.position.y, 
		z: mesh.position.z - Math.cos( Math.asin( 3 / 5 ) + mesh.rotation.y ) * 100 }

	mesh.wrap2.position = { 
		x: mesh.position.x + Math.sin( Math.asin( 3 / 5 ) - mesh.rotation.y ) * 100, 
		y: mesh.position.y, 
		z: mesh.position.z - Math.cos( Math.asin( 3 / 5 ) - mesh.rotation.y ) * 100 }

	mesh.wrap3.position = { 
		x: mesh.position.x + Math.sin( Math.asin( 3 / 5 ) + mesh.rotation.y ) * 100, 
		y: mesh.position.y, 
		z: mesh.position.z + Math.cos( Math.asin( 3 / 5 ) + mesh.rotation.y ) * 100 }

	mesh.wrap4.position = { 
		x: mesh.position.x - Math.sin( Math.asin( 3 / 5 ) - mesh.rotation.y ) * 100, 
		y: mesh.position.y, 
		z: mesh.position.z + Math.cos( Math.asin( 3 / 5 ) - mesh.rotation.y ) * 100 }

	mesh.wrap5.position = { 
		x: mesh.position.x - Math.sin( Math.asin( 0 / 5 ) - mesh.rotation.y ) * 100, 
		y: mesh.position.y, 
		z: mesh.position.z + Math.cos( Math.asin( 0 / 5 ) - mesh.rotation.y ) * 100 }

	mesh.wrap6.position = { 
		x: mesh.position.x - Math.sin( Math.asin( 0 / 5 ) + mesh.rotation.y ) * 100, 
		y: mesh.position.y, 
		z: mesh.position.z - Math.cos( Math.asin( 0 / 5 ) + mesh.rotation.y ) * 100 }

	if ( pass( el, [0,0,0] ) === false ){
		if( el.moveForward ){
			el.position.z -= ( -_z );
			el.position.x -= ( -_x );
		};
		if( el.moveBackward ){
			el.position.z -= ( _z );
			el.position.x -= ( _x );
		}

	}
	
};

function pass( el, _v ){
	
	var i = 0;

	while( ++i < 5 ){

		var ray = new THREE.Ray( el[ 'wrap' + i ].position, new THREE.Vector3( _v[0], _v[1], _v[2] ) );

		var c = THREE.Collisions.rayCastNearest( ray );

		if ( c && c.distance == -1 ) {
			console.log( i )
			return false;

		}
	}
}

function animate() {

	requestAnimationFrame( animate );
	action();
	render();
}

function render() {
	
	//lightMesh.position.z = 10000 * Math.cos( r );
	//lightMesh.position.y = 10000 * Math.sin( r );

	//r += 0.01;

	renderer.render( scene, camera );
	
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}


