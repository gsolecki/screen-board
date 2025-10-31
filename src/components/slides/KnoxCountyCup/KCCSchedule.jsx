import React from 'react';
import './KCCSchedule.css';
import poolData from '../../../data/kcc-pool.json';
import SlideLayout from '../../common/SlideLayout';

// Transform JSON data to get schedule by division
const transformScheduleData = () => {
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

const divisions = transformScheduleData();

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
                <th style={{width: '12%'}}>Time</th>
                <th style={{width: '12%'}}>Field</th>
                <th style={{width: '15%'}}>Group</th>
                <th style={{width: '61%'}}>Match</th>
              </tr>
            </thead>
            <tbody>
              {dateMatches.map((match, idx) => (
                <tr key={idx} className={match.played ? 'played' : ''}>
                  <td className="time">{match.time}</td>
                  <td className="field">Field {match.field}</td>
                  <td className="group">{match.group}</td>
                  <td className="match">
                    <div className="match-teams">
                      <span className="team">{match.home}</span>
                      <span className="vs">vs</span>
                      <span className="team">{match.away}</span>
                      {match.played && (
                        <span className="score">
                          ({match.homeScore} - {match.awayScore})
                        </span>
                      )}
                    </div>
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

