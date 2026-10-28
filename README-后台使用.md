# Principia Lab · 知识节点编辑后台

这版保留原有小学、初中、高中三栏网页和独立实验页面，并新增可本地运行的 SQLite 编辑后台。

## Mac / Windows / Linux

安装 Python 3.10+；打开终端进入解压目录：

```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.server:app --host 127.0.0.1 --port 8000
```

打开浏览器：
- 管理后台：http://127.0.0.1:8000/admin
- 网站首页：http://127.0.0.1:8000/

编辑数据：切换学段 → 编辑或新增节点 → 填写 ID、名称、学科、公式、解释、局限、关联节点 → 保存。

后台将内容保存到 `backend/principia.db`，并同步生成 `content/nodes.js`。因此以后即使不启动服务器，直接双击 `index.html`，仍会读取最近保存的节点内容。

建议备份 `backend/principia.db` 和 `content/nodes.js`。后台默认仅绑定 `127.0.0.1`，没有登录鉴权，不要将其直接公开到互联网。

## 已知边界

- 后台当前可编辑三个学段的 **知识节点和关联边**；实验代码、二级目录的专题详细说明尚未迁入数据库。
- 对原有知识节点 ID 尽量不要改动。删除被其他节点引用的 ID 将造成关联失效；可使用「检查关联」发现这类问题。
- 某些原有实验示例是固定 HTML；后台新增节点不会自动生成新实验文件。
- 静态模式只支持阅读，编辑需运行上述 Python 后台。
