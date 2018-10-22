//https://www.flaticon.es/packs/military-20

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var container, stats, controls;
			var camera, scene, renderer, light;
			var myObj;
			var clock = new THREE.Clock();
			var scoreText;
var score;
var hasCollided;
var trees=[{x:0,z:0}];
var element;
var mrBall;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
//var tablero;
var helper;
//var select;
var selected=[];
var characters=[];
var tablero=[];
var field;
var charcounter=0;
var flagDrag=0;
var inicioDrag;
var finDrag;
var width, height;
var downClick;
var over=false;
var sword;
var hand;
var helper_q1, helper_q2;
function findtree(treeIt) {
    return (element.y==treeIt.y && element.x==treeIt.x);
}

function findclick(position) {
    return (position.x<=downClick.x && position.x+1>=downClick.x && position.z<=downClick.z && position.z+1>=downClick.z);
}

			var mixers = [];
			init();
			animate();

			function init() {

				container =  document.getElementById('GameContainer');//document.createElement( 'div' );
				
				
				
				//document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
				

				scene = new THREE.Scene();
				
				/*
				light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
				light.position.set( 0, 1, 0 );
				scene.add( light );
				*/
				addLight();
				// model
				/*
				var loader = new THREE.GLTFLoader();
				loader.load( 'src/army_soldier_83/scene.gltf', function ( gltf ) {

					myObj = gltf.scene;
					//gltf.scene.position.y=-10;

					scene.add( gltf.scene );

				}, undefined, function ( e ) {

					console.error( e );

				} );
*/
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.gammaOutput = true;
				container.appendChild( renderer.domElement );

				
				
				addWorld();
				addCharacter();
	camera.position.z = 140;
	camera.position.y = 20;
    camera.position.x = 100;
    camera.rotation.x = -Math.PI/5;
	window.addEventListener('resize', onWindowResize, false);//resize callback
    container.addEventListener( 'mousedown', onMouseDown, false );
    container.addEventListener( 'mousemove', onMouseMove, false );
	container.addEventListener( 'mouseup', onMouseUp, false );
	document.onkeydown = handleKeyDown;
				// stats
				stats = new Stats();
				container.clientWidth=window.innerWidth;
				container.clientHeight= window.innerHeight;	
				container.appendChild( stats.dom );
			
				
}
var canvas = document.getElementById('centralCanvas');		
		var centralCtx = canvas.getContext('2d');
function drawImagesToCanvas(src) {
	console.log(src);
  var img = new Image();
  
  img.onload = function () {
	  context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(img, 5, 5,20,30);
}
img.src = src;
  
}



