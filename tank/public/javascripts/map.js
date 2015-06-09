
/**********************************************************************************************
* 创建地图
* creatMap: 草地地表
* create:
* addUser: add item to user
* findUser: find some user by condition
***********************************************************************************************/

!function( root ){

	/*
	* creatMap- 地表
	*/
	function creatMap( scene ){
	
		var mater = THREE.ImageUtils.loadTexture( '/images/grass.jpg' );
		mater.wrapS = THREE.RepeatWrapping;
		mater.wrapT = THREE.RepeatWrapping;
		mater.repeat.x = 200;
		mater.repeat.y = 200;

		var mesh = new THREE.Mesh(
			new THREE.CubeGeometry( 2, 200000, 200000 ),              
			new THREE.MeshLambertMaterial( { map: mater } ) 
		);
		
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		mesh.rotation.z = Math.PI * 2 / 4;

		scene.add( mesh );

	}
	
	/*
	* WALLS- 水泥墙
	*/
	var WALL = function( config ){
	
		this.initialize( config || {} );
	
	};

	_.extend( WALL.prototype, {
		
		model: Backbone.Model.extend( ),

		initialize: function( config ){
			
			this.create( config );

		},

		create: function( config ){
		
			this.el = new THREE.Mesh(
				new THREE.CubeGeometry( 300, 300, config.z || 300 ),              
				new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( '/images/wall.jpg' ) } ) 
			);
			this.el.castShadow = true;
			this.el.receiveShadow = true;
			var position = { x: 0, y: 150, z: 0 };
			this.el.position = position;
			scene.add( this.el );
			
			this.el.hard = true;
			THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( this.el ) );
			
		}

	} );
	
	var WALLS = function(){
	
		this.initialize();
	
	};

	_.extend( WALLS.prototype, {
	
		initialize: function(){
		
			var i = -10;
			while( i++ < 10 ){
				this.createWall( i );
			}
			
		},

		createWall: function( i ){
		
			var wall = new WALL();
			wall.el.position.z = i * 900;
		
		}

	} );


	/*
	* Battlefield- 双方总部
	*/
	var Battlefield = function(){
		
		this.initialize();

	};

	_.extend( Battlefield.prototype, {
	
		initialize: function(){
		
			var i = -10;
			while( i++ < 10 ){
				if( i % 4 ){
					this.createWall( i, 1 );
				}
			}

			var i = -10;
			while( i++ < 10 ){
				if( i % 4 ){
					this.createWall( i, -1 );
				}
			}
			
		},

		createWall: function( i, dir ){
		
			var wall = new WALL( { z: 800 } );
			wall.el.position.z = i * 830;
			wall.el.position.x = dir * 5000;
		
		}
	
	} );	

	/*
	* Flag- 双方总部旗帜
	*/
	root.clothGeometry = '';
	root.clothGeometry2 = '';
	root.sphere;
	var object, 
		arrow;

	var rotate = true;

	function Flag( scene ){
	
		// cloth material

		var clothTexture = THREE.ImageUtils.loadTexture( 'images/flag2.jpg' );
		clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
		clothTexture.anisotropy = 16;

		var clothMaterial = new THREE.MeshPhongMaterial( { alphaTest: 0.5, ambient: 0xffffff, color: 0xffffff, specular: 0x030303, emissive: 0x111111, shiness: 10, map: clothTexture, side: THREE.DoubleSide } );

		// cloth geometry
		clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h );
		clothGeometry.dynamic = true;
		clothGeometry.computeFaceNormals();


		// cloth mesh

		var object = new THREE.Mesh( clothGeometry, clothMaterial );
		object.position.set( 6800, 320, 0 );
		object.castShadow = true;
		object.receiveShadow = true;
		object.rotation.z = Math.PI / 2
		scene.add( object );

		// poles

		var poleGeo = new THREE.CubeGeometry( 5, 460, 5 );
		var poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shiness: 100 } );

		window.meshx = new THREE.Mesh( poleGeo, poleMat );
		meshx.position.set( 6680, 230, 0 );
		meshx.receiveShadow = true;
		meshx.castShadow = true;
		scene.add( meshx );

		// cloth material

		var clothTexture = THREE.ImageUtils.loadTexture( 'images/flag.jpg' );
		clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
		clothTexture.anisotropy = 16;

		var clothMaterial = new THREE.MeshPhongMaterial( { alphaTest: 0.5, ambient: 0xffffff, color: 0xffffff, specular: 0x030303, emissive: 0x111111, shiness: 10, map: clothTexture, side: THREE.DoubleSide } );

		// cloth geometry
		clothGeometry2 = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h );
		clothGeometry2.dynamic = true;
		clothGeometry2.computeFaceNormals();

		

		// cloth mesh

		object = new THREE.Mesh( clothGeometry2, clothMaterial );
		object.position.set( -6800, 320, 0 );
		object.castShadow = true;
		object.receiveShadow = true;
		object.rotation.z = Math.PI / 2
		scene.add( object );

		// poles

		var poleGeo = new THREE.CubeGeometry( 5, 460, 5 );
		var poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shiness: 100 } );

		window.meshx = new THREE.Mesh( poleGeo, poleMat );
		meshx.position.set( -6920, 230, 0 );
		meshx.receiveShadow = true;
		meshx.castShadow = true;
		scene.add( meshx );

		
		// sphere

		var ballGeo = new THREE.SphereGeometry( ballSize, 20, 20 );
		var ballMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

		sphere = new THREE.Mesh( ballGeo, ballMaterial );
		sphere.castShadow = true;
		sphere.receiveShadow = true;
		//scene.add( sphere );

		// arrow

		arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50, 0xff0000 );
		arrow.position.set( -200, 0, -200 );
	
	}

	/*
	* afterScene- threejs 的 scene 创建完成后，创建地图相关场景
	*/
	course.on( 'afterScene', function( scene ){
	
		creatMap( scene );

		new WALLS;

		new Battlefield();

		Flag( scene );

	});
	
	/*
	* render- threejs 执行render方法时调用
	*/
	course.on( 'render', function( scene ){

		var p = cloth.particles;

		for ( var i = 0, il = p.length; i < il; i ++ ) {

			clothGeometry.vertices[ i ].copy( p[ i ].position );

		}

		clothGeometry.computeFaceNormals();
		clothGeometry.computeVertexNormals();

		clothGeometry.normalsNeedUpdate = true;
		clothGeometry.verticesNeedUpdate = true;

		for ( var i = 0, il = p.length; i < il; i ++ ) {

			clothGeometry2.vertices[ i ].copy( p[ i ].position );

		}

		clothGeometry2.computeFaceNormals();
		clothGeometry2.computeVertexNormals();

		clothGeometry2.normalsNeedUpdate = true;
		clothGeometry2.verticesNeedUpdate = true;

		sphere.position.copy( ballPosition );

	});
	
	/*
	* render- threejs 执行animate方法时调用
	*/
	course.on( 'animate', function( scene ){
	
		var time = Date.now();

		windStrength = Math.cos( time / 7000 ) * 20 + 40;
		windForce.set( 1, 1, 1 ).normalize().multiplyScalar( windStrength );
		arrow.setLength( windStrength );
		arrow.setDirection( windForce );

		simulate(time);

	});
 
}( window );