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
import { Engine, Scene, Color4, Color3, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Sound, DynamicTexture, TransformNode, SceneLoader } from "@babylonjs/core";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
class App {
    constructor() {
        let score = 0;
        let bestScore = 0;
        let musicon = true;
        let level = 1;
        let GameState;
        (function (GameState) {
            GameState[GameState["StartMenu"] = 0] = "StartMenu";
            GameState[GameState["PositionQuestion"] = 1] = "PositionQuestion";
            GameState[GameState["CorrectAnswerPosition"] = 2] = "CorrectAnswerPosition";
            GameState[GameState["IncorrectAnswer"] = 3] = "IncorrectAnswer";
            GameState[GameState["VelocityQuestion"] = 4] = "VelocityQuestion";
            GameState[GameState["CorrectAnswerVelocity"] = 5] = "CorrectAnswerVelocity";
            GameState[GameState["GameOver"] = 6] = "GameOver";
        })(GameState || (GameState = {}));
        let state = GameState.StartMenu;
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
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);
        const engine = new Engine(canvas, true);
        engine.displayLoadingUI();
        const scene = new Scene(engine);
        SceneLoader.Append("./assets/models/", "car.gltf", scene);
        SceneLoader.Append("./assets/models/", "tree.gltf", scene);
        scene.clearColor = Color4.FromHexString("#58D596FF");
        const music = new Sound("Music", "./assets/sounds/first-steps-141242_compress.mp3", scene, soundReady, {
            loop: true,
            autoplay: false,
        });
        function soundReady() {
            engine.hideLoadingUI();
            if (document.visibilityState == "visible" && musicon)
                music.play();
            music.setVolume(0.8);
        }
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState == "visible" && musicon) {
                console.log("tab is active");
                if (!music.isPlaying)
                    music.play();
            }
            else {
                music.pause();
            }
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
        let planeWhite = MeshBuilder.CreatePlane('plane', { width: 200, height: 11 }, scene);
        const materialPlaneWhite = new StandardMaterial("materialPlaneWhite", scene);
        materialPlaneWhite.diffuseColor = new Color3(1, 1, 1);
        planeWhite.material = materialPlaneWhite;
        planeWhite.parent = plane;
        planeWhite.position = new Vector3(0, 0, 0.05);
        let xVelocity = 0;
        let x0Position, x0 = 0;
        let zPosition = 0;
        let cube = MeshBuilder.CreateBox('cube', { width: 4, height: 2, depth: 2 }, scene);
        let car;
        const materialCube = new StandardMaterial("cubeMaterial", scene);
        materialCube.diffuseColor = new Color3(1, 0.2, 1);
        cube.material = materialCube;
        scene.executeWhenReady(() => {
            car = scene.getTransformNodeByName("car");
            car.parent = cube;
            car.position.y = -1;
            car.rotation.y = Math.PI / 2;
            cube.isVisible = false;
            cube.position = new Vector3(0, 1, zPosition);
            function startCube() {
                xVelocity = (1 + score + Math.floor(Math.random() * 5)) * Math.sign(Math.random() - 0.5);
                xVelocity < 0 ? zPosition = +2.3 : zPosition = -2.6;
                xVelocity < 0 ? cube.rotation = new Vector3(0, Math.PI, 0) : cube.rotation = new Vector3(0, 0, 0);
                x0 = (-9 + Math.random() * 18);
                x0Position = Math.round(x0) * 20;
                x0 = x0 * 20;
                cube.position.x = x0;
                cube.position.z = zPosition;
            }
            camera.target = cube.position;
            const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
            let textBlockEquation;
            let textBlockTimeTotal;
            let textBlockScore;
            let textBlockBestScore;
            let textblockQuestion;
            let textblockMenuLink;
            let textblockMenuMusic;
            let textblockMenuBest;
            let textblockMenuScore;
            let buttonMenuStart;
            let buttonMenu;
            let buttonReplay;
            let buttonA;
            let buttonB;
            let buttonC;
            let rectangleMenu;
            const trees = [];
            let tree0 = scene.getTransformNodeByName("tree");
            tree0.position = new Vector3(0, 2, -10);
            class Tree {
                constructor(x) {
                    Object.defineProperty(this, "tree", {
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
                    this.tree = tree0.instantiateHierarchy();
                    this.tree.position = new Vector3(x - 10, 2, 12 * Math.sign(Math.random() - 0.5));
                    this.tree.scaling.y = 0.75 + Math.random();
                }
                dispose() {
                    this.tree.dispose();
                }
            }
            let tree1 = new Tree(10);
            const createTrees = function () {
                for (let i = -400; i < 400; i += 10) {
                    let tree1 = new Tree(i);
                    trees.push(tree1);
                }
            };
            createTrees();
            const planeCentreNode = new TransformNode("planeCentreNode");
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
                    this.mesh.parent = planeCentreNode;
                }
                dispose() {
                    this.mesh.dispose();
                }
            }
            const planeMileMarkerNode = new TransformNode("planeMileMarkerNode");
            const planeMileMarkers = [];
            const materialPost = new StandardMaterial("materialPost", scene);
            materialPost.diffuseColor = new Color3(0.9, 0.9, 0.9);
            class PlaneMileMarker {
                constructor(xPosition = 0) {
                    Object.defineProperty(this, "mesh", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "meshPostRight", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: void 0
                    });
                    Object.defineProperty(this, "meshPostLeft", {
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
                    this.meshPostRight = MeshBuilder.CreatePlane(`meshPostRight ${xPosition}`, { width: 0.5, height: 2 }, scene);
                    this.meshPostRight.material = materialPost;
                    this.meshPostLeft = MeshBuilder.CreatePlane(`meshPostLeft ${xPosition}`, { width: 0.5, height: 2 }, scene);
                    this.meshPostLeft.material = materialPost;
                    this.mesh.position = new Vector3(xPosition * 2, 4, 6);
                    this.mesh.rotation.y = Math.PI / 2.5;
                    this.mesh.parent = planeMileMarkerNode;
                    this.meshPostRight.position = new Vector3(xPosition * 2 + 0.8, 2.1, 4.4);
                    this.meshPostRight.rotation.y = Math.PI / 2.5;
                    this.meshPostRight.parent = planeMileMarkerNode;
                    this.meshPostLeft.position = new Vector3(xPosition * 2 + 0.1, 2, 8);
                    this.meshPostLeft.rotation.y = Math.PI / 2.5;
                    this.meshPostLeft.parent = planeMileMarkerNode;
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
            const createMilesLines = function () {
                for (let i = x0Position - 100; i < x0Position + 100; i += 10) {
                    let planeMileMarker = new PlaneMileMarker(i);
                    planeMileMarkers.push(planeMileMarker);
                    lastMileMarkerPosition = i;
                    let planeCentreLine = new PlaneCentreLine(i * 2);
                    planeCentreLines.push(planeCentreLine);
                }
            };
            createMilesLines();
            function updateMilesLinesPosition() {
                for (let i in planeMileMarkers) {
                    planeMileMarkers[i].dispose();
                    planeCentreLines[i].dispose();
                }
                planeMileMarkers.length = 0;
                planeCentreLines.length = 0;
                createMilesLines();
            }
            function createGUI() {
                return __awaiter(this, void 0, void 0, function* () {
                    function gameController() {
                        switch (state) {
                            case GameState.IncorrectAnswer:
                                state = GameState.StartMenu;
                                rectangleMenu.isVisible = true;
                                break;
                            case GameState.CorrectAnswerPosition:
                                shuffleAnswersVelocity();
                                textblockQuestion.text = `What is the constant velocity v?`;
                                state = GameState.VelocityQuestion;
                                if (score <= 28)
                                    level = score;
                                break;
                            case GameState.CorrectAnswerVelocity:
                                startCube();
                                updateMilesLinesPosition();
                                shuffleAnswersPosition();
                                textblockQuestion.text = `What is the initial position s0?`;
                                state = GameState.PositionQuestion;
                                break;
                            case GameState.StartMenu:
                                score = 0;
                                level = 1;
                                textBlockScore.text = `Score: ${score}`;
                                timeEnd = 60;
                                textblockQuestion.text = `What is the initial position s0?`;
                                startCube();
                                updateMilesLinesPosition();
                                shuffleAnswersPosition();
                                rectangleMenu.isVisible = false;
                                state = GameState.PositionQuestion;
                                break;
                            default:
                                console.log("State null");
                                break;
                        }
                    }
                    let loadedGUI = yield advancedTexture.parseFromURLAsync("./assets/gui/guiTexture.json");
                    textblockMenuBest = advancedTexture.getControlByName("TextblockMenuBest");
                    textblockMenuScore = advancedTexture.getControlByName("TextblockMenuScore");
                    textblockMenuLink = advancedTexture.getControlByName("TextblockMenuLink");
                    textblockMenuLink.onPointerUpObservable.add(function () {
                        location.href = "https://fisicagames.com.br";
                    });
                    textblockMenuMusic = advancedTexture.getControlByName("TextblockMenuMusic");
                    ;
                    textblockMenuMusic.onPointerUpObservable.add(function () {
                        if (music.isPlaying) {
                            music.stop();
                            musicon = false;
                            textblockMenuMusic.text = "music: off";
                        }
                        else {
                            music.play();
                            musicon = true;
                            textblockMenuMusic.text = "music: on";
                        }
                    });
                    buttonMenuStart = advancedTexture.getControlByName("ButtonMenuStart");
                    rectangleMenu = advancedTexture.getControlByName("RectangleMenu");
                    buttonMenuStart.onPointerUpObservable.add(function () {
                        state = GameState.StartMenu;
                        gameController();
                    });
                    buttonMenu = advancedTexture.getControlByName("ButtonMenu");
                    buttonMenu.onPointerUpObservable.add(function () {
                        rectangleMenu.isVisible = true;
                        state = GameState.StartMenu;
                    });
                    textBlockEquation = advancedTexture.getControlByName("TextBlockEquation");
                    textBlockEquation.text = "s(t) =  ?  +  ?   * t ";
                    textBlockTimeTotal = advancedTexture.getControlByName("TextblockTimeTotal");
                    textBlockScore = advancedTexture.getControlByName("TextblockScore");
                    textBlockScore.text = `Score: ${score}`;
                    textBlockBestScore = advancedTexture.getControlByName("TextBlockBestScore");
                    textBlockBestScore.text = `Best: ${bestScore}`;
                    textblockQuestion = advancedTexture.getControlByName("TextblockQuestion");
                    textblockQuestion.text = `What is the initial position s0?`;
                    let buttonIsCorrect = [false, false, false];
                    buttonA = advancedTexture.getControlByName("ButtonA");
                    buttonB = advancedTexture.getControlByName("ButtonB");
                    buttonC = advancedTexture.getControlByName("ButtonC");
                    const buttons = [buttonA, buttonB, buttonC];
                    function shuffleAnswersPosition() {
                        const order = Math.ceil(Math.random() * 3);
                        for (let i in buttons) {
                            buttons[i].background = "#C32BADFF";
                        }
                        switch (order) {
                            case 1:
                                buttonA.textBlock.text = (x0 / 2).toFixed(0).toString();
                                buttonB.textBlock.text = (x0 / 2 + 30 - level).toFixed(0).toString();
                                buttonC.textBlock.text = (x0 / 2 + 60 - level * 2).toFixed(0).toString();
                                break;
                            case 2:
                                buttonA.textBlock.text = (x0 / 2 - (30 - level)).toFixed(0).toString();
                                buttonB.textBlock.text = (x0 / 2).toFixed(0).toString();
                                buttonC.textBlock.text = (x0 / 2 + 30 - level).toFixed(0).toString();
                                break;
                            case 3:
                                buttonA.textBlock.text = (x0 / 2 - (60 / level)).toFixed(0).toString();
                                buttonB.textBlock.text = (x0 / 2 - (30 - level)).toFixed(0).toString();
                                buttonC.textBlock.text = (x0 / 2).toFixed(0).toString();
                                break;
                            default:
                                break;
                        }
                    }
                    shuffleAnswersPosition();
                    function shuffleAnswersVelocity() {
                        const order = Math.ceil(Math.random() * 3);
                        for (let i in buttons) {
                            buttons[i].background = "#C32BADFF";
                        }
                        switch (order) {
                            case 1:
                                buttonA.textBlock.text = (xVelocity).toFixed(0).toString();
                                buttonB.textBlock.text = (xVelocity + 9 - level / 4).toFixed(0).toString();
                                buttonC.textBlock.text = (xVelocity + 18 - level / 2).toFixed(0).toString();
                                break;
                            case 2:
                                buttonA.textBlock.text = (xVelocity - (9 - level / 4)).toFixed(0).toString();
                                buttonB.textBlock.text = (xVelocity).toFixed(0).toString();
                                buttonC.textBlock.text = (xVelocity + 18 - level / 2).toFixed(0).toString();
                                break;
                            case 3:
                                buttonA.textBlock.text = (xVelocity - (18 - level / 4)).toFixed(0).toString();
                                buttonB.textBlock.text = (xVelocity - (9 - level / 2)).toFixed(0).toString();
                                buttonC.textBlock.text = (xVelocity).toFixed(0).toString();
                                break;
                            default:
                                break;
                        }
                    }
                    buttonA.onPointerClickObservable.add(function () {
                        checkAnswers(0);
                    });
                    buttonB.onPointerClickObservable.add(function () {
                        checkAnswers(1);
                    });
                    buttonC.onPointerClickObservable.add(function () {
                        checkAnswers(2);
                    });
                    function checkAnswers(b) {
                        if (state == GameState.PositionQuestion) {
                            for (let i in buttons) {
                                if (buttons[i].textBlock.text == (x0 / 2).toFixed(0).toString()) {
                                    buttons[i].background = "#27b376";
                                    buttonIsCorrect[i] = true;
                                }
                                else {
                                    buttons[i].background = "#bf212f";
                                    buttonIsCorrect[i] = false;
                                }
                            }
                            if (buttonIsCorrect[b] == true) {
                                score += 1;
                                textBlockScore.text = `Score: ${score}`;
                                textblockMenuScore.text = `Score: ${score}`;
                                if (score > bestScore) {
                                    bestScore = score;
                                    textBlockBestScore.text = `Best: ${bestScore}`;
                                    textblockMenuBest.text = `Best: ${bestScore}`;
                                }
                                state = GameState.CorrectAnswerPosition;
                                textBlockTimeTotal.text = "Correct!";
                                setTimeout(gameController, 1000);
                            }
                            else {
                                textBlockTimeTotal.text = "Game Over!";
                                state = GameState.IncorrectAnswer;
                                setTimeout(gameController, 2000);
                            }
                        }
                        else if (state == GameState.VelocityQuestion) {
                            for (let i in buttons) {
                                if (buttons[i].textBlock.text == (xVelocity).toFixed(0).toString()) {
                                    buttons[i].background = "#27b376";
                                    buttonIsCorrect[i] = true;
                                }
                                else {
                                    buttons[i].background = "#bf212f";
                                    buttonIsCorrect[i] = false;
                                }
                            }
                            if (buttonIsCorrect[b] == true) {
                                score += 1;
                                textBlockScore.text = `Score: ${score}`;
                                textblockMenuScore.text = `Score: ${score}`;
                                if (score > bestScore) {
                                    bestScore = score;
                                    textBlockBestScore.text = `Best: ${bestScore}`;
                                    textblockMenuBest.text = `Best: ${bestScore}`;
                                }
                                state = GameState.CorrectAnswerVelocity;
                                textBlockTimeTotal.text = "Correct!";
                                setTimeout(gameController, 2000);
                            }
                            else {
                                textBlockTimeTotal.text = "Game Over!";
                                state = GameState.IncorrectAnswer;
                                setTimeout(gameController, 2000);
                            }
                        }
                    }
                    buttonReplay = advancedTexture.getControlByName("ButtonReplay");
                    buttonReplay.onPointerUpObservable.add(function () {
                        cube.position.x = x0;
                        updateMilesLinesPosition();
                        time = 0;
                    });
                    let time = 0;
                    let timeEnd = 60;
                    engine.runRenderLoop(() => {
                        scene.render();
                        if (timeEnd > 0.5 && (state == GameState.PositionQuestion || state == GameState.VelocityQuestion)) {
                            timeEnd -= engine.getDeltaTime() / 1000;
                            textBlockTimeTotal.text = "Time Left: " + timeEnd.toFixed(0) + " s";
                            cube.position.x += xVelocity * 2 * engine.getDeltaTime() / 1000;
                            time += engine.getDeltaTime() / 1000;
                        }
                        else if (state == GameState.PositionQuestion || state == GameState.VelocityQuestion) {
                            textBlockTimeTotal.text = "Game Over!";
                            state = GameState.IncorrectAnswer;
                            setTimeout(gameController, 2000);
                        }
                        plane.position.x = cube.position.x;
                        camera.position = new Vector3(cube.position.x - 4, 3, cube.position.z - 2);
                        camera.radius = 54;
                        camera.target = new Vector3(cube.position.x, cube.position.y, cube.position.z);
                        ;
                        switch (state) {
                            case GameState.PositionQuestion:
                                textBlockEquation.text = (cube.position.x / 2).toFixed(1).toString() + " =  ?  +  ?   * " + time.toFixed(1) + "  (S.I.)";
                                break;
                            case GameState.VelocityQuestion:
                                textBlockEquation.text = (cube.position.x / 2).toFixed(1).toString() + " = " + (x0 / 2).toFixed(0).toString() + " +  ?   * " + time.toFixed(1) + "  (S.I.)";
                                break;
                            case GameState.CorrectAnswerVelocity:
                                textBlockEquation.text = (cube.position.x / 2).toFixed(1).toString() + " = " + (x0 / 2).toFixed(0).toString() + " + " + (xVelocity).toFixed(0).toString() + " * " + time.toFixed(1) + "  (S.I.)";
                                break;
                            default:
                                break;
                        }
                        for (let i in planeMileMarkers) {
                            if (xVelocity > 0) {
                                if (cube.position.x - 100 > planeMileMarkers[i].mesh.position.x) {
                                    planeMileMarkers[i].dispose();
                                    planeMileMarkers[i] = new PlaneMileMarker(lastMileMarkerPosition);
                                    planeCentreLines[i].mesh.position.x = lastMileMarkerPosition * 2;
                                    lastMileMarkerPosition += 10;
                                }
                            }
                            else {
                                if (cube.position.x + 100 < planeMileMarkers[i].mesh.position.x) {
                                    planeMileMarkers[i].dispose();
                                    -lastMileMarkerPosition;
                                    planeMileMarkers[i] = new PlaneMileMarker(lastMileMarkerPosition);
                                    planeCentreLines[i].mesh.position.x = lastMileMarkerPosition * 2;
                                    lastMileMarkerPosition -= 10;
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
        });
    }
}
new App();
