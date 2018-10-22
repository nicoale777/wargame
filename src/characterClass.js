function Character (id,clan,type,x,z,view,health,speed,attack,strength,range,photo,lifebar,heigth) {
	this.id=id;
	this.clan=clan;
    this.type = type;
    this.x=x;
	this.z=z;
	this.heigth=heigth;
	this.xi=0;
	this.zi=0;
	this.view=view;
	this.health=health;
	this.speed=speed;
	this.attack=attack;
	this.strength=strength;
	this.range=range;
	this.moving=false;
	this.onWay=false;
	this.nextMv;
	this.directionX=0;
	this.directionZ=0;
	this.path=[];
	this.glitch=0;
	this.ready=speed;
	this.photo=photo;
	this.lifebar=lifebar;
	this.rotation;
	this.getMove = function() {
		if(this.ready==0){
			this.ready=this.speed;
			return true;
		}else{
			this.ready--;	
			return false;
		}
        
    };
}
