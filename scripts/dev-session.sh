#!/usr/bin/env bash
# Jekyll metabole.beyondfacade.cloud — 개발 세션 표시 on/off
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA_FILE="$REPO_ROOT/_data/dev_session.yml"
NAME_FILE="$REPO_ROOT/.dev-session-name"

usage() {
  echo "Usage: $0 start [이름] | end"
  echo "  start  — 사이트 상단에 '현재 개발 중: 이름' 배너 표시"
  echo "  end    — 배너 숨김"
  exit 1
}

resolve_name() {
  if [[ -n "${1:-}" ]]; then
    echo "$1"
    return
  fi
  if [[ -n "${DEV_SESSION_NAME:-}" ]]; then
    echo "$DEV_SESSION_NAME"
    return
  fi
  if [[ -f "$NAME_FILE" ]]; then
    tr -d '[:space:]' < "$NAME_FILE"
    return
  fi
  echo ""
}

cmd="${1:-}"
case "$cmd" in
  start)
    NAME="$(resolve_name "${2:-}")"
    if [[ -z "$NAME" ]]; then
      echo "error: 개발자 이름이 필요합니다. 예: $0 start 이은상" >&2
      exit 1
    fi
    STARTED="$(TZ=Asia/Seoul date '+%Y-%m-%d %H:%M')"
    cat > "$DATA_FILE" <<EOF
active: true
developer: "$NAME"
started_at: "$STARTED"
EOF
    echo "개발 세션 시작: $NAME ($STARTED)"
    echo "→ $DATA_FILE 갱신됨. GitHub에 push하면 metabole.beyondfacade.cloud에 반영됩니다."
    ;;
  end)
    cat > "$DATA_FILE" <<EOF
active: false
developer: ""
started_at: ""
EOF
    echo "개발 세션 종료"
    echo "→ $DATA_FILE 갱신됨. GitHub에 push하면 metabole.beyondfacade.cloud에 반영됩니다."
    ;;
  *)
    usage
    ;;
esac
