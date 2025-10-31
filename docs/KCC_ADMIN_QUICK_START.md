# Quick Start Guide - KCC Admin Panel

## 🚀 Getting Started

### Step 1: Access the Admin Panel

**Option A: Use the Floating Button**
1. Look for the **⚙️ gear icon** in the bottom-right corner of the screen
2. Click it to open the admin menu
3. Click **"📊 KCC Standings Manager"**

**Option B: Direct URL**
- Navigate to: `http://localhost:5173/admin/kcc/standings`

### Step 2: Enter Match Results

#### Select Your Match
1. Choose **Division**: `12U Boy` or `12U Girl`
2. Choose **Group**: `A`, `B`, `C`, `D`, `E`, `F`, or `G`
3. Find your match in the grid

#### Enter the Score
1. Click the **"○ Pending"** button → Changes to **"✓ Played"**
2. Enter the **Home Score** in the first box
3. Enter the **Away Score** in the second box
4. ✅ **Automatically saved!**

### Step 3: View Updated Standings
1. Click **"← Back to Display"** at the top
2. Wait for the standings slide to appear
3. See your results reflected in the table!

---

## 📋 Quick Reference

### Match Status Colors
- 🟢 **Green Card** = Match has been played
- 🟡 **Yellow Card** = Match is pending

### Data Management Buttons

| Button | What It Does |
|--------|--------------|
| **Export Data** | Downloads a backup JSON file |
| **Reset All Data** | Restores original tournament data (⚠️ Cannot undo!) |
| **← Back to Display** | Returns to main screen |

---

## 💾 Data Backup (Important!)

**Before the tournament day:**
- Click **"Export Data"** to save a backup
- File will be named: `kcc-pool-YYYY-MM-DD.json`
- Keep this safe in case you need to restore

**During the tournament:**
- Export after major updates
- Keep multiple backups

---

## 🔄 Common Tasks

### Correcting a Score
1. Find the match card
2. Change the score numbers
3. Changes save automatically

### Unmarking a Match
1. Click the **"✓ Played"** button
2. It will change back to **"○ Pending"**
3. Scores will be disabled

### Starting Fresh
1. Click **"Reset All Data"**
2. Confirm the warning
3. All scores will be cleared

---

## 🎯 Tournament Day Workflow

### Morning Setup
1. ✅ Export current data (backup)
2. ✅ Test the admin panel
3. ✅ Verify all groups are correct
4. ✅ Set up display on big screen

### During Matches
1. 📝 Write down scores on paper first
2. 🖱️ Enter in admin panel immediately
3. 👀 Verify standings update
4. 💾 Export data every hour

### End of Day
1. ✅ Export final data
2. ✅ Email backup file to yourself
3. ✅ Screenshot final standings
4. ✅ Close browser (or keep for next day)

---

## ⚠️ Important Notes

- **Data is saved in your browser** - Use the same computer/browser all day
- **No undo button** - Double-check scores before entering
- **Export regularly** - Don't lose your work!
- **One person at a time** - Multiple admins = confusion

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Standings not updating | Refresh the display page |
| Lost my scores | Import your backup JSON file (if implemented) |
| Wrong division | Select correct division from dropdown |
| Can't enter scores | Make sure match is marked as "Played" |
| Browser crashed | Data should still be there when you reopen |

---

## 🆘 Emergency Contacts

**Technical Issues:**
- Check browser console (F12)
- Try different browser
- Export data before troubleshooting

**Can't Fix It:**
- Export current data
- Reset to original
- Re-enter scores from paper backup

---

## 📱 Mobile Access

The admin panel works on tablets and phones:
- Use landscape mode for best experience
- Buttons may be smaller
- Export function still works
- Same URL as desktop

---

## ✅ Pre-Tournament Checklist

- [ ] Test admin panel loads
- [ ] Test entering a fake score
- [ ] Verify standings update
- [ ] Export test data
- [ ] Prepare paper backup sheets
- [ ] Bookmark admin URL
- [ ] Show another person how to use it (backup admin)
- [ ] Have laptop/tablet charged
- [ ] Connect to reliable internet/power
- [ ] Test on actual display screen

---

## 🎉 Tips for Success

1. **Paper Trail**: Always write scores on paper first
2. **Double Check**: Verify team names before entering
3. **Save Often**: Export every few games
4. **Stay Organized**: Do one group at a time
5. **Test First**: Practice with fake scores beforehand

---

## 🔗 More Information

- Full documentation: `docs/developers/KCC_ADMIN_INTERFACE.md`
- Implementation details: `docs/developers/KCC_ADMIN_IMPLEMENTATION.md`

---

**Good luck with the tournament! ⚽🏆**

