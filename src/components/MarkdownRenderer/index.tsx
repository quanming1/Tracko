import React, { useMemo } from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
// 引入 DOMPurify 用于 HTML 净化
import DOMPurify from "dompurify";

interface MarkdownRendererProps {
  content: string;
  options?: MarkdownIt.Options;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, options, className }) => {
  const md = useMemo(() => {
    // 初始化 markdown-it 实例
    const instance = new MarkdownIt({
      ...options,
      html: true, // 允许 HTML 标签
      linkify: true, // 自动转换 URL 为链接
      typographer: true, // 启用排版扩展
      highlight: (str, lang) => {
        // 语法高亮处理
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs"><code>${
              hljs.highlight(str, {
                language: lang,
                ignoreIllegals: true,
              }).value
            }</code></pre>`;
          } catch (_) {}
        }
        return `<pre class="hljs"><code>${instance.utils.escapeHtml(str)}</code></pre>`;
      },
    });

    // 添加自定义插件（示例：为所有链接添加 target="_blank"）
    instance.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const hrefIndex = token.attrIndex("href");
      if (hrefIndex >= 0) {
        const href = token.attrs?.[hrefIndex]?.[1];
        // 检查链接是否是 javascript: 协议
        if (href && /^javascript:/i.test(href)) {
          token.attrs[hrefIndex][1] = "#";
        }
        token.attrPush(["target", "_blank"]);
        token.attrPush(["rel", "noopener noreferrer"]);
      }
      return self.renderToken(tokens, idx, options);
    };

    return instance;
  }, [options]);

  const htmlContent = useMemo(() => {
    const rawHtml = md.render(content || "");
    // 使用 DOMPurify 净化 HTML
    return DOMPurify.sanitize(rawHtml, {
      FORBID_TAGS: ["script", "style", "iframe", "form"],
      FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
    });
  }, [md, content]);

  return (
    <div
      className={`markdown-body ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;
