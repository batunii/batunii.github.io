---
title: "Getting started with OpenGL and GLSL shaders"
date: 2026-03-01
tags: [graphics, opengl, glsl]
excerpt: "A walkthrough of setting up a minimal OpenGL context and writing your first vertex and fragment shader from scratch."
---

## the setup

Getting a triangle on screen is the "hello, world" of graphics programming...

```glsl
// vertex shader
#version 330 core
layout (location = 0) in vec3 aPos;

void main() {
  gl_Position = vec4(aPos, 1.0);
}
```

More content here. Replace this file with your own posts — just drop `.md` files into `_posts/` with the filename format `YYYY-MM-DD-title.md`.
