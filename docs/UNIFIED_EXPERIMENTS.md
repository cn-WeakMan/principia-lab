# 统一渲染器与独立实验插件（第二阶段）

- `public/level-renderer.js`：唯一的三学段主页 DOM 生成入口 `PLAB_RENDER_LEVEL(level, options)`；统一顶部、外层、挂载与页面级数据标记。原小学和初高中知识网络及参数面板的不同 DOM 仍作为级别适配内容保留，以确保旧功能兼容。**这不是所有控件内部实现都完全统一。**
- `public/plugins/primary/experiment-00.js` 至 `experiment-41.js`：42 个小学实验的独立算法文件，保留原算式、绘制方法和模型边界。
- `public/plugins/secondary/junior-0.js`、`junior-1.js`、`senior-0.js`、`senior-1.js`：4 个独立曲线模型。
- `public/plugins/primary-drawing.js`：小学实验共用的绘图工具。
- `public/experiment-plugins.js`：浏览器插件注册与调度，不加载远程脚本、不执行任意用户输入代码。
- `public/shared.js`：共用知识网络绘制、跨学段链接及后台公式实验适配机制。

注意：后端配置的公式实验通过已有动态注册路径进入浏览器注册表，并非一份永久的 JS 文件；53 个讲解 HTML 仍是讲解页面，不是可执行实验。后端 Python 插件注册表与前端 JavaScript 插件是两个独立执行环境，尚未合并。

## 新增一个小学实验

1. 参考 `public/plugins/primary/experiment-00.js` 创建独立插件文件，采用唯一 ID 与版本。
2. 在 `public/primary.html` 的 `primary.js` 前引入该脚本。
3. 按插件协议提供 `definition`、`run`，以及参数和绘图信息。
4. 运行 `python -m pytest -q tests`，并分别在 Safari、Edge 进行交互验证。

## 测试范围

目前仅进行了 JavaScript 语法检查、节点端插件注册/页面模板烟雾测试以及 Python 自动化测试；**未完成真实浏览器中的逐实验手工验收**。
