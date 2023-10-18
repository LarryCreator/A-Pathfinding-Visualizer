import { Vector2d } from "./vectors.js";
export class Mouse {
    constructor(canvas) {
        // Initialize mouse properties
        this.position = new Vector2d();
        this.previousPosition = new Vector2d();
        this.isDragged = false;

        // Callback functions for mouse events
        this.mouseDownCallback = null;
        this.mouseReleasedCallback = null;
        this.mouseMoveCallback = null;

        // Initialize event listeners
        this.pressed(null, canvas);
        this.released(null, canvas);
        this.dragged(null, canvas);
    }

    pressed(callback = null, canvas) {
        // Remove previous "mousedown" event listener if it exists
        if (this.mouseDownCallback) {
            canvas.removeEventListener("mousedown", this.mouseDownCallback);
        }
        
        // Create a new "mousedown" callback function
        this.mouseDownCallback = (e) => {
            this.isDragged = true;
            if (callback) {
                callback();
            }
        };

        // Add the "mousedown" event listener
        canvas.addEventListener("mousedown", this.mouseDownCallback);
    }

    released(callback = null, canvas) {
        // Remove previous "mouseup" event listener if it exists
        if (this.mouseReleasedCallback) {
            canvas.removeEventListener("mouseup", this.mouseReleasedCallback);
        }

        // Create a new "mouseup" callback function
        this.mouseReleasedCallback = (e) => {
            this.isDragged = false;
            if (callback) {
                callback();
            }
        };

        // Add the "mouseup" event listener
        canvas.addEventListener("mouseup", this.mouseReleasedCallback);
    }

    dragged(callback = null, canvas) {
        // Remove previous "mousemove" event listener if it exists
        if (this.mouseMoveCallback) {
            canvas.removeEventListener("mousemove", this.mouseMoveCallback);
        }

        // Create a new "mousemove" callback function
        this.mouseMoveCallback = (e) => {
            this.previousPosition = this.position.copy();
            const rect2 = canvas.getBoundingClientRect();
            this.position.x = e.clientX - rect2.left;
            this.position.y = e.clientY - rect2.top;
            if (this.isDragged) {
                if (callback) {
                    callback();
                }
            }
        };

        // Add the "mousemove" event listener
        canvas.addEventListener("mousemove", this.mouseMoveCallback);
    }
}
