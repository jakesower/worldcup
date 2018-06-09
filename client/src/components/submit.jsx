import React from 'react';

export default ({ bracket }) => {
  return (
    <main>
      <div className="group-config">
        { isComplete() ? complete() : incomplete() }
      </div>
    </main>
  );


  function complete() {
    const group = window.worldcup.group;

    return <form action={`/games/${group}/submit`} method="POST">
      <div className="question-container" style={{ flexDirection: 'column' }}>
        <div className="question">
          <label>Your Name</label>
          <input name="name" type="text" required />
        </div>

        <div className="question">
          <input type="hidden" name="bracket" value={ JSON.stringify(bracket) } />
          <input type="submit" value="Finalize Picks" />
          <div className="hint">Once you've submitted your brackets, it will be impossible to go back and change them. Please ensure you only submit once.</div>
        </div>
      </div>
    </form>
  }


  function incomplete() {
    return <div className="question-container">
      <div className="question">
        Looks like you still need to make some picks. Come back here when you're done.
      </div>
    </div>
  }


  function isComplete() {
    const groupsComplete = Object.values(bracket.groups).every(g => g.length >= 2);
    const knockoutComplete = Object.values(bracket.knockout).every(g => g === 'away' || g === 'home');

    return groupsComplete && knockoutComplete;
  }
};
