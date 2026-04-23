# KForge Arsenal Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the KForge SaaS plugin arsenal by extracting 3 high-value defense mechanisms (TPROXY, IDS/IPS, Tor Anonymous Proxy) from the knowledge base and turning them into deployable Docker plugins (skills).

**Architecture:** Each plugin will reside in the `simulations/` directory as an independent Docker Compose project. The `@kforge/core` engine will execute these projects by injecting dynamic environment variables based on the `KForgeMembershipDSL`. We will also update the frontend node options in `apps/admin` and the knowledge base mapping in `apps/academy`.

**Tech Stack:** Docker Compose, iptables (TPROXY), Suricata (IDS), Tor (Anonymous Network), React Flow (Frontend UI).

---

### Task 1: Create the TPROXY (Transparent Proxy) Plugin

**Files:**
- Create: `simulations/tproxy-concealment/docker-compose.yml`
- Create: `simulations/tproxy-concealment/start.sh`

- [ ] **Step 1: Write the failing test**
Create a test script `tests/plugins/tproxy.test.sh` to simulate pulling up the plugin.
```bash
#!/bin/bash
# tests/plugins/tproxy.test.sh
echo "Testing tproxy-concealment plugin existence and syntax..."
if [ ! -f "simulations/tproxy-concealment/docker-compose.yml" ]; then
  echo "FAIL: docker-compose.yml not found"
  exit 1
fi
docker-compose -f simulations/tproxy-concealment/docker-compose.yml config > /dev/null
if [ $? -eq 0 ]; then
  echo "PASS"
else
  echo "FAIL: Invalid docker-compose syntax"
  exit 1
fi
```

- [ ] **Step 2: Run test to verify it fails**
Run: `chmod +x tests/plugins/tproxy.test.sh && ./tests/plugins/tproxy.test.sh`
Expected: FAIL with "docker-compose.yml not found"

- [ ] **Step 3: Write minimal implementation**
Create `simulations/tproxy-concealment/docker-compose.yml`:
```yaml
version: '3.8'
services:
  tproxy-shield:
    image: dreamacro/clash
    container_name: kforge-tproxy-${KFORGE_NODE_ID:-default}
    cap_add:
      - NET_ADMIN
    network_mode: "host"
    environment:
      - PROXY_SERVER=${PROXY_SERVER:-1.1.1.1}
      - PROXY_PORT=${PROXY_PORT:-1080}
    volumes:
      - ./start.sh:/start.sh
    entrypoint: ["/bin/sh", "/start.sh"]
```
Create `simulations/tproxy-concealment/start.sh`:
```bash
#!/bin/sh
echo "Initializing Transparent Proxy..."
echo "1" > /proc/sys/net/ipv4/ip_forward
# Setup iptables rules for TPROXY
iptables -t mangle -N DIVERT || true
iptables -t mangle -A DIVERT -j MARK --set-mark 1
iptables -t mangle -A DIVERT -j ACCEPT
iptables -t mangle -I PREROUTING -p tcp -m socket -j DIVERT
iptables -t mangle -A PREROUTING -p tcp -j TPROXY --on-port 7890 --tproxy-mark 0x1/0x1
echo "TPROXY Rules Applied."
# Start Clash or any underlying engine
/clash
```

- [ ] **Step 4: Run test to verify it passes**
Run: `./tests/plugins/tproxy.test.sh`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add tests/plugins/tproxy.test.sh simulations/tproxy-concealment/
git commit -m "feat(plugins): add TPROXY concealment shield plugin"
```

### Task 2: Create the Suricata IDS/IPS Plugin

**Files:**
- Create: `simulations/suricata-ids/docker-compose.yml`
- Create: `simulations/suricata-ids/suricata.yaml`

- [ ] **Step 1: Write the failing test**
Create a test script `tests/plugins/suricata.test.sh`:
```bash
#!/bin/bash
echo "Testing suricata-ids plugin..."
if [ ! -f "simulations/suricata-ids/docker-compose.yml" ]; then
  echo "FAIL: docker-compose.yml not found"
  exit 1
fi
docker-compose -f simulations/suricata-ids/docker-compose.yml config > /dev/null
if [ $? -eq 0 ]; then
  echo "PASS"
else
  echo "FAIL: Invalid docker-compose syntax"
  exit 1
