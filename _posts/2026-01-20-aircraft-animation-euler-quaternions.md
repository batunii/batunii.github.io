---
layout: post
title: "aircraft animation: euler angles, quaternions, and gimbal lock"
date: 2026-01-20
type: blog
tags: [opengl, animation, quaternions, glsl, cpp, graphics]
description: "implementing aircraft pitch/yaw/roll with euler angles, hitting gimbal lock, and fixing it with quaternions — plus keyframed animation with slerp."
---

this was a real-time animation assignment: animate an aircraft model with full pitch, yaw, and roll control, deliberately induce gimbal lock to demonstrate it, then switch to quaternions to fix it. everything is interactive and live-tweakable through imgui.

## euler rotation

the aircraft's orientation is built by composing three rotation matrices in Y–X–Z order:

```cpp
modelMat = glm::translate(modelMat, position);
modelMat = glm::rotate(modelMat, glm::radians(yaw),   glm::vec3(0,1,0));
modelMat = glm::rotate(modelMat, glm::radians(pitch), glm::vec3(1,0,0));
modelMat = glm::rotate(modelMat, glm::radians(roll),  glm::vec3(0,0,1));
```

keyboard controls: arrow keys for pitch/yaw, Q/E for roll. values displayed live in imgui sliders.

## gimbal lock

gimbal lock is what happens when two rotation axes become aligned. with euler angles, when pitch hits ±90°, the yaw axis and roll axis collapse into the same direction — you lose one degree of freedom. changing yaw and changing roll produce identical motion.

detection in code:

```cpp
bool isInGimbalLock() {
    return (abs(pitch - 90.0f) < 10.0f || abs(pitch + 90.0f) < 10.0f);
}
```

the demo has a dedicated animation that drives pitch to 90° and then shows you yaw and roll producing the same result. the ui highlights the state with a warning. seeing it happen live in a renderer you built is more informative than any explanation.

## quaternions

quaternions represent rotation as a 4-component number `(x, y, z, w)` — geometrically, an axis + angle. they don't suffer from gimbal lock because they represent orientation as a single entity, not three sequential rotations.

incremental rotation in quaternion mode:

```cpp
glm::quat pitchQuat = glm::angleAxis(glm::radians(rotSpeed), glm::vec3(1,0,0));
currentQuatRotation = pitchQuat * currentQuatRotation;

// convert to matrix for the shader
modelMat = modelMat * glm::mat4_cast(currentQuatRotation);
```

multiplying quaternions accumulates rotation without axis collapse. the fly-cam in most engines works this way under the hood.

## keyframed animation

keyframes define the aircraft's path: a list of `{position, rotation, time}` tuples. between keyframes, position is linearly interpolated and rotation uses either LERP or SLERP.

**LERP** — normalised linear interpolation. fast, but the angular velocity isn't constant (speed up/slows down mid-rotation):

```cpp
glm::quat result = glm::normalize(a * (1.0f - t) + b_corrected * t);
```

**SLERP** — spherical linear interpolation. travels the *great circle* between two orientations at constant angular velocity:

```cpp
float theta    = acos(cosTheta);
float sinTheta = sin(theta);
float w1 = sin((1.0f - t) * theta) / sinTheta;
float w2 = sin(t * theta) / sinTheta;
return glm::normalize(q1 * w1 + q2 * w2);
```

SLERP looks noticeably better for slow, deliberate aircraft manoeuvres. LERP is fine for fast short rotations where the non-constant speed isn't visible.

## paths and easing

several paths are implemented: linear, circular, figure-of-eight, and a gimbal-prone path. motion easing is applied to the interpolation parameter `t` to add acceleration/deceleration:

```cpp
float easeInOutQuad(float t) {
    return t < 0.5f ? 2.0f * t * t : -1.0f + (4.0f - 2.0f * t) * t;
}
```

running the same path with linear interpolation vs ease-in-out makes a surprisingly large perceptual difference — eased motion just *feels* more intentional.

## what i learnt

- gimbal lock is unintuitive until you see it happen live. the demo approach (drive into it automatically and show the ui going wrong) teaches it in 10 seconds flat
- quaternions are not scary once you stop trying to visualise them geometrically and just treat them as "rotation accumulator"
- SLERP is almost always worth it over LERP for character/vehicle animation — the constant angular velocity makes motion feel physically plausible
- catmull-rom or bezier curves for position would be the next upgrade — linear position lerp produces visible changes in speed at keyframe boundaries
