import React from 'react';
import { ascend, descend, max, min, prop, sortWith } from 'ramda';

export default ({ players }) => {
  const byPlayer = ascend(prop('player'));
  const byMinScore = descend(prop('minScore'));
  const byMaxScore = descend(prop('maxScore'));
  const byMidpoint = descend(p => p.minScore + p.maxScore);

  const minScore = players.map(prop('minScore')).reduce(min, Infinity);
  const maxScore = players.map(prop('maxScore')).reduce(max, -Infinity);

  return <table className="leaderboard">
    <thead>
      <tr>
        <th>Name</th>
        <th>Predicted Winner</th>
        <th>Score</th>
        <th></th>
        <th>Max Score</th>
      </tr>
    </thead>
    <tbody>
      {sortWith([byMidpoint, byPlayer], players).map(player =>
        <tr key={player.player}>
          <td>{player.player}</td>
          <td>{player.bracket['Winner of Final'].name}</td>
          <td className="numeric">{player.minScore}</td>
          <td width="100%">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="score-range"
              viewBox={`0 0 ${maxScore+2} 9`}
              preserveAspectRatio="none meet"
              >
              <defs>
                <linearGradient id="gradient" x1="0" x2={player.maxScore} y1="0" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D30208" />
                  <stop offset="100%" stopColor="#05B305" />
                </linearGradient>
              </defs>
              <line x1="0" x2={player.minScore} y1="5" y2="5" stroke="url(#gradient)"></line>
              <rect x={player.minScore+1} width={player.maxScore - player.minScore} y="0" height="9" stroke="url(#gradient)"></rect>
            </svg>
          </td>
          <td className="numeric">{player.maxScore}</td>
        </tr>
      )}
    </tbody>
  </table>;
};
