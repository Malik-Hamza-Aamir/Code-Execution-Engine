#!/bin/bash
set -e

# Path to the working directory where code.js and testcases.txt live
WORK_DIR="$(dirname "$0")"

cd "$WORK_DIR"

echo "=== Running code.js with testcases.txt ==="

# Check files
if [ ! -f code.js ]; then
  echo "ERROR: code.js not found" >&2
  exit 1
fi

if [ ! -f testcases.txt ]; then
  echo "ERROR: testcases.txt not found" >&2
  exit 1
fi

# Run with input redirection
echo "=== Executing ==="
node code.js < testcases.txt
echo "=== Done ==="
