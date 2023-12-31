import { Vector2d } from '../vectors.js';
import { getAdjacentNodes } from '../canvasController.js';

export function aStar(canvasController) {
    const adjacentNodes = getAdjacentNodes(canvasController, canvasController.currentNode);
    //calculate the g, h and fScore values for the adjacent nodes
    calculateNodeValues(canvasController, adjacentNodes);
    handleAddingToOpenList(canvasController, adjacentNodes);
    canvasController.openNodes.sort((a, b) => {
        if (a.fScore != b.fScore) {
            return a.fScore - b.fScore;
        }
        if (a.g != b.g) {
            return a.g - b.g;
        }
        return a.addedOrder - b.addedOrder;
        
    });
    //remove current node from open list
    canvasController.openNodes.splice(canvasController.openNodes.indexOf(canvasController.currentNode), 1);
    canvasController.closedNodes.push(canvasController.currentNode);
    //set new current node to the node in the open list with smaller fScore. If the open list is empty, keep the current one
    canvasController.currentNode = canvasController.openNodes.length > 0 ? canvasController.openNodes[0] : canvasController.currentNode;
    if (canvasController.currentNode.node == canvasController.grid.targetNode) {
        canvasController.running = false;
        canvasController.stopRunning();     //if the targetNode was found, finish the algorithm
        canvasController.getFinalPath();
        return;
    };
    if (canvasController.openNodes.length == 0) {
        window.alert('The target is unreachable');
        canvasController.running = false;
        canvasController.stopRunning();     //if the openList is empty, finish the algorithm
    };
}
export function handleAddingToOpenList(canvasController, adjacentNodes) {
    adjacentNodes.forEach(node=>{
        const nodeOnOpenNodes = canvasController.openNodes.find(element=> element == node);

        if (nodeOnOpenNodes == undefined && !canvasController.closedNodes.includes(node)) {
            canvasController.addedOrder += 1;
            node.addedOrder = canvasController.addedOrder;
            canvasController.openNodes.push(node);
        }
        else if (nodeOnOpenNodes != undefined && !canvasController.closedNodes.includes(node)) {
            const newG = calculateG(canvasController.currentNode);
            nodeOnOpenNodes.g = nodeOnOpenNodes.g > newG ? newG : nodeOnOpenNodes.g;  
        }
    });
}
export function calculateNodeValues(canvasController, adjacentNodes) {
    adjacentNodes.forEach(node=>{
        if (!node.parentNode) {
            node.parentNode = node.node == canvasController.grid.startNode ? null : canvasController.currentNode;
        }
        node.g = calculateG(node);
        node.h = calculateH(node, canvasController.nodes.find(element=> element.node == canvasController.grid.targetNode));
        node.fScore = node.g + node.h;
        
        //calculate g, h and f
    })
}
export function calculateH(node, goalNode) {
    //Manhattan distance Heuristic
    const distance = new Vector2d(Math.abs(goalNode.columnIndex - node.columnIndex), Math.abs(goalNode.nodeIndex - node.nodeIndex));
    const h = distance.x + distance.y;
    return h;
}
export function calculateG(currentNode) {
    /*
    this function objective is to get the cumulative cost from the start node to the current one
    i accomplish that by looping backwards from this node to the start, by going through the parent nodes of the nodes
    each parent i go through i count + 1cost of movement. Its 1 because in this grid, the cost to any direction is 1
    */
    let counter = 0;
    let movementCost = 1;
    let current = currentNode;
    while (current.parentNode != null) {
        counter += movementCost;
        current = current.parentNode;
    };
    const g = counter;
    return g;
}
