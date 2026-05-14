import datetime
    def get_tasks():
      # Accessing the auto-generated SQL binding
      return sql("SELECT * FROM tasks ORDER BY id DESC")
    def add_task(title):
      if not title:
        return {"ok": False, "error": "Title is required"}
      now = datetime.datetime.now().isoformat()
      sql("INSERT INTO tasks (title, created_at) VALUES (?, ?)", [title, now])
      return {"ok": True}
    def toggle_task(id, completed):
      sql("UPDATE tasks SET completed = ? WHERE id = ?", [completed, id])
      return {"ok": True}