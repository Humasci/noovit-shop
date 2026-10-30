#!/bin/bash
for pat in next-server postgrest fake-stripe db-server.mjs; do
  for pid in $(pgrep -f "$pat"); do [ "$pid" != "$$" ] && kill "$pid" 2>/dev/null; done
done
echo stopped
