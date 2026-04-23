import { getTechTree } from '../../lib/knowledge';
import Link from 'next/link';
import { Shield, BookOpen, Zap, Play, Terminal, ArrowRight } from 'lucide-react';

export default function TechTreePage() {
  const categories = getTechTree();

  return (
    <div className="min-h-screen bg-[#0B1021] text-gray-200 font-sans selection:bg-[#00E5FF]/30">
      {/* 重构的顶级商业导航栏 */}
      <header className="h-16 border-b border-gray-800/50 bg-[#0B1021]/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Shield className="w-6 h-6 text-[#00E5FF]" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-widest leading-none">KFORGE</span>
            <span className="text-[10px] text-[#00E5FF] tracking-widest leading-none mt-1 uppercase">Academy</span>
          </div>
        </div>
        
        {/* 核心商业漏斗导航：去掉了没用的学习路径、实战靶场 */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="/" className="text-white hover:text-white transition-colors">知识锻造科技树</Link>
          <a href="https://kforge-saas.com/pricing" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-400" /> Web3 会员订阅
          </a>
          <a href="https://admin.kforge-saas.com" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> 防御控制台
          </a>
          <a href="https://docs.kforge-saas.com" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Terminal className="w-4 h-4" /> 开发者 API / CLI
          </a>
        </nav>

        {/* 替换原先危险的"导出知识库"，改为最具商业价值的 CTA (Call To Action) */}
        <div className="flex items-center">
          <a 
            href="https://kforge-saas.com/pricing"
            className="flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#0B1021] font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
          >
            获取 Web3 防御通行证 <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* 页面主标题区 */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 flex items-center gap-3">
          知识锻造科技树
        </h1>
        <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
          探索 Web3 与零信任时代的前沿安全防御理念。点亮的节点代表您可以通过 KForge SaaS <strong className="text-[#00E5FF]">一键部署为真实防御盾牌</strong>。
        </p>
      </div>

      {/* 科技树渲染区 (纯 CSS Flex/Grid 模拟树状结构) */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-[#0D1322] border border-gray-800/60 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* 背景修饰网格 */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-12 relative z-10">
            
            {/* 根节点：KForge 知识锻造体系 */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-20 h-20 rounded-full border-4 border-[#00E5FF] bg-[#0B1021] flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.2)] relative z-20">
                <BookOpen className="w-8 h-8 text-[#00E5FF]" />
              </div>
              <span className="mt-4 text-sm font-bold text-white text-center">KForge<br/>知识基座</span>
            </div>

            {/* 连接线 (PC端横向) */}
            <div className="hidden md:block w-16 h-px bg-gray-700 shrink-0" />

            {/* 分支类别与知识节点 */}
            <div className="flex-1 space-y-12">
              {categories.map((category, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-6 relative">
                  
                  {/* 分支分类圆点 */}
                  <div className="flex items-center gap-3 shrink-0 md:w-64">
                    <div className="w-4 h-4 rounded-full bg-gray-700 border-2 border-[#0B1021] z-20 shadow-[0_0_0_2px_rgba(55,65,81,1)]" />
                    <span className="text-sm font-bold text-gray-300">{category.label}</span>
                  </div>

                  {/* 具体 Markdown 文章节点列表 */}
                  <div className="flex-1 flex flex-wrap gap-3 pl-7 md:pl-0 border-l border-gray-800 md:border-l-0 relative">
                    {/* 左侧垂直连线 (移动端) */}
                    <div className="md:hidden absolute left-[-2px] top-0 bottom-0 w-px bg-gray-800" />
                    
                    {category.nodes.map(node => (
                      <Link 
                        key={node.id} 
                        href={`/article/${node.category}/${node.slug}`}
                        className={`
                          group flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-all
                          ${node.hasSaaSPlugin 
                            ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
                            : 'bg-gray-800/40 border-gray-700/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                          }
                        `}
                      >
                        {node.hasSaaSPlugin && <Play className="w-3 h-3 text-[#00E5FF] group-hover:scale-110 transition-transform" />}
                        {!node.hasSaaSPlugin && <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />}
                        {node.title.substring(0, 30)}{node.title.length > 30 ? '...' : ''}
                      </Link>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}