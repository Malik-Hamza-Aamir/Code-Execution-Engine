{{USER_CODE}}

if __name__ == "__main__":
    import sys, ast
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            args = ast.literal_eval(f"({line},)")
            result = {{FUNCTION_NAME}}(*args)
            print(result)
        except Exception as e:
            print("ERROR:", e, file=sys.stderr)
