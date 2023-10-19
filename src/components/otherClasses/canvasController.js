import {Canvas, drawLine} from './canvas.js';
import {InputDetector} from './inputDetector.js';
import {Container} from './grid.js';
import * as aStar from './algorithms/aStar.js';
import { Vector2d } from './vectors.js';

export class CanvasController {
    constructor() {
        this.addedOrder = 0;
        this.nodes = [];
        this.openNodes = [];
        this.closedNodes = [];
        this.currentNode = {};
        this.path = [];
        this.obstacleColor = 'gray';
    }
    initialize(navBarHeight, algo, stopRunning, canvas) {
         //setting canvas
        this.stopRunning = stopRunning;
        this.algo = algo;
        this.running = false;
        this.canvas = new Canvas(canvas, window.innerWidth, window.innerHeight, 'black');
        this.grid = new Container(20, this.canvas.height - this.canvas.height/3, this.canvas.width - this.canvas.width/3, this.canvas, navBarHeight);
        this.inputDetector = new InputDetector(this.canvas.canvas);
        this.selectedNode = null;
        this.createNodes();
        this.currentNode = this.nodes.find(element=> element.node == this.grid.startNode);//set current node to start node
        this.resizeCanvas = this.resizeCanvas.bind(this);
        window.addEventListener('resize', this.resizeCanvas);
        this.startLoop(this.canvas.ctx);

    }
    createNodes() {
        this.grid.grid.forEach((column, columnIndex)=>{
            column.forEach((cell, cellIndex)=>{
                const newNode = { //created this here to solve a bug where algo doesn't run if there is only one node in the openList
                    node: cell,
                    g: 0,
                    h: 0,
                    fScore: 0,
                    columnIndex: columnIndex,
                    nodeIndex: cellIndex
                };
                this.nodes.push(newNode);
            })
        });
    }
    reset() {
        this.currentNode = {};
        this.addedOrder = 0;
        this.openNodes = [{
            g: 0,
            h: 0,
            fScore: Infinity,
            columnIndex: 5,
            nodeIndex: 7
        }];
        this.closedNodes = [];
        this.nodes = [];
        this.path = [];
        this.createNodes();
        this.currentNode = this.nodes.find(element=> element.node == this.grid.startNode);//set current node to start node
    }
    resizeCanvas() {
        //taking care of resizing of the screen to make it responsive
        this.canvas.canvas.width = window.innerWidth;
        this.canvas.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.middle.setNew(this.canvas.width / 2, this.canvas.height / 2);
        this.grid.reset(this.canvas.middle, this.canvas.height - this.canvas.height/3, this.canvas.width - this.canvas.width/3);
        this.nodes = [];
        this.createNodes();
        this.genMaze();
        // Redraw your content on the canvas here
    }
    getSelectedNode() {
        this.selectedNode = this.grid.startNode.isSelected(this.inputDetector.position) ? 'start' : this.grid.targetNode.isSelected(this.inputDetector.position) ? 'end' : null;
    }
    clearBoard() {
        this.grid.clearObstacles();
        this.reset();
    }
    moveNode() {
        this.path = [];
        outerLoop: for (let row of this.grid.grid) {
            for (let cell of row) {
                if (cell.isSelected(this.inputDetector.position) && cell.fillColor == 'transparent') {
                    this.grid.startNode.fillColor = this.selectedNode == 'start' ? 'transparent' : this.grid.startNode.fillColor;
                    this.grid.targetNode.fillColor = this.selectedNode == 'end' ? 'transparent' : this.grid.targetNode.fillColor;
                    cell.fillColor = this.selectedNode == 'start' ? 'orange' : 'red';
                    this.grid.startNode = this.selectedNode == 'start' ? cell : this.grid.startNode;
                    this.grid.targetNode = this.selectedNode == 'end' ? cell : this.grid.targetNode;
                    this.currentNode = this.nodes.find(element=> element.node == this.grid.startNode);//set current node to start node
                    break outerLoop;
                }
            }
        };
    }
    runAlgorithm() {
        if (this.algo == 'a*') {
            aStar.aStar(this);
            
        };
    }
    drawPath(ctx) {
        if (this.path.length > 0) {
            this.path.forEach((node, index)=>{
                try {
                    const stPos = new Vector2d(node.node.x + node.node.size/2, node.node.y + node.node.size/2);
                    const edPos = new Vector2d(this.path[index + 1].node.x + node.node.size/2, this.path[index + 1].node.y + node.node.size/2)
                    drawLine(stPos, edPos, ctx, 8, 'red');
                }
                catch {
                    return;
                }
            })
        }
        ctx.fillStyle = 'pink';
        ctx.fillRect(this.currentNode.node.x, this.currentNode.node.y, this.currentNode.node.size, this.currentNode.node.size);
    };
    drawFinalPath(ctx) {
        if (this.path.length > 0) {
            this.path.forEach((node, index)=>{
                try {
                    const stPos = new Vector2d(node.node.x + node.node.size/2, node.node.y + node.node.size/2);
                    const edPos = new Vector2d(this.path[index + 1].node.x + node.node.size/2, this.path[index + 1].node.y + node.node.size/2)
                    drawLine(stPos, edPos, ctx, 8, 'green');
                }
                catch {
                    const stPos = new Vector2d(this.path[0].node.x + node.node.size/2, this.path[0].node.y + node.node.size/2);
                    const edPos = new Vector2d(this.nodes.find(element=>element.node == this.grid.targetNode).node.x + node.node.size/2, this.nodes.find(element=>element.node == this.grid.targetNode).node.y + node.node.size/2)
                    drawLine(stPos, edPos, ctx, 8, 'green');
                }
            })
        }
    }
    getFinalPath() {
        this.path = [];
        let current = this.currentNode;
        while (current.parentNode != null) {
            this.path.push(current.parentNode);
            current = current.parentNode;
        };
        
    }
    genMaze() {
        this.nodes.forEach(node=>{
            const val = Math.random();
            if (val < 0.2 && node.node.fillColor != 'orange' && node.node.fillColor != 'red') {
                node.node.fillColor = this.obstacleColor;
            };
        })
    }

