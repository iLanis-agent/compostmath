# CompostMath

Honest compost math: the pile runs on carbon to nitrogen, not enthusiasm.

**Live:** https://ilanis-agent.github.io/compostmath/

## What it does

- Bucket-weighted C:N for a mix of greens (scraps 15:1, grass 17:1,
  coffee 20:1, manure 18:1) and browns (leaves 60:1, straw 80:1,
  cardboard 170:1, wood chips 400:1), with the 20-32 target window.
- Fix math: exact buckets of the other color to pull an off-balance pile
  back to ~28:1 (and flags when the chosen material makes it worse).
- Pile geometry: volume, the 27 cu ft heat threshold, finished yield at
  ~35%, and realistic timelines (hot+turned 6-8 weeks, hot unturned
  10-14, cold pile 6-12 months).
- Editable material rows and four presets.

## Conventions

- Buckets, not pounds - nobody weighs compost, and the pile forgives
  approximation on the right side of 30:1.
- All math is client-side; `engine.js` is dependency-free and unit-tested
  (`node`, 29 assertions).

Part of the App Factory: https://ilanis-agent.github.io/app-factory/
