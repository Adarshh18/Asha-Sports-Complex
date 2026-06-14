# Asha Sports Complex — Website

## Structure
```
asha-sports-complex/
├── index.html              ← Home (all sections assembled)
├── pages/
│   ├── about.html
│   ├── sports.html
│   ├── admission.html      ← Process + Form (Apply scrolls to form)
│   ├── gallery.html
│   └── contact.html
├── sections/               ← HTML snippets (no style/script)
├── css/                    ← One CSS file per section
├── js/                     ← One JS file per section (IIFE-wrapped)
└── assets/                 ← Place images/videos/icons here
```

## Bugs Fixed
- evHeader, tHeader, cHeader internal section tags preserved (no longer stripped)
- All canvas particle IDs unique and matched between HTML and JS
- Coaches, Programs, Gallery, Events, Facilities scroll-reveal works
- Admission Process + Form both visible on admission.html
- Apply for Admission button scrolls to #apply form
- Book Now / Join Academy → admission.html on every page
- All nav links wired (desktop + mobile), logo links home
- JS IIFEs prevent variable collisions across sections
