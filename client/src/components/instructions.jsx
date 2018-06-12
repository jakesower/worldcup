import React from 'react';

export default () => {
  return <div className="group-config">
    <div className="question-container" style={{ flexDirection: 'column' }}>
      <div className="question">
        <h1>Instructions</h1>
        <ul>
          <li>Select two teams from each group: a winner and a runner-up.</li>
          <li>After selecting teams from groups, you'll have the opportunity to choose winners in the knockout rounds.</li>
          <li>Points will be awarded based on the round:
            <ul>
              <li>Group Winner: 2</li>
              <li>Group Runner-up: 2</li>
              <li>Round of 16: 3</li>
              <li>Quarterfinals: 5</li>
              <li>Semifinals: 8</li>
              <li>Third Place: 1</li>
              <li>Final: 13</li>
            </ul>
          </li>
          <li>Most points wins! Good luck!</li>
          <li>Click the "Groups" button in the upper right to begin.</li>
        </ul>
      </div>
    </div>
  </div>
}
