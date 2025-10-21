from decouple import config


class Settings:
    # Database
    DATABASE_URL: str = config("DATABASE_URL", default="sqlite:///./auth.db")

    # JWT Settings
    SECRET_KEY: str = config("SECRET_KEY", default="your-super-secret-key-change-this-in-production")
    ALGORITHM: str = config("ALGORITHM", default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30, cast=int)
    REFRESH_TOKEN_EXPIRE_DAYS: int = config("REFRESH_TOKEN_EXPIRE_DAYS", default=7, cast=int)
    
    # Application Settings
    APP_NAME: str = config("APP_NAME", default="AuthKeyHub")
    DEBUG: bool = config("DEBUG", default=False, cast=bool)

    # Judge settings
    JUDGE_IMAGE: str = config("JUDGE_IMAGE", default="judge-python:1.0")
    PER_TEST_TIMEOUT_SEC: int = config("PER_TEST_TIMEOUT_SEC", default=2, cast=int)
    MEM_LIMIT: str = config("MEM_LIMIT", default="256m")
    NANO_CPUS: int = config("NANO_CPUS", default=500_000_000, cast=int)
    PIDS_LIMIT: int = config("PIDS_LIMIT", default=64, cast=int)
    WORKDIR_HOST: str = config("WORKDIR_HOST", default="/tmp/judge-workdir")


settings = Settings()
