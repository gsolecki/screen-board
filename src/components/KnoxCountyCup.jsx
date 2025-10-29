import React from 'react';
import './KnoxCountyCup.css';

const groups = {
  "U12 Boys - Group A": [
    { pos: 1, team: "12B 128 Breedlove", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 2, team: "12UB - R124 - Guzzo", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 3, team: "12UB-R390-Gentry", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 }
  ],
  "U12 Boys - Group B": [
    { pos: 1, team: "12B 128 Skeen", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 2, team: "12UB - R124 - Hamler", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 3, team: "12UB-R385-Laxton", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 }
  ],
  "U12 Girls - Group A": [
    { pos: 1, team: "12 g 128 Jensen", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 2, team: "12UG - R124 - Lynn", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 3, team: "Swanson", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 }
  ],
  "U12 Girls - Group B": [
    { pos: 1, team: "12g 128 De La Torre", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 2, team: "12UG-R440-Miller", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 3, team: "12UG-R335-Schoenrock", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 }
  ],
  "U12 Girls - Group C": [
    { pos: 1, team: "12G 128 Boyce", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 2, team: "12UG - R124 - Studer", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 3, team: "12UG-R390-POST", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 }
  ],
  "U12 Girls - Group D": [
    { pos: 1, team: "12UG-R337-MOLONEY", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 2, team: "12UG-R385-Hodges", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 3, team: "12UG-R440-Azpurua", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 },
    { pos: 4, team: "12UG-R335-Dalton", mp: 2, w: 1, d: 0, l: 1, gf: 0, ga: 0, gd: 0, pts: 3 }
  ]
};

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
      <h1 className="kcc-title">Knox County Cup 2025</h1>
      <div className="standings-grid">
        {Object.entries(groups).map(([groupName, data]) => (
          <StandingsTable key={groupName} groupName={groupName} data={data} />
        ))}
      </div>
    </div>
  );
}

export default KnoxCountyCup;
