var scn = null;

//event that runs when the content is loaded
document.addEventListener('DOMContentLoaded', function() {
    scn = document.getElementById('avasscene');
    setupEnvironment();
    var wp = generateWelcomePage();
    scn.appendChild(wp);
});

//Generates the Welcome page
var generateWelcomePage = function(){
    var welcomePage = document.createElement('a-entity');
    welcomePage.setAttribute('id', 'welcome_page');
    welcomePage.setAttribute('visible', true);

    var txtFinding = document.createElement('a-text');
    txtFinding.setAttribute('value', 'FINDING');
    txtFinding.setAttribute('color', '#FFF');
    txtFinding.setAttribute('width', '4');
    txtFinding.setAttribute('font', 'dejavu');
    txtFinding.setAttribute('position', '-0.7 3 0');

    var txtAva = document.createElement('a-text');
    txtAva.setAttribute('value', 'AVA');
    txtAva.setAttribute('color', 'orange');
    txtAva.setAttribute('width', '4');
    txtAva.setAttribute('font', 'dejavu');
    txtAva.setAttribute('position', '0.1 3 0');

    var plnStart = document.createElement('a-plane');
    plnStart.setAttribute('color', '#333');
    plnStart.setAttribute('height', '0.2');
    plnStart.setAttribute('width', '0.5');
    plnStart.setAttribute('position', '-0.1 2.5 0');
    plnStart.setAttribute('opacity', '0.8');
    plnStart.setAttribute('sound', 'on: click; src: #click-sound');
    plnStart.setAttribute('text', 'value:START; color:#FFF; width:2; font:dejavu;align:center');
    plnStart.setAttribute('switch-scene', 'from:#welcome_page; to:#level_page');
    plnStart.setAttribute('event-set__1', '_event: mouseenter; text.color:orange');
    plnStart.setAttribute('event-set__2', '_event: mouseleave; text.color:#FFF');

    var plnInstruction = document.createElement('a-plane');
    plnInstruction.setAttribute('height', '0.2');
    plnInstruction.setAttribute('width', '0.5');
    plnInstruction.setAttribute('position', '-0.1 2.3 0');
    plnInstruction.setAttribute('opacity', '0');
    plnInstruction.setAttribute('sound', 'on: click; src: #click-sound');
    plnInstruction.setAttribute('text', 'value:-INSTRUCTION-; color:#888; width:1;font:dejavu;align:center');
    plnInstruction.setAttribute('switch-scene', 'from:#welcome_page; to:#instruction_page');
    plnInstruction.setAttribute('event-set__1', '_event: mouseenter; text.color:orange');
    plnInstruction.setAttribute('event-set__2', '_event: mouseleave; text.color:#888');

    welcomePage.appendChild(txtFinding);
    welcomePage.appendChild(txtAva);
    welcomePage.appendChild(plnStart);
    welcomePage.appendChild(plnInstruction);

    return welcomePage;
};

//removes a page
var removePage = function(name){
    var wp = document.getElementById(name);
    scn.removeChild(wp);
};

//sets up the lights and camera for the scene
var setupEnvironment = function(){
    //sets up the camera and lights
    console.log('camera and lights setup');
};
