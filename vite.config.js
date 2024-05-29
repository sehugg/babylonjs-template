import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
    return {
        base: '/webxr/',
        resolve: {
            alias: {
                'babylonjs': mode === 'development' ? 'babylonjs/babylon.max' : 'babylonjs'
            }
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        babylon: ['babylonjs']
                    }
                }
            }
        }
    };
});
