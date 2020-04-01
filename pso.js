var particleCount = 100;

var can = document.getElementById('canvas');
var c = can.getContext('2d');

var w = window.innerWidth;
var h = window.innerHeight;

can.width = w;
can.height = h;

var target_x = w/2;
var target_y = h/2;

var global_x = null;
var global_y = null;
var global_dis = null;

var globalInf = -.007
var localInf = -.582


function drawTarget(){
  c.fillStyle = "Red";
  c.fillRect(target_x, target_y, 10,10);
}

function update(){
  requestAnimationFrame(update);
  c.clearRect(0,0,w,h);
  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
  }
  drawTarget();
}

class Particle  {
    constructor()
    {
        this.global = false;
        this.x = Math.random() * can.width;
        this.y = Math.random() * can.height;
        this.color = "black";

        this.local_x = this.x;
        this.local_y = this.y;
        this.updateBest();

        this.vel_x = (Math.random() * 2)-1; //between -1 and 1
        this.vel_y = (Math.random() * 2)-1; //between -1 and 1

        this.draw();
    }

    updateBest(){
      if(global_x === null){
        //not initialised
        global_x = this.x;
        global_y = this.y;
        global_dis = Math.abs(this.x - target_x) + Math.abs(this.y - target_y);
      }

      var currentLocalBestDis = Math.abs(this.local_x - target_x) + Math.abs(this.local_y - target_y)

      this.local_dis = Math.abs(this.x - target_x) + Math.abs(this.y - target_y);

      if(this.local_dis < global_dis){
        global_x = this.x;
        global_y = this.y;
        global_dis = this.local_dis;
        for (var i = 0; i < particles.length; i++) {
          particles[i].global = false;
        }
        this.global = true;
      }

      if(this.local_dis < currentLocalBestDis){
        this.local_x = this.x;
        this.local_y = this.y;
      }
    }

    draw()
    {
        if(this.global){
          c.fillStyle = "#39FF14";
        }else{
          c.fillStyle = this.color;
        }
        c.fillRect(this.x, this.y, 5, 5);
    }

    update()
    {

        this.c1 = Math.random() //influence factor from local best
        this.c2 = Math.random() //influence factor from globale best

        this.localDir_x = (this.x - this.local_x);
        this.localDir_y = (this.y - this.local_y);

        this.globalDir_x = (this.x - global_x);
        this.globalDir_y = (this.y - global_y);

        this.x = this.x + this.vel_x + ((localInf*this.c1)*(this.localDir_x)) + ((globalInf*this.c2)*(this.globalDir_x));
        this.y = this.y + this.vel_y + ((localInf*this.c1)*(this.localDir_y)) + ((globalInf*this.c2)*(this.globalDir_y));

        this.updateBest();
        this.draw();
    }
}

particles = [];

for (var i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

requestAnimationFrame(update);

can.addEventListener('click', function(event) {
  target_x = event.pageX-15;
  target_y = event.pageY-15;
  global_x = null;

}, false);
