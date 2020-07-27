let scene, camera, renderer, cube,controls,obj1;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  controls = new THREE.OrbitControls(camera, renderer.domElement)

  // var geometry = new THREE.BoxGeometry();
  // var texture = new THREE.TextureLoader().load('texture/box.jpeg');
  // console.log(texture);
  // var material = new THREE.MeshBasicMaterial( { map: texture } );
  // cube = new THREE.Mesh( geometry, material );
  // scene.add( cube );
  var ambientLight = new THREE.AmbientLight( 0xcccccc, 2);
				scene.add( ambientLight );

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath( 'models/' );
  var url = "bike.mtl";
  mtlLoader.load( url, function( materials ) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.setPath( 'models/' );
    objLoader.load( 'bike.obj', function ( object ) {
        obj1 = object
        scene.add( obj1 );

    });

  });


  camera.position.z = 50;
}

function update() {


}
function onWindowRezize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function startRendering() {
	requestAnimationFrame( startRendering );
  update();
	renderer.render( scene, camera );
}

init()
startRendering();

window.addEventListener('resize', onWindowRezize,false);
