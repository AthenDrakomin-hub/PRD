import { getArticleContent, getTechTree } from '@/lib/knowledge';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';
import { ChevronLeft, Zap, ShieldAlert, Cpu, Terminal, Shield, ArrowRight } from 'lucide-react';
import 'highlight.js/styles/atom-one-dark.css';

export async function generateStaticParams() {
  const tree = getTechTree();
  const paths: any[] = [];
  
  tree.forEach(cat => {
    cat.nodes.forEach(node => {
      paths.push({ category: node.category, slug: node.slug });
    });
  });

  return paths;
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string, slug: string }> }) {
  const resolvedParams = await params;
  const article = getArticleContent(resolvedParams.category, resolvedParams.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0B1021] text-gray-300 font-sans selection:bg-[#00E5FF]/30 pb-24">
      {/* 顶部导航 */}
      <header className="h-16 border-b border-gray-800/50 bg-[#0B1021]/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors border-r border-gray-800 pr-6">
            <ChevronLeft className="w-4 h-4" /> 返回科技树
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#00E5FF] tracking-widest leading-none uppercase border border-[#00E5FF]/30 px-2 py-1 rounded-full bg-[#00E5FF]/10">KForge Academy</span>
          </div>
        </div>

        {/* 右侧商业转化漏斗 */}
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-400">
            <a href="https://admin.kforge-saas.com" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> 防御控制台
            </a>
            <a href="https://docs.kforge-saas.com" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> 开发者 API / CLI
            </a>
          </nav>
          <a 
            href="https://kforge-saas.com/pricing"
            className="flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#0B1021] font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
          >
            获取 Web3 防御通行证 <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* 内容主干与右侧商业转化侧边栏 */}
      <main className="max-w-6xl mx-auto px-6 pt-12 flex flex-col lg:flex-row gap-12">
        
        {/* 左侧 Markdown 正文 */}
        <article className="flex-1 lg:max-w-[70%] prose prose-invert prose-headings:text-white prose-a:text-[#00E5FF] hover:prose-a:text-blue-400 prose-code:bg-gray-800/50 prose-code:text-gray-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0D1322] prose-pre:border prose-pre:border-gray-800/60 prose-blockquote:bg-transparent">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {article.content}
          </ReactMarkdown>
        </article>

        {/* 右侧商业转化侧边栏 (PLG 产品驱动增长核心) */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-6">
            
            {article.hasSaaSPlugin ? (
              // 转化组件 A：该知识点已被实现为 KForge 插件，直接引导部署
              <div className="bg-gradient-to-b from-[#0D1322] to-[#0B1021] border border-[#00E5FF]/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,229,255,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                  <ShieldAlert className="w-32 h-32 text-[#00E5FF]" />
                </div>
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold mb-4 relative z-10">
                  <Zap className="w-3 h-3" /> SaaS 商业插件已就绪
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">
                  不再纸上谈兵，一键拉起真实防御！
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6 relative z-10">
                  这篇文档中的防御理论太复杂？KForge 已经将它封装成了零配置的 Docker 插件。订阅全球防御网络，享受一键极客交付体验。
                </p>
                
                <a 
                  href="https://kforge-saas.com" 
                  className="w-full bg-[#00E5FF] hover:bg-[#00c8e6] text-[#0B1021] font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] relative z-10"
                >
                  <Cpu className="w-4 h-4" /> 立即部署该防御盾牌
                </a>
              </div>
            ) : (
              // 转化组件 B：理论知识阶段，引导加入社区/等待解锁
              <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
                <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">护城河锻造中</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  该防御理念正在被 KForge 引擎容器化封装。订阅 KForge 全球防御网络，即可在插件发布的第一时间获得全量使用权。
                </p>
                <a 
                  href="https://kforge-saas.com" 
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-colors border border-gray-700"
                >
                  了解 Web3 订阅特权
                </a>
              </div>
            )}

            <div className="text-xs text-gray-600 text-center">
              Powered by KForge Engine
            </div>

          </div>
        </aside>

      </main>
    </div>
  );
}