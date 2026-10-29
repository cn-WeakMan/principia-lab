# 局域网访问（macOS / Linux）

## 启动

在项目根目录执行 `bash start.sh`，首次启动生成 `.plab-admin-token`，启动日志也会显示令牌。默认监听 `0.0.0.0:8000`，因此同一可信局域网的其他设备可以通过运行程序的电脑 IP 访问。若只需要本机访问：`PLAB_HOST=127.0.0.1 bash start.sh`。若 8000 端口占用：`PLAB_PORT=8080 bash start.sh`。

## 查询电脑局域网 IP

macOS Wi-Fi：`ipconfig getifaddr en0`（若 en0 不是 Wi-Fi，请用 `networksetup -listallhardwareports` 确认网卡）。Linux：`hostname -I`。假设查到 `192.168.1.20`，其他电脑、iPad 和手机访问 `http://192.168.1.20:8000`。数据库知识页面 `/graph/all`、`/knowledge/all` 需要输入启动时显示的管理员令牌，因为页面读取未发布草稿。后台 `/admin` 也需输入同一令牌。

## 访问故障

1. 确保设备连接同一个可互访的局域网；访客 Wi-Fi、AP 隔离可能阻断访问。
2. macOS 防火墙如出现 Python 入站连接提示，允许可信网络中的连接；不要为此关闭全部防火墙。
3. 确认启动窗口显示 `0.0.0.0:8000`，且访问的是电脑 IP 而不是 `127.0.0.1`。
4. 不要向公网转发该端口；当前只使用 HTTP，令牌明文在可信局域网传输。需要不可信网络远程访问时，应在外层部署 HTTPS、身份认证和访问控制。

## 数据与安全

`.plab-admin-token` 是管理员凭证，请勿随项目分享。备份项目时保管 `data/` 中的数据库；勿用其它计算机同时直接共享 SQLite 文件。所有设备访问同一个正在运行的后端，数据由后端统一读取。


### 总图谱访问说明（修复版）
- 首页嵌入的总图谱和未输入令牌的 `/graph/all`、`/knowledge/all` 使用 `/api/graph/published`，读取已发布的节点快照，不要求管理员令牌。
- 管理员填写令牌后，页面使用 `/api/graph/all` 读取 SQLite 中的最新草稿。
- 编辑节点后需要在后台点击“发布到网页”，才会更新访客所见的图谱。
- 若旧浏览器保存了失效令牌，可清理当前网站的 sessionStorage 中 `plab-token`，或在图谱页填写新的管理员令牌。
