export const CANVAS_W = 1920;
export const CANVAS_H = 1080;
export const FPS = 30;
export const STEP_LEN = 150;
export const TOTAL_FRAMES = STEP_LEN * 4;

export const COLORS = {
  bg: '#0b1a24', text: '#edf3f6', muted: '#adbdc7',
  blue: '#83cdf7', orange: '#f5b77c', green: '#8cd5ac', control: '#acbbc5',
  external: '#192d3b', externalBorder: '#526a79',
  internal: '#342f27', internalBorder: '#a57c50', cloud: '#242426',
};
export const STEPS = ['話す', 'AI応対', '予約確認', '人へ引き継ぐ'];
export const STEP_COLORS = [COLORS.blue, COLORS.orange, COLORS.control, COLORS.green];
export const LEGEND = [
  [COLORS.blue, '発話'], [COLORS.orange, '返答'],
  [COLORS.green, '有人音声'], [COLORS.control, '制御・業務'],
];
export type NodeId = 'user' | 'sfu' | 'adapter' | 'ai' | 'human' | 'state' | 'business';
export type NodeDef = {
  id: NodeId; x: number; y: number; w: number; h: number;
  label: string; title: string; lines: string[]; internal?: boolean;
  wave?: boolean; steps: number[];
};
export const NODES: NodeDef[] = [
  {id: 'user', x: 68, y: 240, w: 312, h: 242, label: 'ブラウザ / アプリ', title: '利用者', lines: ['マイクで話す'], wave: true, steps: [0, 1, 3]},
  {id: 'sfu', x: 575, y: 240, w: 348, h: 242, label: '音声の中継', title: 'Realtime SFU', lines: ['音声トラックを配信'], internal: true, wave: true, steps: [0, 1, 3]},
  {id: 'adapter', x: 1040, y: 240, w: 402, h: 242, label: '音声の橋渡し', title: 'WebSocket Adapter', lines: ['+ Workers', '音声形式・イベント変換'], internal: true, steps: [0, 1]},
  {id: 'ai', x: 1564, y: 240, w: 288, h: 242, label: 'OPENAI', title: 'GPT-Live-1', lines: ['音声で対話する'], wave: true, steps: [0, 1, 2]},
  {id: 'human', x: 68, y: 782, w: 312, h: 170, label: '有人サポート', title: '担当者', lines: ['同じ通話に参加'], steps: [3]},
  {id: 'state', x: 575, y: 782, w: 348, h: 170, label: '通話管理', title: 'Durable Objects', lines: ['参加者・引き継ぎ状態'], internal: true, steps: [2, 3]},
  {id: 'business', x: 1040, y: 782, w: 402, h: 170, label: '制御・業務ロジック', title: 'Workers + D1', lines: ['参加制御・予約照会 / 登録'], internal: true, steps: [2, 3]},
];
export type EdgeDef = { id: string; d: string; color: string; step: number; dashed?: boolean; delay?: number };
// Separate lanes keep voice, replies and control traffic legible.
export const EDGES: EdgeDef[] = [
  {id: 'talk1', d: 'M380 306 H575', color: COLORS.blue, step: 0},
  {id: 'talk2', d: 'M923 306 H1040', color: COLORS.blue, step: 0, delay: 15},
  {id: 'talk3', d: 'M1442 306 H1564', color: COLORS.blue, step: 0, delay: 30},
  {id: 'reply1', d: 'M1564 360 H1442', color: COLORS.orange, step: 1},
  {id: 'reply2', d: 'M1040 360 H923', color: COLORS.orange, step: 1, delay: 15},
  {id: 'reply3', d: 'M575 360 H380', color: COLORS.orange, step: 1, delay: 30},
  {id: 'delegate', d: 'M1714 482 V842 Q1714 866 1690 866 H1442', color: COLORS.control, step: 2, dashed: true},
  {id: 'api', d: 'M1240 782 V482', color: COLORS.control, step: 2, dashed: true, delay: 25},
  {id: 'state', d: 'M1040 866 H923', color: COLORS.control, step: 3, dashed: true},
  {id: 'participants', d: 'M802 782 V482', color: COLORS.control, step: 3, dashed: true, delay: 15},
  {id: 'human-in', d: 'M380 845 H428 Q454 845 454 819 V430 Q454 404 480 404 H575', color: COLORS.green, step: 3, delay: 30},
  {id: 'human-out', d: 'M575 432 H507 Q481 432 481 458 V869 Q481 895 455 895 H380', color: COLORS.green, step: 3, delay: 40},
];
