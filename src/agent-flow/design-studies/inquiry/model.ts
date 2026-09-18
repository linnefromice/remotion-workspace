import { EDGES, NODES, STEP_LEN, type NodeId } from '../../inquiry/cards/constants';

export type Point = readonly [number, number];
export type Layout = Record<NodeId, Point>;
export const FONT = '"Hiragino Sans", "Noto Sans CJK JP", sans-serif';
export const node = (id: NodeId) => NODES.find((item) => item.id === id)!;
export const ROLE: Record<NodeId, string> = {
  resident: '入居者 / LINE', intake: '受付 / LINE', normalize: 'データ化', triage: 'AI判定',
  dispatch: '業者連絡', approval: '担当者 / 承認', vendor: '業者 / Gmail・LINE',
  reply: '一次回答 / LINE', vendorDb: '業者マスタ', staff: '担当者 / レビュー', policy: '判断基準',
};
export const ACTION: Record<NodeId, string> = {
  resident: '相談する・回答を受け取る', intake: '会話と写真を受け取る', normalize: '物件・症状を整理する',
  triage: '優先度と対応方針を決める', dispatch: '自動送信 または 下書き', approval: '下書きの場合だけ確認',
  vendor: '現地対応を手配する', reply: '入居者へ回答を返す', vendorDb: 'エリア・得意分野を参照',
  staff: '判定をレビューする', policy: 'ルールと文脈を調整する',
};
const PAYLOAD: Record<string, [string, string]> = {
  'resident-intake': ['相談を受け取る', '会話・写真'],
  'intake-normalize': ['相談を、扱えるデータに', '物件・症状・緊急度'],
  'normalize-triage': ['整理された情報を渡す', '問い合わせデータ'],
  'triage-normalize': ['判断をデータへ戻す', '優先度・初期対応方針'],
  'normalize-dispatch': ['対応方針を、手配につなぐ', '判定済みの問い合わせ'],
  'vendorDb-dispatch': ['連絡先を参照する', '対応エリア・得意分野'],
  'dispatch-approval': ['下書きを人に渡す', '業者への連絡案'],
  'approval-vendor': ['確認した連絡を届ける', '承認された下書き'],
  'triage-reply': ['判断を、回答につなぐ', '初期対応方針'],
  'reply-resident': ['相談した人へ返す', 'LINEでの一次回答'],
  'triage-staff': ['判断を人が振り返る', '判定結果'],
  'staff-policy': ['人が判断基準を育てる', 'ルール・文脈の調整'],
  'policy-triage': ['次の問い合わせに生かす', '更新された判断基準'],
};
export const LINKS = EDGES.map((edge) => {
  const [from, to] = edge.id.split('-') as [NodeId, NodeId];
  return { ...edge, from, to, title: PAYLOAD[edge.id][0], payload: PAYLOAD[edge.id][1] };
});
export function moment(frame: number) {
  const step = Math.min(5, Math.floor(frame / STEP_LEN));
  const links = LINKS.filter((link) => link.step === step);
  const phase = (frame % STEP_LEN) / STEP_LEN * links.length;
  return { step, link: links[Math.floor(phase)], progress: phase % 1 };
}
export const color = (id: NodeId, light = false) =>
  ['staff', 'policy', 'approval'].includes(id) ? (light ? '#a74a24' : '#ffb78b') :
  ['resident', 'intake'].includes(id) ? (light ? '#087f78' : '#68ddd1') :
  ['reply', 'dispatch', 'vendor'].includes(id) ? (light ? '#21734f' : '#a4e1af') :
  id === 'vendorDb' ? (light ? '#647078' : '#b4c0c8') : (light ? '#6650b5' : '#bcafff');

