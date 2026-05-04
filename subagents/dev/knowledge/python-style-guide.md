# Python 代码风格指南

## 一般原则

- PEP 8 为基线
- Black 格式化，无例外
- 类型注解全覆盖（mypy strict 模式）
- 函数 < 30 行，类 < 200 行

## 命名规范

| 类型 | 风格 | 示例 |
|------|------|------|
| 变量/函数 | snake_case | `get_user_by_id` |
| 类 | PascalCase | `UserService` |
| 常量 | UPPER_SNAKE | `MAX_RETRIES` |
| 私有 | _leading_underscore | `_internal_method` |
| Pydantic 字段 | snake_case | `created_at` |

## FastAPI 最佳实践

### 项目结构
```
app/
├── api/          # 路由层
├── core/         # 配置、安全、依赖
├── models/       # SQLAlchemy 模型
├── schemas/      # Pydantic schemas
├── services/     # 业务逻辑
├── repositories/ # 数据访问
└── tests/        # 测试
```

### 命名约定
- 路由文件：`users.py`, `items.py`
- Schema：`UserCreate`, `UserResponse`, `UserUpdate`
- 路由函数：`create_user`, `get_user`, `list_users`

## 异步编程

- I/O 密集用 `async def`
- CPU 密集用 `asyncio.to_thread()` 或进程池
- 数据库查询用 async driver（asyncpg）
- 避免在 async 函数里做同步阻塞操作

## 错误处理

```python
# 自定义异常继承体系
class AppError(Exception): ...
class NotFoundError(AppError): ...
class ValidationError(AppError): ...

# 全局异常处理器
@app.exception_handler(AppError)
async def app_error_handler(request, exc):
    return JSONResponse(status_code=400, content={"error": str(exc)})
```

## Pydantic 使用

- 用 Pydantic v2（`model_validate`, `model_dump`）
- 配置类用 `model_config = ConfigDict(...)`
- 复杂校验用 `@field_validator`
- 响应模型严格定义，不要用 `dict[str, Any]`

## 测试

- pytest + pytest-asyncio
- fixtures 管理测试数据
- Factory Boy 生成测试对象
- 测试覆盖率 > 80%
