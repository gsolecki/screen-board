import React, { useState, useEffect } from 'react';
import './KCCSchedule.css';
import SlideLayout from '../../common/SlideLayout';

// Transform JSON data to get schedule by division
const transformScheduleData = (poolData) => {
  if (!poolData || !poolData.divisions || !poolData.teams) {
    return null;
  }

  const divisions = {
    boys: { label: 'U12 Boys', matches: [] },
    girls: { label: 'U12 Girls', matches: [] }
  };

  Object.entries(poolData.divisions).forEach(([division, divisionGroups]) => {
    const divType = division === '12U Boy' ? 'boys' : 'girls';

    Object.entries(divisionGroups).forEach(([groupCode, groupData]) => {
      groupData.matches.forEach(match => {
        const homeTeam = poolData.teams[match.home.toString()].name;
        const awayTeam = poolData.teams[match.away.toString()].name;

        divisions[divType].matches.push({
          group: `Group ${groupCode}`,
          home: homeTeam,
          away: awayTeam,
          date: match.date,
          time: match.time,
          field: match.field,
          played: match['match-played'] === 'Y',
          homeScore: match['home-score'],
          awayScore: match['away-score']
        });
      });
    });

    // Sort matches by date and time
    divisions[divType].matches.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.time.localeCompare(b.time);
    });
  });

  return divisions;
};


// Format date to display format
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

function ScheduleTable({ matches, divisionLabel }) {
  // Group matches by date
  const matchesByDate = matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {});

  return (
    <div className="schedule-division">
      <div className="schedule-division-header">{divisionLabel}</div>

      {Object.entries(matchesByDate).map(([date, dateMatches]) => (
        <div key={date} className="schedule-date-section">
          <div className="schedule-date-header">{formatDate(date)}</div>

          <table className="schedule-table">
            <thead>
              <tr>
                <th style={{width: '15%'}}>Time</th>
                <th style={{width: '15%'}}>Field</th>
                <th style={{width: '20%'}}>Group</th>
                <th style={{width: '25%'}}>Home</th>
                <th style={{width: '25%'}}>Away</th>
              </tr>
            </thead>
            <tbody>
              {dateMatches.map((match, idx) => (
                <tr key={idx} className={match.played ? 'played' : ''}>
                  <td className="time">{match.time}</td>
                  <td className="field">Field {match.field}</td>
                  <td className="group">{match.group}</td>
                  <td className="home-team">
                    {match.home}
                    {match.played && (
                      <span className="score-inline"> ({match.homeScore})</span>
                    )}
                  </td>
                  <td className="away-team">
                    {match.away}
                    {match.played && (
                      <span className="score-inline"> ({match.awayScore})</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function KCCSchedule() {
  const [poolData, setPoolData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load base tournament structure
        const baseResponse = await fetch('/data/kcc-pool.json');
        if (!baseResponse.ok) {
          throw new Error(`HTTP error! status: ${baseResponse.status}`);
        }
        const baseData = await baseResponse.json();

        // Load saved match results from API
        try {
          const matchesResponse = await fetch('/api/matches');
          if (matchesResponse.ok) {
            const savedMatches = await matchesResponse.json();

            // Merge saved matches into base data
            savedMatches.forEach(savedMatch => {
              const division = baseData.divisions[savedMatch.division];
              if (division && division[savedMatch.group]) {
                const match = division[savedMatch.group].matches[savedMatch.matchIndex];
                if (match) {
                  match['home-score'] = savedMatch.homeScore;
                  match['away-score'] = savedMatch.awayScore;
                  match['match-played'] = savedMatch.matchPlayed;
                }
              }
            });
          }
        } catch (apiError) {
          console.log('No saved match data from API, using base data only');
        }

        setPoolData(baseData);
      } catch (error) {
        console.error('Error loading KCC pool data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Don't render if poolData is not available
  if (!poolData) {
    return (
      <SlideLayout
        className="kcc-schedule-wrap"
        title="Knox County Cup 2025"
        subtitle="MATCH SCHEDULE"
        footerCenter={<span>Knox County Cup 2025 • Group Phase Schedule</span>}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'white', fontSize: '1.5rem' }}>
          Loading schedule...
        </div>
      </SlideLayout>
    );
  }

  const divisions = transformScheduleData(poolData);

  if (!divisions) {
    return (
      <SlideLayout
        className="kcc-schedule-wrap"
        title="Knox County Cup 2025"
        subtitle="MATCH SCHEDULE"
        footerCenter={<span>Knox County Cup 2025 • Group Phase Schedule</span>}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'white', fontSize: '1.5rem' }}>
          Error loading schedule data
        </div>
      </SlideLayout>
    );
  }

  return (
    <SlideLayout
      className="kcc-schedule-wrap"
      title="Knox County Cup 2025"
      subtitle="MATCH SCHEDULE"
      footerCenter={<span>Knox County Cup 2025 • Group Phase Schedule</span>}
    >
      <div className="schedule-container">
        {/* Boys Division */}
        <div className="schedule-column">
          <ScheduleTable
            matches={divisions.boys.matches}
            divisionLabel={divisions.boys.label}
          />
        </div>

        {/* Royal Blue Divider */}
        <div className="schedule-divider"></div>

        {/* Girls Division */}
        <div className="schedule-column">
          <ScheduleTable
            matches={divisions.girls.matches}
            divisionLabel={divisions.girls.label}
          />
        </div>
      </div>
    </SlideLayout>
  );
}

export default KCCSchedule;