fi
```

- [ ] **Step 2: Run test to verify it fails**
Run: `chmod +x tests/plugins/suricata.test.sh && ./tests/plugins/suricata.test.sh`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
Create `simulations/suricata-ids/docker-compose.yml`:
```yaml
version: '3.8'
services:
  suricata:
    image: jasonish/suricata:latest
    container_name: kforge-ids-${KFORGE_NODE_ID:-default}
    network_mode: "host"
    cap_add:
      - NET_ADMIN
      - SYS_NICE
    environment:
      - INTERFACE=${LISTEN_INTERFACE:-eth0}
    volumes:
      - ./suricata.yaml:/etc/suricata/suricata.yaml
```
Create a dummy `simulations/suricata-ids/suricata.yaml`:
```yaml
%YAML 1.1
---
vars:
  address-groups:
    HOME_NET: "[192.168.0.0/16,10.0.0.0/8,172.16.0.0/12]"
```

- [ ] **Step 4: Run test to verify it passes**
Run: `./tests/plugins/suricata.test.sh`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add tests/plugins/suricata.test.sh simulations/suricata-ids/
git commit -m "feat(plugins): add Suricata IDS/IPS network defense plugin"
```

### Task 3: Create the Tor Anonymous Network Plugin

**Files:**
- Create: `simulations/tor-anonymous/docker-compose.yml`

- [ ] **Step 1: Write the failing test**
Create `tests/plugins/tor.test.sh`:
```bash
#!/bin/bash
echo "Testing tor-anonymous plugin..."
if [ ! -f "simulations/tor-anonymous/docker-compose.yml" ]; then
  echo "FAIL"
  exit 1
fi
docker-compose -f simulations/tor-anonymous/docker-compose.yml config > /dev/null
if [ $? -eq 0 ]; then
  echo "PASS"
else
  echo "FAIL"
  exit 1
fi
```

- [ ] **Step 2: Run test to verify it fails**
Run: `chmod +x tests/plugins/tor.test.sh && ./tests/plugins/tor.test.sh`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
Create `simulations/tor-anonymous/docker-compose.yml`:
```yaml
version: '3.8'
services:
  tor-router:
    image: osminogin/tor-simple
    container_name: kforge-tor-${KFORGE_NODE_ID:-default}
    ports:
      - "${TOR_SOCKS_PORT:-9050}:9050"
    environment:
      - TOR_NEWNYM_INTERVAL=${TOR_INTERVAL:-60}
```

- [ ] **Step 4: Run test to verify it passes**
Run: `./tests/plugins/tor.test.sh`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add tests/plugins/tor.test.sh simulations/tor-anonymous/
git commit -m "feat(plugins): add Tor anonymous network plugin"
```

### Task 4: Integrate New Plugins into Admin Canvas and Academy

**Files:**
- Modify: `apps/admin/src/pages/Editor/components/Sidebar.tsx`
- Modify: `apps/academy/lib/knowledge.ts`

- [ ] **Step 1: Add to Admin Sidebar**
Edit `apps/admin/src/pages/Editor/components/Sidebar.tsx` to add the 3 new skills to the `skills` array.
```tsx
// Inside Sidebar.tsx, add to the skills array:
{ id: 'tproxy-concealment', label: 'TPROXY 透明代理', type: 'defense', icon: <Shield className="w-5 h-5 text-cyber-accent" />, desc: '强制全机流量接管' },
{ id: 'suricata-ids', label: 'Suricata IDS/IPS', type: 'monitor', icon: <Activity className="w-5 h-5 text-purple-400" />, desc: '实时特征检测' },
{ id: 'tor-anonymous', label: 'Tor 匿名网络', type: 'defense', icon: <Shield className="w-5 h-5 text-cyber-accent" />, desc: '多跳洋葱路由' },
```

- [ ] **Step 2: Update Academy Highlight mapping**
Edit `apps/academy/lib/knowledge.ts` to add the corresponding markdown slugs to `SAAS_READY_SLUGS`.
```typescript
const SAAS_READY_SLUGS = [
  'ddos-mitigation',
  'waf',
  'port-knocking-spa',
  'deception-defense',
  '透明代理_手把手教程', // maps to tproxy
  'ids-ips',          // maps to suricata
  'anonymous-networks' // maps to tor
];
```

- [ ] **Step 3: Run the build to verify**
Run: `npm run build --workspaces --if-present`
Expected: Build passes without errors.

- [ ] **Step 4: Commit**
```bash
git add apps/admin/src/pages/Editor/components/Sidebar.tsx apps/academy/lib/knowledge.ts
git commit -m "feat(ui): integrate new defense plugins into canvas and academy knowledge tree"
```
