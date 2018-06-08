import { addIndex, chain, map, mapObjIndexed, merge, mergeAll, range, reduce } from 'ramda';
import { pipeThru } from './utils';
import { matches } from '../data';

const iChain = addIndex(chain);

export function populateBracketSlots(bracketState, teamGroups) {
  function populateKO(populated, round, numSlots) {
    return pipeThru(range(0, numSlots), [
      map(idx => {
        const roundNum = (numSlots > 1) ? ` ${idx+1}` : '';
        const match = matches.find(m => m.name === `${round}${roundNum}`);
        const bracketWinner = bracketState.knockout[`${round}${roundNum}`];
        const winner = bracketWinner ?
          ((bracketWinner === 'home') ? populated[match.home] : populated[match.away]) :
          { name: `Winner of ${round}${roundNum}`, abbreviation: 'unknown' };
        const loser = bracketWinner ?
          ((bracketWinner === 'home') ? populated[match.away] : populated[match.home]) :
          { name: `Loser of ${round}${roundNum}`, abbreviation: 'unknown' };

        return {
          [`Winner of ${round}${roundNum}`]: winner,
          [`Loser of ${round}${roundNum}`]: loser,
        };
      }),
      mergeAll
    ]);
  }

  const rankedInGroup = (rank, group) => {
    const prefix = (rank === 1) ? 'Winner' : 'Runner-up';
    const groupBracket = bracketState.groups[group];
    const rankedInGroup = groupBracket[rank-1];
    const team = teamGroups[group][rankedInGroup];

    return team || { name: `${prefix} of Group ${group}`, abbreviation: 'unknown' };
  }

  const groupRanks = pipeThru(teamGroups, [
    mapObjIndexed(
      (teams, group) => ({
        [`Winner of Group ${group}`]: rankedInGroup(1, group),
        [`Runner-up of Group ${group}`]: rankedInGroup(2, group),
      })
    ),
    Object.values,
    mergeAll
  ]);

  return reduce(
    (acc, [round, numSlots]) => merge(acc, populateKO(acc, round, numSlots)),
    groupRanks,
    [['Ro16', 8], ['Quarter', 4], ['Semi', 2], ['Match for Third Place', 1], ['Final', 1]]
  );
}
