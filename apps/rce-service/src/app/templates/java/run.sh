#!/bin/bash
set -e

SRC_DIR="/runner"
WORK_DIR="/tmp/build"

mkdir -p "$WORK_DIR"
cp "$SRC_DIR"/* "$WORK_DIR"/ 2>/dev/null || true
cd "$WORK_DIR"

echo "Compiling Java..."
javac Main.java

echo "=== Running test cases ==="
if [ -f testcases.txt ]; then
  echo "--- Combined Testcases ---"
  java Main < testcases.txt
fi

if [ -d tests ]; then
  for file in tests/*; do
    [ -f "$file" ] || continue
    echo "--- $(basename "$file") ---"
    java Main < "$file"
  done
fi
