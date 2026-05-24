
import os, yaml, pathlib

DEFAULT_TZ = os.getenv("RW_TIMEZONE", "Asia/Dhaka")
DEFAULT_DB = os.getenv("RW_DB_PATH", str(pathlib.Path(__file__).resolve().parent.parent / "rumorwatch.db"))

def load_yaml(path: str):
    p = pathlib.Path(path)
    if not p.exists():
        return None
    with open(p, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def load_sources(path: str = None):
    if path is None:
        path = str(pathlib.Path(__file__).with_name("sources.yaml"))
    data = load_yaml(path)
    if not data:
        return {"sources": []}
    return data

def load_signals(path: str = None):
    if path is None:
        path = str(pathlib.Path(__file__).with_name("signals.yaml"))
    data = load_yaml(path)
    if not data:
        return {"signals": []}
    return data

def env_email_from():
    return os.getenv("SMTP_FROM", "Deal Rumor Tracker <no-reply@example.com>")

def smtp_config():
    return {
        "host": os.getenv("SMTP_HOST", ""),
        "port": int(os.getenv("SMTP_PORT", "587")),
        "user": os.getenv("SMTP_USER", ""),
        "password": os.getenv("SMTP_PASS", ""),
        "starttls": os.getenv("SMTP_STARTTLS", "1") != "0",
    }
