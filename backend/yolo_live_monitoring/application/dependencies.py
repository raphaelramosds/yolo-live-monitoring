from dependency_injector import containers, providers
from yolo_live_monitoring.application.sqlite_repository import SqliteRepository


class Container(containers.DeclarativeContainer):
    sqlite_repository = providers.Singleton(SqliteRepository)


container = Container()


def get_sqlite_repository() -> SqliteRepository:
    return container.sqlite_repository()
