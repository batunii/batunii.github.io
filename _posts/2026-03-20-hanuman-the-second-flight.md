---
layout: post
title: "hanuman: the second flight — animation principles in unreal engine 5"
date: 2026-03-20
type: both
tags: [unreal, animation, particles, physics, real-time-animation]
youtube: H4mMsfxdOVs
description: "building a cinematic short in ue5 using the 12 principles of animation, chaos destruction, and niagara particle dust — all to tell the story of hanuman's legendary leap."
---

this was assignment 3 for the real-time animation module — create a short animated sequence demonstrating four principles of animation using physically-based systems in unreal engine 5. i chose to tell the story of **hanuman's second flight**: the moment jambavan reminds hanuman of his dormant power, and he makes a colossal leap across a cliff gap.

## the narrative

the sequence has a clear arc: hesitant slow run → building sprint → wind-up → explosive leap → cliff-shattering landing → slow-motion look-back. every technical decision — physics, particles, camera work — was in service of that story beat.

all character animations were sourced from mixamo and edited inside ue5's sequencer. three blending approaches were tested before landing on the final one:

- **boolean-based blending** — switching states via condition flags. too abrupt.
- **slot-based blending** — inserting animations into named slots in the animation blueprint. better, but limited control.
- **overlay blending in sequencer** — direct track overlay on the cinematic timeline. smoothest transitions, adopted for the final cut.

a static end-pose was extracted from the penultimate animation using ue5's pose asset workflow, then converted into a single-frame animation to hold hanuman's final position cleanly.

## four principles of animation

### squash and stretch

implemented directly in the jump animation. hanuman squats low (squash) during wind-up, compressing his body, then explosively extends into a full-body stretch at take-off. the positions were manually exaggerated in sequencer to make the principle unmistakably readable. on landing, the chaos cliff geometry shatters at the contact point — reinforcing squash at an environmental scale.

### anticipation

the sprint transitions into a deliberate crouch-and-wind-up before the leap. a trimmed crouch animation was blended into the run-to-jump transition using sequencer overlay blending, clearly signalling to the viewer that something powerful is about to happen.

### follow through

after hanuman lands, the cliff keeps collapsing and the niagara dust cloud grows progressively — secondary elements extending the energy of the impact well past the moment itself. his slow-motion look-back lets the audience witness the ongoing environmental reaction.

### exaggeration

time dilation (slow motion) applied at the peak of the leap amplifies the drama. the sheer scale of the jump — crossing a vast cliff gap — communicates superhuman power. the camera intentionally can't keep hanuman in frame during his skyward ascent, and the final shot swirls around him as the entire cliff disintegrates into a fog of dust behind him.

## physically-based feature 1: chaos destruction

the cliff fracture was the technical centrepiece. rigid body dynamics governs fragment motion:

- **F = ma** (translational) — net force, mass, linear acceleration
- **τ = Iα** (rotational) — torque, inertia tensor, angular acceleration

fracture patterns are pre-computed via voronoi decomposition, and fragments detach when accumulated strain exceeds a material threshold. the sleep/wake mechanism suspends simulation of stationary bodies until an external impulse wakes them, keeping CPU cost low until the exact moment of impact.

**setup:**

- the cliff was converted into a geometry collection using ue5's fracture mode with a voronoi pattern at medium cluster density — producing large, dramatic fragments
- the collection was placed in **sleep state** to prevent any premature simulation
- an **anchor field** pinned the cliff base, directing fracture propagation upward and outward from the impact point
- a second smaller geometry collection on the far cliff handled hanuman's landing — a smaller, more controlled fracture to reflect his growing mastery

**what was tried and discarded:** a radial falloff force field was tested to add outward impulse at impact. results were visually unstable — fragments launching at inconsistent velocities, resembling an explosion rather than a structural collapse. relying solely on the character's contact impulse and gravity was far more believable.

**limitation worth noting:** voronoi generates geometrically regular fragments. real rock fractures along material grain lines — clustered voronoi with noise offset would better approximate natural breakage.

## physically-based feature 2: niagara particle dust

the dust cloud sustained the follow-through long after the cliff impact. particle motion integrates per timestep, and dust behaviour is dominated by viscous drag — a high drag coefficient produces the slow, billowing quality of fine rock dust.

**setup:**

- a custom dust material colour-matched to the cliff asset, built in ue5's material editor
- a **depthfade node** prevents hard intersection edges where particles meet cliff geometry
- particle opacity driven by a particle colour pin for smooth lifetime fade
- spawn rate **keyframed in sequencer** — inactive until the first impact, then increasing progressively in sync with the cliff's collapse

**two emitter approaches compared:**

| approach | result | verdict |
|---|---|---|
| blowing/directional particles | aggressive, wind-blown feel | discarded — disconnected from the collapse |
| growing hanging particles | slow-rising sprites, high drag | adopted — matched real rock dust behaviour |

**parameters tuned:** drag ~0.8 for slow billowing; curl noise force module for natural swirling; particle lifetime 8–12s with slow fade; scale over life expands particles as they rise. at peak particle count a minor GPU drop was observed — reducing max count and compensating with larger sprites resolved it without visible quality loss.

**challenge:** without depthfade, particles produced harsh visible intersections with the cliff geometry at specific camera angles — only discovered mid-production, requiring a material fix.

## what i learnt

- **overlay blending in sequencer** is the cleanest tool for cinematic animation in ue5 — far more flexible than driving everything through the animation blueprint
- **sleep state + overlap activation** for chaos destruction gives precise narrative timing. continuous collision detection with the character controller was too unstable
- **depthfade is non-negotiable** for any particle effect touching solid geometry
- follow-through can be entirely handled by physics — the environment reacting to the action communicates scale more convincingly than further animating the character
- time dilation is a cinematic cheat that costs almost nothing and pays off enormously for exaggeration moments
