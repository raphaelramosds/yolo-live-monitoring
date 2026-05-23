import sqlite3
from yolo_live_monitoring.application.settings import settings

class SqliteRepository:
    
    def __init__(self):
        # We don't save self.conn here to avoid multi-threading crashes
        pass
    
    def migrate(self):
        print(f'Will try to connect to: {settings.db_sqlite_path}...')
        try:
            with sqlite3.connect(settings.db_sqlite_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS rtsp_connnections (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        rtsp_url TEXT NOT NULL UNIQUE,
                        description TEXT
                    )
                """)
                conn.commit()
                print('Connection established and tables created.')
        except Exception as e:
            print(f'Could not initialize connection: {e}')
            raise e