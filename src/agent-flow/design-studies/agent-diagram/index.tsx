import React from 'react';
import { Network } from './Network';
export { Relay as InquiryRelay } from './Relay';
export const InquiryTransit: React.FC = () => <Network orbit={false} />;
export const InquiryOrbit: React.FC = () => <Network orbit />;
export { InquiryLanes } from './Lanes';
export { InquiryChronicle } from './Chronicle';
export { InquiryCaseboard } from './Caseboard';

export { InquiryBranches } from './Branches';
export { InquiryTerraces } from './Terraces';
