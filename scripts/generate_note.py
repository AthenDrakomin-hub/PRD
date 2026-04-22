#!/usr/bin/env python3
import os
import sys
from datetime import datetime

scenario_dir = sys.argv[1]
scenario_name = os.path.basename(scenario_dir)

# 读取场景描述文件（简单起见，这里手动解析 Front Matter）
scenario_md = os.path.join(scenario_dir, "scenario.md")
with open(scenario_md, "r") as f:
    content = f.read()

# 解析基本元数据（简化，实际可用 PyYAML）
lines = content.split("\n")
metadata = {}
in_fm = False
for line in lines:
    if line.strip() == "---":
        if not in_fm:
            in_fm = True
            continue
        else:
            break
    if in_fm:
        if ":" in line:
            key, val = line.split(":", 1)
            metadata[key.strip()] = val.strip()

title = metadata.get("title", scenario_name)
category = metadata.get("category", "实战笔记")
tags = metadata.get("tags", "模拟,复盘")

# 读取检测输出
output_file = os.path.join(scenario_dir, "detection_output.txt")
detection_log = ""
if os.path.exists(output_file):
    with open(output_file, "r") as f:
        detection_log = f.read()

# 生成笔记
note = f"""---
title: "模拟复盘：{title}"
category: "{category}"
tags: [{tags}]
summary: "通过 Docker 模拟环境复现了 {title} 场景，验证了相关检测方法的有效性。"
created: {datetime.now().strftime('%Y-%m-%d')}
status: "reviewed"
skill_level: "{metadata.get('difficulty', '中级')}"
---

# 模拟复盘：{title}

## 🎯 模拟目标
{metadata.get('sim_id', '')} 场景复现，验证笔记中的技能点。

## 🧪 实验环境
- 详见 `simulations/{scenario_name}/docker-compose.yml`

## ⚙️ 关键操作记录
详见模拟脚本 `attack.sh` 和 `detect.sh`。

## 📊 检测结果
```
{detection_log}
```

## ⚠️ 发现与反思
<!-- 手动填写：这次模拟让你对哪条笔记的理解更深了？遇到了什么意外情况？ -->

## 🔗 关联笔记
- [[关联笔记待补充]]
"""
print(note)
