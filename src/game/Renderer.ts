/**
 * 赶马入圈 - Canvas 渲染器
 */

import { Game, Level, Horse, Position, CellType } from './Game';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private game: Game;
  
  private cellSize: number = 80;
  private padding: number = 40;
  private colors = {
    background: '#F5E6D3',
    board: '#8B4513',
    cell: '#DEB887',
    cellHover: '#D2B48C',
    selected: '#FFD700',
    pen: 'rgba(139, 69, 19, 0.2)',
    penBorder: '#8B4513',
    bait: '#228B22',
    horseBlack: '#2C2C2C',
    horseWhite: '#F5F5F5',
    text: '#8B4513'
  };

  constructor(canvas: HTMLCanvasElement, game: Game) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.game = game;
    this.setupCanvas();
  }

  private setupCanvas(): void {
    const level = this.game.getLevel();
    if (!level) return;

    const gridSize = level.gridSize;
    const boardSize = gridSize * this.cellSize + (gridSize + 1) * 4;
    
    this.canvas.width = boardSize + this.padding * 2;
    this.canvas.height = boardSize + this.padding * 2 + 60; // 60 for header
  }

  render(): void {
    const level = this.game.getLevel();
    if (!level) return;

    this.clear();
    this.drawHeader();
    this.drawBoard(level);
    this.drawPens(level);
    this.drawBaits(level);
    this.drawHorses(level);
    this.drawSelection();
  }

  private clear(): void {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawHeader(): void {
    const level = this.game.getLevel();
    if (!level) return;

    this.ctx.fillStyle = this.colors.text;
    this.ctx.font = 'bold 24px Microsoft YaHei';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`🐴 赶马入圈 - 第 ${level.id} 关`, this.padding, 30);
    
    this.ctx.textAlign = 'right';
    this.ctx.font = '18px Microsoft YaHei';
    this.ctx.fillText(`步数: ${this.game.getMoveCount()}`, this.canvas.width - this.padding, 30);
  }

  private drawBoard(level: Level): void {
    const startX = this.padding;
    const startY = this.padding + 50;

    // 绘制棋盘背景
    this.ctx.fillStyle = this.colors.board;
    const boardSize = level.gridSize * this.cellSize + level.gridSize * 4;
    this.ctx.fillRect(startX - 4, startY - 4, boardSize + 8, boardSize + 8);

    // 绘制格子
    for (let y = 0; y < level.gridSize; y++) {
      for (let x = 0; x < level.gridSize; x++) {
        const cellX = startX + x * (this.cellSize + 4);
        const cellY = startY + y * (this.cellSize + 4);
        
        this.ctx.fillStyle = this.colors.cell;
        this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
      }
    }
  }

  private drawPens(level: Level): void {
    const startX = this.padding;
    const startY = this.padding + 50;

    for (const pen of level.pens) {
      const cellX = startX + pen.x * (this.cellSize + 4);
      const cellY = startY + pen.y * (this.cellSize + 4);
      
      this.ctx.fillStyle = this.colors.pen;
      this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
      
      this.ctx.strokeStyle = this.colors.penBorder;
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      this.ctx.strokeRect(cellX + 2, cellY + 2, this.cellSize - 4, this.cellSize - 4);
      this.ctx.setLineDash([]);
    }
  }

  private drawBaits(level: Level): void {
    const startX = this.padding;
    const startY = this.padding + 50;

    for (const bait of level.baits) {
      const cellX = startX + bait.x * (this.cellSize + 4) + this.cellSize / 2;
      const cellY = startY + bait.y * (this.cellSize + 4) + this.cellSize / 2;
      
      this.ctx.font = '28px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('🌿', cellX, cellY);
    }
  }

  private drawHorses(level: Level): void {
    const startX = this.padding;
    const startY = this.padding + 50;

    for (const horse of level.horses) {
      if (horse.inPen) continue; // 入圈的马不显示

      const cellX = startX + horse.pos.x * (this.cellSize + 4) + this.cellSize / 2;
      const cellY = startY + horse.pos.y * (this.cellSize + 4) + this.cellSize / 2;
      
      this.ctx.font = '40px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('🐴', cellX, cellY);
    }
  }

  private drawSelection(): void {
    const selectedHorse = this.game.getSelectedHorse();
    if (!selectedHorse) return;

    const startX = this.padding;
    const startY = this.padding + 50;

    const cellX = startX + selectedHorse.pos.x * (this.cellSize + 4);
    const cellY = startY + selectedHorse.pos.y * (this.cellSize + 4);

    this.ctx.fillStyle = this.colors.selected;
    this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
    
    this.ctx.strokeStyle = '#FF8C00';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(cellX, cellY, this.cellSize, this.cellSize);
  }

  // 获取点击的格子坐标
  getCellFromClick(clientX: number, clientY: number): Position | null {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left - this.padding;
    const y = clientY - rect.top - this.padding - 50;

    const cellX = Math.floor(x / (this.cellSize + 4));
    const cellY = Math.floor(y / (this.cellSize + 4));

    const level = this.game.getLevel();
    if (!level) return null;

    if (cellX >= 0 && cellX < level.gridSize && 
        cellY >= 0 && cellY < level.gridSize) {
      return { x: cellX, y: cellY };
    }

    return null;
  }
}

export default Renderer;
