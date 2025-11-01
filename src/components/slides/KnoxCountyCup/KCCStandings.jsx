import React, { useState, useEffect } from 'react';
import './KCCStandings.css';
import SlideLayout from '../../common/SlideLayout';

// Transform JSON data to display format by division
const transformPoolData = (poolData) => {
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

function KCCStandings() {
  const [poolData, setPoolData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if there's saved data in localStorage first
        const savedData = localStorage.getItem('kcc-pool-data');
        if (savedData) {
          // Use localStorage data (saved from admin panel)
          setPoolData(JSON.parse(savedData));
        } else {
          // Load base tournament structure if no saved data
          const baseResponse = await fetch('/data/kcc-pool.json');
          if (!baseResponse.ok) {
            throw new Error(`HTTP error! status: ${baseResponse.status}`);
          }
          const baseData = await baseResponse.json();
          setPoolData(baseData);
        }
      } catch (error) {
        console.error('Error loading KCC pool data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Poll for updates every 5 seconds to detect localStorage changes
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Don't render if poolData is not available
  if (!poolData || !poolData.divisions || !poolData.teams) {
    return (
      <SlideLayout
        className="kcc-wrap"
        title="Knox County Cup 2025"
        subtitle="STANDINGS"
        footerCenter={<span>Knox County Cup 2025 • Group Phase Standings</span>}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'white', fontSize: '1.5rem' }}>
          Loading standings...
        </div>
      </SlideLayout>
    );
  }

  const divisions = transformPoolData(poolData);

  return (
    <SlideLayout
      className="kcc-wrap"
      title="Knox County Cup 2025"
      subtitle="STANDINGS"
      footerCenter={<span>Knox County Cup 2025 • Group Phase Standings</span>}
    >
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
    </SlideLayout>
  );
}

export default KCCStandings;


