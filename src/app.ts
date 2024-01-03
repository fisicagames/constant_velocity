//import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    Engine, Scene, Color4, Color3, ArcRotateCamera,
    Vector3, HemisphericLight, Mesh, MeshBuilder,
    StandardMaterial, Sound, DynamicTexture
} from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";

//Color Palette: https://colorhunt.co/palette/1db9c37027a0c32badf56fad
//GUI: https://gui.babylonjs.com/#HEG7HH#14
//Mobile Simulator: https://chromewebstore.google.com/detail/mobile-simulator-responsi/ckejmhbmlajgoklhgbapkiccekfoccmk
//Music1: https://pixabay.com/pt/music/pop-positive-way-124550/
//Music2: https://pixabay.com/pt/music/musicas-felizes-para-criancas-first-steps-141242/
//DynamicTexture Thousands Cubes: https://forum.babylonjs.com/t/optimizing-scene-with-lots-thousands-of-2d-text-labels-in-3d-space/25666
//DynamicTexture text to Plane: https://playground.babylonjs.com/#TMHF80


//see todos in the code


class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        const canvas = document.createElement("canvas");

        let adjustCanvas = function () {
            let screenW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            let screenH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            //console.log(screenH, screenW, screenH / screenW);
            if (screenH / screenW < 1.8) {
                canvas.style.width = "56svh";
                canvas.style.height = "100svh"
            }
            else {
                canvas.style.width = "98svw";
                canvas.style.height = "94svh"
            }

        }
        adjustCanvas();



        console.log(canvas.style.width, canvas.style.height);
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);
        scene.clearColor = Color4.FromHexString("#1DB9C3");

        const music = new Sound("Music", "public/assets/sounds/first-steps-141242.mp3", scene, null, {
            loop: true,
            autoplay: true,
        });

        const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        //camera.attachControl(canvas, false);
        camera.position = new Vector3(-3, 6, -3);
        camera.radius = 54;

        let light1: HemisphericLight = new HemisphericLight("light1", new Vector3(-3, 1, -0.5), scene);
        //let  sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.5 }, scene);


        let plane: Mesh = MeshBuilder.CreatePlane('plane', { width: 200, height: 10 }, scene);
        const materialPlane = new StandardMaterial("planoMaterial", scene);
        materialPlane.diffuseColor = new Color3(0.7, 0.7, 0.8);
        plane.material = materialPlane;
        plane.position = new Vector3(0, 0, 0);
        plane.rotation.x = Math.PI / 2;



        ////////////////////////////////


        let cube: Mesh = MeshBuilder.CreateBox('cube', { width: 4, height: 2, depth: 2 }, scene);
        const materialCube = new StandardMaterial("cubeMaterial", scene);
        materialCube.diffuseColor = new Color3(1, 0.2, 1);
        cube.material = materialCube;
        cube.position = new Vector3(0, 1, -2);

        let xVelocity: number = 0.3;

        cube.position.x = -40;// + Math.random() * 200;
        camera.target = cube.position;

        let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
        let textBlockEquation: TextBlock;

        ////////////////////////////////

        const planeCentreLines: PlaneCentreLine[] = [];
        const materialPlaneCentreLine = new StandardMaterial("materialPlaneCentreLine", scene);
        materialPlaneCentreLine.diffuseColor = new Color3(1, 1, 0);
        
        class PlaneCentreLine {
            mesh: Mesh;
            x: number;

            constructor(x: number) {
                this.mesh = MeshBuilder.CreatePlane(`planeCentreLine ${x}`, { width: 8, height: 0.5 }, scene);
             
                this.mesh.material = materialPlaneCentreLine;
                this.mesh.position = new Vector3(x, 0.1, 0);
                this.mesh.rotation.x = Math.PI / 2;

            }
        }

        ////////////////////////////////

        const planeMileMarkers: PlaneMileMarker[] = [];

        class PlaneMileMarker {

            mesh: Mesh;
            tempDynamicTexture: DynamicTexture;
            dynamicTexture: DynamicTexture;
            mat: StandardMaterial;
            xPosition: number;


            constructor(xPosition = 0) {
                this.mesh = MeshBuilder.CreatePlane(`planeMileMarker ${xPosition}`, { width: 5, height: 3 }, scene);
                this.mesh.position = new Vector3(xPosition * 2, 4, 6);
                this.mesh.rotation.y = Math.PI / 2.5;

                const font_size: number = 48;
                const font: string = "normal " + font_size + "px Arial";
                const planeHeight: number = 4;

                //Set height for dynamic texture
                const DTHeight: number = 1.5 * font_size; //or set as wished

                //Calculate ratio
                const ratio: number = planeHeight / DTHeight;

                //Set text
                let text: string = `${xPosition} m`;

                //Use a temporary dynamic texture to calculate the length of the text on the dynamic texture canvas
                this.tempDynamicTexture = new DynamicTexture(`DynamicTextureTemp${xPosition}`, 64, scene);
                let tempCtx = this.tempDynamicTexture.getContext();
                tempCtx.font = font;
                let DTWidth = tempCtx.measureText(text).width + 8;

                //Calculate width the plane has to be 
                let planeWidth = DTWidth * ratio;

                this.dynamicTexture = new DynamicTexture(`DynamicTexture${xPosition}`, { width: DTWidth, height: DTHeight }, scene, false);
                this.mat = new StandardMaterial(`mat${xPosition}`, scene);
                this.mat.diffuseTexture = this.dynamicTexture;
                this.dynamicTexture.drawText(text, null, null, font, "#ffffff", "#007700", true);
                this.mesh.material = this.mat;
                
            }

            dispose(){
                this.mesh.dispose();
                this.tempDynamicTexture.dispose();
                this.dynamicTexture.dispose();
                this.mat.dispose();

            }
        }
        ////////////////////////////////

        let lastCentreLinePosition, lastMileMarkerPosition: number = 0;
        
        for (let i = -50; i < 50; i += 10) {
            let planeMileMarker = new PlaneMileMarker(i);
            planeMileMarkers.push(planeMileMarker);
            lastMileMarkerPosition = i;

            
            let planeCentreLine: PlaneCentreLine = new PlaneCentreLine(i*2);
            planeCentreLines.push(planeCentreLine);
            lastCentreLinePosition = i *2;


            
        }

        ////////////////////////////////



        //todo: move and combine this async function into a bigger scene function 
        async function createGUI() {
            let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/gui/guiTexture.json");

            textBlockEquation = advancedTexture.getControlByName("TextBlockEquation") as TextBlock;
            textBlockEquation.text = "s(t) =  ?  +  ?   * t ";

            engine.runRenderLoop(() => {
                scene.render();

                cube.position.x += xVelocity;
                plane.position.x = cube.position.x
                //camera.position.x = cube.position.x - 3;
                camera.position = new Vector3(cube.position.x - 4, 3, -4);
                camera.radius = 54;
                camera.target = cube.position;

                textBlockEquation.text = (cube.position.x/2 ).toFixed(1).toString() +" =  ?  +  ?   * t ";
                //console.log(cube.position.x, planeMileMarkers[0].mesh.position.x);
                if( xVelocity > 0 ){
                    for(let i in planeMileMarkers){
                        if(cube.position.x - 50   > planeMileMarkers[i].mesh.position.x ){
                            planeMileMarkers[i].dispose();  
                            planeMileMarkers[i] = new PlaneMileMarker(lastMileMarkerPosition);
                            lastMileMarkerPosition += 10;
                            //planeCentreLines[i].mesh.position.x += 50;
   
                        }
                    }
                }

            });

        }
        createGUI()


        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop


        // Resize
        window.addEventListener("resize", function () {

            adjustCanvas();
            engine.resize();

        });
    }
}
new App();