function addLight(){
	var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .9)
	scene.add(hemisphereLight);
	sun = new THREE.DirectionalLight( 0xcdc1c5, 0.9);
	sun.position.set( 12,6,-7 );
	sun.castShadow = true;
	scene.add(sun);
	//Set up shadow properties for the sun light
	sun.shadow.mapSize.width = 256;
	sun.shadow.mapSize.height = 256;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 50 ;
}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );
    
	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( [world] );

	for ( var i = 0; i < intersects.length; i++ ) {
      /*  select.position.x=intersects[ 0 ].point.x;
            select.position.z=intersects[ 0 ].point.z;
            select.position.y=0.05;*/
        
        helper.position.x=intersects[ 0 ].point.x;
            helper.position.z=intersects[ 0 ].point.z;
            helper.position.y = 1;
         if(flagDrag==0){   
				if(tablero[Math.trunc(helper.position.x)][Math.trunc(helper.position.z)].character!=null){
					
					if(selected[0]!= null && selected[0].type==2 && tablero[Math.trunc(helper.position.x)][Math.trunc(helper.position.z)].character.type==2){
						helper.position.y = -1;
						helper=sword;
						helper.position.y = 1;
					}else{
						helper.position.y = -1;
						helper=hand;
						helper.position.y = 1;
						
					}
					
					if(!over){
						over=true;
						helper.rotation.x=Math.PI/2;
					}
						
					//helper.material.color.set( 0x0000FF );
				}else{
					helper.position.y = -1;
						helper=hand;
						helper.position.y = 1;
					if(over){
						over=false;
						helper.rotation.x=Math.PI;
					}
					//helper.material.color.set( 0xff0000);
				}
		 }else{
			 finDrag=tablero[Math.trunc(helper.position.x)][Math.trunc(helper.position.z)];
			 console.log("en drag-->"+finDrag.x);
			 
			 selectMult.position.x=field.x+0.5;
				selectMult.position.y=0.02;
				selectMult.position.z=field.z+0.5;
			 
			 if(inicioDrag.x>finDrag.x){
					
					width=inicioDrag.x-finDrag.x;
					selectMult.position.x=finDrag.x+(width/2);
			 }else{
					width=finDrag.x-inicioDrag.x;
				 selectMult.position.x=inicioDrag.x+(width/2);
				 
			 }
			 if(inicioDrag.z>finDrag.z){
				 height=inicioDrag.z-finDrag.z;
				 selectMult.position.z=finDrag.z+(height/2);
			 }else{
				 height=finDrag.z-inicioDrag.z;
				 selectMult.position.z=inicioDrag.z+(height/2);
			 }
			 selectMult.scale.set( width, height, 1 );
			 /* illustrate de real positions
			 helper_q1.position.z=selectMult.position.z;
			 helper_q1.position.x=selectMult.position.x;
			 
			 helper_q2.position.z=selectMult.position.z+selectMult.scale.y;
			 helper_q2.position.x=selectMult.position.x+selectMult.scale.x;
			 */
		 }
	}    
}

function onMouseDown( event ) {
		event.preventDefault();
            field=tablero[Math.trunc(helper.position.x)][Math.trunc(helper.position.z)];
            if(field.character!=null){
				if(selected[0]!=null){
					
					//selected.lifebar.position.y=-2;
					
					selected.forEach(function(element) {
					  element.lifebar.position.y=-2;
					});
					selected=[];
				}
                selected[0]=field.character;
				/* I don't need the select any more
				select.position.x=field.x+0.5;
				select.position.z=field.z+0.5;
				select.position.y=0.05;
				*/
				selected[0].lifebar.position.y=2;
				drawImagesToCanvas(selected.photo);
				
            }               
            else if(selected[0]!=null){
				
				selected.forEach(function(element) {
					  
					  if(element.moving){
						element.moving=false;
						element.path=[];
						element.moving=true;
					}else
						element.moving=true;
					
							element.directionX=field.x;
							element.directionZ=field.z; 
					findPath(element);
					element.path.shift();
												
								element.nextMv=element.path.shift();
						
					
					
					});
					
							
																						
               // selected=null
            } else{
				flagDrag=1;
				inicioDrag=field;
				//console.log("inicio drag-->"+inicioDrag.x);
				selectMult.position.x=field.x+0.5;
				selectMult.position.y=0.05;
				selectMult.position.z=field.z+0.5;
				selectMult.scale.set( 1,1 , 32 );
			}
}
function onMouseUp(event){
		
		if(flagDrag==1){
			selected=[];
			for(var i=(Math.trunc(selectMult.position.x)-Math.trunc(selectMult.scale.x/2));i<(Math.trunc(selectMult.position.x)-Math.trunc(selectMult.scale.x/2))+selectMult.scale.x;i++){
				for(var j=(Math.trunc(selectMult.position.z)-Math.trunc(selectMult.scale.y/2));j<(Math.trunc(selectMult.position.z)-Math.trunc(selectMult.scale.y/2))+selectMult.scale.y;j++){
					
					if(tablero[i][j].character!=null && tablero[i][j].character.type==2){						
						console.log("selected "+tablero[i][j].character.id);
						tablero[i][j].character.lifebar.position.y=2;
						selected.push(tablero[i][j].character);
					}	
				}
			}
			
			flagDrag=0;
			selectMult.position.x=-1;
			selectMult.position.z=-1;
			selectMult.position.y=-4;
			selectMult.scale.set( 1,1 , 32 );
		}
		
		
}