// アイコンの位置と線の端点は、どちらもこの座標から導く。座標を2箇所に書かない
export const TRANSIT: Layout = {
  resident: [150, 350], intake: [420, 350], normalize: [690, 350], dispatch: [1230, 350],
  approval: [1500, 350], vendor: [1760, 350], triage: [960, 590], reply: [420, 590],
  staff: [690, 820], policy: [1230, 820], vendorDb: [1500, 590],
};
export const ORBIT: Layout = {
  resident: [170, 495], intake: [480, 270], normalize: [850, 270], dispatch: [1230, 270],
  approval: [1530, 270], vendor: [1790, 495], triage: [850, 555], reply: [430, 650],
  vendorDb: [1330, 590], staff: [580, 820], policy: [1150, 820],
};

export function route(id: string, layout: Layout, orbit: boolean): Point[] {
  const link = LINKS.find((item) => item.id === id)!;
  const p = (nodeId: NodeId, dx = 0, dy = 0): Point => [layout[nodeId][0] + dx, layout[nodeId][1] + dy];
  const left = (nodeId: NodeId) => p(nodeId, -58);
  const right = (nodeId: NodeId) => p(nodeId, 58);
  const top = (nodeId: NodeId) => p(nodeId, 0, -58);
  if (orbit) {
    const routes: Record<string, Point[]> = {
      'resident-intake': [right('resident'), p('resident', 135), p('intake', -135), left('intake')],
      'intake-normalize': [right('intake'), left('normalize')],
      'normalize-triage': [p('normalize', -58, 12), p('normalize', -115, 12), p('triage', -115, -20), p('triage', -74, -20)],
      'triage-normalize': [p('triage', 74, -20), p('triage', 115, -20), p('normalize', 115, 12), p('normalize', 58, 12)],
      'normalize-dispatch': [right('normalize'), left('dispatch')],
      'vendorDb-dispatch': [right('vendorDb'), p('vendorDb', 130), p('dispatch', 230, 160), p('dispatch', 150, 160), p('dispatch', 150, 40), p('dispatch', 58, 40), right('dispatch')],
      'dispatch-approval': [right('dispatch'), left('approval')],
      'approval-vendor': [right('approval'), p('vendor', -115, -100), left('vendor')],
      'triage-reply': [p('triage', -74), p('reply', 165, -95), right('reply')],
      'reply-resident': [left('reply'), p('resident', 135, 155), right('resident')],
      'triage-staff': [p('triage', -74, 25), p('triage', -180, 95), p('staff', 125, -90), right('staff')],
      'staff-policy': [right('staff'), left('policy')],
      'policy-triage': [top('policy'), p('policy', 0, -125), p('triage', 150, 20), p('triage', 74, 20)],
    };
    // 経路を書いていないエッジは、素直に右端から左端へ引く。
    // フォールバックが無いと、cards/constants.ts に1本足した瞬間に落ちる
    return routes[id] ?? [right(link.from), left(link.to)];
  }
  const routes: Record<string, Point[]> = {
    'normalize-triage': [p('normalize', 58, -15), p('normalize', 115, -15), p('triage', -155, -20), p('triage', -58, -20)],
    'triage-normalize': [top('triage'), p('triage', 0, -365), p('normalize', 0, -125), top('normalize')],
    'vendorDb-dispatch': [left('vendorDb'), p('vendorDb', -145), p('dispatch', 125, 75), p('dispatch', 58, 75), right('dispatch')],
    'triage-reply': [left('triage'), right('reply')],
    'reply-resident': [left('reply'), p('resident', -85, 240), p('resident', -85), left('resident')],
    'triage-staff': [p('triage', -58, 20), p('triage', -130, 20), p('staff', 140, -90), p('staff', 0, -90), top('staff')],
    'policy-triage': [top('policy'), p('policy', 0, -105), p('triage', 165, 125), p('triage', 165), right('triage')],
  };
  return routes[id] ?? [right(link.from), left(link.to)];
}
export function pointAlong(points: Point[], fraction: number): Point {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let distance = lengths.reduce((sum, length) => sum + length, 0) * fraction;
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i]) {
      const t = lengths[i] === 0 ? 0 : distance / lengths[i];
      return [points[i][0] + (points[i + 1][0] - points[i][0]) * t, points[i][1] + (points[i + 1][1] - points[i][1]) * t];
    }
    distance -= lengths[i];
  }
  return points[points.length - 1];
}
