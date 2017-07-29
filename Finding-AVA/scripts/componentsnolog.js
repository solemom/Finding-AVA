var level = 1;
var buildbeaker = 0;
var buildbody = 0;
var opendesk = 2;
var previoustool = 0;
var currenttool = -1;
var usingtime = 0;
var endtime = 0;
var timer;
var numberoftiming = 1;
var progress = 0;
var errortime = 0;

window.onload = function(){
  level = 1;
  buildbeaker = 0;
  buildbody = 0;
  opendesk = 2;
  previoustool = 0;
  currenttool = -1;
  usingtime = 0;
  endtime = 0;
  numberoftiming = 1;
  progress = 0;
  errortime = 0;
}

function timedCount(){
  usingtime=usingtime+1;
  timer=setTimeout("timedCount()",1000);
  var showmin = Math.floor(usingtime/60);
  var showsec = usingtime - (showmin * 60);
  var showtime = checkTime(showmin)+":"+checkTime(showsec);
  if(document.getElementById("showtime1")){
    document.getElementById("showtime1").children[0].setAttribute("value", showtime);
    document.getElementById("showtime1").emit("errortime");
    document.getElementById("welcomeins").emit("welcometime");
  }
  if(document.getElementById("showtime2")){
    document.getElementById("showtime2").children[0].setAttribute("value", showtime);
    document.getElementById("showtime2").emit("errortime");
  }
  if(document.getElementById("showtime3")){
    document.getElementById("showtime3").children[0].setAttribute("value", showtime);
    document.getElementById("showtime3").emit("timepassing");
  }
}

function checkTime(i){
  if (i<10) 
    {i="0" + i}
  return i
}

function doSave(value, type, name) {  
    var blob;  
    if (typeof window.Blob == "function") {  
        blob = new Blob([value], {type: type});  
    } else {  
        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;  
        var bb = new BlobBuilder();  
        bb.append(value);  
        blob = bb.getBlob(type);  
    }  
    var URL = window.URL || window.webkitURL;  
    var bloburl = URL.createObjectURL(blob);  
    var anchor = document.createElement("a");  
    if ('download' in anchor) {  
        anchor.style.visibility = "hidden";  
        anchor.href = bloburl;  
        anchor.download = name;  
        document.body.appendChild(anchor);  
        var evt = document.createEvent("MouseEvents");  
        evt.initEvent("click", true, true);  
        anchor.dispatchEvent(evt);  
        document.body.removeChild(anchor);  
    } else if (navigator.msSaveBlob) {  
        navigator.msSaveBlob(blob, name);  
    } else {  
        location.href = bloburl;  
    }  
}  

function logtime(i){
  var a =  i.toString()+":"+usingtime.toString();
  doSave(a, "text/latex", "avatime.txt");   
  //console.log(i.toString()+":"+usingtime.toString());
}

function backtocursor(){
  var toolinhand = document.getElementById("toolinhand").children;
  var boneinhand = document.getElementById("boneinhand").children;
  for(var i =0; i<toolinhand.length;i++){
    toolinhand[i].setAttribute("visible","false");
  }
  for(var i =0; i<boneinhand.length;i++){
    boneinhand[i].setAttribute("visible","false");
  }
}

AFRAME.registerComponent('change-color-on-hover',{
  schema:{
    color:{default:"orange"},
    target:{type:'selector'}
  },
  init:function(){
    var color = this.data.color;
    var el = this.el;
    var tar = this.data.target;
    if(!tar) tar = el;
    var defaultColor = tar.getAttribute('color');
    el.addEventListener('mouseenter',function(){
      tar.setAttribute('color', color);
    });
    el.addEventListener('mouseleave',function(){
      tar.setAttribute('color', defaultColor);
    });
  }
});

AFRAME.registerComponent('hide-welcome',{
  schema:{
    event:{type:'string'},
  },
  update:function(){
    var evt = this.data.event;
    var el = this.el;
    if(evt){
      el.addEventListener(evt, function(){
        if(usingtime == 10){
          if(document.getElementById("welcomeins")){
            document.getElementById("welcomeins").setAttribute("visible","false");
          }
        }
      });
    }
  }
});

