# React 最佳实践

## 组件设计

### 原子设计原则
- **Atoms:** 最小组件（Button, Input, Label）
- **Molecules:** 原子组合（SearchBar = Input + Button）
- **Organisms:** 复杂区域（Header, Sidebar）
- **Templates:** 页面布局
- **Pages:** 具体页面

### 组件拆分规则
- 单一职责：一个组件只做一件事
- props < 7 个：超过则考虑拆分或使用 config 对象
- 复杂度阈值：函数超过 50 行考虑拆分

## 状态管理

### 选择指南
| 场景 | 推荐方案 |
|------|----------|
| 本地 UI 状态 | useState / useReducer |
| 服务端数据 | React Query / SWR |
| 全局客户端状态 | Zustand / Jotai |
| 表单状态 | React Hook Form |
| URL 状态 | nuqs / searchParams |

### 避免
- 不要把所有状态都放到全局 store
- 不要用 useState 存可派生数据
- 不要在 useEffect 里做复杂数据转换

## 性能优化

### 何时使用 memo
- 列表项组件 ✅
- 频繁重渲染的父组件下的子组件 ✅
- 简单的展示组件 ❌（收益不大）

### 虚拟化
- 列表 > 100 项：用 react-window / react-virtuoso
- 表格 > 50 行：用 TanStack Virtual

## TypeScript

- 所有 props 定义 interface
- 避免 `any`，至少用 `unknown`
- 函数组件用 `FC<Props>` 或直接 props 解构
- 事件处理用具体类型：`React.ChangeEvent<HTMLInputElement>`

## 测试

- 组件测试：React Testing Library
- 用户行为优先（点击、输入、可见性）
- 避免测试实现细节
- MSW 模拟 API
