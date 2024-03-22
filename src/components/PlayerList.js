// PlayerList.js

import React from 'react';
import PlayerCard from './PlayerCard';

const PlayerList = ({ players, onSelect }) => {
  return (
    <div className="player-list">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default PlayerList;
