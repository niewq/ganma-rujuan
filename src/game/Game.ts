/**
 * 赶马入圈 - 核心游戏逻辑
 */

export enum CellType {
  EMPTY = 0,
  WALL = 1,
  PEN = 2,
  BAIT = 3
}

export interface Position {
  x: number;
  y: number;
}

export interface Horse {
  id: number;
  pos: Position;
  color: 'black' | 'white';
  inPen: boolean;
}

export interface Level {
  id: number;
  gridSize: number;
  horses: Horse[];
  pens: Position[];
  baits: Position[];
  walls: Position[];
}

export class Game {
  private level: Level | null = null;
  private selectedHorse: Horse | null = null;
  private moveCount: number = 0;
  private startTime: number = 0;

  // 加载关卡
  loadLevel(levelData: Level) {
    this.level = JSON.parse(JSON.stringify(levelData));
    this.selectedHorse = null;
    this.moveCount = 0;
    this.startTime = Date.now();
  }

  // 获取当前关卡
  getLevel(): Level | null {
    return this.level;
  }

  // 选中马
  selectHorse(horseId: number): boolean {
    if (!this.level) return false;
    
    const horse = this.level.horses.find(h => h.id === horseId);
    if (horse && !horse.inPen) {
      this.selectedHorse = horse;
      return true;
    }
    return false;
  }

  // 取消选中
  deselectHorse(): void {
    this.selectedHorse = null;
  }

  // 获取选中的马
  getSelectedHorse(): Horse | null {
    return this.selectedHorse;
  }

  // 移动马
  moveHorse(dx: number, dy: number): boolean {
    if (!this.level || !this.selectedHorse) return false;

    const newX = this.selectedHorse.pos.x + dx;
    const newY = this.selectedHorse.pos.y + dy;

    // 检查边界
    if (newX < 0 || newX >= this.level.gridSize || 
        newY < 0 || newY >= this.level.gridSize) {
      return false;
    }

    // 检查墙壁
    if (this.isWall(newX, newY)) {
      return false;
    }

    // 检查是否有其他马
    if (this.getHorseAt(newX, newY)) {
      return false;
    }

    // 移动马
    this.selectedHorse.pos.x = newX;
    this.selectedHorse.pos.y = newY;
    this.moveCount++;

    // 检查是否碰到草料（吸引到马圈）
    this.checkBait();

    // 检查是否进入马圈
    this.checkPen();

    return true;
  }

  // 检查是否是墙壁
  private isWall(x: number, y: number): boolean {
    if (!this.level) return false;
    return this.level.walls.some(w => w.x === x && w.y === y);
  }

  // 获取指定位置的马
  private getHorseAt(x: number, y: number): Horse | undefined {
    if (!this.level) return undefined;
    return this.level.horses.find(h => h.pos.x === x && h.pos.y === y && !h.inPen);
  }

  // 检查草料吸引
  private checkBait(): void {
    if (!this.level || !this.selectedHorse) return;

    const horse = this.selectedHorse;
    const bait = this.level.baits.find(b => b.x === horse.pos.x && b.y === horse.pos.y);
    
    if (bait) {
      // 马被草料吸引，寻找最近的马圈
      const nearestPen = this.findNearestPen(horse.pos);
      if (nearestPen) {
        horse.pos.x = nearestPen.x;
        horse.pos.y = nearestPen.y;
        horse.inPen = true;
      }
    }
  }

  // 查找最近的马圈
  private findNearestPen(pos: Position): Position | null {
    if (!this.level) return null;

    let nearest: Position | null = null;
    let minDist = Infinity;

    for (const pen of this.level.pens) {
      const dist = Math.abs(pen.x - pos.x) + Math.abs(pen.y - pos.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = pen;
      }
    }

    return nearest;
  }

  // 检查是否进入马圈
  private checkPen(): void {
    if (!this.level) return;

    for (const horse of this.level.horses) {
      if (!horse.inPen) {
        const inPen = this.level.pens.some(p => p.x === horse.pos.x && p.y === horse.pos.y);
        if (inPen) {
          horse.inPen = true;
        }
      }
    }
  }

  // 检查是否通关
  isLevelComplete(): boolean {
    if (!this.level) return false;
    return this.level.horses.every(h => h.inPen);
  }

  // 获取移动次数
  getMoveCount(): number {
    return this.moveCount;
  }

  // 获取用时（秒）
  getElapsedTime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  // 重置关卡
  resetLevel(): void {
    if (this.level) {
      this.level.horses.forEach(h => h.inPen = false);
      this.selectedHorse = null;
      this.moveCount = 0;
      this.startTime = Date.now();
    }
  }
}

export default Game;
