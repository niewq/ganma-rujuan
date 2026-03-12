// 赶马入圈 - 抖音小游戏
// 获取canvas上下文
var canvas = tt.createCanvas();
var ctx = canvas.getContext('2d');

// 游戏配置
var COLS = 10;
var ROWS = 14;
var GAME_WIDTH = 500;
var GAME_HEIGHT = 667;
var CELL_WIDTH = GAME_WIDTH / COLS;
var CELL_HEIGHT = GAME_HEIGHT / ROWS;

// 设置canvas尺寸
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// 同步canvas尺寸到DOM
var gameCanvas = document.getElementById('gameCanvas');
if (gameCanvas) {
    gameCanvas.width = GAME_WIDTH;
    gameCanvas.height = GAME_HEIGHT;
}

// 游戏状态
var level = 1;
var horses = [];
var timeLeft = 120;
var timerInterval = null;
var isMoving = false;

// 马的朝向
var DIRECTIONS = {
    'left-top': { dx: -1, dy: -1 },
    'right-top': { dx: 1, dy: -1 },
    'left-bottom': { dx: -1, dy: 1 },
    'right-bottom': { dx: 1, dy: 1 }
};
var DIRECTION_KEYS = Object.keys(DIRECTIONS);

// 检查格子是否被占用
function isCellOccupied(gridX, gridY) {
    for (var i = 0; i < horses.length; i++) {
        if (horses[i].gridX === gridX && horses[i].gridY === gridY) {
            return true;
        }
    }
    return false;
}

// 初始化游戏
function initGame() {
    horses = [];
    var horseCount = 4 + Math.floor((level - 1) / 5);
    var centerX = Math.floor(COLS / 2);
    var centerY = Math.floor(ROWS / 2);

    for (var i = 0; i < horseCount; i++) {
        var direction = DIRECTION_KEYS[Math.floor(Math.random() * DIRECTION_KEYS.length)];
        var gridX, gridY, attempts = 0;

        do {
            gridX = centerX - 1 + Math.floor(Math.random() * 3);
            gridY = centerY - 1 + Math.floor(Math.random() * 3);
            attempts++;
        } while (isCellOccupied(gridX, gridY) && attempts < 20);

        if (!isCellOccupied(gridX, gridY)) {
            horses.push({ gridX: gridX, gridY: gridY, direction: direction });
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
    timerInterval = setInterval(function() {
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
    for (var i = 0; i <= COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_WIDTH, 0);
        ctx.lineTo(i * CELL_WIDTH, GAME_HEIGHT);
        ctx.stroke();
    }
    for (var j = 0; j <= ROWS; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * CELL_HEIGHT);
        ctx.lineTo(GAME_WIDTH, j * CELL_HEIGHT);
        ctx.stroke();
    }

    // 绘制马
    var colors = {
        'left-top': '#8B4513',
        'right-top': '#D2691E',
        'left-bottom': '#A0522D',
        'right-bottom': '#CD853F'
    };

    for (var k = 0; k < horses.length; k++) {
        var horse = horses[k];
        var x = horse.gridX * CELL_WIDTH + CELL_WIDTH / 2;
        var y = horse.gridY * CELL_HEIGHT + CELL_HEIGHT / 2;

        ctx.fillStyle = colors[horse.direction];
        ctx.beginPath();
        ctx.arc(x, y, Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // 马头方向指示
        var dir = DIRECTIONS[horse.direction];
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + dir.dx * 15, y + dir.dy * 15, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    // 绘制时间
    ctx.fillStyle = timeLeft <= 15 ? '#FF5722' : '#FFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('\u23F1 ' + timeLeft + '\u79D2', 20, 35);
}

// 处理点击
function handleTouch(e) {
    if (isMoving) return;
    
    var rect = canvas.getBoundingClientRect();
    var clientX, clientY;
    
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    var x = clientX - rect.left;
    var y = clientY - rect.top;

    var scaleX = GAME_WIDTH / rect.width;
    var scaleY = GAME_HEIGHT / rect.height;
    var canvasX = x * scaleX;
    var canvasY = y * scaleY;

    var gridX = Math.floor(canvasX / CELL_WIDTH);
    var gridY = Math.floor(canvasY / CELL_HEIGHT);

    // 找到点击的马
    for (var i = 0; i < horses.length; i++) {
        if (horses[i].gridX === gridX && horses[i].gridY === gridY) {
            moveHorse(horses[i]);
            break;
        }
    }
}

function moveHorse(horse) {
    isMoving = true;
    var dir = DIRECTIONS[horse.direction];
    var stepTime = 150;

    function step() {
        var nextX = horse.gridX + dir.dx;
        var nextY = horse.gridY + dir.dy;

        // 检查碰撞
        var collision = false;
        for (var i = 0; i < horses.length; i++) {
            if (horses[i] !== horse && horses[i].gridX === nextX && horses[i].gridY === nextY) {
                collision = true;
                break;
            }
        }
        
        if (collision) {
            isMoving = false;
            return;
        }

        horse.gridX = nextX;
        horse.gridY = nextY;
        render();

        // 检查是否移出边界
        if (nextX < 0 || nextX >= COLS || nextY < 0 || nextY >= ROWS) {
            // 移除该马
            var newHorses = [];
            for (var j = 0; j < horses.length; j++) {
                if (horses[j] !== horse) {
                    newHorses.push(horses[j]);
                }
            }
            horses = newHorses;
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
    var victoryLevel = document.getElementById('victoryLevel');
    if (victoryLevel) {
        victoryLevel.textContent = level;
    }
    var overlay = document.getElementById('victoryOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function showFail() {
    var failLevel = document.getElementById('failLevel');
    if (failLevel) {
        failLevel.textContent = level;
    }
    var overlay = document.getElementById('failOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

// 事件监听 - 兼容DOM和抖音环境
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('click', handleTouch);

// 绑定按钮事件
var restartBtn = document.getElementById('restartBtn');
if (restartBtn) {
    restartBtn.addEventListener('click', function() {
        var failOverlay = document.getElementById('failOverlay');
        if (failOverlay) {
            failOverlay.classList.remove('show');
        }
        initGame();
    });
}

var nextBtn = document.getElementById('nextBtn');
if (nextBtn) {
    nextBtn.addEventListener('click', function() {
        level++;
        var levelSpan = document.getElementById('level');
        if (levelSpan) {
            levelSpan.textContent = level;
        }
        initGame();
    });
}

var nextLevelBtn = document.getElementById('nextLevelBtn');
if (nextLevelBtn) {
    nextLevelBtn.addEventListener('click', function() {
        level++;
        var levelSpan = document.getElementById('level');
        if (levelSpan) {
            levelSpan.textContent = level;
        }
        var victoryOverlay = document.getElementById('victoryOverlay');
        if (victoryOverlay) {
            victoryOverlay.classList.remove('show');
        }
        initGame();
    });
}

var retryBtn = document.getElementById('retryBtn');
if (retryBtn) {
    retryBtn.addEventListener('click', function() {
        var failOverlay = document.getElementById('failOverlay');
        if (failOverlay) {
            failOverlay.classList.remove('show');
        }
        initGame();
    });
}

var shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', function() {
        if (tt.showShareMenu) {
            tt.showShareMenu({
                title: '\uD83D\uDC34 \u8D74\u9A6C\u5165\u5708',
                desc: '\u6211\u6B63\u5728\u7B2C' + level + '\u5173\uFF0C\u5FEB\u6765\u6311\u6218\u6211\uFF01'
            });
        }
    });
}

// 启动游戏
initGame();
