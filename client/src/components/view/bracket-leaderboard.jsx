import React from 'react';
import { ascend, descend, prop, sortWith } from 'ramda';

export default ({ players }) => {
  const byPlayer = ascend(prop('player'));
  const byScore = descend(prop('score'));

  return <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Score</th>
        <th>Predicted Winner</th>
      </tr>
    </thead>
    <tbody>
      {sortWith([byScore, byPlayer], players).map(player =>
        <tr key={player.player}>
          <td>{player.player}</td>
          <td className="numeric">0</td>
          <td>{player.bracket['Winner of Final'].name}</td>
        </tr>
      )}
    </tbody>
  </table>;
};
