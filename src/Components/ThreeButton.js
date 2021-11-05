import * as THREE from 'three';
import * as React from 'react';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { LottieLoader } from 'three/examples/jsm/loaders/LottieLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import 'three/examples/js/libs/lottie_canvas.js';

export function ThreeButton() {
    const ref = React.useRef();
    const [loaded, setLoaded] = React.useState(false);
    
    React.useEffect(() => {
        if(!loaded && ref) {

            let renderer, scene, camera;
			let mesh, mesh2, controls;

            scene = new THREE.Scene();

            renderer = new THREE.WebGLRenderer({antialias: false});
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
            camera.position.z = 2.5;

            controls = new OrbitControls( camera, renderer.domElement );
			controls.target.set( 0, 0.5, 0 );
			controls.update();
			controls.enablePan = false;
			controls.enableDamping = true;

            const loader1 = new LottieLoader();
            loader1.setQuality( 2 );
            loader1.load( 'texture/lottie/404_black.json', function ( texture ) {

                    setupControls( texture.animation );

                    const geometry = new RoundedBoxGeometry( 1, 0.5, 0.3, 7, 0.2 );
                    const material = new THREE.MeshStandardMaterial( { roughness: 0.1, map: texture } );
                    material.normalMapType = 1;
                    mesh = new THREE.Mesh( geometry, material );
                    mesh.position.x = -1;
                    scene.add( mesh );
                }, null, (e) => {
                    console.log("Error:" + e);
                }
            );

            const loader2 = new LottieLoader();
            loader2.setQuality( 2 );
            loader2.load( 'texture/lottie/loading_black.json', function ( texture ) {

                    setupControls( texture.animation );

                    const geometry = new RoundedBoxGeometry( 1, 1, 1, 7, 0.2 );
                    const material = new THREE.MeshStandardMaterial( { roughness: 0.1, map: texture } );
                    mesh2 = new THREE.Mesh( geometry, material );
                    mesh2.position.x = 1;
                    scene.add( mesh2 );
                }, null, (e) => {
                    console.log("Error:" + e);
                }
            );

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );

            const environment = new RoomEnvironment();
            const pmremGenerator = new THREE.PMREMGenerator( renderer );

            scene.environment = pmremGenerator.fromScene( environment ).texture;

            const setupControls = ( animation ) => {
                animation.play();
			};


            const animate = function () {
				requestAnimationFrame( animate );
                
                if ( mesh && mesh2) {
                    mesh.rotation.x += 0.01;
					mesh.rotation.y -= 0.01;

                    mesh2.rotation.y += 0.01;
				}

                controls.update();
				renderer.render( scene, camera );
			};

            const resize = ()  => {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            };

            animate();

            ref.current.appendChild(renderer.domElement);
            window.addEventListener("resize", resize);
            setLoaded(true);
        }
    }, [ref, loaded]);

    return <div ref={ref}/>;
}