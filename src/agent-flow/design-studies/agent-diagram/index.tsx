import React from 'react';
import { Network } from './Network';
export { Relay as DiagramRelay } from './Relay';
export const DiagramTransit: React.FC = () => <Network orbit={false} />;
export const DiagramOrbit: React.FC = () => <Network orbit />;
export { DiagramLanes } from './Lanes';
export { DiagramChronicle } from './Chronicle';
export { DiagramCaseboard } from './Caseboard';

export { DiagramBranches } from './Branches';
export { DiagramTerraces } from './Terraces';
