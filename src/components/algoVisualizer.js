import {useRef, useEffect} from 'react';
import {CanvasController} from './otherClasses/canvasController.js';
const canvasController = new CanvasController();
function AlgoVisualizer({navBarHeight, algo, shouldRun, stopRunning}) {
    const canvas = useRef(null);

    useEffect(()=>{
            canvasController.initialize(navBarHeight, algo, stopRunning, canvas.current);
        }, []);

    useEffect(()=>{
        if (shouldRun) {
            canvasController.reset();
            canvasController.running = true;
        }
    }, [shouldRun]);

    return (
        <canvas ref={canvas} id='canvas'></canvas>
    )
}


export default AlgoVisualizer;