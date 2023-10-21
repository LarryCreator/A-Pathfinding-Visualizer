import { getRandomInt } from "../vectors.js";

export class MazeGenerator {
    constructor(refToCanvasController) {
        this.stack = [];//list to keep track of the path
        this.canvasController = refToCanvasController;
        this.chunks = [];//as my maze is not made with line segments, i made chunks of nodes, each chunk has 3 nodes of height and width
        this.startNodeColor = 'orange';
        this.targetNodeColor = 'red';
    };
    genMaze() { 
        this.canvasController.grid.fillWithObstacles();
        this.chunks.length = 0;
        //create chunks
        this.createChunks();

        //mazeAlgo
        let current = this.chunks[getRandomInt(0, this.chunks.length - 1)];
        current.visited = true;
        this.stack.push(current);
        while (this.stack.length > 0) {
            current = this.stack.pop();
            if (this.haveUnvisitedNeighbors(current)) {
                this.stack.push(current);
                //choose one of the unvisited neighbors
                const chosenNeighbor = this.getRandomUnvisitedNeighbor(current);
                const setColors = ()=>{
                    this.paintSideThatItCameFrom(chosenNeighbor);
                    current.center.node.fillColor = 'transparent';
                };
                requestAnimationFrame(setColors);
                chosenNeighbor.visited = true;
                this.stack.push(chosenNeighbor);
            }
        };
    };
    getAdjacentNodes(canvasController, currentNode) {
        let adjacentNodes = [];
        for (let node of canvasController.nodes) {
            if (node.node.fillColor != 'transparent' && node.node.fillColor != this.startNodeColor && node.node.fillColor != this.targetNodeColor) {
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
    getRandomUnvisitedNeighbor(chunk) {
        const adjacentChunks = chunk.getAdjacentChunks(this);
        shuffleArray(adjacentChunks);

        for (let chunk of adjacentChunks) {
            if (!chunk.visited && chunk.center.node.fillColor != this.startNodeColor && chunk.center.node.fillColor != this.targetNodeColor) {
                return chunk;
            }
        }
    }
    haveUnvisitedNeighbors(chunk) {
        let haveUnvisitedNeighbors = false;
        const adjacentChunks = chunk.getAdjacentChunks(this);
        for (let chunk of adjacentChunks) {
            if (!chunk.visited && chunk.center.node.fillColor != this.startNodeColor && chunk.center.node.fillColor != this.targetNodeColor &&
                chunk.center.node.fillColor != 'transparent') {
                haveUnvisitedNeighbors = true;
                break;
            }
        };
        return haveUnvisitedNeighbors;
    }
    createChunks() {
        const gridColumnLength = this.canvasController.grid.grid.length;
        const gridRowLength = this.canvasController.grid.grid[0].length;
        for (let node of this.canvasController.nodes) {
            if (node.columnIndex >= 1 && node.columnIndex <= gridColumnLength - 2 &&
                node.nodeIndex >= 1 && node.nodeIndex <= gridRowLength - 2) {
                let chunk = {
                    center: node,
                    adjacentNodes: this.getAdjacentNodes(this.canvasController, node),
                    visited: false,
                    getAdjacentChunks(parent) {
                        let adjacentChunks = [];
                        for (let chunk of parent.chunks) {
                            const left = chunk.center.columnIndex == this.center.columnIndex && chunk.center.nodeIndex == this.center.nodeIndex - 1;
                            const right = chunk.center.columnIndex == this.center.columnIndex && chunk.center.nodeIndex == this.center.nodeIndex + 1;
                            const top = chunk.center.columnIndex == this.center.columnIndex - 1 && chunk.center.nodeIndex == this.center.nodeIndex;
                            const bottom = chunk.center.columnIndex == this.center.columnIndex + 1 && chunk.center.nodeIndex == this.center.nodeIndex;
                            if (left || right || top || bottom) {
                                chunk.dirFromCurrent = [top, right, bottom, left];
                                adjacentChunks.push(chunk);
                            }
                        };
                        return adjacentChunks;
                    }
                };
                
                this.chunks.push(chunk);
            }
            
        };
    };
    paintSideThatItCameFrom(chunk) {
        if (chunk.dirFromCurrent[0]) {
            if (chunk.adjacentNodes[2]) {
                chunk.adjacentNodes[2].node.fillColor = 'transparent';
            }
            
        }
        else if (chunk.dirFromCurrent[1]) {
            if (chunk.adjacentNodes[0]) {
                chunk.adjacentNodes[0].node.fillColor = 'transparent';
            }
            
        }
        else if (chunk.dirFromCurrent[2]) {
            if (chunk.adjacentNodes[1]) {
                chunk.adjacentNodes[1].node.fillColor = 'transparent';
            }
            
        }
        else if (chunk.dirFromCurrent[3]) {
            if (chunk.adjacentNodes[3]) {
                chunk.adjacentNodes[3].node.fillColor = 'transparent';
            }
            
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
    }
}
