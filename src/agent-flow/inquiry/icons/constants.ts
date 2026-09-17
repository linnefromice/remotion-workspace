import { NODES, COLORS, type NodeId } from '../cards/constants';

// Centers refer to the icon itself, not the label below it.
const POSITIONS: Record<NodeId, [number, number]> = {
  resident: [150, 400], intake: [440, 260], normalize: [760, 260],
  dispatch: [1080, 260], approval: [1440, 260], vendor: [1750, 260],
  reply: [440, 555], triage: [760, 555], policy: [760, 840],
  vendorDb: [1080, 840], staff: [150, 840],
};
export const ICON_NODES = NODES.map(node => ({...node, position: POSITIONS[node.id]}));
export const nodeColor = (id: NodeId) =>
  ['resident', 'intake'].includes(id) ? COLORS.cyan :
  ['staff', 'policy', 'approval'].includes(id) ? '#ffb17c' :
  ['dispatch', 'reply', 'vendor'].includes(id) ? '#70dbb0' :
  id === 'vendorDb' ? '#a5b6ca' : '#b398f9';

// Horizontal ports attach at +/-64 from icon centers. Routes avoid labels.
export const ROUTES: Record<string, string> = {
  'resident-intake': 'M214 400 H260 V260 H376',
  'intake-normalize': 'M504 260 H696',
  'normalize-triage': 'M696 280 H650 V535 H696',
  'triage-normalize': 'M824 535 H872 V280 H824',
  'normalize-dispatch': 'M824 260 H1016',
  'vendorDb-dispatch': 'M1144 840 H1230 V280 H1144',
  'dispatch-approval': 'M1144 260 H1376',
  'approval-vendor': 'M1504 260 H1686',
  'triage-reply': 'M696 555 H504',
  'reply-resident': 'M376 555 H260 V430 H214',
  'triage-staff': 'M696 580 H620 V745 H150 V776',
  'staff-policy': 'M214 840 H696',
  'policy-triage': 'M824 840 H920 V580 H824',
};
