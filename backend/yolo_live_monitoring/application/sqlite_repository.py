import sqlite3
from yolo_live_monitoring.application.settings import settings
from yolo_live_monitoring.application.commands import CreateConnectionCommand, UpdateConnectionCommand

class SqliteRepository:

    def __init__(self):
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

    def create_connection(self, command: CreateConnectionCommand) -> bool:
        query = """
            INSERT INTO rtsp_connnections (name, rtsp_url, description)
            VALUES (:name, :rtsp_url, :description)
        """
        try:
            with sqlite3.connect(settings.db_sqlite_path) as conn:
                cursor = conn.cursor()
                cursor.execute(query, command.model_dump())
                conn.commit()
                return True
        except sqlite3.IntegrityError:
            print(f"Failed to insert: Stream URL '{command.rtsp_url}' already exists.")
            return False
        except Exception as e:
            print(f"An unexpected error occurred while writing data: {e}")
            raise e

    def get_all_connections(self) -> list[dict]:
        with sqlite3.connect(settings.db_sqlite_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, rtsp_url, description FROM rtsp_connnections")
            return [dict(row) for row in cursor.fetchall()]

    def get_connection_by_id(self, connection_id: int) -> dict | None:
        with sqlite3.connect(settings.db_sqlite_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, name, rtsp_url, description FROM rtsp_connnections WHERE id = ?",
                (connection_id,)
            )
            row = cursor.fetchone()
            return dict(row) if row else None

    def update_connection(self, connection_id: int, command: UpdateConnectionCommand) -> bool:
        query = """
            UPDATE rtsp_connnections
            SET name = :name, rtsp_url = :rtsp_url, description = :description
            WHERE id = :id
        """
        try:
            with sqlite3.connect(settings.db_sqlite_path) as conn:
                cursor = conn.cursor()
                cursor.execute(query, {**command.model_dump(), 'id': connection_id})
                conn.commit()
                return cursor.rowcount > 0
        except sqlite3.IntegrityError:
            print(f"Failed to update: Stream URL '{command.rtsp_url}' already exists.")
            return False
        except Exception as e:
            print(f"An unexpected error occurred while updating data: {e}")
            raise e

    def delete_connection(self, connection_id: int) -> bool:
        with sqlite3.connect(settings.db_sqlite_path) as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM rtsp_connnections WHERE id = ?", (connection_id,))
            conn.commit()
            return cursor.rowcount > 0
