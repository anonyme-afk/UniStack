import datetime
    def render_latest_posts():
      posts = sql("SELECT * FROM posts ORDER BY published_at DESC LIMIT 5")
      if not posts:
        # Initial seeding if empty
        seed_data()
        posts = sql("SELECT * FROM posts ORDER BY published_at DESC LIMIT 5")
      html = ""
      for p in posts:
        html += f"""
        <article class="post-card">
          <h2>{p['title']}</h2>
          <div class="meta">By {p['author']} on {p['published_at']}</div>
          <p>{p['content'][:150]}...</p>
          <a href="/post/{p['slug']}" class="read-more">Read Full Article</a>
        </article>
        """
      return html
    def seed_data():
      now = datetime.datetime.now().strftime("%Y-%m-%d")
      sql("INSERT INTO posts (title, slug, content, published_at) VALUES (?, ?, ?, ?)",
          ["The Rise of UniStack", "rise-of-unistack", "UniStack is revolutionizing how we build web apps by collapsing the stack into a single unified language...", now])
      sql("INSERT INTO posts (title, slug, content, published_at) VALUES (?, ?, ?, ?)",
          ["Why Single-File Apps Matter", "single-file-apps", "Complexity is the enemy of software development. By keeping everything in one place, we reduce mental overhead...", now])