function findPath(thinker){
    thinker.path=[];
    var visited=[];
     for(var i=0;i<200;i++){
        visited[i]=[];
        for(var j=0;j<200;j++){
            if(i==0||i==199||j==0||j==199)
                visited[i][j]=1;
            else    
                visited[i][j]=0;
        }
    }
    var x,z;
    var dist,distTmp;
    var actual={x:thinker.x,z:thinker.z};
    var finded=false;
    thinker.path.push(actual);
    /*
    123
    8 4
    765
    */
    while(thinker.path.length>0 && !finded){
    dist=null;
        if(tablero[actual.x-1][actual.z-1].character==null && visited[actual.x-1][actual.z-1]==0 ){
            distTmp=distance(actual.x-1,actual.z-1,thinker.directionX,thinker.directionZ);
            if(dist==null || dist>distTmp){
                x=actual.x-1;
                z=actual.z-1;
                dist=distTmp;
            }
        }
        if(tablero[actual.x][actual.z-1].character==null && visited[actual.x][actual.z-1]==0 ){
            distTmp=distance(actual.x,actual.z-1,thinker.directionX,thinker.directionZ);
            if(dist==null || dist>distTmp){
                x=actual.x;
                z=actual.z-1;
                dist=distTmp;
            }
        }
        if(tablero[actual.x+1][actual.z-1].character==null && visited[actual.x+1][actual.z-1]==0 ){
            distTmp=distance(actual.x+1,actual.z-1,thinker.directionX,thinker.directionZ);
            if(dist==null || dist>distTmp){
                x=actual.x+1;
                z=actual.z-1;
                dist=distTmp;
            }
        }
    
    if(tablero[actual.x+1][actual.z].character==null && visited[actual.x+1][actual.z]==0 ){
        distTmp=distance(actual.x+1,actual.z,thinker.directionX,thinker.directionZ);
        if(dist==null || dist>distTmp){
                x=actual.x+1;
                z=actual.z;
                dist=distTmp;
            }
    }
    
        if(tablero[actual.x+1][actual.z+1].character==null && visited[actual.x+1][actual.z+1]==0 ){
            distTmp=distance(actual.x+1,actual.z+1,thinker.directionX,thinker.directionZ);
            if(dist==null || dist>distTmp){
                x=actual.x+1;
                z=actual.z+1;
                dist=distTmp;
            }
        }
        if(tablero[actual.x][actual.z+1].character==null && visited[actual.x][actual.z+1]==0 ){
            distTmp=distance(actual.x,actual.z+1,thinker.directionX,thinker.directionZ);
            if(dist==null || dist>distTmp){
                x=actual.x;
                z=actual.z+1;
                dist=distTmp;
            }
        }
        if(tablero[actual.x-1][actual.z+1].character==null && visited[actual.x-1][actual.z+1]==0 ){
            distTmp=distance(actual.x-1,actual.z+1,thinker.directionX,thinker.directionZ);
            if(dist==null || dist>distTmp){
                x=actual.x-1;
                z=actual.z+1;
                dist=distTmp;
            }
        }
    
    if(tablero[actual.x-1][actual.z].character==null && visited[actual.x-1][actual.z]==0 ){
        distTmp=distance(actual.x-1,actual.z,thinker.directionX,thinker.directionZ);
        if(dist==null || dist>distTmp){
                x=actual.x-1;
                z=actual.z;
                dist=distTmp;
            }
    }
    
    if(dist==null){
        thinker.path.pop();
        if(thinker.path.length==0){
            return;
        }else{
            actual=thinker.path[thinker.path.length-1];
        }
    }else{
        
        actual={x,z};
        thinker.path.push(actual);
	visited[actual.x][actual.z]=1;
        if(actual.x==thinker.directionX && actual.z==thinker.directionZ){
		return;	
	}
        
    }    
    
    }
}

