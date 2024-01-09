import {
    Engine, Scene, ArcRotateCamera, Vector3,
    HemisphericLight,
    Sound,
    Color4,
    Color3,
    StandardMaterial,
    Mesh,
    MeshBuilder,
    TransformNode,
    DynamicTexture
} from "@babylonjs/core";

enum GameState {
    LoadAssets,
    StartMenu,
    PositionQuestion,
    CorrectAnswerPosition,
    IncorrectAnswer,
    VelocityQuestion,
    CorrectAnswerVelocity,
    GameOver
}

export class MainScene {

    scene: Scene;
    music: Sound;
    musicOn: boolean;
    car: TransformNode;
    tree: TransformNode;
    street: TransformNode;
    camera: ArcRotateCamera;
    state: GameState;
    planeCentreLines: Mesh[];
    planeMileMarkers: Mesh[];



    constructor(engine: Engine, canvas: HTMLCanvasElement) {

        this.musicOn = true;
        this.scene = new Scene(engine);
        this.scene.clearColor = Color4.FromHexString("#58D596FF"); //AAD9BB
        this.camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this.scene);
        this.camera.attachControl(canvas, true);
        this.camera.position = new Vector3(-3, 6, -3);
        this.camera.radius = 54;
        let light1: HemisphericLight = new HemisphericLight("light1", new Vector3(-3, 1, -0.5), this.scene);
        this.street = new TransformNode("street");
        this.state = GameState.LoadAssets;