AFRAME.registerComponent('clickable',{
  schema:{
    condition:{type:'selector'},
    target:{type:'selector'}
  },
  init:function(){
    var el = this.el;
    var target = this.data.target;
    var condition = this.data.condition;
    //var light = el.querySelector("a-light");
    el.addEventListener('mouseenter',function(){
      if(condition){
        if(condition.getAttribute("visible")){
          target.setAttribute("visible","true");
        }
      }
      else{
        target.setAttribute("visible","true");
      }
    });
    el.addEventListener('mouseleave',function(){
      target.setAttribute("visible","false");
    });
  }
});

AFRAME.registerComponent('iconhover',{
  init:function(){
    var el = this.el;
    el.addEventListener('mouseenter',function(){
      el.children[0].setAttribute("visible","true");
    });
    el.addEventListener('mouseleave',function(){
      el.children[0].setAttribute("visible","false");
    });
  }
});

AFRAME.registerComponent('switch-scene', {
  schema: {
    from: {type: 'selector'}, 
    to: {type: 'selector'}
  },
  init: function () {
    var previousScene = this.data.from;
    var targetScene = this.data.to;
    var el = this.el;
    el.addEventListener('click', function(){
      backtocursor();
      previousScene.setAttribute('visible', 'false');
      targetScene.setAttribute('visible','true');
      if(document.getElementById("level_page").getAttribute("visible")){
        document.getElementById("level_page").emit("checklevel");
      }
      if((targetScene == document.getElementById("discover_page")) && (numberoftiming == 1)){
        timedCount();
        numberoftiming = 0;
      }
      if((targetScene == document.getElementById("welcome_page")) && (previousScene == document.getElementById("research_page"))){
        window.location.reload();
      }
    });
  }
});

AFRAME.registerComponent('levels', {
  schema: {
    event: {type: 'string', default: ''},
  },
  init: function () {
    var self = this;
    var lock1 = document.getElementById("locked1");
    var lock2 = document.getElementById("locked2");
    var identifylink = document.getElementById("identify_link");
    var researchlink = document.getElementById("research_link");
    this.eventHandlerFn = function () {
      switch(level){
        case 1:
          break;
        case 2:
          lock1.setAttribute("visible","false");
          identifylink.setAttribute("event-set__1","_event: mouseenter; text.color:orange");
          identifylink.setAttribute("event-set__2","_event: mouseleave; text.color:#FFF");
          identifylink.setAttribute("switch-scene","from:#level_page; to:#identify_page");
          //identifylink.setAttribute("change-environ","src:#sky");
          break;
        case 3:
          lock2.setAttribute("visible","false");
          researchlink.setAttribute("event-set__1","_event: mouseenter; text.color:orange");
          researchlink.setAttribute("event-set__2","_event: mouseleave; text.color:#FFF");
          researchlink.setAttribute("switch-scene","from:#level_page; to:#research_page");
          //researchlink.setAttribute("change-environ","src:#sky");
          break;
      }
    };
  },
  update: function () {
    var data = this.data;
    var el = this.el;
    if (data.event) {
      el.addEventListener(data.event, this.eventHandlerFn);
    }
  }
});

AFRAME.registerComponent('change-environ', {
  schema: {
    src: {type: 'string'}
  },
  init: function () {
    var src = this.data.src;
    var el = this.el;
    el.addEventListener('click', function(){
      document.getElementById("environ").setAttribute("src",src);
      if(src.indexOf("sky")>=0)
      {
        document.getElementById("environ").setAttribute("theta-length","90");
      }
      else
      {
        document.getElementById("environ").setAttribute("theta-length","180");
      }
    });
  }
});

AFRAME.registerComponent('addtool', {
  schema: {
    name: {type: 'selector'}
  },
  init: function () {
    var name = this.data.name;
    var el = this.el;
    el.addEventListener('click', function(){
      el.setAttribute("visible","false");
      name.setAttribute("visible","true");
    });
  }
});

AFRAME.registerComponent('selecttool', {
  schema: {
    selectwhichtool: {type: 'selector'}
  },
  init: function () {
    var selectwhichtool = this.data.selectwhichtool;
    var el = this.el;
    var toolinhand = document.getElementById("toolinhand");
    var tools = toolinhand.children;
    el.addEventListener('click', function(){
      if(selectwhichtool.getAttribute("visible")){selectwhichtool.setAttribute("visible","false");}
      else {
        for(var i = 0; i < tools.length; i++)
        {
          tools[i].setAttribute("visible","false");
        }
        selectwhichtool.setAttribute("visible","true");
      }
    });
  }
});

