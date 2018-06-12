import { addIndex, chain, concat, map, reduce } from 'ramda';

/**
 * Data having to do with the structure of the tournament, without any actual
 * team or outcome data. In this case, a 32-team group stage followed by single
 * elimination tournament.
 */

const groupNames = ["A", "B", "C", "D", "E", "F", "G", "H"];
const iChain = addIndex(chain);
const iMap = addIndex(map);
const pairsOf = items => {
  if (items.length < 2) { return [] ;}
  const [fst, snd, ...rest] = items;
  return concat([[fst, snd]], pairsOf(rest));
}


const groupMatchups = [[[1,2], [3,4]], [[1,3], [4,2]], [[4,1], [2,3]]];
export const groupMatches = iChain(
  (matchPair, matchupIdx) => iChain(
    (grp, grpIdx) => iMap(
      (match, matchIdx) => {
        const id = ((matchupIdx * 16) + (grpIdx * 2) + matchIdx) + 1;
        return {
          id,
          home: `${grp[0]}${match[0]}`,
          away: `${grp[0]}${match[1]}`,
        };
      },
      matchPair
    ),
    groupNames
  ),
  groupMatchups
);

const gw = g => `Winner of Group ${g}`;
const gr = g => `Runner-up of Group ${g}`;

const Ro16s = [
  { id: 49, name: 'Ro16 1', home: gw('A'), away: gr('B') },
  { id: 50, name: 'Ro16 2', home: gw('C'), away: gr('D') },
  { id: 51, name: 'Ro16 3', home: gw('E'), away: gr('F') },
  { id: 52, name: 'Ro16 4', home: gw('G'), away: gr('H') },
  { id: 53, name: 'Ro16 5', home: gw('B'), away: gr('A') },
  { id: 54, name: 'Ro16 6', home: gw('D'), away: gr('C') },
  { id: 55, name: 'Ro16 7', home: gw('F'), away: gr('E') },
  { id: 56, name: 'Ro16 8', home: gw('H'), away: gr('G') },
];

const quarters = iMap(
  (o, i) => ({
    id: i + 57,
    name: `Quarter ${i+1}`,
    home: `Winner of Ro16 ${(i*2)+1}`,
    away: `Winner of Ro16 ${(i*2)+2}`,
  }),
  [1,2,3,4],
);

const semis = iMap(
  (o, i) => ({
    id: i + 61,
    name: `Semi ${i+1}`,
    home: `Winner of Quarter ${(i*2)+1}`,
    away: `Winner of Quarter ${(i*2)+2}`,
  }),
  [1,2],
);

const third = {
  id: 63,
  name: 'Match for Third Place',
  home: `Loser of Semi 1`,
  away: `Loser of Semi 2`,
};

const final = {
  id: 64,
  name: 'Final',
  home: `Winner of Semi 1`,
  away: `Winner of Semi 2`,
};

export default reduce(
  concat,
  [],
  [groupMatches, Ro16s, quarters, semis, [third], [final]],
);
