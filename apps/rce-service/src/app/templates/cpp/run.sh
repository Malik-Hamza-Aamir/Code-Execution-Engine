#!/bin/bash
set -e

SRC_DIR="/runner"
WORK_DIR="/tmp/build"

mkdir -p "$WORK_DIR"
cp "$SRC_DIR"/* "$WORK_DIR"/ 2>/dev/null || true
cd "$WORK_DIR"

echo "Compiling C++..."
g++ -O2 -std=c++17 code.cpp -o a.out

echo "=== Running test cases ==="
if [ -f testcases.txt ]; then
  echo "--- Combined Testcases ---"
  ./a.out < testcases.txt
fi

if [ -d tests ]; then
  for file in tests/*; do
    [ -f "$file" ] || continue
    echo "--- $(basename "$file") ---"
    ./a.out < "$file"
  done
fi
