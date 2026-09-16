import type { FlowNodeVariant } from './FlowServiceNode';

export const inquiryServiceRoutes = (variant: FlowNodeVariant): Record<string, string> => ({
  'resident-intake': 'M254 400 H280 V260 H336',
  'intake-normalize': 'M544 260 H656',
  'normalize-triage': 'M656 280 H620 V535 H656',
  'triage-normalize': 'M864 535 H900 V280 H864',
  'normalize-dispatch': 'M864 260 H976',
  'vendorDb-dispatch': 'M1184 840 H1250 V280 H1184',
  'dispatch-approval': 'M1184 260 H1336',
  'approval-vendor': 'M1544 260 H1646',
  'triage-reply': 'M656 555 H544',
  'reply-resident': 'M336 555 H280 V430 H254',
  'triage-staff': `M656 580 H600 V745 H150 V${variant === 'logoSeal' ? 776 : 788}`,
  'staff-policy': 'M254 840 H656',
  'policy-triage': 'M864 840 H940 V580 H864',
});
export const claimServiceRoutes = (variant: FlowNodeVariant): Record<string, string> => ({
  'resident-intake': 'M254 260 H326',
  'line-intake': 'M254 550 H280 V280 H326',
  'intake-stt': 'M534 260 H596',
  'stt-judge': 'M804 260 H866',
  'judge-safety': 'M1074 260 H1136',
  'judge-followup': `M866 280 H840 V460 H700 V${variant === 'logoSeal' ? 486 : 498}`,
  'followup-resident': 'M596 550 H300 V300 H254',
  'safety-work': `M1344 280 H1380 V460 H970 V${variant === 'logoSeal' ? 486 : 498}`,
  'work-guardrails': 'M1074 550 H1136',
  'staff-inquiries': 'M1074 860 H1450 V414 H1500',
  'records-csv': `M1660 640 V${variant === 'logoSeal' ? 796 : 808}`,
  'staff-resident': 'M866 860 H845 V1052 H35 V260 H46',
});