function distance(x1,y1,x2,y2){
        
    var dist=Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
    return dist;
    
}

function handleKeyDown(keyEvent){
	
    if ( keyEvent.keyCode === 37) {//left
        camera.position.x = camera.position.x-1;		
	} else if ( keyEvent.keyCode === 39) {//right
        camera.position.x = camera.position.x+1;
	}else if ( keyEvent.keyCode === 38) {//up
		camera.position.z = camera.position.z-1;
	}else if ( keyEvent.keyCode === 40) {//down
		camera.position.z = camera.position.z+1;		
	}else if ( keyEvent.keyCode === 65) {//up
		camera.position.y = camera.position.y+1;
	}else if ( keyEvent.keyCode === 90) {//down
		camera.position.y = camera.position.y-1;		
	}
    
}
			

	var i=1;
function loadchar(x,y,z,src,dimentionx,dimentionz,clan,type,photo){

var loader = new THREE.GLTFLoader();
				
				loader.load( src, function ( gltf ) { //'src/army_soldier_83/scene.gltf'
									
					gltf.scene.scale.x=0.5;
					gltf.scene.scale.y=0.5;
					gltf.scene.scale.z=0.5;
					scene.add( gltf.scene );
					
					gltf.scene.position.x=x+(dimentionx*0.5);
					gltf.scene.position.z=z+(dimentionz*0.5);
					gltf.scene.position.y=y;
					
					/****life bar***/
					var geometry = new THREE.BoxGeometry( 0.6, 0.1, 0.1 );
					var material = new THREE.MeshBasicMaterial( {color:  0x00FF00} );
					var cube = new THREE.Mesh( geometry, material );
					cube.position.x=x+(dimentionx*0.5);
					cube.position.z=z+(dimentionz*0.5);
					cube.position.y=-2;
					scene.add( cube );
					
					
					var characterTmp=new Character(charcounter++,clan,type,x,z,gltf.scene,40,5,1,100,1,photo,cube);
					for(var i=0;i<dimentionx;i++){
						for(var j=0;j<dimentionz;j++){
							tablero[x+i][z+j].character=characterTmp;
						}
					}
					
					characters.push(characterTmp);//tablero[x][z].character);
					
				}, undefined, function ( e ) {

					console.error( e );

				} );
	
}

