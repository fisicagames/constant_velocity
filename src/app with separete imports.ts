//CONSTANT VELOCITY GAME (C) 2024 by Rafael João Ribeiro - IFPR - http://www.fisicagames.com.br
//see todos in the code and:  
//1. remove import inspector and debugLayer before build
//2. change equation.png path to ./assets/gui/equation.png
//3. Add ./ in index.html
//4. Remove //* lines

//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";

import { Engine, AssetsManager, Sound} from "@babylonjs/core";
import "@babylonjs/loaders";
import {MainScene} from "./mainScene";



class App {

    constructor() {
        // create the canvas html element and attach it to the webpage
        const canvas = document.createElement("canvas");
        this.adjustCanvas(canvas);
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        const engine = new Engine(canvas, true);

        const mainScene = new MainScene(engine, canvas);

        this.loadAssets(mainScene)
      
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (mainScene.scene.debugLayer.isVisible()) {
                    mainScene.scene.debugLayer.hide();
                } else {
                    mainScene.scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            mainScene.scene.render();
            mainScene.stateMachine();
        });

        document.addEventListener("visibilitychange", () => {
            //https://forum.babylonjs.com/t/pointer-over-action-vs-lost-focus/18836/3
            if (document.visibilityState == "visible" && mainScene.musicOn) {
                if (!mainScene.music.isPlaying) mainScene.music.play();
            } else {
                mainScene.music.pause();
            }
        })
    }


    loadAssets(mainScene) {

        let tasksReady: number = 0;
        const assetsManager = new AssetsManager(mainScene.scene);
        const meshTask = assetsManager.addMeshTask("carAndTree", "", "./assets/models/", "models.gltf");
        
        
        const binaryTask = assetsManager.addBinaryFileTask("Music", "./assets/sounds/first-steps-141242_compress.mp3");
        meshTask.onSuccess = function () {
            //mainScene.car = meshTask.loadedTransformNodes[0];
            //mainScene.tree = meshTask.loadedTransformNodes[1];
            eachTasksSuccess();
        };
        binaryTask.onSuccess = function (task) {
            mainScene.music = new Sound("Music", task.data, this.scene, eachTasksSuccess, {
                loop: true
            }) as Sound;
        };
        function eachTasksSuccess() {
            tasksReady++;
            if (tasksReady === 2) {
                mainScene.music.setVolume(0.7);
                mainScene.loadReady();
            }
        }
        assetsManager.load();
    }

    adjustCanvas(canvas) {
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
}
new App();