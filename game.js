// 赶马入圈 - 抖音小游戏
// 游戏配置
var COLS = 10;
var ROWS = 14;
var GAME_WIDTH = 375;
var GAME_HEIGHT = 500;
var CELL_WIDTH = GAME_WIDTH / COLS;
var CELL_HEIGHT = GAME_HEIGHT / ROWS;

// 游戏状态
var level = 1;
var horses = [];
var timeLeft = 120;
var timerInterval = null;
var isMoving = false;
var canvas = null;
var ctx = null;

// 马的朝向
var DIRECTIONS = {
    'left-top': { dx: -1, dy: -1 },
    'right-top': { dx: 1, dy: -1 },
    'left-bottom': { dx: -1, dy: 1 },
    'right-bottom': { dx: 1, dy: 1 }
};
var DIRECTION_KEYS = ['left-top', 'right-top', 'left-bottom', 'right-bottom'];

// 检查格子是否被占用
function isCellOccupied(gridX, gridY) {
    var i;
    for (i = 0; i < horses.length; i++) {
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
    var i;

    for (i = 0; i < horseCount; i++) {
        var direction = DIRECTION_KEYS[Math.floor(Math.random() * DIRECTION_KEYS.length)];
        var gridX, gridY, attempts = 0;

        do {
            gridX = centerX - 1 + Math.floor(Math.random() * 3);
            gridY = centerY - 1 + Math.floor(Math.random() * 3);
            attempts++;
        } while (attempts < 20 && isCellOccupied(gridX, gridY));

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
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerInterval = setInterval(function() {
        timeLeft = timeLeft - 1;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            showFail();
        }
        render();
    }, 1000);
}

// 渲染游戏
function render() {
    if (!ctx) return;
    
    // 清空画布 - 绿色草地背景
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // 绘制网格
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    var i;
    for (i = 0; i <= COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_WIDTH, 0);
        ctx.lineTo(i * CELL_WIDTH, GAME_HEIGHT);
        ctx.stroke();
    }
    for (i = 0; i <= ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_HEIGHT);
        ctx.lineTo(GAME_WIDTH, i * CELL_HEIGHT);
        ctx.stroke();
    }

    // 绘制马 - 使用圆形+颜色
    var colors = {
        'left-top': '#8B4513',
        'right-top': '#D2691E',
        'left-bottom': '#A0522D',
        'right-bottom': '#CD853F'
    };

    for (i = 0; i < horses.length; i++) {
        var horse = horses[i];
        var x = horse.gridX * CELL_WIDTH + CELL_WIDTH / 2;
        var y = horse.gridY * CELL_HEIGHT + CELL_HEIGHT / 2;
        var radius = Math.min(CELL_WIDTH, CELL_HEIGHT) * 0.4;

        // 马身
        ctx.fillStyle = colors[horse.direction];
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 马边框
        ctx.strokeStyle = '#5D3A1A';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 马头方向指示
        var dirObj = DIRECTIONS[horse.direction];
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + dirObj.dx * radius * 0.6, y + dirObj.dy * radius * 0.6, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // 绘制标题和时间
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Level ' + level, 10, 25);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = timeLeft <= 15 ? '#FF5722' : '#FFF';
    ctx.fillText('Time: ' + timeLeft, GAME_WIDTH - 90, 25);
}

// 处理点击
function handleTouch(e) {
    if (isMoving || !canvas) return;
    
    var touchInfo = e;
    var clientX = 0;
    var clientY = 0;
    
    if (touchInfo.touches && touchInfo.touches.length > 0) {
        clientX = touchInfo.touches[0].clientX;
        clientY = touchInfo.touches[0].clientY;
    } else if (touchInfo.changedTouches && touchInfo.changedTouches.length > 0) {
        clientX = touchInfo.changedTouches[0].clientX;
        clientY = touchInfo.changedTouches[0].clientY;
    } else {
        return;
    }
    
    // 获取canvas位置
    var rect = null;
    try {
        rect = canvas.getBoundingClientRect();
    } catch(err) {
        rect = { left: 0, top: 0, width: GAME_WIDTH, height: GAME_HEIGHT };
    }
    
    // 计算点击位置
    var x = clientX - rect.left;
    var y = clientY - rect.top;
    var scaleX = GAME_WIDTH / rect.width;
    var scaleY = GAME_HEIGHT / rect.height;
    var canvasX = x * scaleX;
    var canvasY = y * scaleY;

    var gridX = Math.floor(canvasX / CELL_WIDTH);
    var gridY = Math.floor(canvasY / CELL_HEIGHT);

    // 找到点击的马
    var i;
    for (i = 0; i < horses.length; i++) {
        if (horses[i].gridX === gridX && horses[i].gridY === gridY) {
            moveHorse(horses[i]);
            break;
        }
    }
}

function moveHorse(horse) {
    isMoving = true;
    var dirObj = DIRECTIONS[horse.direction];
    var stepTime = 150;

    function step() {
        var nextX = horse.gridX + dirObj.dx;
        var nextY = horse.gridY + dirObj.dy;

        // 检查碰撞
        var collision = false;
        var i;
        for (i = 0; i < horses.length; i++) {
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
            var newHorses = [];
            for (i = 0; i < horses.length; i++) {
                if (horses[i] !== horse) {
                    newHorses.push(horses[i]);
                }
            }
            horses = newHorses;
            isMoving = false;

            if (horses.length === 0) {
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
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
        victoryLevel.innerText = level.toString();
    }
    var overlay = document.getElementById('victoryOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function showFail() {
    var failLevel = document.getElementById('failLevel');
    if (failLevel) {
        failLevel.innerText = level.toString();
    }
    var overlay = document.getElementById('failOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function hideVictory() {
    var overlay = document.getElementById('victoryOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function hideFail() {
    var overlay = document.getElementById('failOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

// 绑定按钮事件
function bindButtons() {
    var restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.onclick = function() {
            hideFail();
            hideVictory();
            level = 1;
            var levelSpan = document.getElementById('level');
            if (levelSpan) {
                levelSpan.innerText = '1';
            }
            initGame();
        };
    }

    var nextLevelBtn = document.getElementById('nextLevelBtn');
    if (nextLevelBtn) {
        nextLevelBtn.onclick = function() {
            level = level + 1;
            var levelSpan = document.getElementById('level');
            if (levelSpan) {
                levelSpan.innerText = level.toString();
            }
            hideVictory();
            initGame();
        };
    }

    var retryBtn = document.getElementById('retryBtn');
    if (retryBtn) {
        retryBtn.onclick = function() {
            hideFail();
            level = 1;
            var levelSpan = document.getElementById('level');
            if (levelSpan) {
                levelSpan.innerText = '1';
            }
            initGame();
        };
    }

    var shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.onclick = function() {
            if (typeof tt !== 'undefined' && tt.showShareMenu) {
                tt.showShareMenu({
                    title: 'Horse Game',
                    desc: 'Level ' + level + ' completed!'
                });
            }
        };
    }
}

// 初始化
function init() {
    // 获取canvas
    var gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) {
        setTimeout(init, 100);
        return;
    }
    
    canvas = gameCanvas;
    ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    // 绑定事件
    canvas.addEventListener('touchstart', handleTouch, false);
    canvas.addEventListener('click', handleTouch, false);
    
    bindButtons();
    
    // 启动游戏
    initGame();
}

// 启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