function addWorld(){
	
    
    for(var i=0;i<200;i++){
        tablero[i]=[];
        for(var j=0;j<200;j++){
            tablero[i][j]={x:i,z:j,zone:1,character:null};
        }
    }
     
    
	var worldGeometry = new THREE.PlaneGeometry( 200,200 , 32 );//new THREE.SphereGeometry( worldRadius, sides,tiers);
	var worldeMaterial = new THREE.MeshStandardMaterial( { color: 0x33ff33 ,shading:THREE.FlatShading} );
	
	world = new THREE.Mesh( worldGeometry, worldeMaterial );
	world.receiveShadow = true;
	world.castShadow=false;
    world.rotation.x=-Math.PI/2;
    
    world.position.x=100;
    world.position.z=100;
    //tablero=world.id;
	scene.add( world );
	
	var tree;
    var i=0;
    while(i<1600){
        
        element={x:Math.floor(Math.random() * 200) ,z:Math.floor(Math.random() * 200) ,type:1};
        //console.log(element.x+" "+element.z);
        if(tablero[element.x][element.z].zone==1 && tablero[element.x][element.z].character==null){
            tree=createTree();
            tree.position.x=element.x+0.5 ;
            tree.position.z=element.z+0.5  ;
           // tree.position.y= 0.25;    
            trees.push(tree);
            scene.add(tree); 
            tablero[element.x][element.z].character=new Character(charcounter++,0,1,element.x,element.z,tree,200,0,0,0,0);
													//{x:element.x,z:element.z,view:tree,moving:false,directionX:0,directionZ:0,path:[]};
            i++;
        }
       
        
    }
				/* illustrate de real positions
    			var geometry = new THREE.ConeGeometry( 0.4, 2,8,6);
				
				
				helper_q1 = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { color: 0xff0000,shading:THREE.FlatShading  } ) );
				helper_q1.rotation.x=-Math.PI;
				scene.add( helper_q1 );
				
				geometry = new THREE.ConeGeometry( 0.4, 2,8,6);
				
				
				helper_q2 = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { color: 0xff0000,shading:THREE.FlatShading  } ) );
				helper_q2.rotation.x=-Math.PI;
				scene.add( helper_q2 );
				*/
				/*
				var texture = new THREE.TextureLoader().load( 'icons/025-sword.png' );
				var geometry = new THREE.BoxBufferGeometry( 1, 1, 0.1 );
				var material = new THREE.MeshBasicMaterial( { map: texture } );
				helper = new THREE.Mesh( geometry, material );*/
				
				//var loader = new THREE.GLTFLoader();
				
				new THREE.GLTFLoader().load( 'src/characters/hand/scene.gltf', function ( gltf ) { 
									
					gltf.scene.scale.x=0.0015;
					gltf.scene.scale.y=0.0015;
					gltf.scene.scale.z=0.0015;
					scene.add( gltf.scene );
					hand=gltf.scene;
					hand.rotation.x=-Math.PI;
					helper=hand;
					
				}, undefined, function ( e ) {

					console.error( e );

				} );
				
				
				new THREE.GLTFLoader().load( 'src/characters/sword/scene.gltf', function ( gltf ) { 
									
					gltf.scene.scale.x=0.035;
					gltf.scene.scale.y=0.035;
					gltf.scene.scale.z=0.035;
					scene.add( gltf.scene );
					sword=gltf.scene;
					sword.rotation.x=-Math.PI;
					
					
				}, undefined, function ( e ) {

					console.error( e );

				} );
				
				
   // helper.rotation.x=-Math.PI;
			//	scene.add( helper );
    /*
    var selectedGeometry = new THREE.PlaneGeometry( 1,1 , 32 );//new THREE.SphereGeometry( worldRadius, sides,tiers);
	var selectedMaterial = new THREE.MeshStandardMaterial( { color: 0xfffafa ,shading:THREE.FlatShading}) ;
    select=  new THREE.Mesh( selectedGeometry, selectedMaterial );
	select.receiveShadow = false;
	select.castShadow=false;
    select.rotation.x=-Math.PI/2;
    
    select.position.x=100;
    select.position.z=100;
    select.position.y=-4;
    
	scene.add( select );  
    */
	
	
	var selectedMultGeometry = new THREE.PlaneGeometry( 1,1 , 32 );//new THREE.SphereGeometry( worldRadius, sides,tiers);
	var selectedMultMaterial = new THREE.MeshStandardMaterial( { color: 0xfffafa ,shading:THREE.FlatShading}) ;
    selectMult=  new THREE.Mesh( selectedMultGeometry, selectedMultMaterial );
	selectMult.receiveShadow = false;
	selectMult.castShadow=false;
    selectMult.rotation.x=-Math.PI/2;
    
    selectMult.position.x=100;
    selectMult.position.z=100;
    selectMult.position.y=-4;
    
	scene.add( selectMult ); 
    /*
    var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    var geometry;
    for(var i=0;i<=200;i++){
        geometry= new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3( 0, 0.05, i) );
geometry.vertices.push(new THREE.Vector3( 200, 0.05, i) );
    var line = new THREE.Line( geometry, material );
    scene.add( line );
    }
    
    for(var i=0;i<=200;i++){
        geometry= new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3( i, 0.05, 0) );
geometry.vertices.push(new THREE.Vector3( i, 0.05, 200) );
    var line = new THREE.Line( geometry, material );
    scene.add( line );
    }
     */                                                   
}

