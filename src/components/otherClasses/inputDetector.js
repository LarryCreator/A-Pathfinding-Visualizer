import { Vector2d } from "./vectors.js";
export class InputDetector {
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
            canvas.removeEventListener("touchstart", this.mouseDownCallback);

        }
        
        // Create a new "mousedown" callback function
        this.mouseDownCallback = (e) => {
            e.preventDefault();
            this.isDragged = true;
            if (e.touches) {
                //as the area of a touch is bigger than a mouse, its better to update it right away in here
                const touch = e.touches[0]; // Get the first touch
                this.position.x = touch.clientX - canvas.getBoundingClientRect().left; // Calculate X position
                this.position.y = touch.clientY - canvas.getBoundingClientRect().top; // Calculate Y position
            }
            if (callback) {
                callback();
            }
        };

        // Add the "mousedown" event listener
        canvas.addEventListener("mousedown", this.mouseDownCallback);
        canvas.addEventListener("touchstart", this.mouseDownCallback);
    }

    released(callback = null, canvas) {
        // Remove previous "mouseup" event listener if it exists
        if (this.mouseReleasedCallback) {
            canvas.removeEventListener("mouseup", this.mouseReleasedCallback);
            canvas.removeEventListener("touchend", this.mouseReleasedCallback);

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
        canvas.addEventListener("touchend", this.mouseReleasedCallback);

    }

    dragged(callback = null, canvas) {
        // Remove previous "mousemove" event listener if it exists
        if (this.mouseMoveCallback) {
            canvas.removeEventListener("mousemove", this.mouseMoveCallback);
            canvas.removeEventListener("touchmove", this.mouseMoveCallback);

        }

        // Create a new "mousemove" callback function
        this.mouseMoveCallback = (e) => {
            this.previousPosition = this.position.copy();
            if (!e.touches) {//get the position of the mouse only if there's no touch screen
                const rect2 = canvas.getBoundingClientRect();
                this.position.x = e.clientX - rect2.left;
                this.position.y = e.clientY - rect2.top;
            }
            else {//else, get the position of the touch and update it
                const touch = e.touches[0]; // Get the first touch
                this.position.x = touch.clientX - canvas.getBoundingClientRect().left; // Calculate X position
                this.position.y = touch.clientY - canvas.getBoundingClientRect().top; // Calculate Y position
            }
            
            if (this.isDragged) {
                if (callback) {
                    callback();
                }
            }
        };

        // Add the "mousemove" event listener
        canvas.addEventListener("mousemove", this.mouseMoveCallback);
        canvas.addEventListener("touchmove", this.mouseMoveCallback);

    }
}
