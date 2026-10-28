#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -d .venv ]; then python3 -m venv .venv; fi
. .venv/bin/activate
python -m pip install -r backend/requirements.txt
export PYTHONPATH="$PWD"
exec uvicorn backend.server:app --host 127.0.0.1 --port "${PLAB_PORT:-8000}"
