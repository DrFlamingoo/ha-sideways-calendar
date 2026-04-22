#!/usr/bin/env bash
# Populate a local HA instance with sample calendars and events for testing
# the sideways-calendar-card.
#
# Usage:
#   ./scripts/sample-day.sh [HA_URL] [TOKEN]
#
# Defaults: http://localhost:8123, reads TOKEN from env or prompts.

set -euo pipefail

HA_URL="${1:-http://localhost:8123}"
TOKEN="${2:-${HA_TOKEN:-}}"

if [[ -z "$TOKEN" ]]; then
  echo "Usage: $0 [HA_URL] TOKEN"
  echo "  or set HA_TOKEN env var"
  exit 1
fi

AUTH="Authorization: Bearer $TOKEN"
CT="Content-Type: application/json"

api() {
  local method="$1" path="$2"
  shift 2
  curl -s -X "$method" "$HA_URL/api/$path" -H "$AUTH" -H "$CT" "$@"
}

# Today's date in YYYY-MM-DD
TODAY=$(date +%F)

echo "=== Creating local calendars ==="

create_calendar() {
  local name="$1"
  echo -n "  $name ... "
  # Initiate config flow
  local flow
  flow=$(api POST "config/config_entries/flow" \
    -d "{\"handler\":\"local_calendar\",\"show_advanced_options\":false}")
  local flow_id
  flow_id=$(echo "$flow" | python3 -c "import sys,json; print(json.load(sys.stdin)['flow_id'])")
  # Complete flow with calendar name
  local result
  result=$(api POST "config/config_entries/flow/$flow_id" \
    -d "{\"calendar_name\":\"$name\"}")
  echo "done"
}

# Check if calendars already exist
existing=$(api GET "states" | python3 -c "
import sys, json
states = json.load(sys.stdin)
cals = [s['entity_id'] for s in states if s['entity_id'].startswith('calendar.')]
print('\n'.join(cals))
")

for cal in alice_personal alice_work bob_personal bob_work carol_personal dave_personal; do
  if echo "$existing" | grep -q "calendar.${cal}"; then
    echo "  calendar.$cal already exists, skipping"
  else
    create_calendar "$cal"
  fi
done

echo ""
echo "=== Creating events for $TODAY ==="

create_event() {
  local entity="$1" summary="$2" start="$3" end="$4"
  echo "  [$entity] $summary  $start → $end"
  api POST "services/calendar/create_event" \
    -d "{
      \"entity_id\": \"calendar.$entity\",
      \"summary\": \"$summary\",
      \"start_date_time\": \"${TODAY}T${start}:00\",
      \"end_date_time\": \"${TODAY}T${end}:00\"
    }" > /dev/null
}

# ── Alice (Slot A) ──────────────────────────────────────────────
# Personal
create_event alice_personal "Morning yoga"         "06:30" "07:15"
create_event alice_personal "Work"                 "08:00" "17:00"
create_event alice_personal "Team lunch"           "12:00" "13:00"
create_event alice_personal "Dentist"              "15:30" "16:30"
create_event alice_personal "Dinner with friends"  "19:00" "21:00"

# Work (sub-events inside the "Work" envelope)
create_event alice_work "Sprint planning"          "09:00" "10:00"
create_event alice_work "1:1 with manager"         "10:30" "11:00"
create_event alice_work "Design review"            "14:00" "15:00"

# ── Bob (Slot B) ────────────────────────────────────────────────
# Personal
create_event bob_personal "Work"                   "09:00" "18:00"
create_event bob_personal "Team lunch"             "12:00" "13:00"   # shared with Alice
create_event bob_personal "Gym"                    "18:30" "19:30"
create_event bob_personal "Movie night"            "20:00" "22:30"

# Work (sub-events inside Bob's "Work" envelope)
create_event bob_work "Standup"                    "09:30" "09:45"
create_event bob_work "Architecture meeting"       "11:00" "12:00"
create_event bob_work "Code review"                "15:00" "16:00"
create_event bob_work "Retro"                      "16:00" "17:00"

# ── Carol (Slot C) ──────────────────────────────────────────────
create_event carol_personal "Doctor appointment"   "08:00" "09:00"
create_event carol_personal "Project meeting"      "10:00" "11:30"
create_event carol_personal "Lunch"                "12:30" "13:30"
create_event carol_personal "Movie night"          "20:00" "22:30"   # shared with Bob + Dave

# ── Dave (Slot D) ───────────────────────────────────────────────
create_event dave_personal "Project meeting"       "10:00" "11:30"   # shared with Carol
create_event dave_personal "Errands"               "13:00" "14:30"
create_event dave_personal "Movie night"           "20:00" "22:30"   # shared with Bob + Carol
create_event dave_personal "Late call"             "23:00" "23:45"

echo ""
echo "=== Done ==="
echo ""
echo "Suggested card config (YAML):"
echo ""
cat <<'EOF'
type: custom:sideways-calendar-card
calendarA:
  - entity: calendar.alice_personal
  - entity: calendar.alice_work
    work: true
calendarB:
  - entity: calendar.bob_personal
  - entity: calendar.bob_work
    work: true
calendarC:
  - entity: calendar.carol_personal
calendarD:
  - entity: calendar.dave_personal
nameA: Alice
nameB: Bob
nameC: Carol
nameD: Dave
colorScheme: colorblind
workStyle: dimmed
inlineLabels: true
EOF
