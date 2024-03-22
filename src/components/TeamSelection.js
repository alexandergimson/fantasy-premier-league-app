import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';
import CrossSVG from './CrossSVG';
import { handleTeamCreation } from './TeamManagement';


const TeamSelection = () => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredPositionAvailable, setFilteredPositionAvailable] = useState(null);
  const [filteredTeamAvailable, setFilteredTeamAvailable] = useState(null);
  const [filteredTeam, setFilteredTeam] = useState(null); // Initialize as null
  const [filteredPriceAvailable, setFilteredPriceAvailable] = useState(null);
  const [sortingOption, setSortingOption] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 30; // Adjust the number as needed
  const [teams, setTeams] = useState({}); // New state for storing teams data
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    // Fetch player information from the provided link
    const fetchPlayerData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/bootstrap-static/');
        const data = await response.json();

        // Extract relevant player information
        const extractedPlayers = data.elements.map((element) => ({
          id: element.id,
          name: element.web_name,
          team: element.team,
          points: element.total_points,
          image: 'https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_3-110.webp',
          price: element.now_cost / 10,
          position: element.element_type === 1 ? 'GK' : element.element_type === 2 ? 'DEF' : element.element_type === 3 ? 'MID' : 'FWD',
        }));

        // url for image `/images/${element.team}.webp`

        setAllPlayers(extractedPlayers);
        const teamsData = data.teams.reduce((acc, team) => {
          acc[team.id] = team.short_name;
          return acc;
        }, {});

        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };

    fetchPlayerData();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  const renderAvailablePlayers = (players) => {
    return players.map((player) => (
      <PlayerCard
        key={player.id}
        player={{
          ...player,
          team: teams[player.team], // Replace team ID with short_name
        }}
        onSelect={() => handlePlayerSelect(player)}
      />
    ));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const validateTeamComposition = (newPlayer) => {
    const gkCount = selectedPlayers.filter((player) => player.position === 'GK').length;
    const defCount = selectedPlayers.filter((player) => player.position === 'DEF').length;
    const midCount = selectedPlayers.filter((player) => player.position === 'MID').length;
    const fwdCount = selectedPlayers.filter((player) => player.position === 'FWD').length;

    const totalCost = selectedPlayers.reduce((total, player) => total + player.price, 0) + newPlayer.price;

    if (newPlayer.position === 'GK' && gkCount >= 1) {
      return alert('You can only select 1 Goalkeeper.');
    }

    if (newPlayer.position === 'DEF' && defCount >= 5) {
      return alert('You can only select up to 5 Defenders.');
    }

    if (newPlayer.position === 'MID' && midCount >= 5) {
      return alert('You can only select up to 5 Midfielders.');
    }

    if (newPlayer.position === 'FWD' && fwdCount >= 3) {
      return alert('You can only select up to 3 Forwards.');
    }

    if (selectedPlayers.length >= 11) {
      return alert('Maximum 11 players are allowed.');
    }

    return ''; // No validation issues
  };



  const handlePlayerSelect = (newPlayer) => {
    const isPlayerAlreadySelected = selectedPlayers.some((player) => player.id === newPlayer.id);

    if (!isPlayerAlreadySelected) {
      const validationMessage = validateTeamComposition(newPlayer);

      if (validationMessage === '') {
        setSelectedPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
        setWarningMessage('');
      } else {
        setWarningMessage(validationMessage);
      }
    } else {
      alert('Player already selected.');
    }
  };

  const handleRemovePlayer = (playerToRemove) => {
    const updatedPlayers = selectedPlayers.filter((player) => player.id !== playerToRemove.id);
    setSelectedPlayers(updatedPlayers);
    setWarningMessage('');
  };

  const calculateTotalPrice = () => {
    return selectedPlayers.reduce((total, player) => total + player.price, 0);
  };

  const handlePositionFilterChangeAvailable = (position) => {
    setFilteredPositionAvailable(position);
  };

  const handleTeamFilterChangeAvailable = (team) => {
    setFilteredTeam(team === '' ? null : parseInt(team, 10)); // Convert to integer or set to null
  };


  const handleTeamFilterChange = (teamId) => {
    setFilteredTeam(teamId === '' ? null : parseInt(teamId, 10)); // Convert to integer or set to null
  };


  const handlePriceFilterChangeAvailable = (price) => {
    setFilteredPriceAvailable(price);
  };

  // Handle sorting change
  const handleSortingChange = (option) => {
    setSortingOption(option);
  };

  // Apply sorting and filtering to players within their respective categories
  const sortedGKPlayers = allPlayers
    .filter((player) => player.position === 'GK' && (!filteredPositionAvailable || player.position === filteredPositionAvailable))
    .filter((player) => !filteredPriceAvailable || (Math.floor(player.price / 10) * 10) <= filteredPriceAvailable)
    .filter((player) => filteredTeam === null || player.team === filteredTeam)
    .sort((a, b) => (sortingOption === 'price' ? a.price - b.price : b.points - a.points));

  const sortedDefPlayers = allPlayers
    .filter((player) => player.position === 'DEF' && (!filteredPositionAvailable || player.position === filteredPositionAvailable))
    .filter((player) => !filteredPriceAvailable || (Math.floor(player.price / 10) * 10) <= filteredPriceAvailable)
    .filter((player) => filteredTeam === null || player.team === filteredTeam)
    .sort((a, b) => (sortingOption === 'price' ? a.price - b.price : b.points - a.points));

  const sortedMidPlayers = allPlayers
    .filter((player) => player.position === 'MID' && (!filteredPositionAvailable || player.position === filteredPositionAvailable))
    .filter((player) => !filteredPriceAvailable || (Math.floor(player.price / 10) * 10) <= filteredPriceAvailable)
    .filter((player) => filteredTeam === null || player.team === filteredTeam)
    .sort((a, b) => (sortingOption === 'price' ? a.price - b.price : b.points - a.points));

  const sortedFwdPlayers = allPlayers
    .filter((player) => player.position === 'FWD' && (!filteredPositionAvailable || player.position === filteredPositionAvailable))
    .filter((player) => !filteredPriceAvailable || (Math.floor(player.price / 10) * 10) <= filteredPriceAvailable)
    .filter((player) => filteredTeam === null || player.team === filteredTeam)
    .sort((a, b) => (sortingOption === 'price' ? a.price - b.price : b.points - a.points));



  const filteredPlayersAvailable = allPlayers.filter((player) => {
    const isPositionMatch = filteredPositionAvailable ? player.position === filteredPositionAvailable : true;
    const isPriceMatch = filteredPriceAvailable ? Math.floor(player.price / 10) * 10 <= filteredPriceAvailable : true;
    const isTeamMatch = filteredTeam !== null ? player.team === filteredTeam : true;
    return isPositionMatch && isPriceMatch && isTeamMatch;
  });


  const renderFormation = () => {
    const gk = selectedPlayers.filter((player) => player.position === 'GK')[0];
    const def = selectedPlayers.filter((player) => player.position === 'DEF').slice(0, 5);
    const mid = selectedPlayers.filter((player) => player.position === 'MID').slice(0, 5);
    const fwd = selectedPlayers.filter((player) => player.position === 'FWD').slice(0, 3);

    const renderPlayerCard = (player) => (
      <div key={player.id} className="square-card">
        <div className="cross" onClick={() => handleRemovePlayer(player)}>
          <CrossSVG />
          <img src={player.image} />
        </div>
        <div className="player-info truncate15 ma">
          <div class="selectedname"><p>{player.name}</p></div>
          <div class="selectedprice"><p>{player.price}</p></div>
        </div>
      </div>
    );

    return (
      <div className="formation">
        <div className="line">
          {gk && renderPlayerCard(gk)}
        </div>
        <div className="line">
          {def.map((player) => renderPlayerCard(player))}
        </div>
        <div className="line">
          {mid.map((player) => renderPlayerCard(player))}
        </div>
        <div className="line">
          {fwd.map((player) => renderPlayerCard(player))}
        </div>
      </div>
    );
  };

  const handleSubmit = () => {
    const totalCost = calculateTotalPrice();
    const totalPlayers = selectedPlayers.length;

    if (totalCost <= 100 && totalPlayers === 11) {
      alert('Team submitted');

      const enteredTeamData = {
        selectedPlayers: selectedPlayers,
      }
      handleTeamCreation(enteredTeamData);

    } else {
      let message = 'Team ';

      if (totalCost > 100) {
        message += 'over required value';
      }

      if (totalPlayers !== 11) {
        message += (totalCost > 100 ? ' and ' : '') + 'does not have 11 players';
      }

      alert(message);
    }
  };

  const filteredAndSortedPlayers = () => {
    // Apply filtering and sorting to players
    const filteredPlayers = filteredPlayersAvailable
      .sort((a, b) => {
        if (sortingOption === 'price') {
          return a.price - b.price;
        } else if (sortingOption === 'points') {
          return b.points - a.points;
        } else {
          return 0; // No sorting
        }
      });

    const indexOfLastPlayer = currentPage * playersPerPage;
    const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
    const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);

    return currentPlayers.map((player) => (
      <PlayerCard key={player.id} player={player} onSelect={() => handlePlayerSelect(player)} />
    ));
  };


  return (
    <div className="team-selection-container">
      <div className="selected-players">
        <h2>Your Fantasy Team</h2>
        <button onClick={handleSubmit}>Submit Team</button>
        <p>Remaining: {100 - calculateTotalPrice()}</p>
        {renderFormation()}
      </div>
      <div className="available-players">
        <h2>Available Players</h2>

        <div className="filters-container">
          <div className="filter-group">
            <label>
              Position:
              <select value={filteredPositionAvailable || ''} onChange={(e) => handlePositionFilterChangeAvailable(e.target.value)}>
                <option value="">All</option>
                <option value="GK">Goalkeeper</option>
                <option value="DEF">Defender</option>
                <option value="MID">Midfielder</option>
                <option value="FWD">Forward</option>
              </select>
            </label>
          </div>

          <div className="filter-group">
            <label>
              Team:
              <select value={filteredTeam} onChange={(e) => handleTeamFilterChange(e.target.value)}>
                <option value="">All</option>
                {/* Map through your teams and create options for each */}
                {Object.entries(teams).map(([id, shortName]) => (
                  <option key={id} value={id}>
                    {shortName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="filter-group">
            <label>
              Sort by:
              <select value={sortingOption || ''} onChange={(e) => handleSortingChange(e.target.value)}>
                <option value="">None</option>
                <option value="price">Price</option>
                <option value="points">Total Points</option>
              </select>
            </label>
          </div>

          <div className="filter-group">
            <label>
              Price:
              <select value={filteredPriceAvailable || ''} onChange={(e) => handlePriceFilterChangeAvailable(parseInt(e.target.value, 10))}>
                <option value="">All</option>
                <option value="10">£0-10</option>
                <option value="20">£10-20</option>
                {/* Add more options as needed */}
              </select>
            </label>
          </div>
        </div>

        {/* Player List for Available Players */}
        {sortedGKPlayers.length > 0 && (
          <>
            <h3>GK</h3>
            {renderAvailablePlayers(sortedGKPlayers)}
          </>
        )}

        {sortedDefPlayers.length > 0 && (
          <>
            <h3>DEF</h3>
            {renderAvailablePlayers(sortedDefPlayers)}
          </>
        )}

        {sortedMidPlayers.length > 0 && (
          <>
            <h3>MID</h3>
            {renderAvailablePlayers(sortedMidPlayers)}
          </>
        )}

        {sortedFwdPlayers.length > 0 && (
          <>
            <h3>FWD</h3>
            {renderAvailablePlayers(sortedFwdPlayers)}
          </>
        )}
        <div className="pagination">
          {Array.from({ length: Math.ceil(allPlayers.length / playersPerPage) }).map((_, index) => (
            <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSelection;