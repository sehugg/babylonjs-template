import { Main } from "./main";

const isWebWorker = typeof (window as any)['WorkerGlobalScope'] === 'function';

if (isWebWorker) {
    // TODO: web worker
} else {
    window.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
        const app = new Main(canvas);
        app.run();
    });
}
