"use strict";

var canvas;
var gl;

var numVertices  = 36;

var numChecks = 8;

var program;

var c;

var P = 1;

var flag = true;

var pointsArray = [];
var colorsArray = [];

// Boolean for direction

var direction = true;

// Boolean per switch projection

var proj = true;

// Boolean per switch shading

var shad = true; // Boolean per  shading

var modelmatrix;   // ModelMatrix

var viewmatrix;  // ViewMatrix

var projectionmatrix ; // projectionMatrix
var proj_Matrix=mat4(),model_Matrix=mat4(),view_Matrix=mat4();
// Setup chart

var projTypeA;
var shadTypeA;

// Setup Lookat values

var eye = vec3(0.0,0.0,1.0);
var at = vec3(0.0,0.0,0.0);
var up = vec3(0.0,0.1,0.0);


// Setup Projection values

// Orthogonal

var left = -1.0;
var  right = 1.0;
var bottom = -1.0;
var  ytop = 1.0;
var  near = 3;
var far = 0.03 ;

// Perspective

var fovy = 60;
var aspect = 1;

// Lights Setup

var lightPosition = vec4(1.0, 1.0, 2.0, 0.0 );
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

// Values for chosen material (Ruby)
var materialAmbient = vec4( 0.1745, 0.01175, 0.01175, 0.55) ;
var materialDiffuse = vec4(0.61424, 0.04136, 0.04136, 0.55);
var materialSpecular = vec4( 0.727811, 0.626959, 0.626959, 0.55 );
var materialShininess = 76.8;

var ambientColor, diffuseColor, specularColor;

// Construction cube


var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];
var vertexColors = [
   vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
   vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
   vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
   vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
   vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
   vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
   vec4( 0.0, 1.0, 1.0, 1.0 ),  // white
   vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


var normalsArray = [];
function quad(a, b, c, d) {
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = [45, 45, 45];

var trX = 0;
var trY = 0;
var trZ = 0;


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    //gl = canvas.getContext("experimental-gl");
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(normalsArray),gl.STATIC_DRAW);

    var nColor = gl.getAttribLocation(program,"vNormal");
    gl.vertexAttribPointer(nColor,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(nColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);


	gl.uniform4fv(gl.getUniformLocation(program, "vAmbientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "vDiffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "vSpecularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );

	 gl.uniform4fv(gl.getUniformLocation(program, "fAmbientProduct"),
     flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "fDiffuseProduct"),
     flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "fSpecularProduct"),
     flatten(specularProduct) );

    gl.uniform1f(gl.getUniformLocation(program,
     "vShininess"),materialShininess);

    gl.uniform1f(gl.getUniformLocation(program,
     "fShininess"),materialShininess);

     projectionmatrix = gl.getUniformLocation(program,"projectionmatrix");
     viewmatrix = gl.getUniformLocation(program,"viewmatrix");
     modelmatrix = gl.getUniformLocation(program,"modelmatrix");

     document.getElementById("X-AXIS").onclick = function(){axis = xAxis;};
     document.getElementById("Y-AXIS").onclick = function(){axis = yAxis;};
     document.getElementById("Z-AXIS").onclick = function(){axis = zAxis; };
     document.getElementById("TOGGLE BUTTON").onclick = function(){flag = !flag;};  
     document.getElementById("ORTHO").onclick = function(){proj = ! proj; document.getElementById("pjType").value=projTypeA;}; 
     document.getElementById("PERSPECT").onclick = function(){proj = ! proj; document.getElementById("pType").value=projTypeA;};   
     document.getElementById("SHADE").onclick = function(){shad = ! shad; document.getElementById("sjType").value=shadTypeA;};  
     document.getElementById("ORIENT").onclick = function(){ direction =! direction };
     document.getElementById("slider1").oninput = function(event) {           
    
           k = parseFloat(event.target.value,10) }
    
     document.getElementById("sliderX").onchange = function(event) {            
         trX= parseFloat(event.target.value,10);
        };
     document.getElementById("sliderY").onchange = function(event) {           
         trY= parseFloat(event.target.value,10);
        };
     document.getElementById("sliderZ").onchange = function(event) {            
         trZ= parseFloat(event.target.value,10); document.getElementById("slidez").value=trZ;
        };
      document.getElementById("Sliderfar").onchange = function(event) {        
           far = parseFloat(event.target.value,10); document.getElementById("farp").value=far;
        };
        document.getElementById("Slidernear").onchange = function(event) {       
           near = parseFloat(event.target.value,10);document.getElementById("nearp").value=near;
        };
        
    render();
}
var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if (!proj) projTypeA = "Orthogonal"; else projTypeA= "Perspective"
	if (!shad) shadTypeA = "Gouraud"; else shadTypeA= "Phong"

	if ((direction) && (!flag) ) theta[axis] -= 3.0;
	if ((!direction) && (!flag) ) theta[axis] += 3.0;
   if (!direction) {theta[axis] -= 3.0;}
   if(direction) { theta[axis] += 3.0;}

   //  Model matrix

   model_Matrix =  lookAt(eye, at , up);

   model_Matrix = mat4();
   view_Matrix = mat4();
   
	model_Matrix = mult(model_Matrix, scalem([P,P,P]));
   model_Matrix = mult(model_Matrix, translate([trX,trY,trZ]));
  model_Matrix = mult(model_Matrix, rotateX(theta[xAxis]));
  model_Matrix = mult(model_Matrix, rotateY(theta[yAxis] ));
  model_Matrix = mult(model_Matrix, rotateZ(theta[zAxis] ));

  proj_Matrix=ortho(left,right,bottom,ytop,near,far);
  gl.uniformMatrix4fv(projectionmatrix,false,flatten(proj_Matrix));
  gl.uniformMatrix4fv(viewmatrix,false,flatten(view_Matrix));
  gl.uniformMatrix4fv(modelmatrix,false,flatten(model_Matrix));

  gl.viewport(0,200,500,550);

  gl.drawArrays( gl.TRIANGLES, 0, numVertices );

  proj_Matrix=perspective(fovy, aspect, near, far);

  gl.uniformMatrix4fv(projectionmatrix,false,flatten(proj_Matrix));
  gl.uniformMatrix4fv(viewmatrix,false,flatten(view_Matrix));
  gl.uniformMatrix4fv(modelmatrix,false,flatten(model_Matrix));

  gl.viewport(500,200,500,550);

  gl.drawArrays( gl.TRIANGLES, 0, numVertices );

   requestAnimFrame(render);
}

   