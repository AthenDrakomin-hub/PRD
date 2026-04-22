#!/bin/bash
# 用法: ./run_sim.sh <场景目录名>

set -e

SCENARIO_DIR="$1"
if [ -z "$SCENARIO_DIR" ]; then
    echo "用法: $0 <场景目录名>"
    exit 1
fi

SCENARIO_NAME=$(basename "$SCENARIO_DIR")
cd "$SCENARIO_DIR" || exit 1

echo "[*] 启动模拟环境: $SCENARIO_NAME"
docker-compose up -d
sleep 5

echo "[*] 执行攻击脚本..."
docker exec attacker ./attack.sh &

echo "[*] 执行检测脚本并记录输出..."
docker exec detector ./detect.sh > detection_output.txt

echo "[*] 停止环境..."
docker-compose down

echo "[*] 生成实战笔记..."
python3 ../../scripts/generate_note.py "$SCENARIO_DIR" > "../../05_实战笔记/模拟_${SCENARIO_NAME}-$(date +%Y%m%d).md"

echo "[+] 完成！笔记已保存至 05_实战笔记/"
