#!/bin/bash
# =============================================================================
# backup.sh — Remote Backup Script
# Dumps MongoDB + Redis data and transfers to Windows backup server
# Backup server IPs: 103.117.15.80 | 103.172.252.129
# Destination: C:/Users/psibo/Backups/{SERVER_IP}/{SERVER_IP}-{DATE}.tar.gz
# =============================================================================

set -euo pipefail

# ─── CONFIGURATION ────────────────────────────────────────────────────────────

BACKUP_IPS=("103.117.15.80" "103.172.252.129")   # Possible backup server IPs
SSH_USER="psibo"                                   # Windows SSH username
SSH_PORT=22                                        # SSH port (adjust if needed)
SSH_KEY="$HOME/.ssh/backup_key"                    # Path to your SSH private key
SSH_TIMEOUT=10                                     # Seconds before SSH probe times out

# Source server identity (this machine's IP, used as folder/file name)
SERVER_IP=$(hostname -I | awk '{print $1}')        # Primary LAN IP
DATE=$(date +"%Y-%m-%d")                           # e.g. 2026-06-01

# Windows destination base (forward slashes work fine over SFTP/SCP/rsync)
WIN_BASE="C:/Users/psibo/Backups"
DEST_DIR="${WIN_BASE}/${SERVER_IP}"
ARCHIVE_NAME="${SERVER_IP}-${DATE}.tar.gz"
DEST_PATH="${DEST_DIR}/${ARCHIVE_NAME}"

# Local staging area (temp dir, cleaned up at exit)
STAGING=$(mktemp -d /tmp/backup_staging.XXXXXX)
DUMP_DIR="${STAGING}/dump"

# ─── LOGGING ──────────────────────────────────────────────────────────────────

LOG_FILE="/var/log/backup_to_windows.log"
log()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]  $*" | tee -a "$LOG_FILE"; }
warn() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN]  $*" | tee -a "$LOG_FILE"; }
fail() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $*" | tee -a "$LOG_FILE"; exit 1; }

# ─── CLEANUP TRAP ─────────────────────────────────────────────────────────────

cleanup() {
    log "Cleaning up staging directory: $STAGING"
    rm -rf "$STAGING"
}
trap cleanup EXIT

# ─── STEP 1: DETECT REACHABLE BACKUP SERVER ───────────────────────────────────

log "======================================================"
log "Starting backup — SOURCE: $SERVER_IP  DATE: $DATE"
log "======================================================"

BACKUP_TARGET=""

for ip in "${BACKUP_IPS[@]}"; do
    log "Probing backup server at $ip ..."
    if ssh -i "$SSH_KEY" \
           -p "$SSH_PORT" \
           -o ConnectTimeout="$SSH_TIMEOUT" \
           -o StrictHostKeyChecking=no \
           -o BatchMode=yes \
           "${SSH_USER}@${ip}" "echo ok" &>/dev/null; then
        log "✔ Backup server reachable at $ip"
        BACKUP_TARGET="$ip"
        break
    else
        warn "✘ $ip not reachable — trying next IP..."
    fi
done

[[ -z "$BACKUP_TARGET" ]] && fail "No backup server reachable. Checked: ${BACKUP_IPS[*]}"

# ─── STEP 2: CREATE STAGING DIRECTORIES ───────────────────────────────────────

log "Creating local staging structure in $STAGING"
mkdir -p \
    "${DUMP_DIR}/mongodb" \
    "${DUMP_DIR}/redis" \
    "${DUMP_DIR}/configs" \
    "${DUMP_DIR}/logs"

# ─── STEP 3: DUMP MONGODB ─────────────────────────────────────────────────────

log "Dumping MongoDB..."

if command -v mongodump &>/dev/null; then
    # --oplog is only valid on replica sets; omitted here for standalone instances.
    # Add --uri="mongodb://user:pass@host:port" if auth is enabled.
    mongodump \
        --out="${DUMP_DIR}/mongodb" \
        --gzip \
        2>>"$LOG_FILE" \
    && log "MongoDB dump completed." \
    || warn "MongoDB dump encountered errors (check $LOG_FILE)."
else
    warn "mongodump not found — skipping MongoDB dump."
fi

# ─── STEP 4: DUMP REDIS ───────────────────────────────────────────────────────

log "Dumping Redis..."

REDIS_RDB_DEFAULT="/var/lib/redis/dump.rdb"

