# KCC Admin System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SCREEN BOARD APPLICATION                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         MAIN DISPLAY (/)                        │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │          Screen Rotator Component                     │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │    │
│  │  │ Slide 1  │→ │ Slide 2  │→ │  KCC     │→ ...      │    │
│  │  │Concessions│  │          │  │Standings │           │    │
│  │  └──────────┘  └──────────┘  └──────────┘           │    │
│  │                                      ↑                │    │
│  │                                      │                │    │
│  │                    Reads from localStorage           │    │
│  └─────────────────────────────────────┼────────────────┘    │
│                                         │                     │
│  [⚙️ Admin Menu Button] ←──────────────┘                     │
│     (bottom-right)                                            │
└───────────────────────────────────────────────────────────────┘
                            │
                            │ Navigation
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                 ADMIN PANEL (/admin/kcc/standings)              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ [← Back to Display]         Knox County Cup Admin    │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ Division: [12U Boy ▼]  Group: [A ▼]                 │     │
│  │ [Export Data]  [Reset All Data]                      │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │  Match 1    │  │  Match 2    │  │  Match 3    │           │
│  │ ✓ Played    │  │ ○ Pending   │  │ ✓ Played    │           │
│  │ Team A [2]  │  │ Team C [ ]  │  │ Team E [1]  │           │
│  │ Team B [1]  │  │ Team D [ ]  │  │ Team F [1]  │           │
│  └──────��──────┘  └─────────────┘  └─────────────┘           │
│                          │                                      │
│                          │ Saves to                             │
│                          ↓                                      │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER LOCALSTORAGE                         │
│                                                                 │
│  Key: "kcc-pool-data"                                           │
│  ┌────────────────────────────────────────────────────┐        │
│  │ {                                                   │        │
│  │   "teams": { ... },                                 │        │
│  │   "divisions": {                                    │        │
│  │     "12U Boy": {                                    │        │
│  │       "A": {                                        │        │
│  │         "teams": [1, 2, 3],                         │        │
│  │         "matches": [                                │        │
│  │           {                                         │        │
│  │             "home": 1,                              │        │
│  │             "away": 2,                              │        │
│  │             "home-score": 2,                        │        │
│  │             "away-score": 1,                        │        │
│  │             "match-played": "Y"                     │        │
│  │           }                                         │        │
│  │         ]                                           │        │
│  │       }                                             │        │
│  │     }                                               │        │
│  │   }                                                 │        │
│  │ }                                                   │        │
│  └────────────────────────────────────────────────────┘        │
│                          │                                      │
│                          │ Event: 'storage'                     │
│                          ↓                                      │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Triggers Re-render
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              KCC STANDINGS CALCULATION ENGINE                   │
│                                                                 │
│  Input: match results from localStorage                        │
│                                                                 │
│  For each team:                                                │
│    Matches Played (MP) = count of played matches              │
│    Wins (W) = matches where score > opponent                  │
│    Draws (D) = matches where score == opponent                │
│    Losses (L) = matches where score < opponent                │
│    Goals For (GF) = total goals scored                        │
│    Goals Against (GA) = total goals conceded                  │
│    Goal Difference (GD) = GF - GA                             │
│    Points (Pts) = (W × 3) + (D × 1)                           │
│                                                                 │
│  Sort by:                                                      │
│    1. Points (descending)                                     │
│    2. Goal Difference (descending)                            │
│    3. Goals For (descending)                                  │
│                                                                 │
│  Output: Ranked team standings                                │
└─────────────────────────────────────────────────────────────────┘


DATA FLOW DIAGRAM
=================

Admin enters score
        │
        ↓
    Validates input
        │
        ↓
Saves to localStorage ←──────────────┐
        │                            │
        ↓                            │
Updates admin UI (saved!)            │
        │                            │
        ↓                            │
Triggers 'storage' event             │
        │                            │
        ↓                            │
Standings component detects change   │
        │                            │
        ↓                            │
Recalculates all standings           │
        │                            │
        ↓                            │
Updates display (automatic)          │
        │                            │
        ↓                            │
Export creates backup ───────────────┘


USER WORKFLOWS
==============

Workflow 1: Enter Match Result
┌─────────────────────────────────────┐
│ 1. Navigate to admin panel          │
│ 2. Select division and group        │
│ 3. Find match card                  │
│ 4. Click "○ Pending" → "✓ Played"  │
│ 5. Enter home score                 │
│ 6. Enter away score                 │
│ 7. ✓ Auto-saved                     │
│ 8. View on main display             │
└─────────────────────────────────────┘

Workflow 2: Correct a Score
┌─────────────────────────────────────┐
│ 1. Navigate to admin panel          │
│ 2. Select correct division/group    │
│ 3. Find match card                  │
│ 4. Update score numbers             │
│ 5. ✓ Auto-saved                     │
└─────────────────────────────────────┘

Workflow 3: Export Backup
┌─────────────────────────────────────┐
│ 1. Navigate to admin panel          │
│ 2. Click "Export Data"              │
│ 3. File downloads automatically     │
│ 4. Save to safe location            │
└─────────────────────────────────────┘

Workflow 4: Reset Data
┌─────────────────────────────────────┐
│ 1. Navigate to admin panel          │
│ 2. Click "Reset All Data"           ��
│ 3. Confirm warning dialog           │
│ 4. All scores cleared               │
│ 5. Back to original data            │
└─────────────────────────────────────┘


COMPONENT HIERARCHY
===================

App.jsx
├── Router
    ├── AdminNav.jsx (floating button)
    └── Routes
        ├── Route "/" 
        │   └── ScreenRotator.jsx
        │       └── Slides.jsx
        │           ├── Concessions.jsx
        │           ├── KCCSchedule.jsx
        │           └── KCCStandings.jsx ← Reads localStorage
        │
        └── Route "/admin/kcc/standings"
            └── KCCStandingsAdmin.jsx ← Writes localStorage
                ├── Division Selector
                ├── Group Selector
                ├── Teams List
                └── Match Cards
                    ├── Match Status Toggle
                    ├── Match Details
                    └── Score Inputs


FILE DEPENDENCIES
=================

KCCStandingsAdmin.jsx
    ├── Uses: useState, useEffect
    ├── Uses: Link (react-router-dom)
    ├── Reads: src/data/kcc-pool.json (initial)
    ├── Writes: localStorage['kcc-pool-data']
    └── Styles: KCCStandingsAdmin.css

KCCStandings.jsx
    ├── Uses: useState, useEffect
    ├── Reads: src/data/kcc-pool.json (fallback)
    ├── Reads: localStorage['kcc-pool-data'] (primary)
    ├── Listens: 'storage' event
    └── Styles: KCCStandings.css

AdminNav.jsx
    ├── Uses: useState
    ├── Uses: Link, useLocation (react-router-dom)
    └── Styles: AdminNav.css


DEPLOYMENT CONSIDERATIONS
==========================

Development:
✓ Works on localhost
✓ localStorage persists across refreshes
✓ Hot reload maintains state
✓ Admin and display on same origin

Production:
✓ Deploy to Azure Static Web Apps
✓ HTTPS enabled (required for localStorage)
✓ Custom domain support
✓ Same-browser requirement
⚠ No cross-device sync (localStorage limitation)
⚠ No authentication (add for production)

```

