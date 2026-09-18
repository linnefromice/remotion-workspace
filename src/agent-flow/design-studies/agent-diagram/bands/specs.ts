import {RESTORATION} from '../../../restoration/constants';
import {PROPOSAL} from '../../../proposal/constants';
import * as claim from '../../../claim-intake/cards/constants';
import type {BandsSpec} from './layout';
/** 旧形式のClaimIntakeは構造だけを合わせる。値・座標・主体を複製しない。 */
export const BAND_SPECS={restoration:RESTORATION,proposal:PROPOSAL,claimIntake:{
 nodes:claim.NODES,edges:claim.EDGES,
 frame:{x:claim.FRAME_X,y:claim.FRAME_Y,w:claim.FRAME_W,h:claim.FRAME_H,radius:claim.FRAME_RADIUS},
 steps:claim.STEPS,stepLen:claim.STEP_LEN,tagline:claim.FRAME_TAGLINE,sublabel:claim.FRAME_SUBLABEL,
}} satisfies Record<string,BandsSpec>;