# redis-cli may live outside PATH on some installs
REDIS_CLI=$(command -v redis-cli 2>/dev/null \
    || ls /usr/bin/redis-cli /usr/local/bin/redis-cli /opt/redis/bin/redis-cli 2>/dev/null | head -1 \
    || echo "")

if [[ -n "$REDIS_CLI" ]]; then
    # Trigger a synchronous BGSAVE and wait for it
    $REDIS_CLI BGSAVE 2>>"$LOG_FILE"
    log "Waiting for Redis BGSAVE to complete..."
    for i in {1..30}; do
        STATUS=$($REDIS_CLI LASTSAVE 2>/dev/null)
        sleep 2
        NEW_STATUS=$($REDIS_CLI LASTSAVE 2>/dev/null)
        [[ "$NEW_STATUS" != "$STATUS" ]] && break
    done

    # Find and copy the RDB file
    REDIS_RDB=$($REDIS_CLI CONFIG GET dir 2>/dev/null | tail -1)
    REDIS_RDB_FILE=$($REDIS_CLI CONFIG GET dbfilename 2>/dev/null | tail -1)
    REDIS_RDB_PATH="${REDIS_RDB}/${REDIS_RDB_FILE}"

    if [[ -f "$REDIS_RDB_PATH" ]]; then
        cp "$REDIS_RDB_PATH" "${DUMP_DIR}/redis/dump.rdb"
        log "Redis RDB copied from $REDIS_RDB_PATH"
    elif [[ -f "$REDIS_RDB_DEFAULT" ]]; then
        cp "$REDIS_RDB_DEFAULT" "${DUMP_DIR}/redis/dump.rdb"
        log "Redis RDB copied from default path."
    else
        warn "Redis RDB file not found — skipping Redis dump."
    fi

    # Also dump AOF if present
    REDIS_AOF="${REDIS_RDB}/appendonly.aof"
    if [[ -f "$REDIS_AOF" ]]; then
        cp "$REDIS_AOF" "${DUMP_DIR}/redis/appendonly.aof"
        log "Redis AOF file copied."
    fi
else
    warn "redis-cli not found in PATH or common locations — skipping Redis dump."
fi

# ─── STEP 5: COLLECT CONFIGS & KEY LOGS ───────────────────────────────────────

log "Collecting config snapshots..."

# System info
uname -a                          > "${DUMP_DIR}/configs/uname.txt"   2>/dev/null || true
df -h                             > "${DUMP_DIR}/configs/disk.txt"    2>/dev/null || true
free -h                           > "${DUMP_DIR}/configs/memory.txt"  2>/dev/null || true
ps aux --sort=-%cpu | head -30    > "${DUMP_DIR}/configs/processes.txt" 2>/dev/null || true
crontab -l                        > "${DUMP_DIR}/configs/crontab.txt" 2>/dev/null || true

# MongoDB config (if exists)
[[ -f /etc/mongod.conf ]] && cp /etc/mongod.conf "${DUMP_DIR}/configs/mongod.conf"

# Redis config (if exists)
[[ -f /etc/redis/redis.conf ]] && cp /etc/redis/redis.conf "${DUMP_DIR}/configs/redis.conf"

# Nginx/Apache config dirs (if exist)
[[ -d /etc/nginx ]]  && cp -r /etc/nginx  "${DUMP_DIR}/configs/nginx"  2>/dev/null || true
[[ -d /etc/apache2 ]] && cp -r /etc/apache2 "${DUMP_DIR}/configs/apache2" 2>/dev/null || true

# Recent syslog excerpt
journalctl -n 500 --no-pager > "${DUMP_DIR}/logs/syslog_recent.txt" 2>/dev/null || \
    tail -500 /var/log/syslog > "${DUMP_DIR}/logs/syslog_recent.txt" 2>/dev/null || true

log "Config and log collection done."

# ─── STEP 6: WRITE MANIFEST ───────────────────────────────────────────────────

cat > "${DUMP_DIR}/MANIFEST.txt" <<EOF
============================
BACKUP MANIFEST
============================
Source Server IP : $SERVER_IP
Backup Date      : $DATE
Timestamp        : $(date '+%Y-%m-%d %H:%M:%S %Z')
Backup Target    : $BACKUP_TARGET
Archive Name     : $ARCHIVE_NAME

Contents:
  mongodb/   — mongodump output (gzip compressed)
  redis/     — Redis RDB + AOF snapshot
  configs/   — System & service configs, disk/memory/process info
  logs/      — Recent system logs

