# Gasnet.org Feature Roadmap

> 功能优化计划 | 版本 1.0 | 2026-01-16

## 目录

- [项目现状](#项目现状)
- [Phase 1: 核心功能增强](#phase-1-核心功能增强)
- [Phase 2: 用户体验优化](#phase-2-用户体验优化)
- [Phase 3: 高级功能](#phase-3-高级功能)
- [Phase 4: 社区与生态](#phase-4-社区与生态)
- [内容补全计划](#内容补全计划)
- [技术债务清理](#技术债务清理)
- [实施检查清单](#实施检查清单)

---

## 项目现状

### 已完成功能

| 功能                | 状态    | 备注                                |
| ------------------- | ------- | ----------------------------------- |
| Docusaurus 3.9 框架 | ✅ 完成 | React 19                            |
| 深色/浅色主题       | ✅ 完成 | useColorMode hook                   |
| Chart.js 图表       | ✅ 完成 | 支持无障碍访问                      |
| Mermaid 流程图      | ✅ 完成 | 集成主题插件                        |
| KaTeX 数学公式      | ✅ 完成 | remark-math + rehype-katex          |
| 本地搜索            | ✅ 完成 | @easyops-cn/docusaurus-search-local |
| Giscus 评论         | ✅ 完成 | 需要环境变量配置                    |
| Umami 分析          | ✅ 完成 | 支持 DNT                            |
| 无障碍访问          | ✅ 完成 | WCAG AA 合规                        |
| 响应式设计          | ✅ 完成 | 移动端优先                          |
| 安全头配置          | ✅ 完成 | CSP, SRI                            |
| 404 页面            | ✅ 完成 | 品牌化设计                          |
| Labs 页面           | ✅ 完成 | 研究实验室目录                      |

### 待改进项

| 功能           | 状态    | 问题             |
| -------------- | ------- | ---------------- |
| API 文档       | ⚠️ 占位 | 手写 placeholder |
| 文档互链       | ⚠️ 缺失 | 内容孤立         |
| 代码示例       | ⚠️ 缺失 | 无交互式示例     |
| 版本管理       | ⚠️ 缺失 | 仅单版本         |
| Benchmark 对比 | ⚠️ 基础 | 仅静态图表       |
| Labs 链接      | ⚠️ 占位 | 大多为 #         |

---

## Phase 1: 核心功能增强

> 优先级: 🔴 高 | 预计工作量: 中等

### 1.1 交互式代码示例

**目标**: 用户可在页面内运行和修改代码

**实现方案**:

```bash
npm install @docusaurus/theme-live-codeblock
```

**配置修改** (`docusaurus.config.js`):

```javascript
themes: [
  '@docusaurus/theme-mermaid',
  '@docusaurus/theme-live-codeblock', // 新增
],
themeConfig: {
  liveCodeBlock: {
    playgroundPosition: 'bottom',
  },
},
```

**使用示例**:

````markdown
```jsx live
function GasnetDemo() {
  const [latency, setLatency] = useState(0.5);
  return (
    <div>
      <input
        type="range"
        min="0.1"
        max="2"
        step="0.1"
        value={latency}
        onChange={e => setLatency(e.target.value)}
      />
      <p>Latency: {latency}μs</p>
    </div>
  );
}
```
````

**文件变更**:

- [ ] `docusaurus.config.js` - 添加主题
- [ ] `docs/03-programming-model/` - 添加实时示例
- [ ] `src/css/custom.css` - 代码编辑器样式

---

### 1.2 文档版本管理

**目标**: 支持多版本文档 (如 v2.0, v1.x)

**实现方案**:

```bash
npm run docusaurus docs:version 1.0
```

**配置修改** (`docusaurus.config.js`):

```javascript
docs: {
  sidebarPath: './sidebars.js',
  lastVersion: 'current',
  versions: {
    current: {
      label: '2.0 (Current)',
      path: '',
    },
    '1.0': {
      label: '1.0',
      path: '1.0',
    },
  },
},
```

**目录结构**:

```
docs/                    # 当前版本
versioned_docs/
  └── version-1.0/       # 历史版本
versioned_sidebars/
  └── version-1.0-sidebars.json
versions.json            # 版本列表
```

**文件变更**:

- [ ] `docusaurus.config.js` - 版本配置
- [ ] `versions.json` - 自动生成
- [ ] Navbar - 添加版本选择器

---

### 1.3 API 文档自动生成

**目标**: 从代码注释自动生成 API 参考

**方案 A - TypeDoc (TypeScript 项目)**:

```bash
npm install typedoc docusaurus-plugin-typedoc
```

**方案 B - Doxygen (C/C++ 项目)**:

```bash
# 生成 XML 后转换为 Markdown
doxygen Doxyfile
npx doxygen2md ./xml ./docs/api
```

**方案 C - 手动 MDX 模板**:

创建 `src/components/APIReference.js`:

```jsx
export default function APIReference({ name, signature, description, params, returns }) {
  return (
    <div className="api-reference">
      <h3>
        <code>{name}</code>
      </h3>
      <pre>{signature}</pre>
      <p>{description}</p>
      <h4>Parameters</h4>
      <ul>
        {params.map((p, i) => (
          <li key={i}>
            <code>{p.name}</code>: {p.description}
          </li>
        ))}
      </ul>
      <h4>Returns</h4>
      <p>{returns}</p>
    </div>
  );
}
```

**文件变更**:

- [ ] `package.json` - 添加依赖
- [ ] `src/components/APIReference.js` - 新组件
- [ ] `docs/03-programming-model/03-api-reference.md` - 重写

---

### 1.4 文档智能互链

**目标**: 自动推荐相关文档

**实现方案**:

创建 `src/components/RelatedDocs.js`:

```jsx
import Link from '@docusaurus/Link';

const RELATED_MAP = {
  '/docs/architecture/overview': [
    { title: 'Transport Layers', path: '/docs/architecture/transport-layers' },
    { title: 'Getting Started', path: '/docs/getting-started/intro' },
  ],
  // ... 更多映射
};

export default function RelatedDocs({ currentPath }) {
  const related = RELATED_MAP[currentPath] || [];
  if (!related.length) return null;

  return (
    <div className="related-docs">
      <h4>Related Documentation</h4>
      <ul>
        {related.map((doc, i) => (
          <li key={i}>
            <Link to={doc.path}>{doc.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**自动化方案**: 基于标签/关键词匹配

```javascript
// 在 frontmatter 中添加
---
tags: [architecture, transport, networking]
related:
  - /docs/benchmarks/methodology
  - /docs/case-studies/atlas
---
```

**文件变更**:

- [ ] `src/components/RelatedDocs.js` - 新组件
- [ ] `src/theme/DocItem/Footer/index.js` - 集成组件
- [ ] 所有 docs - 添加 frontmatter tags

---

## Phase 2: 用户体验优化

> 优先级: 🟡 中 | 预计工作量: 中等

### 2.1 Benchmark 交互式对比工具

**目标**: 用户可选择多个数据集进行对比

**实现方案**:

创建 `src/components/BenchmarkCompare.js`:

```jsx
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import BrowserOnly from '@docusaurus/BrowserOnly';

const DATASETS = [
  { id: 'atlas-4096', label: 'Atlas 4096-node' },
  { id: 'default', label: 'Reference' },
  // 可扩展
];

export default function BenchmarkCompare() {
  const [selected, setSelected] = useState(['atlas-4096', 'default']);
  const [metric, setMetric] = useState('latency'); // or 'bandwidth'

  return (
    <BrowserOnly>
      {() => (
        <div className="benchmark-compare">
          <div className="controls">
            <label>Datasets:</label>
            {DATASETS.map(ds => (
              <label key={ds.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(ds.id)}
                  onChange={() => toggleDataset(ds.id)}
                />
                {ds.label}
              </label>
            ))}
            <select value={metric} onChange={e => setMetric(e.target.value)}>
              <option value="latency">Latency (μs)</option>
              <option value="bandwidth">Bandwidth (GB/s)</option>
            </select>
          </div>
          <Line data={buildChartData(selected, metric)} />
        </div>
      )}
    </BrowserOnly>
  );
}
```

**文件变更**:

- [ ] `src/components/BenchmarkCompare.js` - 新组件
- [ ] `static/data/benchmarks/` - 添加更多数据集
- [ ] `docs/05-benchmarks/` - 集成对比工具

---

### 2.2 多语言代码标签组件

**目标**: 统一展示 C/Python/Rust 示例

**实现方案**:

````jsx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="language">
  <TabItem value="c" label="C" default>

```c
gasnet_put(dest, src, size);
````

  </TabItem>
  <TabItem value="python" label="Python">

```python
gasnet.put(dest, src, size)
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
gasnet::put(dest, src, size);
```

  </TabItem>
</Tabs>
```

**封装组件** `src/components/CodeTabs.js`:

```jsx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export default function CodeTabs({ c, python, rust }) {
  return (
    <Tabs groupId="language">
      {c && (
        <TabItem value="c" label="C">
          <CodeBlock language="c">{c}</CodeBlock>
        </TabItem>
      )}
      {python && (
        <TabItem value="python" label="Python">
          <CodeBlock language="python">{python}</CodeBlock>
        </TabItem>
      )}
      {rust && (
        <TabItem value="rust" label="Rust">
          <CodeBlock language="rust">{rust}</CodeBlock>
        </TabItem>
      )}
    </Tabs>
  );
}
```

**文件变更**:

- [ ] `src/components/CodeTabs.js` - 新组件
- [ ] `docs/03-programming-model/` - 使用组件

---

### 2.3 PDF 导出功能

**目标**: 允许用户下载文档 PDF

**方案 A - 构建时生成**:

```bash
npm install docusaurus-prince-pdf
```

**方案 B - 按需生成按钮**:

```jsx
// src/components/PDFExport.js
export default function PDFExport({ path }) {
  const handleExport = () => {
    window.print(); // 简单方案，配合 @media print 样式
  };

  return (
    <button onClick={handleExport} className="pdf-export-btn">
      Export as PDF
    </button>
  );
}
```

**打印样式** (`src/css/custom.css`):

```css
@media print {
  .navbar,
  .footer,
  .pagination-nav,
  .table-of-contents {
    display: none;
  }
  .markdown {
    max-width: 100%;
  }
  pre {
    white-space: pre-wrap;
  }
}
```

**文件变更**:

- [ ] `src/components/PDFExport.js` - 新组件
- [ ] `src/css/custom.css` - 打印样式
- [ ] `src/theme/DocItem/Footer/index.js` - 添加导出按钮

---

### 2.4 Changelog / 版本日志

**目标**: 展示版本更新历史

**方案 A - 独立页面**:

创建 `src/pages/changelog.md`:

```markdown
# Changelog

## [2.0.0] - 2026-01-15

### Added

- Interactive benchmark comparison
- Multi-language code tabs
- PDF export

### Changed

- Upgraded to Docusaurus 3.9
- New chart theme system

### Fixed

- Dark mode chart colors
```

**方案 B - 启用 Blog 功能**:

```javascript
// docusaurus.config.js
presets: [
  ['classic', {
    blog: {
      routeBasePath: 'changelog',
      blogTitle: 'Changelog',
      blogSidebarTitle: 'Recent Updates',
      showReadingTime: false,
    },
  }],
],
```

**文件变更**:

- [ ] `src/pages/changelog.md` 或 `blog/` 目录
- [ ] Navbar - 添加 Changelog 链接

---

### 2.5 FAQ 专区

**目标**: 结构化常见问题解答

创建 `docs/08-faq/index.md`:

````markdown
---
sidebar_position: 8
---

# Frequently Asked Questions

## Installation

<details>
<summary>How do I install GASNet on macOS?</summary>

```bash
brew install gasnet
```
````

</details>

<details>
<summary>What are the minimum system requirements?</summary>

- Linux kernel 4.x+ or macOS 12+
- GCC 9+ or Clang 11+
- 4GB RAM minimum

</details>

## Performance

<details>
<summary>Why is my latency higher than benchmarks?</summary>

Check the following:

1. Network configuration
2. NUMA affinity
3. Process binding

</details>
```

**文件变更**:

- [ ] `docs/08-faq/index.md` - 新章节
- [ ] `docs/08-faq/_category_.json` - 分类配置

---

## Phase 3: 高级功能

> 优先级: 🟢 低 | 预计工作量: 较大

### 3.1 快捷键导航

**目标**: `Ctrl+K` 搜索, `←/→` 翻页

创建 `src/theme/Root.js` (扩展现有):

```jsx
import { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

function KeyboardNav({ children }) {
  const history = useHistory();

  useEffect(() => {
    const handler = e => {
      // Ctrl+K or Cmd+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.DocSearch-Button')?.click();
      }
      // Arrow keys for pagination (when not in input)
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.key === 'ArrowLeft') {
          document.querySelector('.pagination-nav__link--prev')?.click();
        }
        if (e.key === 'ArrowRight') {
          document.querySelector('.pagination-nav__link--next')?.click();
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return children;
}
```

**文件变更**:

- [ ] `src/theme/Root.js` - 添加键盘导航

---

### 3.2 阅读进度指示器

**目标**: 顶部显示阅读进度条

创建 `src/components/ReadingProgress.js`:

```jsx
import { useState, useEffect } from 'react';
import styles from './ReadingProgress.module.css';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      className={styles.progressBar}
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin="0"
      aria-valuemax="100"
    />
  );
}
```

```css
/* ReadingProgress.module.css */
.progressBar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--ifm-color-primary);
  z-index: 1000;
  transition: width 0.1s;
}
```

**文件变更**:

- [ ] `src/components/ReadingProgress.js`
- [ ] `src/components/ReadingProgress.module.css`
- [ ] `src/theme/Root.js` - 引入组件

---

### 3.3 用户 Benchmark 数据提交

**目标**: 允许社区贡献 benchmark 数据

**方案**: GitHub PR 工作流

1. 创建数据模板 `static/data/benchmarks/TEMPLATE.json`:

```json
{
  "$schema": "./schema.json",
  "metadata": {
    "name": "Your Cluster Name",
    "date": "2026-01-16",
    "contributor": "GitHub Username",
    "hardware": {
      "nodes": 128,
      "network": "HDR InfiniBand",
      "cpu": "AMD EPYC 7763"
    }
  },
  "latency": {
    "labels": ["8B", "64B", "512B", "4KB", "32KB"],
    "p50": [0.5, 0.6, 0.8, 1.2, 2.5],
    "p95": [0.8, 1.0, 1.5, 2.0, 4.0]
  },
  "bandwidth": {
    "labels": ["8B", "64B", "512B", "4KB", "32KB", "256KB", "1MB"],
    "values": [0.01, 0.1, 0.8, 5.0, 15.0, 22.0, 24.0]
  }
}
```

2. 创建贡献指南 `CONTRIBUTING.md`:

```markdown
## Contributing Benchmark Data

1. Fork this repository
2. Copy `static/data/benchmarks/TEMPLATE.json` to `static/data/benchmarks/your-cluster.json`
3. Fill in your measurements
4. Submit a Pull Request

### Data Requirements

- At least 3 message sizes
- Include hardware metadata
- Measurements must be reproducible
```

**文件变更**:

- [ ] `static/data/benchmarks/TEMPLATE.json`
- [ ] `static/data/benchmarks/schema.json` - JSON Schema 验证
- [ ] `CONTRIBUTING.md` - 贡献指南
- [ ] `.github/workflows/validate-benchmarks.yml` - PR 验证

---

### 3.4 i18n 国际化

**目标**: 支持中文等多语言

**配置** (`docusaurus.config.js`):

```javascript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'zh-CN'],
  localeConfigs: {
    en: { label: 'English' },
    'zh-CN': { label: '简体中文' },
  },
},
```

**目录结构**:

```
i18n/
└── zh-CN/
    ├── docusaurus-plugin-content-docs/
    │   └── current/
    │       └── 01-getting-started/
    │           └── 01-intro.md
    └── docusaurus-theme-classic/
        └── navbar.json
```

**文件变更**:

- [ ] `docusaurus.config.js` - i18n 配置
- [ ] `i18n/zh-CN/` - 中文翻译
- [ ] Navbar - 语言切换器

---

## Phase 4: 社区与生态

> 优先级: 🟢 低 | 预计工作量: 持续性

### 4.1 社区资源页面

创建 `src/pages/community.js`:

```jsx
export default function Community() {
  return (
    <Layout title="Community">
      <div className="container">
        <h1>Community Resources</h1>

        <section>
          <h2>Get Help</h2>
          <ul>
            <li>
              <a href="https://github.com/org/gasnet/discussions">GitHub Discussions</a>
            </li>
            <li>
              <a href="mailto:gasnet-users@lists.example.org">Mailing List</a>
            </li>
          </ul>
        </section>

        <section>
          <h2>Contribute</h2>
          <ul>
            <li>
              <a href="/docs/contributing">Contribution Guide</a>
            </li>
            <li>
              <a href="https://github.com/org/gasnet">Source Code</a>
            </li>
          </ul>
        </section>

        <section>
          <h2>Events</h2>
          <ul>
            <li>SC'26 BoF: GASNet Updates</li>
            <li>ISC'26 Workshop: PGAS Programming</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
```

---

### 4.2 JSON-LD Schema 启用

**目标**: 改善 SEO，启用富摘要

取消注释 `docusaurus.config.js` 中的 schema:

```javascript
headTags: [
  {
    tagName: 'script',
    attributes: { type: 'application/ld+json' },
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      name: 'GASNet Documentation',
      description: 'High-performance networking documentation',
      author: { '@type': 'Organization', name: 'GASNet Team' },
    }),
  },
],
```

---

## 内容补全计划

### 高优先级内容

| 文件                                            | 当前状态 | 需要内容                 |
| ----------------------------------------------- | -------- | ------------------------ |
| `docs/03-programming-model/03-api-reference.md` | 空壳     | 完整 API 文档            |
| `docs/04-interop/01-language-bindings.md`       | Stub     | C++/Python/Rust 绑定详情 |
| `docs/04-interop/02-runtime-integration.md`     | Stub     | MPI, OpenMP 集成指南     |
| `docs/01-getting-started/04-troubleshooting.md` | 过短     | 常见问题解决方案         |

### 中优先级内容

| 文件                                         | 需要内容                                      |
| -------------------------------------------- | --------------------------------------------- |
| `docs/01-getting-started/02-installation.md` | 平台特定安装指南 (Linux, macOS, HPC clusters) |
| `docs/02-architecture/`                      | 添加 Mermaid 架构图                           |
| `docs/05-benchmarks/`                        | 添加更多真实数据集                            |

### Labs 页面链接修复

当前 placeholder (`#`) 需替换为真实链接:

```javascript
// src/pages/labs/index.js
const LABS = [
  {
    name: 'Berkeley Lab',
    url: 'https://crd.lbl.gov/', // 替换 #
    publications: 'https://crd.lbl.gov/publications/',
  },
  // ...
];
```

---

## 技术债务清理

### 优先处理

| 问题              | 位置                     | 解决方案                       |
| ----------------- | ------------------------ | ------------------------------ |
| Giscus 手动配置   | `GiscusComponent.js`     | 添加配置向导或 CLI 工具        |
| Chart.js 重复注册 | 多个组件                 | 统一在 `src/lib/chartSetup.js` |
| 环境变量文档      | `.env.example`           | 扩展说明，添加获取步骤         |
| 链接检查          | `scripts/check-links.js` | 集成到 CI/CD                   |

### 代码质量

```bash
# 添加到 package.json scripts
"lint:fix": "eslint --fix .",
"type-check": "tsc --noEmit",
"test:a11y": "pa11y-ci"
```

---

## 实施检查清单

### Phase 1 Checklist

- [ ] **1.1 交互式代码示例**
  - [ ] 安装 `@docusaurus/theme-live-codeblock`
  - [ ] 配置 `docusaurus.config.js`
  - [ ] 添加示例到 programming-model 文档
  - [ ] 测试深色/浅色模式

- [ ] **1.2 文档版本管理**
  - [ ] 运行 `npm run docusaurus docs:version 1.0`
  - [ ] 配置版本选择器
  - [ ] 更新 Navbar

- [ ] **1.3 API 文档**
  - [ ] 选择生成方案 (TypeDoc/手动)
  - [ ] 创建 APIReference 组件
  - [ ] 重写 api-reference.md

- [ ] **1.4 文档互链**
  - [ ] 创建 RelatedDocs 组件
  - [ ] 添加 frontmatter tags 到所有文档
  - [ ] 集成到 DocItem Footer

### Phase 2 Checklist

- [ ] **2.1 Benchmark 对比工具**
  - [ ] 创建 BenchmarkCompare 组件
  - [ ] 添加更多数据集
  - [ ] 集成到 benchmarks 页面

- [ ] **2.2 多语言代码标签**
  - [ ] 创建 CodeTabs 组件
  - [ ] 更新 programming-model 文档

- [ ] **2.3 PDF 导出**
  - [ ] 添加打印样式
  - [ ] 创建导出按钮组件

- [ ] **2.4 Changelog**
  - [ ] 创建 changelog 页面/blog
  - [ ] 添加 Navbar 链接

- [ ] **2.5 FAQ**
  - [ ] 创建 08-faq 目录
  - [ ] 添加初始问题

### Phase 3 Checklist

- [ ] **3.1 快捷键导航**
- [ ] **3.2 阅读进度指示器**
- [ ] **3.3 Benchmark 数据提交**
- [ ] **3.4 i18n 国际化**

### Phase 4 Checklist

- [ ] **4.1 社区页面**
- [ ] **4.2 JSON-LD Schema**

---

## 附录

### 依赖版本参考

```json
{
  "@docusaurus/theme-live-codeblock": "^3.9.0",
  "docusaurus-prince-pdf": "^1.2.0",
  "typedoc": "^0.27.0",
  "docusaurus-plugin-typedoc": "^1.4.0"
}
```

### 相关文档

- [Docusaurus Versioning](https://docusaurus.io/docs/versioning)
- [Live Code Blocks](https://docusaurus.io/docs/markdown-features/code-blocks#interactive-code-editor)
- [i18n Tutorial](https://docusaurus.io/docs/i18n/tutorial)

---

_Last updated: 2026-01-16_
