import { NODES, type NodeId, type NodeTone } from '../cards/constants';

export const TONES: Record<NodeTone, string> = {
  input: '#71d7ef', ai: '#b398f9', rule: '#ffffff', human: '#ffb17c', record: '#70dbb0', planned: '#8291a5',
};
export const STEP_TONES = [TONES.input, TONES.input, TONES.ai, TONES.rule, TONES.ai, TONES.human, TONES.record];
const POSITIONS: Record<NodeId, [number, number]> = {
  resident: [150, 260], line: [150, 550], intake: [430, 260], stt: [700, 260],
  judge: [970, 260], safety: [1240, 260], followup: [700, 550], work: [970, 550],
  guardrails: [1240, 550], staff: [970, 860], csv: [1660, 860],
  recConv: [1660, 230], recJudgments: [1660, 322], recInquiries: [1660, 414],
  recWork: [1660, 506], recEvents: [1660, 598],
};
export const ICON_NODES = NODES.map(node => ({...node, position: POSITIONS[node.id]}));
export const ROUTES: Record<string, string> = {
  'resident-intake': 'M214 260 H366',
  'line-intake': 'M214 550 H260 V280 H366',
  'intake-stt': 'M494 260 H636',
  'stt-judge': 'M764 260 H906',
  'judge-safety': 'M1034 260 H1176',
  'judge-followup': 'M906 280 H850 V460 H700 V486',
  'followup-resident': 'M636 550 H290 V300 H214',
  'safety-work': 'M1304 280 H1360 V460 H970 V486',
  'work-guardrails': 'M1034 550 H1176',
  'staff-inquiries': 'M1034 860 H1450 V414 H1500',
  'records-csv': 'M1660 640 V796',
  'staff-resident': 'M906 860 H870 V1052 H35 V260 H86',
};
