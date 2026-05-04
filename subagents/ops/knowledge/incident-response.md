# 事件响应手册

## 告警分级处理

### 🟢 INFO — 信息级
- 单个非关键服务短暂不可用
- 资源使用率小幅超阈值
- **处理:** 记录日志，下一工作日排查

### 🟡 WARNING — 警告级
- 关键服务性能降级
- 资源使用率持续超阈值
- 错误率小幅上升
- **处理:** 30 分钟内响应，评估是否升级

### 🔴 CRITICAL — 严重级
- 核心服务不可用
- 数据丢失风险
- 安全事件
- **处理:** 5 分钟内响应，立即止损

## 常见故障排查清单

### 服务不可用
```
1. 检查进程状态: systemctl status <service>
2. 检查端口监听: ss -tlnp | grep <port>
3. 检查最近日志: journalctl -u <service> --since "10 min ago"
4. 检查资源: top, df -h, free -m
5. 检查网络: curl -v http://localhost:<port>/health
```

### 响应时间异常
```
1. 检查应用日志中的慢查询
2. 检查数据库连接池
3. 检查外部依赖响应时间
4. 检查 GC 日志（JVM 应用）
5. 检查 CPU 使用率和上下文切换
```

### 内存问题
```
1. 检查内存使用: free -h
2. 检查进程内存: ps aux --sort=-%mem | head
3. 检查 OOM 日志: dmesg | grep -i oom
4. 检查 swap 使用: swapon -s
5. 检查内存泄漏: valgrind / heap dump
```

### 磁盘问题
```
1. 检查磁盘使用: df -h
2. 检查 inode 使用: df -i
3. 查找大文件: find / -type f -size +100M -exec ls -lh {} \;
4. 检查日志轮转: logrotate -d /etc/logrotate.conf
5. 清理临时文件: tmpwatch /tmp
```

### 网络问题
```
1. 检查连接状态: ss -s
2. 检查 DNS 解析: dig <domain>
3. 检查路由: traceroute <target>
4. 检查防火墙: iptables -L -n
5. 检查带宽: iftop / nethogs
```

## 日志分析模式

### 常见错误模式

#### NullPointerException / NoneType
- 原因: 空值未处理
- 排查: 检查上游数据源、API 返回值

#### Connection Refused / Timeout
- 原因: 依赖服务不可达
- 排查: 检查目标服务状态、网络连通性

#### OOM Killed
- 原因: 内存不足被内核杀掉
- 排查: 调整内存限制、排查内存泄漏

#### Too Many Open Files
- 原因: 文件描述符泄漏
- 排查: 检查未关闭的连接/文件句柄

#### Rate Limited / 429
- 原因: 请求频率过高
- 排查: 实现指数退避、检查是否循环调用