function createTree(){
	var sides=8;
	var tiers=6;
	var scalarMultiplier=(Math.random()*(0.25-0.1))+0.05;
	var midPointVector= new THREE.Vector3();
	var vertexVector= new THREE.Vector3();
	var treeGeometry = new THREE.ConeGeometry( 0.5, 1, sides, tiers);
	var treeMaterial = new THREE.MeshStandardMaterial( { color: 0x33ff33,shading:THREE.FlatShading  } );
	var offset;
	midPointVector=treeGeometry.vertices[0].clone();
	var currentTier=0;
	var vertexIndex;
	
	var treeTop = new THREE.Mesh( treeGeometry, treeMaterial );
	treeTop.castShadow=true;
	treeTop.receiveShadow=false;
	treeTop.position.y=0.9;
	treeTop.rotation.y=(Math.random()*(Math.PI));
	var treeTrunkGeometry = new THREE.CylinderGeometry( 0.1, 0.1,0.5);
	var trunkMaterial = new THREE.MeshStandardMaterial( { color: 0x886633,shading:THREE.FlatShading  } );
	var treeTrunk = new THREE.Mesh( treeTrunkGeometry, trunkMaterial );
	treeTrunk.position.y=0.25;
	var tree =new THREE.Object3D();
	tree.add(treeTrunk);
	tree.add(treeTop);
	return tree;
}