        //this.scene.debugLayer.show();

    }

    update() {
        //this.car.position.x += 0.5;
        //this.street.position.x = this.car.position.x;

        //this.car.rotation.x += 0.1;
        this.camera.position = new Vector3(this.car.position.x - 4, 3, this.car.position.z - 2);
        this.camera.radius = 54;
        this.camera.target = this.car.position;
    }

    loadReady() {
        if (document.visibilityState == "visible" && this.musicOn) {
            this.music.play();
            this.musicOn = true;
        }
        this.createStreet(this.street);
        this.createTrees();
        this.centreLines();
        //this.createMileMarker();

        //this.car = this.scene.getMeshByName("car");
        this.car = this.scene.getTransformNodeByName("car");
        this.car.position.z = 2.5;

        this.scene.getMeshByName("__root__").rotation = new Vector3(0, 0, 0)
        //this.car.rotation = new Vector3(Math.PI/2, 0, Math.PI);
        setTimeout(() => {
            this.state = GameState.PositionQuestion;
        }, 4000);
        
        
        

    }

    stateMachine() {
        switch (this.state) {
            case GameState.LoadAssets:
                //this.loadAssets(mainScene);
                break;
            case GameState.PositionQuestion:
                this.update();
                break;


            default:
                break;
        }

    }

    createStreet(street) {
        let plane: Mesh = MeshBuilder.CreatePlane('plane', { width: 200, height: 10 }, this.scene);
        const materialPlane = new StandardMaterial("planoMaterial", this.scene);
        materialPlane.diffuseColor = new Color3(0.7, 0.7, 0.8);
        materialPlane.freeze;
        plane.material = materialPlane;
        plane.position = new Vector3(0, 0, 0);
        plane.rotation.x = Math.PI / 2;
        plane.parent = street;

        let planeWhite: Mesh = MeshBuilder.CreatePlane('planeWhite', { width: 200, height: 11 }, this.scene);
        const materialPlaneWhite = new StandardMaterial("materialPlaneWhite", this.scene);
        materialPlaneWhite.diffuseColor = new Color3(1, 1, 1);
        materialPlaneWhite.freeze;
        planeWhite.material = materialPlaneWhite;

        //planeWhite.rotation.x = Math.PI / 2;
        planeWhite.rotation.x = Math.PI / 2;
        planeWhite.parent = street;
        planeWhite.position = new Vector3(0, -0.05, 0);


    }


    createTrees() {
        this.tree = this.scene.getTransformNodeByName("tree");
        this.tree.position = new Vector3(0, 2, -10);

        const trees: TransformNode[] = [];

        for (let i = -50; i < 50; i += 10) {
            let tree1 = this.tree.instantiateHierarchy();
            tree1.position = new Vector3(i - 10, 2, 12 * Math.sign(Math.random() - 0.5));
            tree1.scaling.y = 0.75 + Math.random();
            tree1.freezeWorldMatrix();
            trees.push(tree1);
        }
    }

    centreLines() {
        const planeCentreNode = new TransformNode("planeCentreNode");
        const materialPlaneCentreLine = new StandardMaterial("materialPlaneCentreLine", this.scene);
        materialPlaneCentreLine.diffuseColor = new Color3(1, 1, 0);
        materialPlaneCentreLine.freeze;

        this.planeCentreLines = [];

        for (let i = -100; i < 100; i += 20) {
            let line: Mesh;

            line = MeshBuilder.CreatePlane(`planeCentreLine ${i}`, { width: 8, height: 0.5 }, this.scene);

            line.material = materialPlaneCentreLine;
            line.position = new Vector3(i, 0.1, 0);
            line.rotation.x = Math.PI / 2;

            line.parent = planeCentreNode;
            this.planeCentreLines.push(line);
        }
    }
    createMileMarker() {
        const planeMileMarkerNode = new TransformNode("planeMileMarkerNode");
        this.planeMileMarkers = [];

        const materialPost = new StandardMaterial("materialPost", this.scene);
        materialPost.diffuseColor = new Color3(0.9, 0.9, 0.9);
        materialPost.freeze;

        const font_size: number = 48;
        const font: string = "normal " + font_size + "px Arial";
        const planeHeight: number = 4;

        //Set height for dynamic texture
        const DTHeight: number = 1.5 * font_size; //or set as wished

        //Calculate ratio
        const ratio: number = planeHeight / DTHeight;


        for (let i = -50; i < 50; i += 10) {
            let mesh = MeshBuilder.CreatePlane(`planeMileMarker ${i}`, { width: 5, height: 3 }, this.scene);
            let meshPostRight = MeshBuilder.CreatePlane(`meshPostRight ${i}`, { width: 0.5, height: 2 }, this.scene);
            meshPostRight.material = materialPost;
            let meshPostLeft = MeshBuilder.CreatePlane(`meshPostLeft ${i}`, { width: 0.5, height: 2 }, this.scene);
            meshPostLeft.material = materialPost;

            mesh.position = new Vector3(i * 2, 4, 6);
            mesh.rotation.y = Math.PI / 2.5;
            mesh.parent = planeMileMarkerNode;

            meshPostRight.position = new Vector3(i * 2 + 0.8, 2.1, 4.4);
            meshPostRight.rotation.y = Math.PI / 2.5;
            meshPostRight.parent = planeMileMarkerNode;

            meshPostLeft.position = new Vector3(i * 2 + 0.1, 2, 8);
            meshPostLeft.rotation.y = Math.PI / 2.5;
            meshPostLeft.parent = planeMileMarkerNode;



            //Set text
            let text: string = `${i} m`;

            //Use a temporary dynamic texture to calculate the length of the text on the dynamic texture canvas
            let tempDynamicTexture = new DynamicTexture(`DynamicTextureTemp${i}`, 64, this.scene);
            let tempCtx = tempDynamicTexture.getContext();
            tempCtx.font = font;
            let DTWidth = tempCtx.measureText(text).width + 8;

            //Calculate width the plane has to be 
            let planeWidth = DTWidth * ratio;

            let dynamicTexture = new DynamicTexture(`DynamicTexture${i}`, { width: DTWidth, height: DTHeight }, this.scene, false);
            let mat = new StandardMaterial(`mat${i}`, this.scene);
            mat.diffuseTexture = dynamicTexture;
            mat.freeze;
            dynamicTexture.drawText(text, null, null, font, "#ffffff", "#007700", true);
            mesh.material = mat;


        }



    }
}


