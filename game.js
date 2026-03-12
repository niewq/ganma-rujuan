// 赶马入圈 - 抖音小游戏
// 抖音小游戏适配
const canvas = tt.createCanvas();
const ctx = canvas.getContext('2d');

// 游戏配置
const COLS = 10;
const ROWS = 14;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 667;
const CELL_WIDTH = GAME_WIDTH / COLS;
const CELL_HEIGHT = GAME_HEIGHT / ROWS;

// 设置canvas尺寸
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
document.getElementById('gameCanvas').width = GAME_WIDTH;
document.getElementById('gameCanvas').height = GAME_HEIGHT;

// 游戏状态
let level = 1;
let horses = [];
let timeLeft = 120;
let timerInterval = null;
let isMoving = false;

// 马的朝向
const DIRECTIONS = {
  'left-top': { dx: -1, dy: -1 },
  'right-top': { dx: 1, dy: -1 },
  'left-bottom': { dx: -1, dy: 1 },
  'right-bottom': { dx: 1, dy: 1 }
};
const DIRECTION_KEYS = Object.keys(DIRECTIONS);

// 检查格子是否被占用
function isCellOccupied(gridX, gridY) {
  return horses.some(h => h.gridX === gridX && h.gridY === gridY);
}

// 初始化游戏
function initGame() {
  horses = [];
  const horseCount = 4 + Math.floor((level - 1) / 5);
  const centerX = Math.floor(COLS / 2);
  const centerY = Math.floor(ROWS / 2);

  for (let i = 0; i < horseCount; i++) {
    const direction = DIRECTION_KEYS[Math.floor(Math.random() * DIRECTION_KEYS.length)];
    let gridX, gridY, attempts = 0;

    do {
      gridX = centerX - 1 + Math.floor(Math.random() * 3);
      gridY = centerY - 1 + Math.floor(Math.random() * 3);
      attempts++;
    } while (isCellOccupied(gridX, gridY) && attempts < 20);

    if (!isCellOccupied(gridX, gridY)) {
      horses.push({ gridX, gridY, direction });
    }
  }

  timeLeft = getTimeLimit();
  startTimer();
  render();
}

function getTimeLimit() {
  if (level <= 5) return 120;
  if (level <= 10) return 90;
  if (level <= 20) return 75;
  if (level <= 30) return 60;
  return 45;
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showFail();
    }
    render();
  }, 1000);
}

// 渲染游戏
function render() {
  // 清空画布
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // 绘制网格
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_WIDTH, 0);
    ctx.lineTo(i * CELL_WIDTH, GAME_HEIGHT);
    ctx.stroke();
  }
  for (let j = 0; j <= ROWS; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * CELL_HEIGHT);
    ctx.lineTo(GAME_WIDTH, j * CELL_HEIGHT);
    ctx.stroke();
  }

  // 绘制马
  horses.forEach(horse => {
    const x = horse.gridX * CELL_WIDTH + CELL_WIDTH / 2;
    const y = horse.gridY * CELL_HEIGHT + CELL_HEIGHT / 2;

    // 马的颜色根据朝向
    const colors = {
      'left-top': '#8B4513',
      'right-top': '#D2691E',
      'left-bottom': '#A0522D',
      'right-bottom': '#CD853F'
    };

    ctx.fillStyle = colors[horse.direction];
    ctx.beginPath();
    ctx.arc(x, y, Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // 马头方向指示
    const dir = DIRECTIONS[horse.direction];
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + dir.dx * 15, y + dir.dy * 15, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // 绘制时间
  ctx.fillStyle = timeLeft <= 15 ? '#FF5722' : '#FFF';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(`⏱️ ${timeLeft}秒`, 20, 35);
}

// 处理点击
function handleTouch(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  const scaleX = GAME_WIDTH / rect.width;
  const scaleY = GAME_HEIGHT / rect.height;
  const canvasX = x * scaleX;
  const canvasY = y * scaleY;

  const gridX = Math.floor(canvasX / CELL_WIDTH);
  const gridY = Math.floor(canvasY / CELL_HEIGHT);

  // 找到点击的马
  const horse = horses.find(h => h.gridX === gridX && h.gridY === gridY);
  if (horse && !isMoving) {
    moveHorse(horse);
  }
}

function moveHorse(horse) {
  isMoving = true;
  const dir = DIRECTIONS[horse.direction];
  const stepTime = 150;

  function step() {
    const nextX = horse.gridX + dir.dx;
    const nextY = horse.gridY + dir.dy;

    // 检查碰撞
    const collision = horses.find(h => h !== horse && h.gridX === nextX && h.gridY === nextY);
    if (collision) {
      isMoving = false;
      return;
    }

    horse.gridX = nextX;
    horse.gridY = nextY;
    render();

    // 检查是否移出边界
    if (nextX < 0 || nextX >= COLS || nextY < 0 || nextY >= ROWS) {
      horses = horses.filter(h => h !== horse);
      isMoving = false;

      if (horses.length === 0) {
        clearInterval(timerInterval);
        showVictory();
      }
    } else {
      setTimeout(step, stepTime);
    }
  }

  step();
}

function showVictory() {
  document.getElementById('victoryLevel').textContent = level;
  document.getElementById('victoryOverlay').classList.add('show');
}

function showFail() {
  document.getElementById('failLevel').textContent = level;
  document.getElementById('failOverlay').classList.add('show');
}

// 事件监听
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('click', handleTouch);

document.getElementById('restartBtn').addEventListener('click', () => {
  document.getElementById('failOverlay').classList.remove('show');
  initGame();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  level++;
  document.getElementById('level').textContent = level;
  initGame();
});

document.getElementById('nextLevelBtn').addEventListener('click', () => {
  level++;
  document.getElementById('level').textContent = level;
  document.getElementById('victoryOverlay').classList.remove('show');
  initGame();
});

document.getElementById('retryBtn').addEventListener('click', () => {
  document.getElementById('failOverlay').classList.remove('show');
  initGame();
});

document.getElementById('shareBtn').addEventListener('click', () => {
  tt.showShareMenu({
    title: '🐴 赶马入圈',
    desc: `我正在玩第${level}关，快来挑战我！`
  });
});

// 启动游戏
initGame();