AFRAME.registerComponent('digtent', {
  init: function () {
    var el = this.el;
    var shovel = document.getElementById("useshovel");
    el.addEventListener('click', function(){
      if(shovel.getAttribute("visible")){
        el.setAttribute("visible","false");
        document.getElementById("shovel-tool").children[0].setAttribute("material","color:#888");
        progress = 1; // first step to dig tent
        //logtime(progress);
      }
      shovel.setAttribute("visible","false");

    });
  }
});

AFRAME.registerComponent('showlock', {
  init: function () {
    var el = this.el;
    var toolinhand = document.getElementById("toolinhand");
    var tools = toolinhand.children;
    var letterlock = document.getElementById("letterlock");
    el.addEventListener('click', function()
    {
      var i = 0;
      while(i<tools.length)
      {
        if(!tools[i].getAttribute("visible")){
          i=i+1;
          if(i==tools.length){
            //alert(i);
            var lockanimation1 = document.createElement("a-animation");
            var lockanimation2 = document.createElement("a-animation");
            lockanimation1.setAttribute("attribute","scale");
            lockanimation1.setAttribute("to","7 7 7");
            lockanimation1.setAttribute("easing","ease-in");
            lockanimation1.setAttribute("dur","300");
            lockanimation1.setAttribute("fill","both");
            lockanimation2.setAttribute("attribute","position");
            lockanimation2.setAttribute("to","0 2.5 -0.8");
            lockanimation2.setAttribute("easing","linear");
            lockanimation2.setAttribute("dur","300");
            lockanimation2.setAttribute("fill","both");
            letterlock.appendChild(lockanimation1);
            letterlock.appendChild(lockanimation2);
          }
        }
        else{
          break;
        }
      }
    });
  }
});

AFRAME.registerComponent('letterplus', {
  schema: {
    target: {type: 'selector'}
  },
  init: function () {
    var el = this.el;
    var target = this.data.target;
    el.addEventListener('click', function(){
      var currentletter = target.getAttribute('value');
      var asciicode = currentletter.charCodeAt(0);
      if(asciicode==90){asciicode=64;}
      asciicode=asciicode+1;
      var nextletter = String.fromCharCode(asciicode);
      target.setAttribute("value",nextletter);
    });
  }
});

AFRAME.registerComponent('letterminus', {
  schema: {
    target: {type: 'selector'}
  },
  init: function () {
    var el = this.el;
    var target = this.data.target;
    el.addEventListener('click', function(){
      var currentletter = target.getAttribute('value');
      var asciicode = currentletter.charCodeAt(0);
      if(asciicode==65){asciicode=91;}
      asciicode=asciicode-1;
      var nextletter = String.fromCharCode(asciicode);
      target.setAttribute("value",nextletter);
    });
  }
});

AFRAME.registerComponent('openlock', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function(){
      var digit1 = document.getElementById("firstdigit").getAttribute("value");
      var digit2 = document.getElementById("seconddigit").getAttribute("value");
      var digit3 = document.getElementById("thirddigit").getAttribute("value");
      var digit4 = document.getElementById("fourthdigit").getAttribute("value");
      var digit5 = document.getElementById("fifthdigit").getAttribute("value");
      var digit6 = document.getElementById("sixthdigit").getAttribute("value");
      if(digit1=="L" && digit2=="R" && digit3=="M" && digit4=="C" && digit5=="P" && digit6=="T")
      {
        document.getElementById("letterlock").setAttribute("visible","false");
        document.getElementById("toolbox-model").setAttribute("visible","false");
        document.getElementById("toolbox-open-model").setAttribute("visible","true");
        document.getElementById("toolsinbox").setAttribute("visible","true");
        progress = 2; // second step to open lock
        //logtime(progress);
      }
    });
  }
});

