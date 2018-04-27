main();

function main() {
}

function initGL(canvas) {
	const gl = canvas.getContext("webgl");
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
	}
	return gl;
}

function webGLStart() {
	const canvas = document.querySelector("#glCanvas");
	// Initialize the GL context
	const gl = initGL(canvas);

	// Set clear color to black, fully opaque
	gl.clearColor(100.0, 100.0, 0.0, 1.0);
	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);
}

