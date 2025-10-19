#!/bin/bash
set -euo pipefail

TIMEOUT=5s
MAIN_FILE="code.js"

echo "Running JavaScript code..."

# Ensure code.js exists
if [ ! -f "$MAIN_FILE" ]; then
  echo "Error: code.js not found."
  exit 1
fi

# Ensure testcases.txt exists
if [ ! -f "testcases.txt" ]; then
  echo "Error: testcases.txt not found."
  exit 1
fi

echo "=== Running test cases ==="
timeout "$TIMEOUT" node "$MAIN_FILE" < "testcases.txt"
