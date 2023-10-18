import { Vector2d, mapValue, getRandomInt } from "./vectors";
import { drawCircle } from "./canvas.js";
export class Container {
    constructor(cellSize, height, width, canvas, navBarHeight) {
        this.height = height
        this.width = width
        this.yOffset = navBarHeight/3;
        this.position = new Vector2d(canvas.middle.x - width/2, canvas.middle.y + this.yOffset - height/2);
        this.cellSize = cellSize;
        this.startNode = {};
        this.targetNode = {};
        this.grid = [];
        this.initializeGrid(this.cellSize);
        
    }
    initializeGrid(cellSize) {
        for (let w = 0; w < this.width; w += cellSize) {
            const column = [];
            for (let h = 0; h < this.height; h += cellSize) {
                const cell = {
                    size: cellSize,
                    x: mapValue(w, 0, this.width, this.position.x, this.position.x + this.width),
                    y: mapValue(h, 0, this.height, this.position.y, this.position.y + this.height),
                    fillColor: 'transparent',

                    isSelected(mousePos) {
                        if (mousePos.x > this.x && mousePos.x < this.x + this.size &&
                            mousePos.y > this.y && mousePos.y < this.y + this.size) {
                            return true;
                        }
                        return false;
                    }

                }
                column.push(cell);
            };
            this.grid.push(column);
        } 
        //setting start node
        this.startNode = this.getRandomCell();
        this.startNode.fillColor = 'orange'; 
        //setting target;
        this.targetNode = this.getRandomCell()
        this.targetNode.fillColor = 'red'; 
    }
    clearObstacles() {
        this.grid.forEach(column=>{
            column.forEach(cell=>{
                cell.fillColor = cell.fillColor != 'red' && cell.fillColor != 'orange' ? 'transparent' : cell.fillColor;
            })
        })
    }
    getRandomCell() {
        let randomRow =  this.grid[getRandomInt(0, this.grid.length - 1)];
        let randomCell = randomRow[getRandomInt(0, randomRow.length - 1)];
        return randomCell;
    }
    reset(canvasMiddlePos, height, width) {
        this.height = height;
        this.width = width;
        this.position.setNew(canvasMiddlePos.x - width/2, canvasMiddlePos.y + this.yOffset - height/2);
        this.grid = [];
        this.initializeGrid(this.cellSize);
    }
    drawBorders(ctx) {
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.position.x - 10, this.position.y - 10);
        ctx.lineTo(this.position.x + this.width + 10, this.position.y - 10);
        ctx.lineTo(this.position.x + this.width + 10, this.position.y + this.height + 20);
        ctx.lineTo(this.position.x - 10, this.position.y + this.height + 20);
        ctx.lineTo(this.position.x - 10, this.position.y - 10);
        ctx.stroke();
    }
    renderGrid(ctx) {
        this.drawBorders(ctx);
        this.grid.forEach(row=>{
            row.forEach(cell=>{
                drawCircle(new Vector2d(cell.x + cell.size/2, cell.y + cell.size/2), cell.size/3, ctx, cell.fillColor, 'transparent');
            })    
        })
    }
}