AFRAME.registerComponent('usetool', {
  init: function () {
    var el = this.el;
    var toolinhand = document.getElementById("toolinhand");
    var toolonboard = document.getElementById("toolsinbox");
    var tools = toolinhand.children;
    var boardtools = toolonboard.children;
    el.addEventListener('click', function(){
      for(var i = 0; i<tools.length; i++){
        if(tools[i].getAttribute("visible")){
          currenttool = i;
          break;
        }
      }
      if(currenttool == previoustool + 1){
        switch(currenttool){
          case 1:
            document.getElementById("directionline").setAttribute("visible","true");
            boardtools[7].children[0].setAttribute("material","color:#888");
            break;
          case 2:
            document.getElementById("measurepoint").setAttribute("visible","true");
            boardtools[6].children[0].setAttribute("material","color:#888");
            break;
          case 3:
            document.getElementById("pegpoint").setAttribute("visible","true");
            boardtools[1].children[0].setAttribute("material","color:#888");
            break;
          case 4:
            document.getElementById("crossline").setAttribute("visible","true");
            boardtools[2].children[0].setAttribute("material","color:#888");
            break;
          case 5:
            document.getElementById("discover-ground").children[1].setAttribute("visible","false");
            document.getElementById("discover-ground").children[2].setAttribute("visible","true");
            boardtools[3].children[0].setAttribute("material","color:#888");
            break;
          case 6:
            document.getElementById("discover-ground").children[2].setAttribute("visible","false");
            document.getElementById("discover-ground").children[3].setAttribute("visible","true");
            boardtools[4].children[0].setAttribute("material","color:#888");
            break;
          case 7:
            document.getElementById("discover-ground").children[4].setAttribute("visible","true");
            document.getElementById("discover-end").setAttribute("visible","true");
            boardtools[5].children[0].setAttribute("material","color:#888");
            progress = 3; //third step to dig the ground
            level = 2;
            break;
        }
        previoustool=previoustool+1;
        tools[currenttool].setAttribute("visible","false");
      }
      else{
        var camera = document.querySelector("a-camera");
        var errormsg = document.createElement("a-text");
        errormsg.setAttribute("value","Wrong tool! Mind the using order!");
        errormsg.setAttribute("color","#000");
        errormsg.setAttribute("width","2");
        errormsg.setAttribute("position","-0.6 -0.1 -1.5");
        camera.appendChild(errormsg);
        errortime = usingtime;
      }
    });
  }
});

AFRAME.registerComponent('hide-error',{
  schema:{
    event:{type:'string'},
  },
  update:function(){
    var evt = this.data.event;
    var el = this.el;
    if(evt){
      el.addEventListener(evt, function(){
        if((errortime!=0) && (usingtime == errortime + 2)){
          var camera = document.querySelector("a-camera");
          if(camera.querySelector("a-text")){
             camera.removeChild(camera.querySelector("a-text")); 
          }
        }
      });
    }
  }
});

AFRAME.registerComponent('showsomething', {
  schema: {
    target:{type:'selector'}
  },
  init: function () {
    var el = this.el;
    var target = this.data.target;
    el.addEventListener('click', function(){
      target.setAttribute('visible','true');
      if(target == document.getElementById("researchhint")){
        progress = progress + 1; // step to find the book on the shelf
      }
    });
  }
});

AFRAME.registerComponent('hidesomething', {
  schema: {
    target:{type:'selector'}
  },
  init: function () {
    var el = this.el;
    var target = this.data.target;
    el.addEventListener('click', function(){
      target.setAttribute('visible','false');
    });
  }
});

AFRAME.registerComponent('scalesomething', {
  schema: {
    scaleto: {type: 'vec3'},
    positionto: {type: 'vec3'},
    pinposition: {type: 'vec3'},
    pinrotation: {type: 'vec3'}
  },
  init: function () {
    var el = this.el;
    var scaleto = this.data.scaleto;
    var positionto = this.data.positionto;
    var pinposition = this.data.pinposition;
    var pinrotation = this.data.pinrotation;
    var originalscale = el.getAttribute("scale");
    var originalposition = el.getAttribute("position");
    var originalrotation = el.getAttribute("rotation");
    var toolinhand = document.getElementById("toolinhand");
    var tools = toolinhand.children;
    el.addEventListener('click', function(){
      var originalscaleX = el.getAttribute("scale").x;
      var i = 0;
      while(i<tools.length)
      {
        if(!tools[i].getAttribute("visible")){
          i=i+1;
          if(i==tools.length){
            if(originalscaleX==originalscale.x)
            {
              el.setAttribute("scale",scaleto);
              el.setAttribute("position",positionto);
              el.setAttribute("rotation","0 0 0");
            }
            else
            {
              //el.setAttribute("scale",originalscale);
              //el.setAttribute("position",originalposition);
              //el.setAttribute("rotation",originalrotation);
              var anim = document.createElement("a-animation");
              anim.setAttribute("attribute","position");
              anim.setAttribute("to",pinposition.x.toString()+" "+pinposition.y.toString()+" "+pinposition.z.toString());
              anim.setAttribute("easing","ease-in-out");
              anim.setAttribute("dur","2000");
              var anim2 = document.createElement("a-animation");
              anim2.setAttribute("attribute","rotation");
              anim2.setAttribute("to",pinrotation.x.toString()+" "+pinrotation.y.toString()+" "+pinrotation.z.toString());
              anim2.setAttribute("easing","ease-in-out");
              anim2.setAttribute("dur","2000");
              el.appendChild(anim);
              el.appendChild(anim2);
            }
          }
        }
        else{
          break;
        }
      }
    });
  }
});

