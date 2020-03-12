import sys
import json
data = json.loads(sys.argv[1])

print(json.dumps(data, ensure_ascii=False))
sys.stdout.flush()
