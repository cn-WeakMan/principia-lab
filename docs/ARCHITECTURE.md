# Principia Lab 兼容性模块化架构（已实施范围）

本版保留现有 HTML/JS 教学页面和 FastAPI HTTP 路由，**没有**迁移为 Vue、完整插件化所有既有实验或彻底拆分 API 路由。

## 当前模块边界

- `backend/server.py`：原有 API 路由、数据校验与协调层（兼容入口 `backend.server:app`）。
- `backend/core/storage.py`：数据库路径、初始种子、连接与事务生命周期。
- `backend/core/publishing.py`：公开数据快照的 JS 序列化与原子文件替换。
- `backend/plugin_system/contracts.py`：后端模型插件协议。
- `backend/plugin_system/registry.py`：可信插件注册、发现以及重复 ID 检查。
- `backend/plugin_system/builtins.py`：示例匀加速模型（尚未连接到旧实验页面）。
- `backend/formulas.py`：保留现有 AST 公式安全验证。
- `backend/xlsxio.py`：保留既有 XLSX 读写。
- `public/shared.js`：保留三学段现有共享知识图谱和公式渲染能力。

## 约束与迁移路线

1. 首先维持旧页面、旧 API、原学段 ID、现有数据库结构，避免一次性切换 UI 技术栈。
2. 逐步将 `server.py` 的课程、节点、实验、知识图谱路由迁移到独立 `APIRouter`，保持路径和响应字段不变。
3. 将实验模型分为 `experiment definition`、`calculation plugin`、`renderer` 三个可独立版本化的对象。
4. 当需要将一个旧 JS 实验迁入插件时，先写数值/绘图基准测试，再拆出计算模型。
5. 仅注册可信、内置 Python 插件。不得把用户上传的 Python 文件直接导入主应用进程。
6. 再评估迁移数据库 schema、统一小学/初中/高中页面渲染器以及后台编辑工作流。

## 数据保护

发布操作先提交版本记录，之后执行 SQLite 在线备份，最后以临时文件+`os.replace` 更新各个静态 JS 文件。两份静态文件单独原子更新，**不代表双文件整体事务发布**；需要严格一致性时应引入带版本目录的发布指针机制。

## 运行及测试

`bash start.sh`，然后访问 `http://127.0.0.1:8000/`。

`python3 -m pip install pytest httpx` 与 `python3 -m pytest -q tests`。