MongoDB version  : $(mongod --version 2>/dev/null | head -1 || echo "N/A")
Redis version    : $(redis-server --version 2>/dev/null | head -1 || echo "N/A")
Hostname         : $(hostname)
Kernel           : $(uname -r)
============================
EOF

log "Manifest written."

# ─── STEP 7: CREATE TAR ARCHIVE ───────────────────────────────────────────────

ARCHIVE_PATH="${STAGING}/${ARCHIVE_NAME}"
log "Creating archive: $ARCHIVE_PATH"

tar -czf "$ARCHIVE_PATH" -C "$STAGING" dump/ \
    2>>"$LOG_FILE" \
    && log "Archive created ($(du -sh "$ARCHIVE_PATH" | cut -f1))." \
    || fail "Failed to create tar archive."

# ─── STEP 8: CREATE REMOTE DIRECTORY & TRANSFER ───────────────────────────────

log "Creating remote directory on $BACKUP_TARGET: $DEST_DIR"

# Windows OpenSSH uses PowerShell — mkdir -Force works cross-platform
ssh -i "$SSH_KEY" \
    -p "$SSH_PORT" \
    -o StrictHostKeyChecking=no \
    -o BatchMode=yes \
    "${SSH_USER}@${BACKUP_TARGET}" \
    "powershell -Command \"New-Item -ItemType Directory -Force -Path '${DEST_DIR}' | Out-Null\"" \
    2>>"$LOG_FILE" \
    && log "Remote directory ready." \
    || fail "Could not create remote directory $DEST_DIR"

log "Transferring archive to $BACKUP_TARGET:${DEST_PATH} ..."

scp -i "$SSH_KEY" \
    -P "$SSH_PORT" \
    -o StrictHostKeyChecking=no \
    -o BatchMode=yes \
    "$ARCHIVE_PATH" \
    "${SSH_USER}@${BACKUP_TARGET}:${DEST_PATH}" \
    2>>"$LOG_FILE" \
    && log "✔ Transfer complete: ${DEST_PATH}" \
    || fail "SCP transfer failed."

# ─── STEP 9: VERIFY REMOTE FILE ───────────────────────────────────────────────

log "Verifying remote file..."

# PowerShell on Windows returns size with \r\n — strip all whitespace/CR before comparing
REMOTE_SIZE_RAW=$(ssh -i "$SSH_KEY" \
    -p "$SSH_PORT" \
    -o StrictHostKeyChecking=no \
    -o BatchMode=yes \
    "${SSH_USER}@${BACKUP_TARGET}" \
    "powershell -Command \"(Get-Item '${DEST_PATH}').Length\"" 2>/dev/null || echo "0")

REMOTE_SIZE=$(echo "$REMOTE_SIZE_RAW" | tr -d '[:space:]\r\n')
REMOTE_SIZE="${REMOTE_SIZE:-0}"

LOCAL_SIZE=$(stat -c%s "$ARCHIVE_PATH" 2>/dev/null || stat -f%z "$ARCHIVE_PATH")

if [[ "$REMOTE_SIZE" -eq "$LOCAL_SIZE" ]]; then
    log "✔ File size verified: ${LOCAL_SIZE} bytes"
else
    warn "Size mismatch — local: ${LOCAL_SIZE}B  remote: ${REMOTE_SIZE}B (transfer may still be ok)"
fi

# ─── STEP 10: OPTIONAL — PRUNE OLD BACKUPS ON REMOTE (keep last 7 days) ───────

log "Pruning backups older than 7 days on $BACKUP_TARGET ..."

ssh -i "$SSH_KEY" \
    -p "$SSH_PORT" \
    -o StrictHostKeyChecking=no \
    -o BatchMode=yes \
    "${SSH_USER}@${BACKUP_TARGET}" \
    "powershell -Command \"
        \$cutoff = (Get-Date).AddDays(-7);
        Get-ChildItem -Path '${DEST_DIR}' -Filter '*.tar.gz' |
        Where-Object { \$_.LastWriteTime -lt \$cutoff } |
        Remove-Item -Force
    \"" 2>>"$LOG_FILE" \
    && log "Old backups pruned." \
    || warn "Pruning step failed (non-fatal)."

# ─── DONE ─────────────────────────────────────────────────────────────────────

log "======================================================"
log "✔ Backup SUCCESSFUL"
log "  Archive : $ARCHIVE_NAME"
log "  Server  : $BACKUP_TARGET"
log "  Path    : $DEST_PATH"
log "======================================================"