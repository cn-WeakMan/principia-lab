"""Database lifecycle for the modular monolith.

All connections have explicit transaction ownership; handlers must use `with connect()`.
"""
from __future__ import annotations
import os
import shutil
import sqlite3
from contextlib import contextmanager
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / 'public'
DATA = Path(os.environ.get('PLAB_DATA_DIR', str(ROOT / 'data'))).resolve()
DB = DATA / 'principia.db'
SEED = ROOT / 'data' / 'seed.db'
DATA.mkdir(parents=True, exist_ok=True)
if not DB.exists():
    if not SEED.is_file():
        raise FileNotFoundError(f'Missing initial database: {SEED}')
    shutil.copyfile(SEED, DB)

@contextmanager
def connect():
    db = sqlite3.connect(DB, timeout=15)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    db.execute('PRAGMA busy_timeout=15000')
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
