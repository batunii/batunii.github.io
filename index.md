---
layout: default
title: Home
---

<div class="hero">
  <h1>Welcome to <span class="highlight">Batunii's Portfolio</span></h1>
  <p class="subtitle">Showcasing my projects and sharing my thoughts.</p>
</div>

<section class="projects">
  <h2>Projects</h2>
  <ul>
    <li><a href="https://projectone.example.com" target="_blank">Project One</a></li>
    <li><a href="https://projecttwo.example.com" target="_blank">Project Two</a></li>
    <li><a href="https://projectthree.example.com" target="_blank">Project Three</a></li>
  </ul>
</section>

<section class="blog-preview">
  <h2>Latest Blog Posts</h2>
  <ul>
    {% for post in site.posts limit:3 %}
      <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
        <span class="date">{{ post.date | date: "%b %-d, %Y" }}</span>
      </li>
    {% endfor %}
  </ul>
  <a class="blog-link" href="/blog">See all blog posts &rarr;</a>
</section>

<style>
.hero {
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  color: #fff;
  padding: 2rem 1rem;
  text-align: center;
  border-radius: 10px;
  margin-bottom: 2rem;
}
.highlight {
  color: #ffd700;
}
.subtitle {
  font-size: 1.2rem;
  margin-top: 0.5rem;
}
.projects, .blog-preview {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}
.projects ul, .blog-preview ul {
  list-style: none;
  padding: 0;
}
.projects li, .blog-preview li {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}
.projects a, .blog-preview a {
  color: #2575fc;
  text-decoration: none;
  transition: color 0.2s;
}
.projects a:hover, .blog-preview a:hover {
  color: #6a11cb;
  text-decoration: underline;
}
.date {
  color: #888;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}
.blog-link {
  display: inline-block;
  margin-top: 1rem;
  color: #fff;
  background: #2575fc;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  transition: background 0.2s;
}
.blog-link:hover {
  background: #6a11cb;
}
</style>