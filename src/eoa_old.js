var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var sun;
var ground;
var world;
var heroSphere;
var rollingSpeed=0.008;
var heroRollingSpeed;
var worldRadius=800;
var heroRadius=0.2;
var sphericalHelper;
var pathAngleValues;
var heroBaseY=1.8;
var bounceValue=0.1;
var gravity=0.005;
var leftLane=-1;
var rightLane=1;
var middleLane=0;
var currentLane;
var clock;
var jumping;
var treeReleaseInterval=0.5;
var lastTreeReleaseTime=0;
var treesInPath;
var treesPool;
var particleGeometry;
var particleCount=20;
var explosionPower =1.06;
var particles;
//var stats;
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
var select;
var selected;
var characters=[];
var tablero=[];
var field;
var charcounter=0;
var flagDrag=0;
var inicioDrag;
var finDrag;
var width, height;
function findtree(treeIt) {
    return (element.y==treeIt.y && element.x==treeIt.x);
}

function findclick(position) {
    return (position.x<=downClick.x && position.x+1>=downClick.x && position.z<=downClick.z && position.z+1>=downClick.z);
}
var downClick;
init();
var texture;

function init() {
   
	createScene();
    
	//call game loop
	update();
}

function createScene(){
	hasCollided=false;
	score=0;
	treesInPath=[];
	treesPool=[];
	clock=new THREE.Clock();
	clock.start();
	heroRollingSpeed=(rollingSpeed*worldRadius/heroRadius)/5;
	sphericalHelper = new THREE.Spherical();
	pathAngleValues=[1.52,1.57,1.62];
    sceneWidth=window.innerWidth;
    sceneHeight=window.innerHeight;
    scene = new THREE.Scene();//the 3d scene
    //scene.fog = new THREE.FogExp2( 0xf0fff0, 0.14 );
    camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
        
    renderer = new THREE.WebGLRenderer({antialias: true});//renderer with transparent backdrop
    renderer.setClearColor(0xfffafa, 1); 
    renderer.shadowMap.enabled = true;//enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize( window.innerWidth, window.innerHeight );
   // renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
			//	renderer.setSize( window.innerWidth, window.innerHeight );
    dom = document.getElementById('GameContainer');
	dom.appendChild(renderer.domElement);
    
    
    
	addWorld();
	addLight();
     addCharacter();
	camera.position.z = 140;
	camera.position.y = 20;
    camera.position.x = 100;
    camera.rotation.x = -Math.PI/5;
	window.addEventListener('resize', onWindowResize, false);//resize callback
    window.addEventListener( 'mousedown', onMouseDown, false );
    window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'mouseup', onMouseUp, false );
	document.onkeydown = handleKeyDown;
	  
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
					helper.material.color.set( 0x0000FF );
				}else{
					helper.material.color.set( 0xff0000);
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
		 }
	}    
}

function onMouseDown( event ) {
            field=tablero[Math.trunc(helper.position.x)][Math.trunc(helper.position.z)];
            if(field.character!=null){
                selected=field.character;
				select.position.x=field.x+0.5;
				select.position.z=field.z+0.5;
				select.position.y=0.05;
            }               
            else if(selected!=null){
				if(selected.moving){
					selected.moving=false;
					selected.path=[];
					selected.moving=true;
				}else
                    selected.moving=true;
				
                        selected.directionX=field.x;
                        selected.directionZ=field.z; 
                findPath(selected);
               // selected=null
            } else{
				flagDrag=1;
				inicioDrag=field;
				console.log("inicio drag-->"+inicioDrag.x);
				selectMult.position.x=field.x+0.5;
				selectMult.position.y=0.05;
				selectMult.position.z=field.z+0.5;
				selectMult.scale.set( 1,1 , 32 );
			}
}
function onMouseUp(event){
		
		if(flagDrag==1){
			console.log("Fin drag-->"+finDrag.x);
			flagDrag=0;
			selectMult.position.x=-1;
    selectMult.position.z=-1;
    selectMult.position.y=-4;
	selectMult.scale.set( 1,1 , 32 );
		}
		
		
}

