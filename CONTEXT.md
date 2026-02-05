# Technova 项目上下文

## 项目概述

**项目名称**: Technova
**类型**: SaaS 维修店管理系统
**状态**: 开发中

## 技术栈

### 前端
| 技术 | 版本 | 用途 |
|-----|------|-----|
| React | 18.x | UI 框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x | 构建工具 |
| Tailwind CSS | 3.x | 样式框架 |

### 后端服务
| 服务 | 用途 |
|-----|-----|
| Firebase Auth | 用户认证 |
| Firestore | 数据库 |
| Gemini API | AI 功能 |

### 开发工具
- ESLint + Prettier (代码规范)
- Git (版本控制)

---

## 项目结构

```
/technova
├── components/           # React 组件
│   ├── AIAssistant.tsx      # AI 聊天助手
│   ├── AdminLogin.tsx       # 管理员登录
│   ├── AttendancePanel.tsx  # 考勤面板
│   ├── CustomCaseCreator.tsx # 自定义手机壳
│   ├── Dashboard.tsx        # 管理仪表盘（含员工端）
│   ├── Hero3D.tsx           # Hero 组件
│   ├── KanbanBoard.tsx      # 看板
│   ├── ProductManager.tsx   # 产品管理
│   ├── RepairForm.tsx       # 维修表单
│   ├── RepairLookup.tsx     # 维修查询
│   ├── Storefront.tsx       # 客户门店页
│   └── SyncSettings.tsx     # 同步设置
│
├── services/             # 服务层
│   ├── authService.ts       # 认证服务
│   ├── firebase.ts          # Firebase 配置
│   ├── geminiService.ts     # Gemini API
│   └── productService.ts    # 产品服务
│
├── App.tsx               # 主应用入口
├── types.ts              # 全局类型定义
├── constants.ts          # 常量配置
├── index.tsx             # 入口文件
├── index.html            # HTML 模板
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 依赖管理
```

---

## 核心功能模块

### 1. 客户端 (Storefront)
- 维修预约
- 订单查询
- 产品浏览

### 2. 员工端 (Dashboard)
- 任务看板
- 工单处理
- 考勤打卡

### 3. 管理端 (Dashboard)
- 数据统计
- 用户管理
- 库存管理
- 员工管理

### 4. AI 功能 (AIAssistant)
- 智能诊断
- 客服问答
- 工单建议

---

## 设计约束

### 必须遵守
- TypeScript 严格模式 (`strict: true`)
- 组件单一职责原则
- Tailwind 原生类优先
- Firebase 安全规则

### 禁止事项
- 使用 `any` 类型
- 内联样式 (除动态值外)
- 在客户端存储敏感信息
- 未处理的 Promise rejection

---

## 命名规范

### 文件命名
- 组件: `PascalCase.tsx` (e.g., `RepairForm.tsx`)
- 服务: `camelCase.ts` (e.g., `authService.ts`)
- 类型: `camelCase.ts` 或内联

### 变量命名
- 组件: `PascalCase`
- 函数: `camelCase`
- 常量: `UPPER_SNAKE_CASE`
- 类型/接口: `PascalCase`

### CSS 类命名
- 使用 Tailwind 原生类
- 自定义类用 kebab-case

---

## 环境变量

```env
# .env.local
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_GEMINI_API_KEY=xxx
```

**注意**: 所有环境变量必须以 `VITE_` 开头才能在客户端访问。

---

## Git 工作流

### 分支策略
- `main`: 生产环境
- `develop`: 开发环境
- `feature/*`: 新功能
- `fix/*`: Bug 修复

### Commit 规范
```
<type>(<scope>): <description>

type: feat | fix | docs | style | refactor | test | chore
scope: component name or module
```

示例:
```
feat(RepairForm): add image upload
fix(auth): handle token expiration
```

---

## 常见任务命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览构建
npm run preview

# 类型检查
npx tsc --noEmit

# Lint
npm run lint
```

---

## 已知限制

1. **无 SSR**: 当前使用纯客户端渲染
2. **无测试**: 尚未配置测试框架
3. **无 CI/CD**: 手动部署
4. **无国际化**: 仅支持英文/中文硬编码

---

## 待办改进

- [ ] 添加单元测试 (Vitest)
- [ ] 配置 CI/CD (GitHub Actions)
- [ ] 添加错误追踪 (Sentry)
- [ ] 国际化支持 (i18next)
- [ ] PWA 支持

---

## 相关文档

- [AGENTS.md](./AGENTS.md) - Agent 定义
- [PRODUCT.md](./PRODUCT.md) - 产品定位
- [README.md](./README.md) - 项目说明
