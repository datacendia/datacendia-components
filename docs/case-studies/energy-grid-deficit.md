# Energy Platform Demonstration: Grid Emergency Dispatch Under Sunset Risk

## Scenario

Heartland Power, serving 1.2 million customers, lost two 450MW generation units during a heat-wave peak. Demand was 14,200MW, available generation dropped to 12,800MW, and the system faced a **1,400MW deficit** with under-frequency load shedding risk in about 7-8 minutes.

Immediate resources existed but were constrained: 340MW/1,360MWh battery storage, 480MW demand response within 10 minutes, and 300MW emergency imports in 15 minutes. The first-pass answer looked straightforward: discharge batteries fully and shed the remainder.

## Specific Insight the Council Found

The pivotal insight came from the Renewable Optimizer. Full immediate battery discharge solved the near-term gap but created a more dangerous second-order problem at sunset.

With solar output expected to decline by ~2,100MW over 90 minutes, using the full battery now could leave no fast-response bridge later. The optimizer modeled a potential **2,840MW sunset deficit** in the adverse case if battery capacity was exhausted early.

That reframed the dispatch strategy from "minimize immediate shedding" to "optimize reliability across both crisis windows." The recommendation shifted toward partial battery discharge (200MW), larger temporary controlled shed, and preservation of storage for transition risk.

## What a Single AI Model Would Have Missed

A single-model answer often overweights immediate system stabilization and underweights ramp-transition dynamics unless explicitly forced. In this case, the council structure forced competing operational horizons into one decision cycle.

- Grid Controller prioritized immediate frequency arrest,
- Renewable Optimizer modeled sunset ramp exposure,
- Demand Response Manager expanded realistic DR contribution timelines,
- Asset Guardian updated restart probabilities and field status that changed contingency posture.

This interplay produced a better control strategy: treat resource timing, not just resource capacity, as the core reliability variable.

## What This Means For You

If you're a system operator, grid reliability lead, or utility emergency planner, this demonstration highlights a practical dispatch principle: **an emergency solved in minute 5 can still fail in minute 90 if transition reserves are consumed too early.**

The council's value was not theoretical. It produced an audit-ready rationale for why immediate controlled shedding can be preferable to maxing storage in the first interval, especially under steep renewable ramps and extreme weather.

As regulators and public utility commissions scrutinize emergency operations under increasingly volatile load and generation conditions, having a documented deliberation trail that captures both immediate and second-order reliability logic can materially improve post-event defensibility.

It also helps operators explain why a short, targeted curtailment can be the safer public-interest decision versus a larger uncontrolled outage later.