function findPath(thinker){
    
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
    
    				var geometry = new THREE.ConeGeometry( 0.4, 2,8,6);
				
				
				helper = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { color: 0xff0000,shading:THREE.FlatShading  } ) );
    helper.rotation.x=-Math.PI;
				scene.add( helper );
    
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
    sphereGeometry = new THREE.SphereGeometry( 0.5, 32,32);
	sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xfffafa ,shading:THREE.FlatShading} );
    mrBall = new THREE.Mesh( sphereGeometry, sphereMaterial );
    mrBall.position.x=40.5;
    mrBall.position.z=80.5;
    mrBall.position.y=0.5;
    scene.add(mrBall);
    
    tablero[40][80].character=new Character(charcounter++,0,2,40,80,mrBall,40,0,1,100,1);//{x:40,z:80,view:mrBall,moving:false,directionX:0,directionZ:0,path:[]};
    
    characters.push(tablero[40][80].character);
    
    sphereGeometry = new THREE.SphereGeometry( 0.5, 32,32);
	sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xfffafa ,shading:THREE.FlatShading} );
    mrBall = new THREE.Mesh( sphereGeometry, sphereMaterial );
    mrBall.position.x=20.5;
    mrBall.position.z=30.5;
    mrBall.position.y=0.5;
    scene.add(mrBall);
     tablero[20][30].character=new Character(charcounter++,0,2,20,30,mrBall,40,5,1,100,1);//{x:20,z:30,view:mrBall,moving:false,directionX:0,directionZ:0,path:[]};
    
    characters.push(tablero[20][30].character);
    sphereGeometry = new THREE.SphereGeometry( 0.5, 32,32);
	sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xfffafa ,shading:THREE.FlatShading} );
    mrBall = new THREE.Mesh( sphereGeometry, sphereMaterial );
    mrBall.position.x=60.5;
    mrBall.position.z=100.5;
    mrBall.position.y=0.5;
    scene.add(mrBall);
     tablero[60][100].character=new Character(charcounter++,0,2,60,100,mrBall,40,3,1,100,1);//{x:60,z:100,view:mrBall,moving:false,directionX:0,directionZ:0,path:[]};
    
    characters.push(tablero[60][100].character);
}

function addWorld2(){
	var sides=40;
	var tiers=40;
	var sphereGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
	var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xfffafa ,shading:THREE.FlatShading} );
	
	var vertexIndex;
	var vertexVector= new THREE.Vector3();
	var nextVertexVector= new THREE.Vector3();
	var firstVertexVector= new THREE.Vector3();
	var offset= new THREE.Vector3();
	var currentTier=1;
	var lerpValue=0.5;
	var heightValue;
	var maxHeight=0.07;
	for(var j=1;j<tiers-2;j++){
		currentTier=j;
		for(var i=0;i<sides;i++){
			vertexIndex=(currentTier*sides)+1;
			vertexVector=sphereGeometry.vertices[i+vertexIndex].clone();
			if(j%2!==0){
				if(i==0){
					firstVertexVector=vertexVector.clone();
				}
				nextVertexVector=sphereGeometry.vertices[i+vertexIndex+1].clone();
				if(i==sides-1){
					nextVertexVector=firstVertexVector;
				}
				lerpValue=(Math.random()*(0.75-0.25))+0.25;
				vertexVector.lerp(nextVertexVector,lerpValue);
			}
			heightValue=(Math.random()*maxHeight)-(maxHeight/2);
			offset=vertexVector.clone().normalize().multiplyScalar(heightValue);
			sphereGeometry.vertices[i+vertexIndex]=(vertexVector.add(offset));
		}
	}
	rollingGroundSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
	rollingGroundSphere.receiveShadow = true;
	rollingGroundSphere.castShadow=false;
	
	scene.add( rollingGroundSphere );
	
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


function update(){

    for(var i=0;i<characters.length;i++){
        if(characters[i].moving && characters[i].getMove()){
            
            if(characters[i].path.length>0){
                tablero[characters[i].x][characters[i].z].character=null;
                var nextMv=characters[i].path.shift();
               characters[i].z=nextMv.z;
               characters[i].x=nextMv.x; 
            characters[i].view.position.x=characters[i].x+0.5;
            characters[i].view.position.z=characters[i].z+0.5;
            tablero[characters[i].x][characters[i].z].character=characters[i];
			if(selected.id==characters[i].id){
				select.position.x=characters[i].x+0.5;
				select.position.z=characters[i].z+0.5;
				select.position.y=0.05;
			}
            }else
                characters[i].moving=false;
            
        }
        
    }

    render();
	requestAnimationFrame(update);//request next update
}

function render(){
    renderer.render(scene, camera);//draw
}

function onWindowResize() {
	//resize & align
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}