import sqlite3

def migrate():
    conn = sqlite3.connect('airsense.db')
    cursor = conn.cursor()
    try:
        cursor.execute("PRAGMA table_info(users)")
        cols = [c[1] for c in cursor.fetchall()]
        if "home_location" not in cols:
            cursor.execute("ALTER TABLE users ADD COLUMN home_location TEXT DEFAULT 'Pune'")
            conn.commit()
            print("Successfully added home_location column to users table.")
        else:
            print("home_location column already exists.")
    except Exception as e:
        print(f"Migration error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
