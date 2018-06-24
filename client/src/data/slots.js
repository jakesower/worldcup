import { indexBy, merge, prop, unnest, xprod } from 'ramda';

const groupSlots = xprod(['A','B','C','D','E','F','G','H'], [1,2]).map(
  ([group, position]) => ({
    group,
    position,
    id: `${group}${position}`,
    type: 'group',
    points: 2,
  })
);

const ro16 = [
  { id: 'Ro16-1', sources: ['A1', 'B2'] },
  { id: 'Ro16-2', sources: ['C1', 'D2'] },
  { id: 'Ro16-3', sources: ['E1', 'F2'] },
  { id: 'Ro16-4', sources: ['G1', 'H2'] },
  { id: 'Ro16-5', sources: ['B1', 'A2'] },
  { id: 'Ro16-6', sources: ['D1', 'C2'] },
  { id: 'Ro16-7', sources: ['F1', 'E2'] },
  { id: 'Ro16-8', sources: ['H1', 'G2'] },
];

const quar = [
  { id: 'QF-1', sources: ['Ro16-1', 'Ro16-2'] },
  { id: 'QF-2', sources: ['Ro16-3', 'Ro16-4'] },
  { id: 'QF-3', sources: ['Ro16-5', 'Ro16-6'] },
  { id: 'QF-4', sources: ['Ro16-7', 'Ro16-8'] },
];

const semi = [
  { id: 'SF-1', sources: ['QF-1', 'QF-2'] },
  { id: 'SF-2', sources: ['QF-3', 'QF-4'] },
];

export default indexBy(prop('id'))(unnest([
  groupSlots,
  ro16.map(s => merge(s, { type: 'knockout', points: 3 })),
  quar.map(s => merge(s, { type: 'knockout', points: 5 })),
  semi.map(s => merge(s, { type: 'knockout', points: 8 })),
  [
    { id: 'Third', sources: ['SF-1', 'SF-2'], type: 'knockout', points: 1, losers: true },
    { id: 'Final', sources: ['SF-1', 'SF-2'], type: 'knockout', points: 13 }
  ]
]));
