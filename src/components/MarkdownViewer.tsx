import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewerProps {
  filePath: string; // 相对于项目根目录的路径，如 "02_网络隐匿/透明代理_手把手教程.md"
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ filePath }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    // 生产环境需要确保这些 .md 文件被复制到 build 目录
    fetch(`/content/${filePath}`)
      .then(res => {
        if (!res.ok) throw new Error('网络响应错误');
        return res.text();
      })
      .then(text => {
        // 由于解析出的文本带有 frontmatter，我们需要去掉它以防止渲染在页面上
        const contentWithoutFrontmatter = text.replace(/---[\s\S]*?---/, '');
        setContent(contentWithoutFrontmatter);
      })
      .catch(err => {
        console.error('加载 Markdown 失败', err);
        setContent('> 加载文档失败，请检查文件是否存在。');
      });
  }, [filePath]);

  return (
    <div className="prose prose-invert max-w-none mt-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
