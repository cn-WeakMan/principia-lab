# Principia Lab · 模块化兼容版

## 启动（macOS/Linux）

```bash
cd principia-lab
bash start.sh
```

浏览器访问 http://127.0.0.1:8000 ，管理页面 http://127.0.0.1:8000/admin 。

源码公开区仅为 `public/`；`backend/`、`data/`、`scripts/` 不对外提供静态访问。默认只绑定本机回环地址，不要直接改成 `0.0.0.0` 暴露管理端。远程部署必须使用反向代理身份验证、HTTPS，且设置随机 `PLAB_ADMIN_TOKEN`。令牌在管理页输入栏中填写，保存在当前浏览器标签页会话内。

编辑操作先写 SQLite 草稿，点击「发布到网页」才重新生成 `public/content/nodes.js` 与 `catalog.js`。数据库首次运行由 `data/seed.db` 复制。运行态 DB 不要提交到版本控制。

## 后台接口

- `GET/PUT /api/nodes`, `DELETE /api/nodes/{level}/{id}`
- `GET/PUT /api/edges`, `DELETE /api/edges/{sl}/{sid}/{tl}/{tid}/{rel}`
- `GET/PUT /api/branches`, `GET/PUT /api/experiments`
- `GET /api/check`, `POST /api/repair`, `POST /api/publish`
- `GET /api/revisions`, `POST /api/rollback/{id}`
- `GET /api/export/{table}` (CSV, Excel 兼容), `POST /api/import/{branches|experiments}` (CSV 请求体)

编辑接口本机可用；配置 `PLAB_ADMIN_TOKEN` 后需提供 `X-Admin-Token` 请求头。每次保存自动生成草稿历史，发布前备份。

## 兼容性说明

原有小学、初中、高中页面及动画计算保留在 `public/primary.js` 和 `public/app.js`；节点数据仅由数据库生成的 `nodes.js` 提供，二级目录由 `catalog.js` 提供。实验元信息进入独立表，但新实验的计算函数仍需开发者为指定 model_key 编写并审核，**不能通过后台输入任意 JavaScript 执行**。跨学段关系由 `edges` 表管理，概念详情显示跨学段跳转。离线直接打开静态 HTML 时若浏览器限制 file:// 资源，请通过本地 HTTP 服务访问。

运行静态与接口测试：`python -m pytest tests -q`（需要额外安装 pytest/httpx）。浏览器 Safari/Edge 尚需用户实际环境手动验证。

## 2026-10-28 · 四项补充升级

1. **后台无代码实验**：`/admin` 选择“新建无代码公式实验”，填写实验 ID、学段、名称、参数 JSON 和算式，例如 `a*x^2+b`。公式支持 `x`、自定义参数、加减乘除、指数 `^`、以及 `sin/cos/tan/sqrt/abs/log/exp/min/max/pow/floor/ceil`；后台按受限 Python AST 验证语法，网页用纯 JavaScript 数学表达式解析器计算，不使用 `eval`。支持 line / scatter / bar 展示。原有需要自定义逻辑的复杂教学实验继续保留原 JS 实现，并未强行转译；新加的**公式类**实验可完全后台配置。
2. **三学段共享渲染**：`public/shared.js` 内的 `PLAB_GRAPH`、`PLAB_GRAPH_CONTROLS`、`PLAB_CONFIG_LABS` 为小学、初中、高中提供同一知识图谱核心、层级控制和公式实验视图。三学段现有不同的页面排版、目录和详情仍由适配层分别管理，避免破坏原教学功能。
3. **自动布局和筛选**：图谱使用确定性力引导模拟布局（100 次迭代，原始 SVG 图幅不缩放）；支持既有学科搜索及新增 1/2/3 层邻居筛选，节点支持键盘 Enter/空格选择。大规模概念图仍可进一步提升性能。
4. **真正 XLSX**：`GET /api/xlsx/export` 导出四张工作表；`POST /api/xlsx/import` 读取 Excel 2007+ `.xlsx` 工作簿并按主键覆盖/新增、整体验证后提交草稿；后台新增上传及下载入口。使用标准 ZIP + SpreadsheetML，无第三方 Excel 包依赖。支持文本和普通数字单元格，**不支持公式求值、单元格格式或宏**；导入不删除工作簿未列出的记录。

注意：修改实验或 Excel 导入后需要手动点击“发布到网页”。如使用服务器对外访问，请配置令牌/鉴权。已有内容仍为离线发布快照；需要重新运行测试请执行 `python -m pytest tests -q`。

## 2026-10-29 · 兼容性架构优化

保持旧前端、原 API 和 SQLite 表结构不变，新增 `backend/core/storage.py` 数据库事务模块、`backend/core/publishing.py` 原子快照发布模块和 `backend/plugin_system/` 可信模型插件协议、注册表及参考模型。数据库备份改为写事务提交后使用 SQLite 在线备份。新增模块回归测试；`GET /api/plugins` 可列出已注册可信模型（编辑权限受原策略保护）。

**当前插件接口只是扩展基础设施**，旧实验仍由其现有 JS 逻辑执行，尚不能经后台任意安装、启用新模型。具体迁移边界与后续工作见 `docs/ARCHITECTURE.md`。