AFRAME.registerComponent('changeable', {
  schema: {
    condition:{type:'selector'},
    action:{type:'string'},
    icon:{type:'string'}
  },
  init: function () {
    var el = this.el;
    var condition = this.data.condition;
    var action = this.data.action;
    var icon = this.data.icon;
    el.addEventListener('click', function(){
      if(condition.getAttribute("visible")){
        el.setAttribute("obj-model","obj:"+action+"-obj;mtl:"+action+"-mtl");
        document.getElementById(icon).children[0].setAttribute("material","color:#888");
        backtocursor();
        buildbeaker++;
        document.getElementById("leftcover").emit("buildingbeaker");
      }
      else{
        var camera = document.querySelector("a-camera");
        var errormsg = document.createElement("a-text");
        errormsg.setAttribute("value","Wrong Position!");
        errormsg.setAttribute("color","yellow");
        errormsg.setAttribute("width","2");
        errormsg.setAttribute("position","0.1 0 -1.5");
        camera.appendChild(errormsg);
        errortime = usingtime;
      }
    });
  }
});

AFRAME.registerComponent('selectbone', {
  schema: {
    selectwhichbone: {type: 'selector'}
  },
  init: function () {
    var selectwhichbone = this.data.selectwhichbone;
    var el = this.el;
    var boneinhand = document.getElementById("boneinhand");
    var bones = boneinhand.children;
    el.addEventListener('click', function(){
      if(selectwhichbone.getAttribute("visible")){selectwhichbone.setAttribute("visible","false");}
      else {
        for(var i = 0; i < bones.length; i++)
        {
          bones[i].setAttribute("visible","false");
        }
        selectwhichbone.setAttribute("visible","true");
      }
    });
  }
});

AFRAME.registerComponent('checkbeaker', {
  schema: {
    event: {type: 'string', default: ''},
  },
  init: function () {
    var self = this;
    var target = document.getElementById("beaker-question");
    this.eventHandlerFn = function () {
      if(buildbeaker==3)
      {
        target.setAttribute("visible","true");
      }
    };
  },
  update: function () {
    var data = this.data;
    var el = this.el;
    if (data.event) {
      el.addEventListener(data.event, this.eventHandlerFn);
    }
  }
});

AFRAME.registerComponent('openleftcover', {
  init: function () {
    var el = this.el;
    var leftcover = document.getElementById("leftcover");
    el.addEventListener('click', function(){
      el.parentNode.setAttribute("visible","false");
      var leftanimation = document.createElement("a-animation");
      leftanimation.setAttribute("attribute","position");
      leftanimation.setAttribute("to","-1.5 1.05 0");
      leftanimation.setAttribute("easing","linear");
      leftanimation.setAttribute("dur","300");
      leftanimation.setAttribute("fill","both");
      document.getElementById("leftcover").appendChild(leftanimation);
      progress = progress + 1; //step to open the left cover
      opendesk--;
      if(opendesk==0)
      {
        document.getElementById("carbonmachine").setAttribute("visible","true");
        var carbonanimation = document.createElement("a-animation");
        carbonanimation.setAttribute("attribute","position");
        carbonanimation.setAttribute("to","0 1 0");
        carbonanimation.setAttribute("easing","linear");
        carbonanimation.setAttribute("dur","1000");
        carbonanimation.setAttribute("fill","both");
        document.getElementById("carbonmachine").appendChild(carbonanimation);
        document.getElementById("identify-end").setAttribute("visible","true");
        level = 3;
      }
    });
  }
});

