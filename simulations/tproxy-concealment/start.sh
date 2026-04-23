#!/bin/sh
echo "Initializing KForge Transparent Proxy (TPROXY) Shield..."

# Enable IP forwarding
echo "1" > /proc/sys/net/ipv4/ip_forward

# Setup iptables rules for TPROXY to redirect host traffic to port 7890
iptables -t mangle -N DIVERT || true
iptables -t mangle -A DIVERT -j MARK --set-mark 1
iptables -t mangle -A DIVERT -j ACCEPT
iptables -t mangle -I PREROUTING -p tcp -m socket -j DIVERT
iptables -t mangle -A PREROUTING -p tcp -j TPROXY --on-port 7890 --tproxy-mark 0x1/0x1

echo "TPROXY Kernel Rules Applied. Starting Proxy Engine..."
# Start the underlying engine
/clash
