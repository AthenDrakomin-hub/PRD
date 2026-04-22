// 自动生成，请勿手动修改
export interface Simulation {
  id: string;
  title: string;
  category: string;
  tags: string[];
  difficulty: string;
  estimatedTime: string;
  description: string;
  commands: {
    start: string;
    attack: string;
    detect: string;
    stop: string;
  };
}

export const simulations: Simulation[] = [
  {
    "id": "dns-tunnel-detect",
    "title": "DNS隧道建立与检测模拟",
    "category": "威胁检测",
    "tags": [
      "DNS隧道",
      "iodine",
      "流量分析",
      "模拟"
    ],
    "difficulty": "中级",
    "estimatedTime": "5分钟",
    "description": "",
    "commands": {
      "start": "cd simulations/dns-tunnel-detect && docker-compose up -d",
      "attack": "cd simulations/dns-tunnel-detect && docker exec attacker ./attack.sh",
      "detect": "cd simulations/dns-tunnel-detect && docker exec detector ./detect.sh",
      "stop": "cd simulations/dns-tunnel-detect && docker-compose down"
    }
  }
];
