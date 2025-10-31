# KCC Standings Admin Interface

## Overview
The KCC Standings Admin Interface allows administrators to manage match results for the Knox County Cup tournament. The admin panel provides an intuitive interface to enter scores, mark matches as played, and manage match schedules.

## Access
Navigate to `/admin/kcc/standings` to access the admin panel.

Example: `http://localhost:5173/admin/kcc/standings`

## Features

### 1. Match Management
- **View all matches** organized by division and group
- **Enter scores** for home and away teams
- **Mark matches as played/pending** with a toggle button
- **Edit match details** including date, time, and field

### 2. Data Persistence
- All changes are automatically saved to browser's localStorage
- Changes are reflected in real-time on the standings display
- Data persists across browser sessions

### 3. Data Management
- **Export Data**: Download current standings data as a JSON file
- **Reset Data**: Restore original tournament data (requires confirmation)

### 4. Division and Group Selection
- Easy dropdown navigation between divisions (U12 Boys, U12 Girls)
- Quick group selection within each division
- View all teams in selected group

## How to Use

### Entering Match Results

1. **Select Division**: Choose between "12U Boy" or "12U Girl"
2. **Select Group**: Choose the group (A, B, C, etc.)
3. **View Matches**: All matches for the selected group will be displayed
4. **Mark as Played**: Click the "○ Pending" button to change it to "✓ Played"
5. **Enter Scores**: Once marked as played, enter the home and away scores
6. **Automatic Save**: Changes are saved automatically

### Match Information

Each match card displays:
- Match number
- Match status (Played/Pending)
- Date, time, and field
- Home and away team names
- Score inputs (enabled when match is marked as played)

### Visual Indicators

- **Green cards**: Matches that have been played
- **Yellow cards**: Pending matches
- **Disabled score inputs**: Scores can only be entered for played matches

### Data Management

#### Export Data
Click "Export Data" button to download a JSON file with current standings. The file includes:
- All team information
- All match results
- Updated scores and statistics
- Filename format: `kcc-pool-YYYY-MM-DD.json`

#### Reset Data
Click "Reset All Data" button to restore original tournament data. This action:
- Requires confirmation
- Clears all entered scores
- Resets all matches to "Pending" status
- Cannot be undone (unless you have exported the data first)

## Data Flow

1. **Admin enters data** → Saved to localStorage
2. **Standings component** → Reads from localStorage
3. **Display updates** → Shows current results in real-time

## Technical Details

### Data Storage
- Data is stored in browser localStorage under the key `kcc-pool-data`
- Original data remains in `src/data/kcc-pool.json`
- Changes in localStorage override the original JSON data

### Data Structure
```json
{
  "teams": {
    "1": {
      "id": 1,
      "name": "Team Name",
      "division": "12U Boy"
    }
  },
  "divisions": {
    "12U Boy": {
      "A": {
        "teams": [1, 2, 3],
        "matches": [
          {
            "home": 1,
            "away": 2,
            "date": "2025-10-25",
            "time": "09:00",
            "field": "1",
            "home-score": 2,
            "away-score": 1,
            "match-played": "Y"
          }
        ]
      }
    }
  }
}
```

### Standings Calculation
The standings are automatically calculated based on:
1. **Points**: 3 for win, 1 for draw, 0 for loss
2. **Goal Difference**: Goals For minus Goals Against
3. **Goals For**: Total goals scored

Teams are ranked by:
1. Points (descending)
2. Goal Difference (descending)
3. Goals For (descending)

## Browser Compatibility

The admin interface works in all modern browsers that support:
- localStorage API
- ES6 JavaScript
- CSS Grid and Flexbox

## Best Practices

1. **Regular Exports**: Export data regularly as backup
2. **Double-check Scores**: Verify scores before marking as played
3. **Test on Dev**: Test on development environment before using in production
4. **Multiple Browsers**: Data is browser-specific; use same browser consistently

## Troubleshooting

### Data not updating on display
- Check that you're viewing the display in the same browser
- Refresh the standings page
- Check browser console for errors

### Lost data after browser clear
- Data is stored in localStorage, which is cleared when browser data is cleared
- Always export data before clearing browser data
- Consider implementing a backend API for production use

### Export not working
- Check browser's download settings
- Ensure popup blocker is disabled
- Try a different browser

## Future Enhancements

Potential improvements for production use:
- Backend API for persistent storage
- User authentication
- Real-time sync across multiple devices
- Match history and audit log
- Bulk import/export functionality
- Mobile app integration