    startLoop(ctx) {
        //canvas loop
        this.genMaze();
        this.inputDetector.dragged(()=>{
            for (const node of this.nodes) {
                if (node.node.isSelected(this.inputDetector.position) && node.node.fillColor != 'orange' && node.node.fillColor != 'red' && !this.selectedNode) {
                    node.node.fillColor = this.obstacleColor;
                }
            };
        }, this.canvas.canvas);
        this.inputDetector.pressed(()=>{this.getSelectedNode()}, this.canvas.canvas);
        this.inputDetector.released(()=>{this.selectedNode = null}, this.canvas.canvas);
        document.addEventListener('clearPath', ()=>{//this is emitted from the app component
            this.running = false;
            this.stopRunning();
            this.reset();
        });
        document.addEventListener('clearBoard', ()=>{//this is emitted from the app component
            this.running = false;
            this.stopRunning();
            this.reset();
            this.grid.clearObstacles();
        });
        document.addEventListener('genMaze', ()=>{//this is emitted from the app component
            this.running = false;
            this.stopRunning();
            this.reset();
            this.grid.clearObstacles();
            this.genMaze();
        });
        this.canvas.loop(true, ()=>{
            if (this.inputDetector.isDragged && this.selectedNode && !this.running) {
                this.moveNode();
            }
            if (this.running) {
                this.runAlgorithm();
                this.getFinalPath();
                this.drawPath(ctx);
            }
            else if (!this.running && this.currentNode.node == this.grid.targetNode) {
                this.drawFinalPath(ctx);
            }
            this.grid.renderGrid(ctx);
        })
    }
}

export function getAdjacentNodes(canvasController, currentNode) {
    let adjacentNodes = [];
    for (let node of canvasController.nodes) {
        if (node.node.fillColor != canvasController.obstacleColor) {
            if (node.columnIndex == currentNode.columnIndex &&//if the node is adjascent upwards
                node.nodeIndex == currentNode.nodeIndex - 1 ||
                node.columnIndex == currentNode.columnIndex - 1 && //if the node is adjascent leftwards
                node.nodeIndex == currentNode.nodeIndex ||
                node.columnIndex == currentNode.columnIndex + 1 && //if the node is adjascent rightwards
                node.nodeIndex == currentNode.nodeIndex ||
                node.columnIndex == currentNode.columnIndex && //if the node is adjascent downwards
                node.nodeIndex == currentNode.nodeIndex + 1
            ) {
                adjacentNodes.push(node);
            }
        }
        
    }
    return adjacentNodes;
}
