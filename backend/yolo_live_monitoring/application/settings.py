from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # If some variable is not found in environment or .env, it defaults to its value inside Field
    db_sqlite_path: str = Field(
        default = None,
        validation_alias="YOLO_LIVE_MONITORING_DB_SQLITE_PATH"
    )

    cors_allow_origins: list[str] = Field(default_factory=lambda: ['*'])
    
    # Configure Pydantic to read from a .env file
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore" # Ignores other variables in the .env not defined here
    )

# Instantiate the settings to make them available across your app
settings = Settings()