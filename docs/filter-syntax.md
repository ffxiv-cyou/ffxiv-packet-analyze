# 报文过滤表达式语法

FFXIV Packet Analyzer 的过滤框支持类 Wireshark 的显示过滤表达式，可以按 IPC 结构体字段做细粒度筛选。

```
ActorControlSelf.category == 109 && ActorControlSelf.param1 == 231560
```

## 1. 快速过滤（兼容旧写法）

如果整段输入只由 `数字 / opcode / 名字` 用逗号分隔组成，会按旧的 opcode 列表处理，等价于 `opcode in { ... }`：

```
0x02D2, 0x0123
ActorControlSelf, Examine
```

## 2. 字面量

| 形式 | 例子 |
|---|---|
| 十进制 | `109` |
| 十六进制 | `0x6D`、`0xFFFFFFFFFFFFFFFF` |
| 二进制 | `0b1011` |
| 浮点 | `1.5`、`1e3` |
| 字符串 | `"LogMsg"`、`'金币'` |
| 布尔 | `true`、`false` |

超过 `2^53-1` 的整数字面量会以 BigInt 处理（用于 `uint64`/`int64` 字段）。数字里可以用 `_` 分隔：`0xFFFF_FFFF`。

## 3. 命名空间与字段引用

字段引用**必须带前缀**（不允许裸字段名）。

| 写法 | 含义 |
|---|---|
| `packet.opcode` | opcode |
| `packet.dir` | 方向，值为 `c` / `s`（也接受 `client` / `server`） |
| `packet.len` / `packet.length` | 报文长度（含 32 字节头） |
| `packet.epoch` | 时间戳（毫秒） |
| `packet.conn` | 连接名 |
| `packet.self` | `source_actor == target_actor` |
| `hdr.src` / `hdr.source` / `hdr.sourceActor` | 32 字节头 offset 4 的 source_actor (uint32 LE) |
| `hdr.dst` / `hdr.target` / `hdr.targetActor` | 32 字节头 offset 8 的 target_actor (uint32 LE) |
| `ipc.name` | 运行时按方向解析出的 IPC 类型名，如 `ActorControlSelf` |
| `data[i]` | 整包第 i 个字节（0 基，含 32 字节头） |
| `data[a:b]` | 整包字节切片（`[a, b)`），返回字节序列 |
| `payload[i]` / `payload[a:b]` | 去掉 32 字节头之后的字节 |

IPC 字段：`<Type>.<field>...`，`<Type>` 接受 `ActorControlSelf`、`FFXIVIpcActorControlSelf` 或 `opcode_alias.json` 中的别名。

```
ActorControlSelf.param1
ClientTrigger.position.X
PartyList.member[0].name
StatusEffectList.effect[2].effect_id
```

- 嵌套结构体用 `.` 继续下钻。
- 数组用静态下标 `[i]`；结构体数组按 `i * 元素大小` 计算偏移。
- 单独写一个类型名（如 `ActorControlSelf`）表示“该包是这个 IPC 类型”。

## 4. 子类型（判别联合）

`ActorControlSelf` / `ActorControl` / `ActorControlTarget` 的 `param1..param6` 语义由判别字段 `category` 决定；`ClientTrigger`（若该版本有这个 IPC）由 `commandId` 决定。用点号子类型段声明分支：

```
ActorControlSelf.LogMsg.param1 == 7313
ActorControlSelf.StatusEffectGain.param1 == 石化
ActorControlSelf.LogMsg.param1 == 7313
```

解析时会自动展开为 `category == <LogMsg 的值> && <字段读取>`，并让 `param1` 按该分支的别名表（LogMessage / ItemId / Status …）解析右值。

等价的显式写法：

```
ActorControlSelf.category == LogMsg && ActorControlSelf.param1 == 7313
```

## 5. 运算符

优先级从低到高：

| 优先级 | 运算符 |
|---|---|
| 1 | `\|\|`、`or` |
| 2 | `&&`、`and` |
| 3 | `!`、`not`（前缀） |
| 4 | `==`、`!=`、`>`、`>=`、`<`、`<=`、`contains`、`matches`、`startswith`、`endswith`、`in`、`not in` |
| 5 | `\|` |
| 6 | `^` |
| 7 | `&` |
| 8 | `+`、`-` |
| 9 | `*`、`/`、`%` |
| 10 | `-`、`~`（前缀） |

- 集合：`ipc.name in {ActorControlSelf, Examine}`、`opcode not in {0x02D2, 0x0123}`
- 位运算：`(UpdateClassInfo.level & 0xff) == 90`
- 正则：`PartyList.member[0].name matches "^Jim"`（JS 正则，区分大小写）
- 字符串：`contains` / `startswith` / `endswith`（大小写敏感）
- `has(<字段>)`：判断字段是否存在

## 6. 右值解析（枚举与本地化名）

比较运算的右值会按左侧字段的类型**上下文化**解析，顺序如下：

1. 判别字段 → `ActorControlType` / `ClientTriggerType`（`src/data/ipc_extra_enum.json`）
2. 字段类型是 `ipc_structs.json` 里的枚举 → 如 `InventoryModifyHandler.action == Split`
3. `keyMapping` 上下文（含点号子类型段）→ LogMessage / ItemId / Status / ClassJob / Action
4. `db.json` 本地化名反查 → `Examine.catalogId == "金币"`，裸写 `== 金币` 也可
5. 值位置上的 IPC 类型名 → 解析为 opcode（`packet.opcode == ActorControlSelf`）

```
ActorControlSelf.category == StatusEffectGain
InventoryModifyHandler.action == Split
Examine.catalogId == "金币"
UpdateClassInfo.classId == 白魔法师
ActorControlSelf.LogMsg.param1 == "向???发送了入队邀请。"
packet.opcode == ActorControlSelf
```

同名本地化名（如 `Item` 里有大量重名）取最小 ID，并给出 warning。

## 7. 求值语义

- 整数按 number 比较，`uint64`/`int64` 按 BigInt 比较，两者混合时自动提升。
- 浮点用精确 `==`。
- 字节序列与数字比较时，按**小端无符号整数**解释：`data[16:20] == 0x11223344`。
- 字符串字段：`int8`/`uint8` 数组且字段名以 `name` 结尾，或遇到 `0` 终止。
- **缺值**（类型不匹配 / 长度不足 / 字段不存在）：该叶子为“无值”，所有比较（**包括 `!=`**）都为 `false`。用 `has()` 显式判断存在性。
- `&&` / `||` 短路。

## 8. 示例

```
ActorControlSelf.category == 109 && ActorControlSelf.param1 == 231560
ActorControlSelf
dir == c && ActorControlSelf.category == StatusEffectGain
ipc.name in {ActorControlSelf, ActorControlTarget, ActorControl}
ActorControlSelf.LogMsg.param1 == 7313
InventoryModifyHandler.action == Split && (InventoryModifyHandler.param1 & 0xFFFF) != 0
PartyList.member[0].name contains "Jim"
Examine.catalogId == "金币"
data[18] == 0xD2 && packet.self
packet.len > 100 && !(ipc.name == ActorControl)
```
