---
layout: post
title: "fabrik inverse kinematics in unreal engine 5"
date: 2026-03-05
type: both
tags: [unreal, ik, animation, cpp, real-time-animation]
youtube: qLFXAQ3URxs
description: "building a custom fabrik ik solver in ue5 c++ — multi-bone arm reaching dynamic targets, joint constraints, and spline-driven scripted animation."
---

this was an assignment for the real-time animation module at trinity: implement a multi-bone inverse kinematics system from scratch in unreal engine 5 using c++. no built-in ik nodes, no animation blueprint magic — custom solver, custom components.

## what it does

a mannequin arm with three bones (upper arm, lower arm, hand) reaches for a moving target in real time. the target moves along a spline path defined by keyframes, and the arm follows it with natural-looking constraints on every joint.

## the fabrik algorithm

fabrik (forward and backward reaching inverse kinematics) is an iterative solver. each iteration has two passes:

**backward pass** — start from the end effector (hand), place it at the target, then walk back towards the root adjusting each bone to maintain its length:

```cpp
Config.Bones[NumBones - 1].CurrentPosition = TargetPosition;
for (int32 i = NumBones - 2; i >= 0; --i) {
    FVector Direction = (Config.Bones[i].CurrentPosition - Config.Bones[i + 1].CurrentPosition).GetSafeNormal();
    Config.Bones[i].CurrentPosition = Config.Bones[i + 1].CurrentPosition + Direction * Config.Bones[i].BoneLength;
}
```

**forward pass** — fix the root in place, then walk forward repositioning bones towards the end effector:

```cpp
Config.Bones[0].CurrentPosition = RootPosition;
for (int32 i = 1; i < NumBones; ++i) {
    FVector Direction = (Config.Bones[i].CurrentPosition - Config.Bones[i - 1].CurrentPosition).GetSafeNormal();
    Config.Bones[i].CurrentPosition = Config.Bones[i - 1].CurrentPosition + Direction * Config.Bones[i - 1].BoneLength;
}
```

repeating these passes until convergence (or max iterations) produces the final joint positions. the elegance is that bone lengths are preserved exactly — no drift, no stretching.

## applying rotations to the skeletal mesh

fabrik gives you *positions*, but ue5's poseable mesh needs *rotations*. the conversion uses `FQuat::FindBetweenNormals` to compute the delta rotation between the current bone direction and the target direction:

```cpp
FQuat DeltaRot    = FQuat::FindBetweenNormals(CurrentBoneDir, TargetDir);
FQuat NewWorldQuat = DeltaRot * CurrentWorldQuat;
PoseableMesh->SetBoneRotationByName(
    Config.Bones[i].BoneName,
    NewWorldQuat.Rotator(),
    EBoneSpaces::WorldSpace
);
```

## joint constraints

without constraints, fabrik produces correct positions but can result in unnatural configurations — elbows bending backward, shoulders over-rotating. joint limits clamp each rotation to a realistic range:

- shoulder: ±90°
- elbow: constrained to forward-bending range only
- wrist: smaller range

## unreachable targets

if the target is further than the total arm length, the solver clamps it to the maximum reachable point. this prevents the arm from stretching/distorting:

```cpp
float totalLength = /* sum of all bone lengths */;
if (FVector::Dist(RootPosition, TargetPosition) > totalLength) {
    TargetPosition = RootPosition + (TargetPosition - RootPosition).GetSafeNormal() * totalLength;
}
```

## spline-driven scripted animation

the target moves along a spline path using catmull-rom interpolation between keyframes:

```cpp
FVector CatmullRomInterpolate(const FVector& P0, const FVector& P1,
                               const FVector& P2, const FVector& P3, float T) {
    float T2 = T * T, T3 = T2 * T;
    return 0.5f * (
        2.0f * P1 +
        (-P0 + P2) * T +
        (2.0f * P0 - 5.0f * P1 + 4.0f * P2 - P3) * T2 +
        (-P0 + 3.0f * P1 - 3.0f * P2 + P3) * T3
    );
}
```

catmull-rom passes through every control point (unlike bezier) which makes it easier to define exact positions the arm needs to reach. a smoothstep ease-in/out function on `T` removes the abrupt acceleration at keyframe transitions.

## modular architecture

the system is split into four components:
- `IKComponent` — manages IK solving and target updates
- `IKChainSolver` — the FABRIK algorithm itself
- `SplineAnimationComponent` — generates the moving target position
- `AAPosableCharacter` — wires everything together

this separation means the ik solver can be reused on any character by attaching `IKComponent` without touching the animation or spline code.

## what i learnt

- fabrik is a surprisingly elegant algorithm. the two-pass structure is easy to reason about and debug — you can print intermediate bone positions and see exactly where it's going
- quaternions in ue5 (`FQuat`) are the right tool everywhere rotations appear. `FindBetweenNormals` in particular is a clean way to express "rotate from this direction to that direction"
- joint constraints are harder than the solver itself. getting realistic-looking limits requires experimentation, not math
- catmull-rom is strictly better than linear lerp for spline paths in animation. the tangent continuity at control points eliminates visible direction changes
- the ik → spline broadcast pattern (spline broadcasts position, ik reads it every frame) is a clean decoupled architecture — changing the animation path doesn't require touching the ik code at all
