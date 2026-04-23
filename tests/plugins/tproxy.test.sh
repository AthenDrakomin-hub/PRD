#!/bin/bash
# tests/plugins/tproxy.test.sh
echo "Testing tproxy-concealment plugin existence and syntax..."
if [ ! -f "simulations/tproxy-concealment/docker-compose.yml" ]; then
  echo "FAIL: docker-compose.yml not found"
  exit 1
fi
# Ignore docker absence in CI, just check if file exists and has valid yaml format
python3 -c 'import yaml; yaml.safe_load(open("simulations/tproxy-concealment/docker-compose.yml"))' > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "PASS"
else
  echo "FAIL: Invalid docker-compose syntax"
  exit 1
fi