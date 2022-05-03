
//import { AnaglyphEffect } from './jsm/effects/AnaglyphEffect.js';

//const { render } = require("express/lib/response");

var uid = Date.now();
var ws = new WebSocket("ws://localhost:7474");

let clickX = 0;
let clickY = 0;

const objs = [];

let container, camera, scene, renderer, effect;

let numGroups = 6;
let particleGroups = [];
let particleSystems = [];
let particleGeos = [];

let uniforms;

const particles = 1000;

// Wave configuration
var wavespeed = 1;
var wavewidth = 0.4;
var waveheight = 0.4;
var objects_margin = 20;
//Array
var waveobjects = new Array();

let clock = new THREE.Clock();

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
	const radius = 0.4;

	for (let i = 0; i < numGroups; i++) {
		let particleSystem, particleGeometry;

		particleGeometry = new THREE.BufferGeometry();
		const positions = [];
		const colors = [];
		const sizes = [];
		const color = new THREE.Color();
		for (let i = 0; i < particles; i ++) {
			//let x = (Math.random()
			positions.push( ( Math.random() * 2 - 1 ) * radius );
			positions.push( ( Math.random() * 2 - 1 ) * radius );
			positions.push( ( Math.random() * 2 - 1 ) * radius );
			color.setHSL( i / particles, 1.0, 0.5 );
			colors.push( color.r, color.g, color.b );
			sizes.push( 0.5 );
		}

		particleGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
		particleGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
		particleGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

		particleSystem = new THREE.Points( particleGeometry, shaderMaterial );
		particleGroups.push([particleSystem, particleGeometry]);
		scene.add( particleSystem );
	}


	// the sun
	const sunColor = new THREE.Color();
	//sunColor.setHSL(0.51, 0.95, 0.54);
	const geometrySphere = new THREE.SphereGeometry(0.7, 32, 16 );
	geometrySphere.center();
	//geometrySphere.setAttribute('color', sunColor);
	const material = new THREE.MeshBasicMaterial( { color: 0xFDB813 } );
	const sun = new THREE.Mesh(geometrySphere, material);
	scene.add(sun);

}
function animate_obj() {
	const timer = 0.005 * Date.now();
	var delta = clock.getDelta();
    var elapsed = clock.elapsedTime;

	for (let p = 0; p < numGroups; p++) {
		let particleSystem = particleGroups[p][0];
		let particleGeometry = particleGroups[p][1];

		particleSystem.rotation.z = 0.005 * timer;
		particleSystem.position.y = Math.sin( (elapsed + 
			particleSystem.position.x / wavewidth) + 
			(particleSystem.position.z / wavewidth)  * 
			wavespeed ) * waveheight;

		particleSystem.position.x = Math.cos( (elapsed + 
			particleSystem.position.y / wavewidth) + 
			(particleSystem.position.z / wavewidth)  * 
			wavespeed ) * waveheight;
		const sizes = particleGeometry.attributes.size.array
		
		for ( let i = 0; i < particles; i ++ ) {
			sizes[ i ] = 0.05 * ( 1 + Math.sin( 0.1 * i + timer ) );
		}
		particleGeometry.attributes.size.needsUpdate = true;
	}



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


