
//import { AnaglyphEffect } from './jsm/effects/AnaglyphEffect.js';

//const { render } = require("express/lib/response");

var uid = Date.now();
var ws = new WebSocket("ws://localhost:7474");

let clickX = 0;
let clickY = 0;

const objs = [];

let container, camera, scene, renderer, effect;

let particleSystem, unforms, geometry;

const particles = 10000;

//socekts
ws.onopen = function (event) {
	console.log("sending data...");
	
	init();
	animate();
};

ws.onmessage = function (event) {
	let e = JSON.parse(event.data);
	//console.log(e);
};

// three js stuff
//init();
//animate();

function init() {
	//container = document.createElement('div');
	//document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 3;
	camera.focalLength = 3;


	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild(renderer.domElement);

	// particles
	uniforms = {
		pointTexture: { value: new THREE.TextureLoader().load( 'img/spark1.png' ) }
	};
	const shaderMaterial = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true,
		vertexColors: true
	} );
	const radius = 200;
	const particle_geometry = new THREE.BufferGeometry();
	const positions = [];
	const colors = [];
	const sizes = [];

	const color = new THREE.Color();
	for (let i = 0; i < particles; i ++) {
		positions.push( ( Math.random() * 2 - 1 ) * radius );
		positions.push( ( Math.random() * 2 - 1 ) * radius );
		positions.push( ( Math.random() * 2 - 1 ) * radius );
		color.setHSL( i / particles, 1.0, 0.5 );
		colors.push( color.r, color.g, color.b );
		sizes.push( 20 );
	}

	particle_geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	particle_geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	particle_geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

	particleSystem = new THREE.Points( particle_geometry, shaderMaterial );

	scene.add( particleSystem );

	// the objects
	const center = new THREE.BoxGeometry(1, 1, 1);

	const geometryCube = new THREE.BoxGeometry(0.1, 0.1, 0.1);
	const geometrySphere = new THREE.SphereGeometry( 0.1, 32, 16 );
	const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	for (let i = 0; i < 6; i++) {
		if (i % 2 == 0) {
			const cube = new THREE.Mesh( geometryCube, material );
			cube.position.x = Math.random() * 10 - 5;
			cube.position.y = Math.random() * 10 - 5;
			cube.position.z = Math.random() * 10 - 5;
			//cube.scale.x = cube.scale.y = cube.scale.z = Math.random() * 3 + 1;
			cube.color = 0x123456;

			objs.push(cube);
			scene.add(cube);
		} else if (i % 2 == 1) {
			const sphere = new THREE.Mesh( geometrySphere, material );
			sphere.position.x = Math.random() * 10 - 5;
			sphere.position.y = Math.random() * 10 - 5;
			sphere.position.z = Math.random() * 10 - 5;
			//sphere.scale.x = sphere.scale.y = sphere.scale.z = Math.random() * 3 + 1;

			objs.push(sphere);
			scene.add(sphere);
		} else {

		}
	}

}
function animate_obj() {
	const timer = 0.0001 * Date.now();
	for ( let i = 0, il = objs.length; i < il; i++ ) {
		const o = objs[ i ];
		o.position.x = 5 * Math.cos( timer + i ) *0.1;
		o.position.y = 5 * Math.sin( timer + i * 1.1 )*0.1;
		if (ws.readyState == ws.OPEN) {
			let data = JSON.stringify([i + 1, o.position.x, o.position.y, o.position.z]);
			ws.send(data);
			//console.log(data);
		}
	}
	renderer.render( scene, camera );
}

function animate() {
	requestAnimationFrame(animate);
	animate_obj();
}

function touch() {
	//var coords = document.getElementById("coords");
	//coords.innerHTML = "x: " + x + " y: " + y;
}


$(window).on("click", function () {
    ws.send("hi");
});

$(window).on("beforeunload", function () {
	ws.close();
});

$(window).on("click", function(e) {
	hold = true;
	x = e.pageX;
	y = e.pageY;
	touch();
});


