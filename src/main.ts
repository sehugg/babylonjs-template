

// https://doc.babylonjs.com/divingDeeper/developWithBjs/treeShaking#almighty-inspector
var debug = true;
import "@babylonjs/core/Debug/debugLayer"; // Augments the scene with the debug methods
import "@babylonjs/inspector"; // Injects a local ES6 version of the inspector to prevent 

import * as BABYLON from "@babylonjs/core";

export class Main {
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    xr: BABYLON.WebXRDefaultExperience | null = null;

    constructor(canvas: HTMLCanvasElement) {
        const engine = this.engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
        const scene = this.scene = new BABYLON.Scene(engine);

        scene.createDefaultEnvironment(); // plane + skybox

        const camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 4, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    
        const box = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 0.75, depth: 0.25});
    
        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
            engine.resize();
        });
    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        const isDebug = (import.meta as any).env.DEV;
        this.debug(isDebug);

        this.engine.runRenderLoop(() => {
            this.scene.render();
            const timeStep = this.scene.deltaTime / 1000;
            this.update(timeStep);
        });
    }

    update(timeStep: number) {
    }

    async startXR() {
        const xrHelper = await this.scene.createDefaultXRExperienceAsync({
        });
        xrHelper.baseExperience.onInitialXRPoseSetObservable.add((xrCamera) => {
            this.xr = xrHelper;
        });
    }
}
