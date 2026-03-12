/**
 * 赶马入圈 - 关卡配置
 */

import { Level } from './Game';

export const levels: Level[] = [
  // 第1关 - 教学关
  {
    id: 1,
    gridSize: 3,
    horses: [
      { id: 1, pos: { x: 0, y: 0 }, color: 'black', inPen: false }
    ],
    pens: [
      { x: 2, y: 2 }
    ],
    baits: [
      { x: 1, y: 1 }
    ],
    walls: []
  },
  // 第2关
  {
    id: 2,
    gridSize: 3,
    horses: [
      { id: 1, pos: { x: 0, y: 0 }, color: 'black', inPen: false },
      { id: 2, pos: { x: 2, y: 0 }, color: 'white', inPen: false }
    ],
    pens: [
      { x: 1, y: 2 }
    ],
    baits: [
      { x: 0, y: 2 },
      { x: 2, y: 2 }
    ],
    walls: []
  },
  // 第3关
  {
    id: 3,
    gridSize: 4,
    horses: [
      { id: 1, pos: { x: 0, y: 0 }, color: 'black', inPen: false },
      { id: 2, pos: { x: 1, y: 2 }, color: 'white', inPen: false }
    ],
    pens: [
      { x: 1, y: 1 }
    ],
    baits: [
      { x: 2, y: 0 },
      { x: 2, y: 3 }
    ],
    walls: []
  },
  // 第4关
  {
    id: 4,
    gridSize: 4,
    horses: [
      { id: 1, pos: { x: 0, y: 0 }, color: 'black', inPen: false },
      { id: 2, pos: { x: 3, y: 0 }, color: 'white', inPen: false },
      { id: 3, pos: { x: 0, y: 3 }, color: 'black', inPen: false }
    ],
    pens: [
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ],
    baits: [
      { x: 1, y: 0 },
      { x: 2, y: 3 },
      { x: 3, y: 1 }
    ],
    walls: []
  },
  // 第5关
  {
    id: 5,
    gridSize: 4,
    horses: [
      { id: 1, pos: { x: 0, y: 1 }, color: 'black', inPen: false },
      { id: 2, pos: { x: 3, y: 1 }, color: 'white', inPen: false },
      { id: 3, pos: { x: 1, y: 3 }, color: 'black', inPen: false }
    ],
    pens: [
      { x: 1, y: 0 },
      { x: 2, y: 3 }
    ],
    baits: [
      { x: 2, y: 0 },
      { x: 0, y: 2 },
      { x: 3, y: 2 }
    ],
    walls: [
      { x: 1, y: 2 }
    ]
  },
  // 第6关 - 新增
  {
    id: 6,
    gridSize: 4,
    horses: [
      { id: 1, pos: { x: 0, y: 0 }, color: 'black', inPen: false },
      { id: 2, pos: { x: 3, y: 3 }, color: 'white', inPen: false }
    ],
    pens: [
      { x: 0, y: 2 },
      { x: 3, y: 1 }
    ],
    baits: [
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ],
    walls: [
      { x: 1, y: 0 },
      { x: 2, y: 3 }
    ]
  },
  // 第7关 - 新增
  {
    id: 7,
    gridSize: 4,
    horses: [
      { id: 1, pos: { x: 1, y: 0 }, color: 'black', inPen: false },
      { id: 2, pos: { x: 2, y: 0 }, color: 'white', inPen: false },
      { id: 3, pos: { x: 1, y: 3 }, color: 'black', inPen: false }
    ],
    pens: [
      { x: 0, y: 1 },
      { x: 3, y: 2 }
    ],
    baits: [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 2, y: 3 }
    ],
    walls: [
      { x: 2, y: 1 },
      { x: 1, y: 2 }
    ]
  },
  // 第8关 - 新增
  {
    id: 8,
    gridSize: 4,
    horses: [
      { id: 1, pos: { x: 0, y: 0 }, color: 'black', inPen: false },
      { id: 2, pos: { x: 3, y: 0 }, color: 'white', inPen: false },
      { id: 3, pos: { x: 0, y: 3 }, color: 'black', inPen: false },
      { id: 4, pos: { x: 3, y: 3 }, color: 'white', inPen: false }
    ],
    pens: [
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ],
    baits: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 2 },
      { x: 3, y: 2 }
    ],
    walls: []
  },
  // 第9关 - 新增
  {
    id: 9,
    gridSize: 5,
    horses: [
      { id: 1, pos: { x: 0, y: 0 }, color: 'black', inPen: false },
      { id: 2, pos: { x: 4, y: 0 }, color: 'white', inPen: false },
      { id: 3, pos: { x: 2, y: 2 }, color: 'black', inPen: false }
    ],
    pens: [
      { x: 0, y: 4 },
      { x: 4, y: 4 }
    ],
    baits: [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 3 }
    ],
    walls: [
      { x: 1, y: 3 },
      { x: 3, y: 3 }
    ]
  },
  // 第10关 - 新增
  {
    id: 10,
    gridSize: 5,
    horses: [
      { id: 1, pos: { x: 0, y: 0 }, color: 'black', inPen: false },
      { id: 2, pos: { x: 4, y: 0 }, color: 'white', inPen: false },
      { id: 3, pos: { x: 0, y: 4 }, color: 'black', inPen: false },
      { id: 4, pos: { x: 4, y: 4 }, color: 'white', inPen: false }
    ],
    pens: [
      { x: 2, y: 2 }
    ],
    baits: [
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 1 },
      { x: 2, y: 3 }
    ],
    walls: [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 1, y: 3 },
      { x: 3, y: 3 }
    ]
  }
];

export default levels;
