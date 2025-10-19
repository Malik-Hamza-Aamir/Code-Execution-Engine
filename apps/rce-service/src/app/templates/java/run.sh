#!/bin/bash
set -euo pipefail

TIMEOUT=5s
SRC_FILE="code.java"
CLASS_FILE="code"

echo "Compiling Java code..."

# Ensure source exists
if [ ! -f "$SRC_FILE" ]; then
  echo "Error: code.java not found."
  exit 1
fi

# Compile Java file
if ! javac "$SRC_FILE"; then
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
timeout "$TIMEOUT" java "$CLASS_FILE" < "testcases.txt"
