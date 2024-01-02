var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "@babylonjs/inspector";
import { Engine, Scene, Color4, Color3, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Sound } from "@babylonjs/core";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
class App {
    constructor() {
        const canvas = document.createElement("canvas");
        let adjustCanvas = function () {
            let screenW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            let screenH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            if (screenH / screenW < 1.8) {
                canvas.style.width = "56svh";
                canvas.style.height = "100svh";
            }
            else {
                canvas.style.width = "98svw";
                canvas.style.height = "94svh";
            }
        };
        adjustCanvas();
        console.log(canvas.style.width, canvas.style.height);
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);
        scene.clearColor = Color4.FromHexString("#1DB9C3");
        const music = new Sound("Music", "public/assets/sounds/positive-way-124550.mp3", scene, null, {
            loop: true,
            autoplay: true,
        });
        const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, false);
        camera.position = new Vector3(-3, 6, -3);
        camera.radius = 54;
        var light1 = new HemisphericLight("light1", new Vector3(0.5, 1, 0), scene);
        var plane = MeshBuilder.CreatePlane('plane', { width: 200, height: 10 }, scene);
        const materialPlane = new StandardMaterial("planoMaterial", scene);
        materialPlane.diffuseColor = new Color3(0.7, 0.7, 0.8);
        plane.material = materialPlane;
        plane.position = new Vector3(0, 0, 0);
        plane.rotation.x = Math.PI / 2;
        var planeCentreLine = MeshBuilder.CreatePlane('planeCentreLine', { width: 4, height: 0.2 }, scene);
        const materialPlaneCentreLine = new StandardMaterial("materialPlaneCentreLine", scene);
        materialPlaneCentreLine.diffuseColor = new Color3(1, 1, 0);
        planeCentreLine.material = materialPlaneCentreLine;
        planeCentreLine.position = new Vector3(0, 0.1, 0);
        planeCentreLine.rotation.x = Math.PI / 2;
        var cube = MeshBuilder.CreateBox('cube', { width: 4, height: 2, depth: 2 }, scene);
        const materialCube = new StandardMaterial("cubeMaterial", scene);
        materialCube.diffuseColor = new Color3(1, 0.2, 1);
        cube.material = materialCube;
        cube.position = new Vector3(0, 1, -2);
        cube.position.x = -100 + Math.random() * 200;
        camera.target = cube.position;
        let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
        let textEquation;
        function createGUI() {
            return __awaiter(this, void 0, void 0, function* () {
                let loadedGUI = yield advancedTexture.parseFromURLAsync("./assets/gui/guiTexture.json");
                textEquation = advancedTexture.getControlByName("TextEquation");
                textEquation.text = "s(t) =  ?  +  ?   * t ";
                engine.runRenderLoop(() => {
                    scene.render();
                    cube.position.x += 0.2;
                    camera.position = new Vector3(cube.position.x - 4, 3, -3);
                    camera.radius = 54;
                    camera.target = cube.position;
                    textEquation.text = `${cube.position.x.toFixed(1)} =  ?  +  ?   * t `;
                });
            });
        }
        createGUI();
        window.addEventListener("keydown", (ev) => {
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                }
                else {
                    scene.debugLayer.show();
                }
            }
        });
        window.addEventListener("resize", function () {
            adjustCanvas();
            engine.resize();
        });
    }
}
new App();
