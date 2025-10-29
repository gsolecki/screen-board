import React from 'react';
import './KnoxCountyCup.css';
import poolData from '../data/kcc-pool.json';
import Header from './Header';
import Footer from './Footer';

// Transform JSON data to display format by division
const transformPoolData = () => {
  const divisions = {
    boys: { label: 'U12 Boys', groups: {} },
    girls: { label: 'U12 Girls', groups: {} }
  };

  Object.entries(poolData.divisions).forEach(([division, divisionGroups]) => {
    const divType = division === '12U Boy' ? 'boys' : 'girls';

    Object.entries(divisionGroups).forEach(([groupCode, groupData]) => {
      // Initialize stats for each team
      const teamStats = {};
      let hasMatchesPlayed = false;

      groupData.teams.forEach(teamId => {
        teamStats[teamId] = {
          teamId: teamId,
          team: poolData.teams[teamId.toString()].name,
          mp: 0,
          w: 0,
          d: 0,
          l: 0,
          gf: 0,
          ga: 0,
          gd: 0,
          pts: 0
        };
      });

      // Calculate stats from matches
      groupData.matches.forEach(match => {
        if (match['match-played'] === 'Y') {
          hasMatchesPlayed = true;
          const homeScore = match['home-score'];
          const awayScore = match['away-score'];
          const homeId = match.home;
          const awayId = match.away;

          // Update matches played
          teamStats[homeId].mp++;
          teamStats[awayId].mp++;

          // Update goals
          teamStats[homeId].gf += homeScore;
          teamStats[homeId].ga += awayScore;
          teamStats[awayId].gf += awayScore;
          teamStats[awayId].ga += homeScore;

          // Determine result and update W/D/L and points
          if (homeScore > awayScore) {
            // Home win
            teamStats[homeId].w++;
            teamStats[homeId].pts += 3;
            teamStats[awayId].l++;
          } else if (homeScore < awayScore) {
            // Away win
            teamStats[awayId].w++;
            teamStats[awayId].pts += 3;
            teamStats[homeId].l++;
          } else {
            // Draw
            teamStats[homeId].d++;
            teamStats[awayId].d++;
            teamStats[homeId].pts += 1;
            teamStats[awayId].pts += 1;
          }
        }
      });

      // Calculate goal difference for each team
      Object.values(teamStats).forEach(team => {
        team.gd = team.gf - team.ga;
      });

      // Convert to array and sort by points (desc), then GD (desc), then GF (desc)
      const sortedTeams = Object.values(teamStats).sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
      });

      // Add position numbers
      sortedTeams.forEach((team, index) => {
        team.pos = index + 1;
      });

      divisions[divType].groups[groupCode] = {
        teams: sortedTeams,
        hasMatchesPlayed: hasMatchesPlayed
      };
    });
  });

  return divisions;
};

const divisions = transformPoolData();

function StandingsTable({ data, groupName, hasMatchesPlayed }) {
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
          {data.map((team, index) => (
            <tr key={team.team} className={hasMatchesPlayed && index === 0 ? 'leader' : ''}>
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
      <Header title="Knox County Cup 2025" subtitle="STANDINGS" />
      <div className="divisions-container">
        {/* Boys Division */}
        <div className="division-column">
          <div className="division-header">{divisions.boys.label}</div>
          <div className="division-groups">
            {Object.entries(divisions.boys.groups).map(([groupCode, groupData]) => (
              <StandingsTable
                key={groupCode}
                groupName={`Group ${groupCode}`}
                data={groupData.teams}
                hasMatchesPlayed={groupData.hasMatchesPlayed}
              />
            ))}
          </div>
        </div>

        {/* Royal Blue Divider */}
        <div className="division-divider"></div>

        {/* Girls Division */}
        <div className="division-column">
          <div className="division-header">{divisions.girls.label}</div>
          <div className="division-groups">
            {Object.entries(divisions.girls.groups).map(([groupCode, groupData]) => (
              <StandingsTable
                key={groupCode}
                groupName={`Group ${groupCode}`}
                data={groupData.teams}
                hasMatchesPlayed={groupData.hasMatchesPlayed}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer
        leftContent={null}
        centerContent={<span>Knox County Cup 2025 • Group Phase Standings</span>}
        rightContent={null}
      />
    </div>
  );
}

export default KnoxCountyCup;