AFRAME.registerComponent('putbody', {
  schema: {
    bone:{type:'selector'},
    target: {type: 'selector'},
    icon: {type:'string'}
  },
  init: function () {
    var el = this.el;
    var bone = this.data.bone;
    var target = this.data.target;
    var icon = this.data.icon;
    el.addEventListener("click", function(){
      if(bone.getAttribute("visible"))
      {
        target.setAttribute("visible","true");
        document.getElementById(icon).children[0].setAttribute("material","color:#888");
        buildbody++;
        document.getElementById("rightcover").emit("buildingbody");
        backtocursor();
      }
      else
      {
        var camera = document.querySelector("a-camera");
        var errormsg = document.createElement("a-text");
        errormsg.setAttribute("value","Wrong Position!");
        errormsg.setAttribute("color","yellow");
        errormsg.setAttribute("width","2");
        errormsg.setAttribute("position","0.1 0 -1.5");
        camera.appendChild(errormsg);
        errortime = usingtime;
      }
    });
  }
});

AFRAME.registerComponent('checkbody', {
  schema: {
    event: {type: 'string', default: ''},
  },
  init: function () {
    var self = this;
    var target = document.getElementById("bodyline");
    var rightanimation = document.createElement("a-animation");
    rightanimation.setAttribute("attribute","position");
    rightanimation.setAttribute("to","1.5 1.05 0");
    rightanimation.setAttribute("easing","linear");
    rightanimation.setAttribute("dur","300");
    rightanimation.setAttribute("fill","both");
    var carbonanimation = document.createElement("a-animation");
    carbonanimation.setAttribute("attribute","position");
    carbonanimation.setAttribute("to","0 1 0");
    carbonanimation.setAttribute("easing","linear");
    carbonanimation.setAttribute("dur","1000");
    carbonanimation.setAttribute("fill","both");
    this.eventHandlerFn = function () {
      if(buildbody==5)
      {
        target.setAttribute("src","#bodyfinish");
        document.getElementById("rightcover").appendChild(rightanimation);
        progress = progress + 1;//step to open the right cover
        opendesk--;
        if(opendesk==0)
        {
          document.getElementById("carbonmachine").setAttribute("visible","true");
          document.getElementById("carbonmachine").appendChild(carbonanimation);
          document.getElementById("identify-end").setAttribute("visible","true");
          level = 3;
        }
      }
    };
  },
  update: function () {
    var data = this.data;
    var el = this.el;
    if (data.event) {
      el.addEventListener(data.event, this.eventHandlerFn);
    }
  }
});

AFRAME.registerComponent('radiobutton',{
  init:function(){
    var el = this.el;
    var childnodes = el.parentNode.children;
    var length = childnodes.length;
    el.addEventListener('click',function(){
      for(var i = 0; i<length; i++){
        childnodes[i].setAttribute("color","#664");
      }
      el.setAttribute("color","#66492d");
      var gender = document.getElementById("rightgender").getAttribute("color");
      var age = document.getElementById("rightage").getAttribute("color");
      var height = document.getElementById("rightheight").getAttribute("color");
      var environ = document.getElementById("rightenviron").getAttribute("color");
      if(gender=="#66492d" && age=="#66492d" && height=="#66492d" && environ=="#66492d"){
        progress = progress + 1;//final progress to answer the questions
        document.getElementById("avatext").setAttribute("visible","true");
        document.getElementById("researchhint").setAttribute("src","#avaface");
        endtime = usingtime;
        //logtime(progress);
      }
    })
  }
});

var positioninfo = new Array();
var scaleinfo = new Array();
var rotationinfo = new Array();

function getboneinfo(){
  var boneelem = document.getElementById("boneondesk").children;  
  for(var i=0;i<boneelem.length; i++){
    positioninfo[i] = boneelem[i].getAttribute("position");
    scaleinfo[i] = boneelem[i].getAttribute("scale");
    rotationinfo[i] = boneelem[i].getAttribute("rotation"); 
  }
}

