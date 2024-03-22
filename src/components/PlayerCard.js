import React from 'react';
import '../styles/PlayerCard.css';
import CrossSVG from './CrossSVG';

const PlayerCard = ({ player, onSelect, onRemove, squareCard }) => {
  return (
    <div className={`player-card ${squareCard ? 'square-card' : ''}`} onClick={onSelect}>
      <div className="fb13 tac">
        <img src={player.image}/>
      </div>
      <div className="player-info">
        <h3 class="truncate10">{player.name}</h3>
        <div className="info">
          <p>{player.team}</p>
          <p>{player.position}</p>
        </div>
      </div>
      <div className="fb13 tac">
        <p>{player.price}</p>
      </div>
      <div className="fb13 tac">
        <p>{player.points}</p>
      </div>
      {onRemove && <button onClick={(e) => { e.stopPropagation(); onRemove(); }}><CrossSVG /></button>}
    </div>
  );
};

export default PlayerCard;
