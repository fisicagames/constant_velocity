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
import { Engine, Scene, Color4, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
class App {
    constructor() {
        var canvas = document.createElement("canvas");
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
        console.log(canvas.style.width, canvas.style.height);
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);
        scene.clearColor = Color4.FromHexString("#1DB9C3");
        var camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.position = new Vector3(0, 3, -3);
        var light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        var plane = MeshBuilder.CreatePlane('plane', { width: 20, height: 10 }, scene);
        plane.position = new Vector3(0, 0, 0);
        plane.rotation.x = Math.PI / 2;
        var cube = MeshBuilder.CreateBox('cube', { width: 5, height: 5, depth: 5 }, scene);
        let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
        function createGUI() {
            return __awaiter(this, void 0, void 0, function* () {
                let loadedGUI = yield advancedTexture.parseFromURLAsync("./assets/gui/guiTexture.json");
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
        engine.runRenderLoop(() => {
            scene.render();
        });
        window.addEventListener("resize", function () {
            engine.resize();
        });
    }
}
new App();