AFRAME.registerComponent('showboneinfo', {
  schema: {
    scaleto: {type: 'vec3'},
    positionto: {type: 'vec3'},
    target:{type: 'selector'},
  },
  init: function () {
    var el = this.el;
    var scaleto = this.data.scaleto;
    var positionto = this.data.positionto;
    var target = this.data.target;
    var originalscale = el.getAttribute("scale");
    var originalposition = el.getAttribute("position");
    var originalrotation = el.getAttribute("rotation");
    getboneinfo();
    var elem = document.getElementById("boneondesk").children;
    
    el.addEventListener('click', function(){
      var originalscaleX = el.getAttribute("scale").x;
      if(originalscaleX==originalscale.x)
      {
        if(document.getElementById("boneondesk").querySelector("a-animation")){
          var anim = document.getElementById("boneondesk").querySelectorAll("a-animation");
          for(var j=0;j<anim.length; j++){
            anim[j].parentNode.removeChild(anim[j].parentNode.children[0]);
          }
        }
        for(var i=0;i<elem.length; i++){
          elem[i].setAttribute("position",positioninfo[i]);
          elem[i].setAttribute("scale",scaleinfo[i]);
          elem[i].setAttribute("rotation",rotationinfo[i]);
          document.getElementById("boneinfo").children[i].setAttribute("visible","false");
        }
        el.setAttribute("scale",scaleto);
        el.setAttribute("position",positionto);
        el.setAttribute("rotation","0 0 0");
        target.setAttribute("visible","true");
        var infoanimation = document.createElement("a-animation");
        infoanimation.setAttribute("attribute","rotation");
        infoanimation.setAttribute("from","0 0 0");
        infoanimation.setAttribute("to","0 360 0");
        infoanimation.setAttribute("dur","15000");
        infoanimation.setAttribute("easing","linear");
        infoanimation.setAttribute("repeat","indefinite");
        el.appendChild(infoanimation);
      }
      else
      {
        el.setAttribute("scale",originalscale);
        el.setAttribute("position",originalposition);
        el.setAttribute("rotation",originalrotation);
        target.setAttribute("visible","false");
        el.removeChild(el.children[0]);
      } 
    });
  }
});

AFRAME.registerComponent('movetowall', {
  schema: {
    position: {type: 'vec3'},
    rotation: {type: 'vec3'}
  },
  init: function () {
    var el = this.el;
    var pinposition = this.data.position;
    var pinrotation = this.data.rotation;
    el.addEventListener("click", function(){
      var anim = document.createElement("a-animation");
      anim.setAttribute("attribute","position");
      anim.setAttribute("to",pinposition.x.toString()+" "+pinposition.y.toString()+" "+pinposition.z.toString());
      anim.setAttribute("easing","ease-in-out");
      anim.setAttribute("dur","2000");
      var anim2 = document.createElement("a-animation");
      anim2.setAttribute("attribute","rotation");
      anim2.setAttribute("to",pinrotation.x.toString()+" "+pinrotation.y.toString()+" "+pinrotation.z.toString());
      anim2.setAttribute("easing","ease-in-out");
      anim2.setAttribute("dur","2000");
      el.appendChild(anim);
      el.appendChild(anim2);
    })
  }          
});

AFRAME.registerComponent('show-end',{
  schema:{
    event:{type:'string'},
  },
  update:function(){
    var evt = this.data.event;
    var el = this.el;
    if(evt){
      el.addEventListener(evt, function(){
        if((endtime!=0) && (usingtime == endtime + 3)){
          document.getElementById("research-end").setAttribute("visible","true");
        }
      });
    }
  }
});

/*
AFRAME.registerComponent('clickable',{
  init:function(){
    var el = this.el;
    var originalscaleX = el.getAttribute("scale").x;
    var originalscaleY = el.getAttribute("scale").y;
    var originalscaleZ = el.getAttribute("scale").z;
    var toscaleX = originalscaleX +0.2;
    var toscaleY = originalscaleY +0.2;
    var toscaleZ = originalscaleZ +0.2;
    var anim = document.createElement("a-animation");
    anim.setAttribute("attribute","scale");
    anim.setAttribute("to",toscaleX.toString()+" "+toscaleY.toString()+" "+toscaleZ.toString());
    anim.setAttribute("repeat","indefinite");
    anim.setAttribute("direction","alternate");
    anim.setAttribute("easing","ease-in-out");
    anim.setAttribute("dur","1200");
    el.addEventListener('mouseenter',function(){
      el.appendChild(anim);
    });
    el.addEventListener('mouseleave',function(){
      if(el.querySelector("a-animation")){
        el.removeChild(el.querySelector("a-animation"));
      }
      el.setAttribute("scale",originalscaleX.toString()+" "+originalscaleY.toString()+" "+originalscaleZ.toString());
    });
  }
});
*/
