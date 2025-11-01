import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './KCCStandingsAdmin.css';

const KCCStandingsAdmin = () => {
  const [poolData, setPoolData] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState('12U Boy');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  // Load data from localStorage or fallback to original JSON
  useEffect(() => {
    const loadData = async () => {
      const savedData = localStorage.getItem('kcc-pool-data');
      if (savedData) {
        try {
          setPoolData(JSON.parse(savedData));
        } catch (error) {
          console.error('Error parsing saved data:', error);
          localStorage.removeItem('kcc-pool-data');
          // Load from server
          const response = await fetch('/data/kcc-pool.json');
          const data = await response.json();
          setPoolData(data);
        }
      } else {
        // Load original data from public folder
        try {
          const response = await fetch('/data/kcc-pool.json');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setPoolData(data);
        } catch (error) {
          console.error('Error loading KCC pool data:', error);
          alert('Error loading tournament data. Please refresh the page.');
        }
      }
    };
    loadData();
  }, []);

  // Auto-select first group when division changes
  useEffect(() => {
    if (poolData && selectedDivision) {
      const groups = Object.keys(poolData.divisions[selectedDivision]);
      if (groups.length > 0 && !selectedGroup) {
        setSelectedGroup(groups[0]);
      }
    }
  }, [poolData, selectedDivision, selectedGroup]);

  const saveData = (newData) => {
    localStorage.setItem('kcc-pool-data', JSON.stringify(newData));
    setPoolData(newData);
    setSaveStatus('Saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleMatchUpdate = (matchIndex, field, value) => {
    const newData = { ...poolData };
    const match = newData.divisions[selectedDivision][selectedGroup].matches[matchIndex];

    if (field === 'home-score' || field === 'away-score') {
      match[field] = Number.parseInt(value, 10) || 0;
    } else {
      match[field] = value;
    }

    saveData(newData);
  };

  const toggleMatchPlayed = (matchIndex) => {
    const newData = { ...poolData };
    const match = newData.divisions[selectedDivision][selectedGroup].matches[matchIndex];
    match['match-played'] = match['match-played'] === 'Y' ? 'N' : 'Y';
    saveData(newData);
  };

  const resetAllData = async () => {
    if (globalThis.confirm('Are you sure you want to reset all data to original values? This cannot be undone!')) {
      try {
        const response = await fetch('/data/kcc-pool.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        saveData(data);
        alert('Data has been reset to original values.');
      } catch (error) {
        console.error('Error loading original data:', error);
        alert('Error resetting data. Please check your connection and try again.');
      }
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(poolData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kcc-pool-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!poolData) {
    return <div className="admin-loading">Loading...</div>;
  }

  const currentGroup = poolData.divisions[selectedDivision]?.[selectedGroup];
  const divisions = Object.keys(poolData.divisions);
  const groups = selectedDivision ? Object.keys(poolData.divisions[selectedDivision]) : [];

  return (
    <div className="kcc-admin">
      <header className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Knox County Cup - Admin Panel</h1>
            <p>Manage match results and standings</p>
          </div>
          <Link to="/" className="btn-back-to-display">
            ← Back to Display
          </Link>
        </div>
      </header>

      <div className="admin-controls">
        <div className="control-group">
          <label htmlFor="division-select">Division:</label>
          <select
            id="division-select"
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedGroup(null);
            }}
          >
            {divisions.map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="group-select">Group:</label>
          <select
            id="group-select"
            value={selectedGroup || ''}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            {groups.map(group => (
              <option key={group} value={group}>Group {group}</option>
            ))}
          </select>
        </div>

        <div className="action-buttons">
          <button onClick={exportData} className="btn-export">Export Data</button>
          <button onClick={resetAllData} className="btn-reset">Reset All Data</button>
        </div>

        {saveStatus && <div className="save-status">{saveStatus}</div>}
      </div>

      {currentGroup && (
        <div className="admin-content">
          <div className="teams-section">
            <h2>Teams in Group {selectedGroup}</h2>
            <ul className="teams-list">
              {currentGroup.teams.map(teamId => (
                <li key={teamId}>
                  <span className="team-id">#{teamId}</span>
                  <span className="team-name">{poolData.teams[teamId.toString()].name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="matches-section">
            <h2>Matches</h2>
            <div className="matches-grid">
              {currentGroup.matches.map((match, index) => {
                const homeTeam = poolData.teams[match.home.toString()];
                const awayTeam = poolData.teams[match.away.toString()];
                const isPlayed = match['match-played'] === 'Y';
                const matchKey = `${match.home}-${match.away}-${match.date}`;

                return (
                  <div key={matchKey} className={`match-card ${isPlayed ? 'played' : 'pending'}`}>
                    <div className="match-header">
                      <span className="match-number">Match {index + 1}</span>
                      <button
                        onClick={() => toggleMatchPlayed(index)}
                        className={`btn-toggle ${isPlayed ? 'played' : 'pending'}`}
                      >
                        {isPlayed ? '✓ Played' : '○ Pending'}
                      </button>
                    </div>

                    <div className="match-details">
                      <div className="match-info">
                        <span className="label">Date:</span>
                        <input
                          type="date"
                          value={match.date}
                          onChange={(e) => handleMatchUpdate(index, 'date', e.target.value)}
                        />
                      </div>
                      <div className="match-info">
                        <span className="label">Time:</span>
                        <input
                          type="time"
                          value={match.time}
                          onChange={(e) => handleMatchUpdate(index, 'time', e.target.value)}
                        />
                      </div>
                      <div className="match-info">
                        <span className="label">Field:</span>
                        <input
                          type="text"
                          value={match.field}
                          onChange={(e) => handleMatchUpdate(index, 'field', e.target.value)}
                          className="field-input"
                        />
                      </div>
                    </div>

                    <div className="match-teams">
                      <div className="team-score">
                        <div className="team-name">{homeTeam.name}</div>
                        <input
                          type="number"
                          min="0"
                          value={match['home-score']}
                          onChange={(e) => handleMatchUpdate(index, 'home-score', e.target.value)}
                          className="score-input"
                          disabled={!isPlayed}
                        />
                      </div>

                      <div className="vs-divider">VS</div>

                      <div className="team-score">
                        <div className="team-name">{awayTeam.name}</div>
                        <input
                          type="number"
                          min="0"
                          value={match['away-score']}
                          onChange={(e) => handleMatchUpdate(index, 'away-score', e.target.value)}
                          className="score-input"
                          disabled={!isPlayed}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KCCStandingsAdmin;

