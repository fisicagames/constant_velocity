//CONSTANT VELOCITY GAME (C) 2024 by Rafael João Ribeiro - IFPR - http://www.fisicagames.com.br
//see todos in the code and:  
//1. remove import inspector and debugLayer before build
//2. change equation.png path to ./assets/gui/equation.png
//3. Add ./ in index.html
//4. Remove //* lines

//import "@babylonjs/core/Debug/debugLayer";

//import "@babylonjs/inspector";

////////////////////////////////////////////////////////////////

import "@babylonjs/loaders";

import {
    Engine, Scene, Color4, Color3, ArcRotateCamera,
    Vector3, HemisphericLight, Mesh, MeshBuilder,
    StandardMaterial, Sound, DynamicTexture, TransformNode,
    SceneLoader, ScenePerformancePriority
} from "@babylonjs/core";
import {
    AdvancedDynamicTexture, TextBlock, Button,
    Rectangle
} from "@babylonjs/gui";

//Color Palette: https://colorhunt.co/palette/1db9c37027a0c32badf56fad
//GUI: https://gui.babylonjs.com/#HEG7HH#33
//Mobile Simulator: https://chromewebstore.google.com/detail/mobile-simulator-responsi/ckejmhbmlajgoklhgbapkiccekfoccmk
//Music1: https://pixabay.com/pt/music/pop-positive-way-124550/
//Music2: https://pixabay.com/pt/music/musicas-felizes-para-criancas-first-steps-141242/
//DynamicTexture Thousands Cubes: https://forum.babylonjs.com/t/optimizing-scene-with-lots-thousands-of-2d-text-labels-in-3d-space/25666
//DynamicTexture text to Plane: https://playground.babylonjs.com/#TMHF80


class App {
    constructor() {


        let score: number = 0;
        let bestScore: number = 0;
        let musicon: boolean = true;
        let level: number = 1;

        enum GameState {
            StartMenu,
            PositionQuestion,
            CorrectAnswerPosition,
            IncorrectAnswer,
            VelocityQuestion,
            CorrectAnswerVelocity,
            GameOver
        }

        let state: GameState = GameState.StartMenu;

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

        //(canvas.style.width, canvas.style.height);
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine

        //*const engine = new Engine(canvas, true);
        //const engine = new Engine(canvas, true, {disableWebGL2Support: true, useHighPrecisionFloats: false});
        
        const engine = new Engine(canvas, true, {disableWebGL2Support: true});
        //*
        engine.displayLoadingUI();
        engine.disableVertexArrayObjects = true;
        engine.disableUniformBuffers= true;
        //*//

        const scene = new Scene(engine);
        scene.skipPointerMovePicking = true;
        scene.getAnimationRatio();
        scene.performancePriority = ScenePerformancePriority.BackwardCompatible;
        

        

        

        SceneLoader.Append("./assets/models/", "models.gltf", scene);



        
        scene.clearColor = Color4.FromHexString("#58D596FF"); //AAD9BB

        ////////////////////////////////

        const music = new Sound("Music", "./assets/sounds/first-steps-141242_compress.mp3", scene, soundReady, {
            loop: true,
            autoplay: false,
        });

        function soundReady() {
            engine.hideLoadingUI();

            if (document.visibilityState == "visible" && musicon) music.play();
            music.setVolume(0.8);
        }

        document.addEventListener("visibilitychange", () => {
            //https://forum.babylonjs.com/t/pointer-over-action-vs-lost-focus/18836/3
            if (document.visibilityState == "visible" && musicon) {
                if (!music.isPlaying) music.play();
            } else {
                music.pause();
            }
        })

        ////////////////////////////////

        const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        //camera.attachControl(canvas, false);
        camera.position = new Vector3(-3, 6, -3);
        camera.radius = 54;

        let light1: HemisphericLight = new HemisphericLight("light1", new Vector3(-3, 1, -0.5), scene);
        //let  sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.5 }, scene);


        let plane: Mesh = MeshBuilder.CreatePlane('plane', { width: 200, height: 10 }, scene);
        const materialPlane = new StandardMaterial("planoMaterial", scene);
        materialPlane.diffuseColor = new Color3(0.7, 0.7, 0.8);
        materialPlane.freeze;
        plane.material = materialPlane;
        plane.position = new Vector3(0, 0, 0);
        plane.rotation.x = Math.PI / 2;



        let planeWhite: Mesh = MeshBuilder.CreatePlane('plane', { width: 200, height: 11 }, scene);
        planeWhite.doNotSyncBoundingInfo = true;
        const materialPlaneWhite = new StandardMaterial("materialPlaneWhite", scene);
        materialPlaneWhite.diffuseColor = new Color3(1, 1, 1);
        materialPlaneWhite.freeze;
        planeWhite.material = materialPlaneWhite;

        //planeWhite.rotation.x = Math.PI / 2;
        planeWhite.parent = plane;
        planeWhite.position = new Vector3(0, 0, 0.05);

        //let planeGround: Mesh = MeshBuilder.CreatePlane('planeGround', { width: 200, height: 200 }, scene);
        //const materialPlaneGround = new StandardMaterial("materialPlaneGround", scene);
        //materialPlaneGround.diffuseColor = new Color3(Math.random()+0.5, Math.random()+0.5, Math.random()+0.5);
        //planeGround.material = materialPlaneGround;

        //planeGround.parent = plane;
        //planeGround.position = new Vector3(0, 0, 0.1);

        ////////////////////////////////

        let xVelocity: number = 0;
        let x0Position, x0: number = 0;
        let zPosition: number = 0;


        //let cube: Mesh = MeshBuilder.CreateBox('cube', { width: 4, height: 2, depth: 2 }, scene);
        let cube: Mesh = MeshBuilder.CreateBox('cube', { width: 3.5, height: 2, depth: 1 }, scene);
        cube.doNotSyncBoundingInfo = true;


        let car: TransformNode;


        const materialCube = new StandardMaterial("cubeMaterial", scene);
        materialCube.diffuseColor = new Color3(1, 0.2, 1);
        materialCube.freeze;
        cube.material = materialCube;
        

        scene.executeWhenReady(() => {

            car = scene.getTransformNodeByName("car");



            car.position.y = -1;
            //car.position.z = 0.4;
            car.rotation.y = Math.PI / 2;

            cube.position = new Vector3(0, 1, zPosition);
            car.parent = cube;




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
            let textBlockEquation: TextBlock;
            let textBlockTimeTotal: TextBlock;
            let textBlockScore: TextBlock;
            let textBlockBestScore: TextBlock;
            let textblockQuestion: TextBlock;
            let textblockMenuLink: TextBlock;
            let textblockMenuMusic: TextBlock;
            let textblockMenuBest: TextBlock;
            let textblockMenuScore: TextBlock;



            let buttonMenuStart: Button;
            let buttonMenu: Button;
            let buttonReplay: Button;
            let buttonA: Button;
            let buttonB: Button;
            let buttonC: Button;

            let rectangleMenu: Rectangle;


            ////////////////////////////////

            const trees: Tree[] = [];


            let tree0: TransformNode = scene.getTransformNodeByName("tree");
            tree0.position = new Vector3(0, 2, -10);
            tree0.freezeWorldMatrix();




            class Tree {
                tree: TransformNode;
                x: number;

                constructor(x: number) {

                    this.tree = tree0.instantiateHierarchy();

                    this.tree.position = new Vector3(x - 10, 2, 12 * Math.sign(Math.random() - 0.5));
                    this.tree.scaling.y = 0.75 + Math.random();
                    this.tree.freezeWorldMatrix();
                    

                }
                dispose() {
                    this.tree.dispose();
                }
            }

      
            let tree1 = new Tree(10);

            const createTrees = function(){
                for (let i = -400; i < 400; i +=10){
                    let tree1 = new Tree(i);
                    trees.push(tree1);
                }
            }
            createTrees();

            ////////////////////////

            const planeCentreNode = new TransformNode("planeCentreNode");

            const planeCentreLines: PlaneCentreLine[] = [];
            const materialPlaneCentreLine = new StandardMaterial("materialPlaneCentreLine", scene);
            materialPlaneCentreLine.diffuseColor = new Color3(1, 1, 0);
            materialPlaneCentreLine.freeze;

            class PlaneCentreLine {
                mesh: Mesh;
                x: number;

                constructor(x: number) {
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

            ////////////////////////////////

            const planeMileMarkerNode = new TransformNode("planeMileMarkerNode");

            const planeMileMarkers: PlaneMileMarker[] = [];

            const materialPost = new StandardMaterial("materialPost", scene);
            materialPost.diffuseColor = new Color3(0.9, 0.9, 0.9);
            materialPost.freeze;


            class PlaneMileMarker {

                mesh: Mesh;
                meshPostRight: Mesh;
                meshPostLeft: Mesh;
                tempDynamicTexture: DynamicTexture;
                dynamicTexture: DynamicTexture;
                mat: StandardMaterial;
                xPosition: number;

                constructor(xPosition = 0) {
                    this.mesh = MeshBuilder.CreatePlane(`planeMileMarker ${xPosition}`, { width: 5, height: 3 }, scene);
                    this.mesh.doNotSyncBoundingInfo = true;
                    this.meshPostRight = MeshBuilder.CreatePlane(`meshPostRight ${xPosition}`, { width: 0.5, height: 2 }, scene);
                    this.meshPostRight.material = materialPost;
                    this.meshPostRight.doNotSyncBoundingInfo = true;
                    this.meshPostLeft = MeshBuilder.CreatePlane(`meshPostLeft ${xPosition}`, { width: 0.5, height: 2 }, scene);
                    this.meshPostLeft.material = materialPost;
                    this.meshPostLeft.doNotSyncBoundingInfo = true;

                    this.mesh.position = new Vector3(xPosition * 2, 4, 6);
                    this.mesh.rotation.y = Math.PI / 2.5;
                    this.mesh.parent = planeMileMarkerNode;

                    this.meshPostRight.position = new Vector3(xPosition * 2+0.8, 2.1, 4.4);
                    this.meshPostRight.rotation.y = Math.PI / 2.5;
                    this.meshPostRight.parent = planeMileMarkerNode;

                    this.meshPostLeft.position = new Vector3(xPosition * 2+0.1, 2, 8);
                    this.meshPostLeft.rotation.y = Math.PI / 2.5;
                    this.meshPostLeft.parent = planeMileMarkerNode;

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
                    this.mat.freeze;
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
            ////////////////////////////////

            let lastMileMarkerPosition: number = 0;


            const createMilesLines = function () {
                for (let i = x0Position - 100; i < x0Position + 100; i += 10) {
                    let planeMileMarker = new PlaneMileMarker(i);
                    planeMileMarkers.push(planeMileMarker);
                    lastMileMarkerPosition = i;
                    let planeCentreLine: PlaneCentreLine = new PlaneCentreLine(i * 2);
                    planeCentreLines.push(planeCentreLine);
                    //lastCentreLinePosition = i *2;
                }

            }

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

            ////////////////////////////////

            //todo: move and combine this async function into a bigger scene function 

            async function createGUI() {


                function gameController() {
                    //console.log("teste async");

                    switch (state) {
                        case GameState.IncorrectAnswer:
                            state = GameState.StartMenu;
                            rectangleMenu.isVisible = true;
                            break;
                        case GameState.CorrectAnswerPosition:
                            shuffleAnswersVelocity();
                            textblockQuestion.text = `What is the constant velocity v?`
                            state = GameState.VelocityQuestion;
                            if (score <= 28) level = score;
                            break;
                        case GameState.CorrectAnswerVelocity:
                            startCube();
                            updateMilesLinesPosition();
                            shuffleAnswersPosition();
                            textblockQuestion.text = `What is the initial position s0?`
                            state = GameState.PositionQuestion;
                            break;
                        case GameState.StartMenu:
                            score = 0;
                            level = 1;
                            textBlockScore.text = `Score: ${score}`;
                            timeEnd = 60;
                            time = 0;
                            textblockQuestion.text = `What is the initial position s0?`
                            startCube();
                            updateMilesLinesPosition();
                            shuffleAnswersPosition();
                            rectangleMenu.isVisible = false;
                            state = GameState.PositionQuestion;
                            break
                        default:
                            console.log("State null")
                            break;
                    }
                }


                let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/gui/guiTexture.json");


                textblockMenuBest = advancedTexture.getControlByName("TextblockMenuBest") as TextBlock;
                textblockMenuScore = advancedTexture.getControlByName("TextblockMenuScore") as TextBlock;

                textblockMenuLink = advancedTexture.getControlByName("TextblockMenuLink") as TextBlock;
                textblockMenuLink.onPointerUpObservable.add(function () {
                    //window.open("https://fisicagames.com.br")
                    location.href = "https://fisicagames.com.br";

                });

                textblockMenuMusic = advancedTexture.getControlByName("TextblockMenuMusic") as TextBlock;;
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



                buttonMenuStart = advancedTexture.getControlByName("ButtonMenuStart") as Button;
                rectangleMenu = advancedTexture.getControlByName("RectangleMenu") as Rectangle;

                buttonMenuStart.onPointerUpObservable.add(function () {
                    state = GameState.StartMenu;
                    gameController();


                });

                buttonMenu = advancedTexture.getControlByName("ButtonMenu") as Button;
                buttonMenu.onPointerUpObservable.add(function () {
                    rectangleMenu.isVisible = true;
                    state = GameState.StartMenu;
                });

                textBlockEquation = advancedTexture.getControlByName("TextBlockEquation") as TextBlock;
                textBlockEquation.text = "s(t) =  ?  +  ?   * t ";
                textBlockTimeTotal = advancedTexture.getControlByName("TextblockTimeTotal") as TextBlock;
                textBlockScore = advancedTexture.getControlByName("TextblockScore") as TextBlock;
                textBlockScore.text = `Score: ${score}`;
                textBlockBestScore = advancedTexture.getControlByName("TextBlockBestScore") as TextBlock;
                textBlockBestScore.text = `Best: ${bestScore}`;
                textblockQuestion = advancedTexture.getControlByName("TextblockQuestion") as TextBlock;
                textblockQuestion.text = `What is the initial position s0?`




                let buttonIsCorrect: boolean[] = [false, false, false];
                buttonA = advancedTexture.getControlByName("ButtonA") as Button;
                buttonB = advancedTexture.getControlByName("ButtonB") as Button;
                buttonC = advancedTexture.getControlByName("ButtonC") as Button;

                const buttons: Button[] = [buttonA, buttonB, buttonC];

                function shuffleAnswersPosition() {

                    const order: number = Math.ceil(Math.random() * 3);

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

                    const order: number = Math.ceil(Math.random() * 3);

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
                    checkAnswers(0)
                })
                buttonB.onPointerClickObservable.add(function () {
                    checkAnswers(1)
                })
                buttonC.onPointerClickObservable.add(function () {
                    checkAnswers(2)
                })


                function checkAnswers(b: number) {
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



                buttonReplay = advancedTexture.getControlByName("ButtonReplay") as Button;
                buttonReplay.onPointerUpObservable.add(function () {
                    cube.position.x = x0;

                    //console.log(planeMileMarkers.length, planeCentreLines.length);
                    updateMilesLinesPosition();

                    time = 0;
                });

                let time: number = 0;

                let timeEnd: number = 60;

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

                    plane.position.x = cube.position.x
                    camera.position = new Vector3(cube.position.x - 4, 3, cube.position.z - 2);
                    camera.radius = 54;
                    camera.target = new Vector3(cube.position.x, cube.position.y, cube.position.z);;


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


            // Resize
            window.addEventListener("resize", function () {

                adjustCanvas();
                engine.resize();

            });




        });


    }
}
new App();