//import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, Color4, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";

//https://colorhunt.co/palette/1db9c37027a0c32badf56fad
//https://gui.babylonjs.com/#HEG7HH#11
//Mobile simulator - responsive testing tool
//https://chromewebstore.google.com/detail/mobile-simulator-responsi/ckejmhbmlajgoklhgbapkiccekfoccmk
//see todos in the code


class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");

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
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);
        scene.clearColor = Color4.FromHexString("#1DB9C3");


        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.position = new Vector3(-3, 3, -3);
        camera.radius = 54;
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        //var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.5 }, scene);
        var plane: Mesh = MeshBuilder.CreatePlane('plane', { width: 20, height: 10 }, scene);
        plane.position = new Vector3(0, 0, 0);
        plane.rotation.x = Math.PI / 2;
        var cube: Mesh = MeshBuilder.CreateBox('cube', { width: 4, height: 2, depth: 2 }, scene);
        cube.position.y = 1;

        cube.position.x = -10 + Math.random() * 20;
        camera.target = cube.position;


        let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
        let textEquation: TextBlock;

        //todo: move and combine this async function into a bigger scene function 
        async function createGUI() {
            let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/gui/guiTexture.json");
            
            textEquation = advancedTexture.getControlByName("TextEquation") as TextBlock;
            textEquation.text = "s(t) =  ?  +  ?   * t ";

            engine.runRenderLoop(() => {
                scene.render();
    
                cube.position.x += 0.2;
                //camera.position.x = cube.position.x - 3;
                camera.position = new Vector3(cube.position.x - 3, 3, -3);
                camera.radius = 54;
                camera.target = cube.position;
    
                textEquation.text = `${cube.position.x.toFixed(1)} =  ?  +  ?   * t `;
    
    
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