function addCharacter(){

    loadchar(40,0,80,'src/characters/army_soldier_02/scene.gltf',1,1,0,2,'images/soldier1.png');
    loadchar(41,0,80,'src/characters/army_soldier_03/scene.gltf',1,1,0,2,'images/soldier2.png');
    loadchar(42,0,80,'src/characters/army_soldier_07/scene.gltf',1,1,0,2,'images/soldier3.png');
    loadchar(43,0,80,'src/characters/army_soldier_15/scene.gltf',1,1,0,2,'images/soldier4.png');
    loadchar(44,0,80,'src/characters/army_soldier_22/scene.gltf',1,1,0,2,'images/soldier5.png');
    loadchar(45,0,80,'src/characters/army_soldier_29/scene.gltf',1,1,0,2,'images/soldier6.png');
    loadchar(46,0,80,'src/characters/army_soldier_30/scene.gltf',1,1,0,2,'images/soldier7.png');
    loadchar(47,0,80,'src/characters/army_soldier_33/scene.gltf',1,1,0,2,'images/soldier8.png');
    loadchar(48,0,80,'src/characters/army_soldier_54/scene.gltf',1,1,0,2,'images/soldier9.png');
    loadchar(49,0,80,'src/characters/army_soldier_56/scene.gltf',1,1,0,2,'images/soldier10.png');
    loadchar(50,0,80,'src/characters/army_soldier_73/scene.gltf',1,1,0,2,'images/soldier11.png');
    loadchar(51,0,80,'src/characters/army_soldier_80/scene.gltf',1,1,0,2,'images/soldier12.png');
    loadchar(52,0,80,'src/characters/army_soldier_83/scene.gltf',1,1,0,2,'images/soldier13.png');
    loadchar(53,0,80,'src/characters/army_soldier_85/scene.gltf',1,1,0,2,'images/soldier14.png');
    
	
	loadchar(40,0,50,'src/builds/town_house_01/scene.gltf',8,5,0,1,'images/soldier13.png');
    loadchar(50,0,50,'src/builds/town_house_02/scene.gltf',5,3,0,1,'images/soldier13.png');
	loadchar(60,0,50,'src/builds/town_house_03/scene.gltf',5,4,0,1,'images/soldier13.png');
	loadchar(70,0,50,'src/builds/town_house_09/scene.gltf',9,6,0,1,'images/soldier13.png');
	loadchar(80,0,50,'src/builds/town_house_10/scene.gltf',6,4,1,'images/soldier13.png');
}

	
			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
				container.clientWidth=window.innerWidth;
				container.clientHeight= window.innerHeight;	
			}

			function release(){
				if(selected[0]!=null){
					
					//selected.lifebar.position.y=-2;
					
					selected.forEach(function(element) {
					  element.lifebar.position.y=-2;
					});
					selected=[];
				}
					helper.position.y = -1;
						helper=hand;
						helper.position.y = 1;
						//select.position.y=-1;
						
			}

			function animate() {

				requestAnimationFrame( animate );
				if ( mixers.length > 0 ) {

					for ( var i = 0; i < mixers.length; i ++ ) {

						mixers[ i ].update( clock.getDelta() );

					}

				}
				renderer.render( scene, camera );
				update();
				stats.update();

			}
			function update(){

				for(var i=0;i<characters.length;i++){
					if(characters[i].moving){
						
						if(characters[i].getMove()){
						
							if(characters[i].path.length>0 || !characters[i].onWay){
								if(!characters[i].onWay){
									
									if(tablero[characters[i].nextMv.x][characters[i].nextMv.z].character!=null ){
										characters[i].path=[];
										findPath(characters[i]);
										if(characters[i].path==null || characters[i].path.length==0){
											characters[i].moving=false;
											continue;
										}
										characters[i].path.shift();
										characters[i].nextMv=characters[i].path.shift();
										
									}
									tablero[characters[i].nextMv.x][characters[i].nextMv.z].character=characters[i];
									v1 = new THREE.Vector3( 0,0,1);//characters[i].x, 0, characters[i].z );
									
										v2=new THREE.Vector3(( characters[i].nextMv.x-characters[i].x), 0,( characters[i].nextMv.z-characters[i].z) );
									
									var dot = v1.dot(v2);
									var lengthA = v1.length();
									var lengthB = v2.length();
									 
									// Now to find the angle
									var theta = Math.acos( dot / (lengthA * lengthB) );
									if(characters[i].nextMv.x<characters[i].x)
										theta=theta*-1;
									
									
									
									characters[i].onWay=true;		
									
									characters[i].view.rotation.y=theta;
									characters[i].rotation=theta;
									characters[i].zi=characters[i].z;
									characters[i].xi=characters[i].x;
									
									
								}else{
									
									if(characters[i].nextMv.x<characters[i].xi)
										characters[i].xi=characters[i].xi-0.25;
									else if(characters[i].nextMv.x>characters[i].xi)
										characters[i].xi=characters[i].xi+0.25;
										
									if(characters[i].nextMv.z<characters[i].zi)
										characters[i].zi=characters[i].zi-0.25;
									else if(characters[i].nextMv.z>characters[i].zi)
										characters[i].zi=characters[i].zi+0.25;
									
									characters[i].view.position.x=characters[i].xi+0.5;
									characters[i].view.position.z=characters[i].zi+0.5;
									
									
									
									characters[i].lifebar.position.x=characters[i].xi+0.5;
									characters[i].lifebar.position.z=characters[i].zi+0.5;
									
									/* i don't need the select any more
									if(selected!=null && selected.id==characters[i].id){
											select.position.x=characters[i].xi+0.5;
											select.position.z=characters[i].zi+0.5;
											select.position.y=0.05;
										}*/
									
									if(characters[i].nextMv.x==characters[i].xi && characters[i].nextMv.z==characters[i].zi){	
										tablero[characters[i].x][characters[i].z].character=null;//free space
										characters[i].view.rotation.z=0;
										characters[i].z=characters[i].nextMv.z;
										characters[i].x=characters[i].nextMv.x; 
										//characters[i].view.position.x=characters[i].x+0.5;
										//characters[i].view.position.z=characters[i].z+0.5;
										tablero[characters[i].x][characters[i].z].character=characters[i];//set in new position
										
										characters[i].onWay=false;
																		
										characters[i].nextMv=characters[i].path.shift();
																							
									}else{
										if(characters[i].glitch==0){
											characters[i].glitch=1;
											characters[i].view.rotation.y=characters[i].rotation+0.2;
											characters[i].view.rotation.z=0.2
										}else{
											characters[i].glitch=0;
											characters[i].view.rotation.y=characters[i].rotation-0.2;
											characters[i].view.rotation.z=-0.2
										}
									}
								}
							}else
								characters[i].moving=false;
						}
					}
					
				}

				
			}