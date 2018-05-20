import { addIndex, chain, concat, map } from 'ramda';

const pairsOf = items => {
  if (items.length < 2) { return [] ;}
  const [fst, snd, ...rest] = items;
  return concat([[fst, snd]], pairsOf(rest));
}

const groupNames = ["A", "B", "C", "D", "E", "F", "G", "H"];
const groupPairs = pairsOf(groupNames);

const unknownTeam = team => ({
  team,
  abbreviation: "unknown", // for the image
});

export function groupWinner(groupRankings, group) {
  return groupRankings[group][0] || unknownTeam(`Group ${group} Winner`);
}

export function groupRunnerUp(groupRankings, group) {
  return groupRankings[group][1] || unknownTeam(`Group ${group} Runner-up`);
}

function matchWinner(groupRankings, match) {

}

function matchLoser(groupRankings, match) {

}


// export function knockoutMatches(groupRankings) {
//   const w = g => groupWinner(groupRankings, g);
//   const r = g => groupRunnerUp(groupRankings, g);

//   const octosPairs = [
//     [w('A'), r('B')],
//     [w('C'), r('D')],
//     [w('B'), r('A')],
//     [w('D'), r('C')],
//     [w('E'), r('F')],
//     [w('G'), r('H')],
//     [w('F'), r('E')],
//     [w('H'), r('G')],
//   ];

//   const octos = addIndex(map)(
//     (teams, i) => ({ teams, matchId: `octos-${i+1}` }),
//     octosPairs
//   );

//   const quarters = addIndex(map)(
//     (teams, i) => ({ teams, matchId: `quarters-${i+1}` }),
//     pairsOf(octos)
//   );

//   const quarters = addIndex(map)(
//     (teams, i) => ({ teams, matchId: `semis-${i+1}` }),
//     pairsOf(octos)
//   );

// }
