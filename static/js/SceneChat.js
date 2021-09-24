import { Scene, MathUtils, DirectionalLight, PlaneGeometry, Vector2, Color, DoubleSide, LinearFilter, ACESFilmicToneMapping, RGBAFormat, sRGBEncoding, MeshBasicMaterial, Mesh, TextureLoader, PerspectiveCamera, Vector3, WebGLRenderer,WebGLMultisampleRenderTarget, WebGLRenderTarget, Clock } from 'three/build/three.module.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export class SceneChat {
    constructor(animation) {
        
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        this.animation = animation;
   
        this.mouse = new Vector2();
      
        this.target = new Vector2();
      
        this.windowHalf = new Vector2( window.innerWidth / 2, window.innerHeight / 2 );


        //HTML
        this.canvas = document.querySelector('canvas.webgl')
       
     
        this.scene = new Scene();
        this.scene.background = new Color(255,255,255)
     

        this.textureLoader = new TextureLoader()
        this.clock = new Clock()
        this.controls;
      
        // RENDER 
        this.renderer = new WebGLRenderer( { antialias: true, canvas: this.canvas } );
        this.renderer.outputEncoding = sRGBEncoding
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.toneMapping = ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 1;
        
        this.RenderTargetClass = null;

        if(this.renderer.getPixelRatio() < 1 || this.renderer.getPixelRatio() === 1 && this.renderer.capabilities.isWebGL2) {
             this.RenderTargetClass = WebGLMultisampleRenderTarget
            //  console.log('Using WebGLMultisampleRenderTarget')
         }
         else {
             this.RenderTargetClass = WebGLRenderTarget
            //  console.log('Using WebGLRenderTarget')
         }
 
         // Render Target
        this.renderTarget = new this.RenderTargetClass(
             800,
             600,
             {
                 minFilter: LinearFilter,
                 magFilter: LinearFilter,
                 format:RGBAFormat,
                 encoding: sRGBEncoding
             }
         )
       

        this.camera = new PerspectiveCamera(16, this.sizes.width / this.sizes.height, 0.1, 100)

        this.camera.position.set(0, 1, 30)
   


        this.scene.add(this.camera)
        this.oldElapsedTime = 0;

        //sun
        this.effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 2,
            azimuth: 180,
            exposure: this.renderer.toneMappingExposure
        };

       
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath( '../assets/js/draco/' );
        this.loader.setDRACOLoader(  this.dracoLoader );
        this.loadModel('../assets/3D/plane2.glb')


            
        this.resize()
        this.animate()
      

        this.canvas.addEventListener('mousemove', this.onMouseMove, false );

        window.addEventListener("resize", () => {
            this.resize()
        });


        this.sceneTexture = this.textureLoader.load('../assets/img/2442-min.jpg')
        this.sceneTexture.encoding = sRGBEncoding
        this.sceneTexture.flipY = false;

        this.playerTexture = this.textureLoader.load('../assets/img/fleur.png')
        this.playerTexture.encoding = sRGBEncoding
        this.playerMaterial = new MeshBasicMaterial();
        const planeWidth = 1;
        const planeHeight = 1;
        this.geometry = new PlaneGeometry(planeWidth, planeHeight);

        this.material = new MeshBasicMaterial({
            // color: new Color(255,255,255),
            map: this.playerTexture,
            // alphaTest: 0.01,
            opacity:0,
            transparent: true,
            side: DoubleSide,
        });

        this.part1;
        this.part2;
        this.part3;
        this.part4;
        this.part5;

        this.part1Texture = this.textureLoader.load('../assets/img/giorgia_o_keef_texture_1-min.png')
        this.part2Texture = this.textureLoader.load('../assets/img/giorgia_o_keef_texture_2-min.png')
        this.part3Texture = this.textureLoader.load('../assets/img/giorgia_o_keef_texture_3-min.png')
        this.part4Texture = this.textureLoader.load('../assets/img/giorgia_o_keef_texture_5-min.png')
        this.part5Texture = this.textureLoader.load('../assets/img/giorgia_o_keef_texture_6-min.jpg')


        this.part1Texture.flipY = false;
        this.part1Texture.encoding = sRGBEncoding
        
        this.part2Texture.flipY = false;
        this.part2Texture.encoding = sRGBEncoding

        this.part3Texture.flipY = false;
        this.part3Texture.encoding = sRGBEncoding

        this.part4Texture.flipY = false;
        this.part4Texture.encoding = sRGBEncoding

        this.part5Texture.flipY = false;
        this.part5Texture.encoding = sRGBEncoding



        this.addLights(-1,  2,  4);
        this.addLights( 1, -1, -2);

        this.usersId = [];
    }

    onMouseMove = (e) => {
          
        this.mouse.x = ( e.clientX - this.windowHalf.x );
        this.mouse.y = ( e.clientY - this.windowHalf.x ); 

        this.camera.position.y = (e.clientY - window.innerHeight * 0.5) * 0.02;
        this.camera.position.x = (e.clientX - window.innerWidth * 0.5) * 0.0001;

    }

    addLights(x,y,z) {
       
            const color = 0xff4c4c
            
            const intensity = 1;
            const light = new DirectionalLight(color, intensity);
            light.position.set(x, y, z);
            this.scene.add(light);
        
        
    }

    loadModel(url) {
        this.loader.load(url, (gltf) => { 
            gltf.scene.scale.set(30,30,30)

            this.part1 = gltf.scene.children.find((child) => child.name === "giorgia_o'keef_texture_1")
            this.part2 = gltf.scene.children.find((child) => child.name === "giorgia_o'keef_texture_2_2")
            this.part3 = gltf.scene.children.find((child) => child.name === "giorgia_o'keef_texture_3-3")
            this.part4 = gltf.scene.children.find((child) => child.name === "giorgia_o'keef_texture_4-4")
            this.part5 = gltf.scene.children.find((child) => child.name === "giorgia_o'keef_texture_5-5")

            this.part1.material =  new MeshBasicMaterial({
              
                map: this.part1Texture,
                alphaTest: 1,
               
                transparent: true,
                side: DoubleSide,
            });
        
            this.part2.material =  new MeshBasicMaterial({
               
                map: this.part2Texture,
                alphaTest: 0.8,
               
                transparent: true,
                side: DoubleSide,
            });

            this.part3.material =  new MeshBasicMaterial({
               
                map: this.part3Texture,
                alphaTest: 0.7,
                transparent: true,
                side: DoubleSide,
            });

            this.part4.material =  new MeshBasicMaterial({
              
                map: this.part4Texture,
                alphaTest: 0.5,
                transparent: true,
                side: DoubleSide,
            });

            this.part5.material =  new MeshBasicMaterial({

                map: this.part5Texture,
                alphaTest: 0.4,
                transparent: true,
                side: DoubleSide,
            });
        
    

            this.part1.material.opacity = 0.95
            this.part2.material.opacity = 0.85
            this.part3.material.opacity = 0.73
            this.part4.material.opacity = 0.75
            this.part5.material.opacity = 0.60

            this.scene.add( gltf.scene );

        })
    }

   

    disposeUserMesh(id) {
        this.oldUser = this.scene.getObjectByName(id) 

        if(this.oldUser !== undefined) {
            this.animation.userDisappear(this.oldUser)
        }
    
        
        setTimeout(() => {
            this.scene.remove(this.oldUser)
            this.animate()
        }, 2000);
    
    }
    
    newUserMesh(id) {
      
        this.mesh = new Mesh(this.geometry, this.material)
        this.mesh.name = id;    

        this.mesh.position.x = Math.random() * -4;
        this.mesh.position.y = Math.random() * 4;
        this.mesh.position.z = Math.random() * -20;
        this.scene.add(this.mesh)

        this.usersId.push(id)

        this.animation.newUserShow(this.mesh)
    }
    

    resize() {
      
        // Update sizes
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight
        
        // Update camera
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
        
        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      
    }

   
    animate() {
    
        
	    this.target.x = ( 1 -  this.mouse.x ) * 0.0001;
        this.target.y = ( 1 -  this.mouse.y ) * 0.0003;
    
        this.camera.rotation.x += 0.05 * (  this.target.y - this.camera.rotation.x );
        this.camera.rotation.y += 0.05 * (  this.target.x - this.camera.rotation.y )
        

        requestAnimationFrame(this.animate.bind(this));

        const time = performance.now() / 1000
        const dt = time - this.lastCallTime
        this.lastCallTime = time

        this.renderer.render(this.scene, this.camera);
        
       
    
    }

}