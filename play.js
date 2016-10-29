THREE = require('three');
Canvas = require('canvas');

require('three/examples/js/renderers/Projector');
require('three/examples/js/renderers/SoftwareRenderer');
require('three/examples/js/renderers/CanvasRenderer');
const fs = require('fs');

/*
 * Attempt to use three.js in node.js
 * 29 Oct 2016
 *
 * Also see,
 *  ascii_effect
 *  https://github.com/mrdoob/three.js/issues/7085
 *  https://github.com/mrdoob/three.js/issues/2182
 *  examples/canvas_ascii_effect.html
 */

let y_scale = 2;
let rendering_scale = 0.25;
let width = 640 * rendering_scale;
let height = 480 * rendering_scale;


// Set up fake canvas
canvas = new Canvas()
canvas.style = {};
const { scene } = require('./scene');

const camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
camera.position.y = 150;
camera.position.z = 500;

const params = {
	canvas: canvas, // pass in fake canvas
};

function resize(w, h) {
	width = w;
	height = h;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	canvas.width = w;
	canvas.height = h;
	renderer.setSize(w, h);
}


// renderer = new THREE.SoftwareRenderer(params); // TODO pass in raw arrays and render that instead
renderer = new THREE.CanvasRenderer(params);
// renderer.setClearColor( 0xf0f0f0 );
renderer.render(scene, camera);

function saveCanvas() {
	// Write canvas to file
	const out = fs.createWriteStream("./test-out4.png");
	const canvasStream = canvas.pngStream().pipe(out);
}


var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true,
  fullUnicode: true
});

screen.title = 'Three.js Terminal';


// placeholder for renderering
var icon = blessed.image({
	parent: screen,
	top: 0,
	left: 0,
	type: 'ansi',
	width: '100%',
	height: '100%',
	//   border: { type: 'line' },
	search: false
});


var box = blessed.box({
	parent: screen,
	top: '0',
	left: '0',
	width: 'shrink',
	height: 'shrink',
	content: '{bold}Logs{/bold}\n',
	tags: true,
	border: {
		type: 'line'
	},
	style: {
		fg: 'white',
		// bg: 'magenta',
		border: {
			fg: '#f0f0f0'
		},
		hover: {
			bg: 'green'
		}
	}
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0);
});

// Focus our element.
box.focus();
box.on('click', clearlog);

// Render the screen.
screen.render();

screen.on('mousedown', function(e) {
	// e.action === 'mousedown';
	log('mouse', e.x, e.y, screen.width, screen.height);
});

screen.program.on('response', function(e) {
	console.error('res', e);
})

// This doesn't seem to work so well, so use screen.program
screen.on('resize', function(e) {
	console.log('resizing', e);
});

screen.program.on('resize', e => {
	console.error('resize', screen.program.columns,
	screen.program.rows);
});

// screen.program.getWindowSize((e, res) => {
// 	console.error('window size', e);
// 	/*
// 	{ event: 'window-manipulation',
// 		code: '',
// 		type: 'textarea-size',
// 		size: { height: 44, width: 127 },
// 		height: 44,
// 		width: 127,
// 		textAreaSizeCharacters: { height: 44, width: 127 } }
// 	*/
// })

screen.program.manipulateWindow(14, (e, res) => {
	console.error('pixel size', res);
	const fontWidth = res.width
		/ screen.width;
	const fontHeight = res.height
		/ screen.height;

	y_scale = fontHeight / fontWidth;
	console.error('font', fontWidth, fontHeight, y_scale);

	width = res.width * rendering_scale | 0;
	height = res.height * rendering_scale | 0;
	console.error('using ', width, height);
	resize(width, height);
	/*
	{ event: 'window-manipulation',
		code: '',
		type: 'window-size-pixels',
		size: { height: 830, width: 1375 },
		height: 830,
		width: 1375,
		windowSizePixels: { height: 830, width: 1375 } }
	*/
})

function render() {
	const timer = Date.now() - start;
	sphere.position.y = Math.abs( Math.sin( timer * 0.002 ) ) * 150;
	sphere.rotation.x = timer * 0.0003;
	sphere.rotation.z = timer * 0.0002;
}

const start = Date.now();

setInterval( () => {
	// log(screen.width, screen.height);
	// resize(screen.width, screen.height * y_scale);
	const start = Date.now()
	render();
	renderer.render(scene, camera);
	icon.setImage(canvas.toBuffer())
	screen.render();
	// saveCanvas();
	const done = Date.now()
	log('Time took', done - start);
	// console.timeEnd('render');
}, 30)

function log(...args) {
	box.setContent(
		box.getContent() +
		args.join('\t') + '\n');
}

function clearlog() {
	box.setContent('{bold}Logs{/bold}\n');
}