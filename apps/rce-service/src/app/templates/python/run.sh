#!/bin/bash
set -euo pipefail

TIMEOUT=5s
SRC_FILE="code.py"

echo "Running Python code..."

# Ensure source exists
if [ ! -f "$SRC_FILE" ]; then
  echo "Error: code.py not found."
  exit 1
fi

# Ensure testcases.txt exists
if [ ! -f "testcases.txt" ]; then
  echo "Error: testcases.txt not found."
  exit 1
fi

echo "=== Running test cases ==="
timeout "$TIMEOUT" python3 "$SRC_FILE" < "testcases.txt"
