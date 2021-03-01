var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();  //Runs smoothly on slow and fast processing pcs

function main() {
    var scene = new THREE.Scene(); //Scenenobjekt
    var gui = new dat.GUI();

    var box = generateBox(1, 1, 1);
    box.name = 'box-1';
    box.position.z = -0.5;

    var floor = generateFloor(10, 10);
    floor.name = 'floor-1';
    floor.rotation.x = Math.PI / 2;  //Radiant
    floor.add(box);

    var pointLight = generatePointLight(0xffffff, 1); //Color, Intensity
    pointLight.position.X = 5;
    pointLight.position.y = 5;

	var moon = generateMoon();
	moon.name = 'moon-1';

    scene.add(floor);
    scene.add(pointLight);
	scene.add(moon);
	objectLoader("./obj/couch.obj");

    var camera = new THREE.PerspectiveCamera(
        45, //Field Of View
        window.innerWidth / window.innerHeight, //Aspect Ratio
        1,    //Near clipping plane. Anything closer to the near clipping distance not displayed
        1000  //Far clipping plane. Anything further away the far clipping distance is not diplayed
    );
    camera.position.x = 3;
    camera.position.y = 8;
    camera.position.z = -15;
    camera.lookAt(new THREE.Vector3(0, 0, -5));   //Camera view

    const positionFolder = gui.addFolder("Position");
    positionFolder.add(box.position, "x", -10, 10);
    positionFolder.add(box.position, "y", -10, 10);
    positionFolder.add(box.position, "z", -10, 10);
    positionFolder.open();

	const rotationFolder = gui.addFolder("Rotation");
	rotationFolder.add(box.rotation, "x", 0, Math.PI * 2);
	rotationFolder.add(box.rotation, "y", 0, Math.PI * 2);
	rotationFolder.add(box.rotation, "z", 0, Math.PI * 2);
	rotationFolder.open();

	const cameraFolder = gui.addFolder("Camera");
	cameraFolder.add(camera.position, "x", -20, 20, 0.01);  //Min,Max
	cameraFolder.add(camera.position, "y", -20, 20, 0.01);  //Min,Max
	cameraFolder.add(camera.position, "z", 0, 10, 0.01);  //Min,Max
	cameraFolder.open();
	
	const lightFolder = gui.addFolder("Lighting");
	lightFolder.add(pointLight, 'intensity', 0, 20)

    var renderer = new THREE.WebGLRenderer();  //Uses Graphics card
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(60,60,60)')
    document.getElementById('webgl').appendChild(renderer.domElement);  //canvas where the renderer draws its output
    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, controls);
    return scene;
}

function generateFloor(w, d) {
    var geo = new THREE.PlaneGeometry(w, d);
    var mat = new THREE.MeshPhongMaterial({
        color: 'rgb(100, 100, 100)',
        side: THREE.DoubleSide   //Ebene von beiden Seiten sichtbar
    });

    var mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    return mesh;
}

function generateMoon() {
    var sphere = new THREE.SphereGeometry(3, 42, 42);
    var texture = THREE.ImageUtils.loadTexture('/img/moon.jpg');
    var moonMat = new THREE.MeshLambertMaterial( {map: texture} );
    var mesh = new THREE.Mesh(sphere, moonMat);

    mesh.position.x = -10;
    mesh.position.y = 10;
    mesh.position.z = 10;

    return mesh;
}

function generateBox(w, h, d) {
    var geo = new THREE.BoxGeometry(w, h, d); //width, height, depth
    var mat = new THREE.MeshPhongMaterial({
        color: 'rgb(100, 100, 100)'
    });

    var mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    return mesh;
}

function generatePointLight(color, intensity) {
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true;
    return light
}

function objectLoader(pathname) {
	var objectLoader = new THREE.OBJLoader();
	objectLoader.load(pathname, function(object){
		object.scale.x = 4;
		object.scale.y = 4;
		object.scale.z = 4;

		scene.add(object);
	});
}

function update(renderer, scene, camera, controls) {
    renderer.render(scene, camera);
    controls.update();

    var step = 10*clock.getDelta();   //Checks how many frames the pc can run on
    var box = scene.getObjectByName('box-1');
    if(keyboard.pressed("W")) {
        box.translateY(step);
    }
    if(keyboard.pressed("A")) {
        box.translateX(step);
    }
    if(keyboard.pressed("S")) {
        box.translateY(-step);
    }
    if(keyboard.pressed("D")) {
        box.translateX(-step);
    }
    if(keyboard.pressed("shift")) {
        box.translateZ(step);
    }
    if(keyboard.pressed("space")) {
        box.translateZ(-step);
    }

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

main();
