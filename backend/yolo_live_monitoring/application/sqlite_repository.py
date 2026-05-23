import sqlite3
from yolo_live_monitoring.application.settings import settings
from yolo_live_monitoring.application.commands import CreateRTSPConnectionCommand

class SqliteRepository:
    
    def __init__(self):
        # We don't save self.conn here to avoid multi-threading crashes
        self.__migrate()
    
    def __migrate(self):
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
        
    def create_rtsp_connection(self, create_rtsp_connection_command: CreateRTSPConnectionCommand):
        data = create_rtsp_connection_command.model_dump()

        query = """
            INSERT INTO rtsp_connnections (name, rtsp_url, description)
            VALUES (:name, :rtsp_url, :description)
        """
        try:
            # Open a fresh connection dedicated solely to this execution thread
            with sqlite3.connect(settings.db_sqlite_path) as conn:
                cursor = conn.cursor()
                cursor.execute(query, data)
                conn.commit()  # Save changes permanently
                return True
                
        except sqlite3.IntegrityError:
            # This triggers if a unique constraint (like rtsp_url UNIQUE) is broken
            print(f"Failed to insert: Stream URL '{create_rtsp_connection_command.rtsp_url}' already exists.")
            return False
            
        except Exception as e:
            # Log any unexpected failures (e.g., disk full, database locked)
            print(f"An unexpected error occurred while writing data: {e}")
            raise e
                
