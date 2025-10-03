#!/bin/bash
set -e

SRC_DIR="/runner"
WORK_DIR="/tmp/build"

mkdir -p "$WORK_DIR"
cp "$SRC_DIR"/* "$WORK_DIR"/ 2>/dev/null || true
cd "$WORK_DIR"

echo "=== Running test cases ==="

# Run with combined testcases.txt (if present)
if [ -f testcases.txt ]; then
  echo "--- Combined Testcases ---"
  python3 code.py < testcases.txt
fi

# Run individually for each file inside tests/ (if present)
if [ -d tests ]; then
  for file in tests/*; do
    [ -f "$file" ] || continue
    echo "--- $(basename "$file") ---"
    python3 code.py < "$file"
  done
fi
