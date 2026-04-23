#!/bin/bash
# tests/plugins/suricata.test.sh
echo "Testing suricata-ids plugin..."
if [ ! -f "simulations/suricata-ids/docker-compose.yml" ]; then
  echo "FAIL: docker-compose.yml not found"
  exit 1
fi
python3 -c 'import yaml; yaml.safe_load(open("simulations/suricata-ids/docker-compose.yml"))' > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "PASS"
else
  echo "FAIL: Invalid docker-compose syntax"
  exit 1
fi
