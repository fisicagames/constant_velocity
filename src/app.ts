//import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    Engine, Scene, Color4, Color3, ArcRotateCamera,
    Vector3, HemisphericLight, Mesh, MeshBuilder,
    StandardMaterial, Sound, DynamicTexture
} from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";

//Color Palette: https://colorhunt.co/palette/1db9c37027a0c32badf56fad
//GUI: https://gui.babylonjs.com/#HEG7HH#13
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

        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(-3, 1, -0.5), scene);
        //var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.5 }, scene);


        var plane: Mesh = MeshBuilder.CreatePlane('plane', { width: 200, height: 10 }, scene);
        const materialPlane = new StandardMaterial("planoMaterial", scene);
        materialPlane.diffuseColor = new Color3(0.7, 0.7, 0.8);
        plane.material = materialPlane;
        plane.position = new Vector3(0, 0, 0);
        plane.rotation.x = Math.PI / 2;




        let planeCentreLine: Mesh = MeshBuilder.CreatePlane('planeCentreLine', { width: 6, height: 0.6 }, scene);
        const materialPlaneCentreLine = new StandardMaterial("materialPlaneCentreLine", scene);
        materialPlaneCentreLine.diffuseColor = new Color3(1, 1, 0);
        planeCentreLine.material = materialPlaneCentreLine;
        planeCentreLine.position = new Vector3(0, 0.1, 0);
        planeCentreLine.rotation.x = Math.PI / 2;


        var cube: Mesh = MeshBuilder.CreateBox('cube', { width: 4, height: 2, depth: 2 }, scene);
        const materialCube = new StandardMaterial("cubeMaterial", scene);
        materialCube.diffuseColor = new Color3(1, 0.2, 1);
        cube.material = materialCube;
        cube.position = new Vector3(0, 1, -2);

        cube.position.x = -40;// + Math.random() * 200;
        camera.target = cube.position;

        let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
        let textBlockEquation: TextBlock;

        ///////////
        let planeMileMarkers: Mesh = MeshBuilder.CreatePlane('planeMileMarkers', { width: 5, height: 4 }, scene);

        planeMileMarkers.position = new Vector3(0, 4, 6);
        planeMileMarkers.rotation.y = Math.PI / 2.5;
        //Set font

        var font_size = 48;
        var font = "bold " + font_size + "px Arial";

        //Set height for plane
        var planeHeight = 4;

        //Set height for dynamic texture
        var DTHeight = 1.5 * font_size; //or set as wished

        //Calculate ratio
        var ratio = planeHeight / DTHeight;

        //Set text
        var text = "1000 m";

        //Use a temporary dynamic texture to calculate the length of the text on the dynamic texture canvas
        var temp = new DynamicTexture("DynamicTextureTemp", 64, scene);
        var tmpctx = temp.getContext();
        tmpctx.font = font;
        var DTWidth = tmpctx.measureText(text).width + 8;

        //Calculate width the plane has to be 
        var planeWidth = DTWidth * ratio;

        var dynamicTexture = new DynamicTexture("DynamicTexture", { width: DTWidth, height: DTHeight }, scene, false);
        var mat = new StandardMaterial("mat", scene);
        mat.diffuseTexture = dynamicTexture;
        dynamicTexture.drawText(text, null, null, font, "#ffffff", "#007700", true);
        planeMileMarkers.material = mat;


        //todo: move and combine this async function into a bigger scene function 
        async function createGUI() {
            let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/gui/guiTexture.json");

            textBlockEquation = advancedTexture.getControlByName("TextBlockEquation") as TextBlock;
            textBlockEquation.text = "s(t) =  ?  +  ?   * t ";

            engine.runRenderLoop(() => {
                scene.render();

                cube.position.x += 0.2;
                //camera.position.x = cube.position.x - 3;
                camera.position = new Vector3(cube.position.x - 4, 3, -4);
                camera.radius = 54;
                camera.target = cube.position;

                textBlockEquation.text = `${cube.position.x.toFixed(1)} =  ?  +  ?   * t `;


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