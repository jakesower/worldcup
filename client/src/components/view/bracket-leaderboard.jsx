import React from 'react';
import { ascend, descend, prop, sortWith } from 'ramda';

export default ({ players }) => {
  const byPlayer = ascend(prop('player'));
  const byMinScore = descend(prop('minScore'));
  const byMaxScore = descend(prop('maxScore'));

  return <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Predicted Winner</th>
        <th>Min Score</th>
        <th></th>
        <th>Max Score</th>
      </tr>
    </thead>
    <tbody>
      {sortWith([byMinScore, byMaxScore, byPlayer], players).map(player =>
        <tr key={player.player}>
          <td>{player.player}</td>
          <td>{player.bracket['Winner of Final'].name}</td>
          <td className="numeric">{player.minScore}</td>
          <td></td>
          <td className="numeric">{player.maxScore}</td>
        </tr>
      )}
    </tbody>
  </table>;
};
