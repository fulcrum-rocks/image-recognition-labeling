import sys
import json

data = {"a": 1, "b": 2}

print(json.dumps(data, ensure_ascii=False))
sys.stdout.flush()
