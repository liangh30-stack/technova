# TechNova Design Tokens

设计系统规范，供 UI 设计师和工程师统一使用。

---

## 色彩 (Colors)

| Token | 值 | 用途 |
|-------|-----|------|
| `brand.primary` | `#1e3a5f` | 主色，信任感、专业 |
| `brand.accent` | `#f97316` | 强调色，CTA、高亮 |
| `brand.dark` | `#0f172a` | 深色背景、标题 |
| `brand.light` | `#f8fafc` | 浅色背景 |
| `brand.pink` | `#f97316` | 兼容别名，同 accent |
| `brand.teal` | `#1e3a5f` | 兼容别名，同 primary |

### 语义色
- 成功: `green-500` / `#22c55e`
- 警告: `yellow-500` / `#eab308`
- 错误: `red-500` / `#ef4444`
- 信息: `blue-500` / `#3b82f6`

---

## 字体 (Typography)

| Token | 值 | 用途 |
|-------|-----|------|
| `font-sans` | Poppins, sans-serif | 全局默认 |
| 标题 H1 | `text-4xl md:text-6xl font-black` | Hero 主标题 |
| 标题 H2 | `text-2xl md:text-4xl font-bold` | 区块标题 |
| 标题 H3 | `text-xl font-semibold` | 卡片标题 |
| 正文 | `text-base` | 默认正文 |
| 小字 | `text-sm` | 辅助信息 |

---

## 间距 (Spacing)

| Token | 值 | 用途 |
|-------|-----|------|
| 容器 padding | `px-4` / `md:px-6` | 页面边距 |
| 区块间距 | `gap-6` / `gap-8` | 组件间距 |
| 卡片内边距 | `p-6` | 卡片内容 |
| 按钮 padding | `px-6 py-3` / `px-8 py-4` | 按钮尺寸 |

---

## 圆角 (Border Radius)

| Token | 值 | 用途 |
|-------|-----|------|
| 小 | `rounded-lg` (8px) | 按钮、输入框 |
| 中 | `rounded-xl` (12px) | 卡片 |
| 大 | `rounded-2xl` (16px) | 大卡片、弹窗 |
| 全圆 | `rounded-full` | 徽章、头像 |

---

## 阴影 (Shadows)

| Token | 用途 |
|-------|------|
| `shadow-lg` | 卡片悬浮 |
| `shadow-xl` | 弹窗、下拉 |
| `shadow-2xl` | Hero、强调区域 |
| `shadow-brand-accent/25` | CTA 按钮发光 |

---

## 响应式断点 (Breakpoints)

| 断点 | 宽度 | 用途 |
|------|------|------|
| mobile | < 640px | 手机 |
| tablet | 640px - 1024px | 平板 |
| desktop | > 1024px | 桌面 |

Tailwind 前缀: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)

---

## 动效 (Motion)

| Token | 值 | 用途 |
|-------|-----|------|
| 过渡 | `transition-all duration-200` | 默认交互 |
| 缓动 | `ease-out` | 弹出、展开 |
| 悬停 | `hover:scale-105` / `hover:-translate-y-1` | 卡片悬浮 |

---

## 使用规范

1. **优先使用 Tailwind 类**，避免自定义 CSS
2. **色彩** 使用 `brand-*` 或 Tailwind 语义色
3. **间距** 使用 4 的倍数 (4, 8, 12, 16, 24, 32)
4. **保持一致**：新增组件参考现有 Storefront、Hero3D 的样式模式
