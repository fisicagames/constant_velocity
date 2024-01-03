var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Engine, Scene, Color4, Color3, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Sound, DynamicTexture } from "@babylonjs/core";
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
        const music = new Sound("Music", "./assets/sounds/first-steps-141242_compress.mp3", scene, null, {
            loop: true,
            autoplay: true,
        });
        const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.position = new Vector3(-3, 6, -3);
        camera.radius = 54;
        let light1 = new HemisphericLight("light1", new Vector3(-3, 1, -0.5), scene);
        let plane = MeshBuilder.CreatePlane('plane', { width: 200, height: 10 }, scene);
        const materialPlane = new StandardMaterial("planoMaterial", scene);
        materialPlane.diffuseColor = new Color3(0.7, 0.7, 0.8);
        plane.material = materialPlane;
        plane.position = new Vector3(0, 0, 0);
        plane.rotation.x = Math.PI / 2;
        let cube = MeshBuilder.CreateBox('cube', { width: 4, height: 2, depth: 2 }, scene);
        const materialCube = new StandardMaterial("cubeMaterial", scene);
        materialCube.diffuseColor = new Color3(1, 0.2, 1);
        cube.material = materialCube;
        cube.position = new Vector3(0, 1, -2);
        let xVelocity = 1;
        cube.position.x = 0;
        camera.target = cube.position;
        let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
        let textBlockEquation;
        const planeCentreLines = [];
        const materialPlaneCentreLine = new StandardMaterial("materialPlaneCentreLine", scene);
        materialPlaneCentreLine.diffuseColor = new Color3(1, 1, 0);
        class PlaneCentreLine {
            constructor(x) {
                Object.defineProperty(this, "mesh", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "x", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.mesh = MeshBuilder.CreatePlane(`planeCentreLine ${x}`, { width: 8, height: 0.5 }, scene);
                this.mesh.material = materialPlaneCentreLine;
                this.mesh.position = new Vector3(x, 0.1, 0);
                this.mesh.rotation.x = Math.PI / 2;
            }
        }
        const planeMileMarkers = [];
        class PlaneMileMarker {
            constructor(xPosition = 0) {
                Object.defineProperty(this, "mesh", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "tempDynamicTexture", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "dynamicTexture", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "mat", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                Object.defineProperty(this, "xPosition", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.mesh = MeshBuilder.CreatePlane(`planeMileMarker ${xPosition}`, { width: 5, height: 3 }, scene);
                this.mesh.position = new Vector3(xPosition * 2, 4, 6);
                this.mesh.rotation.y = Math.PI / 2.5;
                const font_size = 48;
                const font = "normal " + font_size + "px Arial";
                const planeHeight = 4;
                const DTHeight = 1.5 * font_size;
                const ratio = planeHeight / DTHeight;
                let text = `${xPosition} m`;
                this.tempDynamicTexture = new DynamicTexture(`DynamicTextureTemp${xPosition}`, 64, scene);
                let tempCtx = this.tempDynamicTexture.getContext();
                tempCtx.font = font;
                let DTWidth = tempCtx.measureText(text).width + 8;
                let planeWidth = DTWidth * ratio;
                this.dynamicTexture = new DynamicTexture(`DynamicTexture${xPosition}`, { width: DTWidth, height: DTHeight }, scene, false);
                this.mat = new StandardMaterial(`mat${xPosition}`, scene);
                this.mat.diffuseTexture = this.dynamicTexture;
                this.dynamicTexture.drawText(text, null, null, font, "#ffffff", "#007700", true);
                this.mesh.material = this.mat;
            }
            dispose() {
                this.mesh.dispose();
                this.tempDynamicTexture.dispose();
                this.dynamicTexture.dispose();
                this.mat.dispose();
            }
        }
        let lastMileMarkerPosition = 0;
        for (let i = -200; i < 200; i += 10) {
            let planeMileMarker = new PlaneMileMarker(i);
            planeMileMarkers.push(planeMileMarker);
            lastMileMarkerPosition = i;
            let planeCentreLine = new PlaneCentreLine(i * 2);
            planeCentreLines.push(planeCentreLine);
        }
        function createGUI() {
            return __awaiter(this, void 0, void 0, function* () {
                let loadedGUI = yield advancedTexture.parseFromURLAsync("./assets/gui/guiTexture.json");
                textBlockEquation = advancedTexture.getControlByName("TextBlockEquation");
                textBlockEquation.text = "s(t) =  ?  +  ?   * t ";
                let time = 0;
                engine.runRenderLoop(() => {
                    scene.render();
                    time += engine.getDeltaTime() / 1000;
                    cube.position.x += xVelocity * 2 * engine.getDeltaTime() / 1000;
                    plane.position.x = cube.position.x;
                    camera.position = new Vector3(cube.position.x - 4, 3, -4);
                    camera.radius = 54;
                    camera.target = cube.position;
                    textBlockEquation.text = (cube.position.x / 2).toFixed(1).toString() + " =  ?  +  ?   * " + time.toFixed(1) + "  (S.I.)";
                    if (xVelocity > 0) {
                        for (let i in planeMileMarkers) {
                            if (cube.position.x - 100 > planeMileMarkers[i].mesh.position.x) {
                                planeMileMarkers[i].dispose();
                                planeMileMarkers[i] = new PlaneMileMarker(lastMileMarkerPosition);
                                planeCentreLines[i].mesh.position.x = lastMileMarkerPosition * 2;
                                lastMileMarkerPosition += 10;
                            }
                        }
                    }
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
