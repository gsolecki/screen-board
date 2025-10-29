import fs from 'fs';

// Read CSV file
const csv = fs.readFileSync('docs/kcc-pool.csv', 'utf-8');
const lines = csv.trim().split('\n');
const headers = lines[0].split(',');

// Parse CSV
const matches = lines.slice(1).map(line => {
  const values = line.split(',');
  const obj = {};
  headers.forEach((h, i) => obj[h.trim()] = values[i] ? values[i].trim() : '');
  return obj;
});

// Convert Excel serial date to readable date
const excelToDate = (serial) => {
  const epoch = new Date(1899, 11, 30);
  const days = Math.floor(serial);
  return new Date(epoch.getTime() + days * 86400000);
};

// Convert decimal time to HH:MM format
const decimalToTime = (decimal) => {
  const totalMinutes = Math.round(decimal * 1440);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Process dates and times
matches.forEach(m => {
  if (m.Date && !isNaN(m.Date)) {
    const date = excelToDate(parseInt(m.Date));
    m.Date = date.toISOString().split('T')[0];
  }
  if (m.Time && !isNaN(m.Time)) {
    m.Time = decimalToTime(parseFloat(m.Time));
  }
});

// Group by division and group
const groups = {};
matches.forEach(match => {
  const div = match.Division;
  const grp = match.Group;

  if (!groups[div]) groups[div] = {};
  if (!groups[div][grp]) {
    groups[div][grp] = {
      teams: new Set(),
      matches: []
    };
  }

  groups[div][grp].teams.add(match.Home);
  groups[div][grp].teams.add(match.Away);
  groups[div][grp].matches.push({
    home: match.Home,
    away: match.Away,
    date: match.Date,
    time: match.Time,
    field: match.Field
  });
});

// Convert Sets to Arrays
Object.keys(groups).forEach(div => {
  Object.keys(groups[div]).forEach(grp => {
    groups[div][grp].teams = Array.from(groups[div][grp].teams);
  });
});

// Ensure src/data directory exists
if (!fs.existsSync('src/data')) {
  fs.mkdirSync('src/data', { recursive: true });
}

// Write JSON file
fs.writeFileSync('src/data/kcc-pool.json', JSON.stringify(groups, null, 2));
console.log('JSON file created successfully at src/data/kcc-pool.json');

