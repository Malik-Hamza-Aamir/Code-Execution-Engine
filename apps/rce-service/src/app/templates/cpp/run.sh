#!/bin/bash
set -euo pipefail

TIMEOUT=5s
SRC_FILE="code.cpp"
OUT_FILE="code.out"

echo "Compiling C++ code..."

# Ensure source exists
if [ ! -f "$SRC_FILE" ]; then
  echo "Error: code.cpp not found."
  exit 1
fi

# Compile with g++
if ! g++ -std=c++17 -O2 -o "$OUT_FILE" "$SRC_FILE"; then
  echo "Compilation failed."
  exit 1
fi

echo "Compilation successful."

# Ensure testcases.txt exists
if [ ! -f "testcases.txt" ]; then
  echo "Error: testcases.txt not found."
  exit 1
fi

echo "=== Running test cases ==="
timeout "$TIMEOUT" "./$OUT_FILE" < "testcases.txt"
