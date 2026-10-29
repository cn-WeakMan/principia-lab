#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# 默认仅供可信局域网使用；设 PLAB_HOST=127.0.0.1 可恢复仅本机模式。
export PLAB_HOST="${PLAB_HOST:-0.0.0.0}"
export PLAB_PORT="${PLAB_PORT:-8000}"

# 初次启动时创建管理员令牌，后续保持不变。切勿放入 Git 或对外分享。
TOKEN_FILE=".plab-admin-token"
if [ -z "${PLAB_ADMIN_TOKEN:-}" ]; then
    if [ ! -s "$TOKEN_FILE" ]; then
        (umask 077; python3 -c 'import secrets; print(secrets.token_urlsafe(32))' > "$TOKEN_FILE")
    fi
    export PLAB_ADMIN_TOKEN="$(cat "$TOKEN_FILE")"
fi

if [ ! -f .venv/bin/python ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
export PYTHONPATH="$PWD"

printf '\nPrincipia Lab 正在启动\n'
printf '本机访问: http://127.0.0.1:%s\n' "$PLAB_PORT"
printf '其他设备: http://<运行本程序的电脑局域网IP>:%s\n' "$PLAB_PORT"
printf '后台地址: http://<运行本程序的电脑局域网IP>:%s/database\n' "$PLAB_PORT"
if [ "${PLAB_UNSAFE_LAN_ADMIN:-0}" = "1" ]; then
    printf '警告：局域网后台已关闭令牌校验，同网络设备可编辑数据库！\n'
else
    printf '管理员令牌（远程编辑使用）: %s\n' "$PLAB_ADMIN_TOKEN"
fi
printf '注意：仅在可信的家庭/工作局域网开放，不要在路由器上做公网端口映射。\n\n'
exec python -m uvicorn backend.server:app --host "$PLAB_HOST" --port "$PLAB_PORT"
