import React from 'react';
import './KnoxCountyCup.css';
import poolData from '../data/kcc-pool.json';

// Transform JSON data to display format
const transformPoolData = () => {
  const groups = {};

  Object.entries(poolData).forEach(([division, divisionGroups]) => {
    Object.entries(divisionGroups).forEach(([groupCode, groupData]) => {
      const divisionLabel = division === '12U Boy' ? 'U12 Boys' : 'U12 Girls';
      const groupName = `${divisionLabel} - Group ${groupCode}`;

      // Create standings table from teams
      groups[groupName] = groupData.teams.map((team, index) => ({
        pos: index + 1,
        team: team,
        mp: 0,
        w: 0,
        d: 0,
        l: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0
      }));
    });
  });

  return groups;
};

const groups = transformPoolData();

function StandingsTable({ data, groupName }) {
  return (
    <div className="group">
      <div className="group-header">{groupName}</div>
      <table className="standings-table">
        <thead>
          <tr>
            <th style={{width: '40%'}}>Club</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {data.map((team) => (
            <tr key={team.team}>
              <td>
                <div className="team-cell">
                  <span className="position">{team.pos}</span>
                  <span className="team-name">{team.team}</span>
                </div>
              </td>
              <td className="stats">{team.mp}</td>
              <td className="stats">{team.w}</td>
              <td className="stats">{team.d}</td>
              <td className="stats">{team.l}</td>
              <td className="stats">{team.gf}</td>
              <td className="stats">{team.ga}</td>
              <td className="stats">{team.gd}</td>
              <td className="points">{team.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KnoxCountyCup() {
  return (
    <div className="kcc-wrap">
      <header className="kcc-header">
        <h1 className="kcc-title">Knox County Cup 2025</h1>
      </header>
      <div className="season-label">Season 2025-26 • Group Phase</div>
      <div className="standings-grid">
        {Object.entries(groups).map(([groupName, data]) => (
          <StandingsTable key={groupName} groupName={groupName} data={data} />
        ))}
      </div>
    </div>
  );
}

export default KnoxCountyCup;
