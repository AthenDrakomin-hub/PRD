#!/bin/bash
# tests/plugins/tor.test.sh
echo "Testing tor-anonymous plugin..."
if [ ! -f "simulations/tor-anonymous/docker-compose.yml" ]; then
  echo "FAIL: docker-compose.yml not found"
  exit 1
fi
python3 -c 'import yaml; yaml.safe_load(open("simulations/tor-anonymous/docker-compose.yml"))' > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "PASS"
else
  echo "FAIL: Invalid docker-compose syntax"
  exit 1
fi
