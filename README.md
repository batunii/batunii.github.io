# My Jekyll Site

This is a Jekyll-based project that allows for blogging and showcases various projects. It is designed to be hosted on GitHub Pages, leveraging GitHub's integrated Jekyll support.

## Project Structure

The project consists of the following key directories and files:

- **_config.yml**: Configuration settings for the Jekyll site, including site title and description.
- **_posts/**: Contains markdown files for blog posts. Each post includes front matter for metadata.
- **_projects/**: Contains markdown files for showcasing projects, each with its own metadata.
- **_layouts/**: Contains layout files that define the structure of the site and individual pages.
- **_includes/**: Contains reusable HTML snippets, such as the header.
- **_sass/**: Contains Sass stylesheets for styling the site.
- **assets/css/**: Additional stylesheets for the site.
- **index.md**: The homepage of the site, linking to blog posts and projects.
- **projects.md**: A dedicated page for showcasing projects.

## Getting Started

To set up this Jekyll site locally, follow these steps:

1. **Install Jekyll**: Make sure you have Ruby and Bundler installed. Then, install Jekyll by running:
   ```
   gem install jekyll bundler
   ```

2. **Clone the Repository**: Clone this repository to your local machine:
   ```
   git clone https://github.com/yourusername/my-jekyll-site.git
   ```

3. **Navigate to the Project Directory**:
   ```
   cd my-jekyll-site
   ```

4. **Install Dependencies**: Run Bundler to install the required gems:
   ```
   bundle install
   ```

5. **Serve the Site**: Start the Jekyll server:
   ```
   bundle exec jekyll serve
   ```

6. **View the Site**: Open your browser and go to `http://localhost:4000` to see your site in action.

## Adding Blog Posts

To add a new blog post, create a new markdown file in the `_posts` directory with the following naming convention: `YYYY-MM-DD-title.md`. Include front matter at the top of the file for metadata.

## Showcasing Projects

To showcase a new project, create a new markdown file in the `_projects` directory with front matter for the project title and description.

## Customization

Feel free to customize the styles in the `_sass/main.scss` and `assets/css/style.scss` files to match your personal branding.

## License

This project is open-source and available under the MIT License.