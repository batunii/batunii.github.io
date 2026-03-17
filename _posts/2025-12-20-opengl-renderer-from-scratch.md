---
layout: post
title: "building a real-time opengl renderer from scratch"
date: 2025-12-20
type: both
tags: [opengl, renderer, glsl, cpp, graphics, pbr]
youtube: 6CFIXQ5L6bk
description: "a personal project — building a modular opengl renderer with pbr materials, normal mapping, and a skybox from the ground up."
---

after the coursework assignments, i wanted to build something that wasn't constrained by a spec sheet. this is the start of an ongoing renderer project — a clean, modular opengl 3.3 base that i can extend over time. this video is a preliminary submission showing the current state.

## what's in it so far

- pbr material system (cook-torrance, same as the earlier assignment but now cleaner and more general)
- normal mapping with tangent-space TBN, adjustable bump strength
- blinn-phong as an alternative shader (switchable at runtime)
- skybox with correct depth handling (`GL_LEQUAL`)
- imgui control panel for all material and light properties
- free-fly camera (click to capture, WASD + mouse, scroll to zoom, ESC to release)
- multiple models in scene simultaneously, each with independent transform

the window title says "RTR - Normal Maps" but this is the renderer project — the normal mapping is just the current feature under development.

## architecture decisions

i built this with reusable modules from the start:

- `Camera.hpp` — encapsulated free-fly camera, processes keyboard and mouse delta
- `Models.hpp` — assimp-based model loader with texture caching
- `Shaders.hpp` — shader program wrapper with typed setters (`setMat4`, `setVec3`, `setFloat`, `setBool`)
- `Texture.hpp` — texture loader and bind helper
- `Light.hpp` — point light with position/colour and its own draw call
- `WindowMaker.hpp` — glfw window setup boilerplate

the main loop is clean — update, build imgui frame, set uniforms, draw. no global state leaking between systems.

## the imgui panel

the panel exposes:
- light position (slider3) and colour (colour picker)
- ambient strength, specular strength, shininess
- bumpiness (0–2.0)
- normal mapping toggle
- shader selector (blinn-phong / toon)
- rotation toggle

the mouse/camera interaction is integrated cleanly with imgui — left click on an imgui window doesn't activate the fly-cam, only clicks outside the panel do.

## what's next

this renderer is a long-term project. planned additions:

- shadow mapping (directional + point)
- deferred rendering pipeline
- screen-space ambient occlusion (ssao)
- bloom post-processing
- gaussian splatting integration (longer term)
- proper asset/scene management

the goal is to understand every part of a modern renderer by building it, not by reading about it.

## what i learnt so far

- clean module boundaries from the start save enormous refactoring pain later
- the camera/imgui interaction conflict (who owns mouse input?) is a real UX problem in any interactive demo. the `io.WantCaptureMouse` check is the right solution
- texture caching in the model loader (checking `textures_loaded` before uploading) makes a noticeable difference when loading models with shared textures across meshes
- there's no substitute for just building the thing and running it
