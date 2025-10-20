# AstroWhispers UI / UX 指南

## 1. 视觉主题
- **色板**：
  - 背景底：#07071B（午夜蓝黑）、#0D1028（星云蓝）。
  - 主色：#6C5CE7（星霓紫）、#A29BFE（雾光紫）。
  - 强调色：#F8D16C（金辉）、#C8E4FF（星光银蓝）。
  - 错误/警告：#FF7B7B（玫瑰红）。
- **字体**：标题使用「Playfair Display」或「Cormorant Garamond」，正文使用「Inter」/「Noto Sans SC」。
- **质感**：深色渐变、柔和发光、玻璃拟态卡片；星屑粒子与渐隐动画营造神秘感。

## 2. 布局结构
- 顶部导航：透明/半透明背景 + 模糊；滚动后压缩高度。
- Hero：全屏渐变背景 + 星空纹理 + 行星/符号插画；CTA 按钮使用发光边框。
- 内容区域：以分区卡片呈现，沿用 6/12 栅格，支持大屏和手机响应式。
- 报告页面：折叠面板 + 时间轴 + 徽章标签突出维度。

## 3. 交互元素
- 卡片：默认半透明玻璃风；悬停时抬升 + 内发光；点击出现柔和波纹。
- 按钮：使用 Tailwind 自定义类 `btn-primary`, `btn-ghost`；主按钮带渐变 + 外发光。
- 输入框：暗色背景 + 内发光；获取焦点时边框渐变。
- 动画：
  - Hero 背景粒子（CSS 动画或 canvas）；
  - 报告段落进入视图时淡入 + 轻微上移；
  - 文章卡片悬停显示「阅读更多」。

## 4. Tailwind 定制
- `tailwind.config.cjs` 中扩展颜色 `cosmic`, `accent`, `gold`, `silver`，字体 `serif`, `sans`。
- 使用 `@layer components` 定义通用类：
  - `.glass-card`: `bg-white/5 backdrop-blur border border-white/10 shadow-lg`。
  - `.btn-primary`: 渐变背景 + `hover` 发光。
  - `.section-padding`: `py-16 md:py-24`。

## 5. 关键组件线框
- `Navbar`: 左侧品牌 + 中央导航 + 右侧 CTA（登录/注册）；移动端折叠。
- `Hero`: 标题、描述、CTA、背景粒子（`HeroBackground` 组件）。
- `ReportSection`: 包含标题、描述、图标、内容段落；可折叠。
- `ArticleCard`: 封面图 + 渐变遮罩 + 标题、标签、阅读时间。

## 6. 图标与插画
- 星座符号：SVG line icon + 轻微外发光。
- 生肖剪影：圆形框 + 金色描边。
- 背景纹理：使用 PNG/SVG 占位符（`/assets`），支持后续替换。

## 7. 可访问性
- 深色背景下保证文字对比度 ≥ 4.5。
- 支持键盘导航与 `focus-visible` 样式。
- 重要内容提供替代文字（图像、SVG）。

