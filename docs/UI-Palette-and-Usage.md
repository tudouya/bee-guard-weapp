# UI Palette and Usage

本文件总结了小程序的统一色板、全局工具类以及推荐用法，便于后续统一设计与快速落地。

## 1. 色板（Palette）
- 主色 primary：#07c160（品牌绿，用于主行动按钮、关键高亮）
- 成功 success：#52c41a（完成、通过）
- 警告 warning：#faad14（提醒、等待）
- 危险 danger：#ff4d4f（失败、错误）
- 信息 info：#2db7f5（中性信息）
- 价格强调（局部使用）：#d46b08（稳重橙，用于价格等强调，不刺眼）

说明：价格强调色暂未纳入全局工具类，如需统一，可新增 `.color-accent { color: #d46b08; }`。

## 2. 全局工具类（app.wxss）
- 文本色：
  - `color-primary` `color-success` `color-warning` `color-danger` `color-info`
- 背景色：
  - `bg-primary` `bg-success` `bg-warning` `bg-danger` `bg-info`
- 按钮体系：
  - 基类：`u-btn`（内联 flex、圆角、无边框、加粗）
  - 配色：`u-btn-primary`（品牌绿背景、白字、轻阴影）
  - 尺寸：`u-btn--xs` `u-btn--sm` `u-btn--md` `u-btn--lg`
  - 形态与宽度：`u-btn--pill`（大圆角 68rpx）、`u-btn-block`（宽度 100%）

以上类已在 `app.wxss` 定义，推荐在所有页面直接复用，避免重复硬编码色值。

## 3. 推荐用法（Patterns）
- 主要行动按钮（提交/下一步/支付）：
  - `u-btn u-btn-primary u-btn--md u-btn--pill u-btn-block`
- 次级按钮（页面内辅助 CTA）：
  - `u-btn u-btn-primary u-btn--sm`
- 文本高亮（关键数字/提示）：
  - `color-primary`
- 状态徽标/标签：
  - 完成：`color-success` 或浅底 `bg-success`
  - 进行/等待：`color-warning` 或浅底 `bg-warning`
  - 错误/失败：`color-danger` 或浅底 `bg-danger`
  - 中性信息：`color-info` 或浅底 `bg-info`
- 价格显示：
  - 使用 `#d46b08` 强调但不过度刺眼；若需要全局统一，新增 `color-accent` 并替换使用。

## 4. 示例（Examples）
```xml
<!-- 文本高亮 -->
<text class="color-primary">{{num}}人正在学习</text>

<!-- 主按钮（表单提交） -->
<button class="u-btn u-btn-primary u-btn--md u-btn--pill u-btn-block">提交</button>

<!-- 次按钮（小尺寸） -->
<button class="u-btn u-btn-primary u-btn--sm">查看全部</button>

<!-- 状态标签（浅底胶囊可搭配圆角） -->
<text class="bg-success" style="padding: 4rpx 12rpx; border-radius: 20rpx;">已完成</text>
```

## 5. 使用规范与建议
- 统一从全局工具类取色，避免在页面内写死色值，降低维护成本。
- 表单提交类按钮保持“等宽 + 大圆角”（`u-btn-block` + `u-btn--pill`），与卡片宽度一致、易于点击。
- 状态色使用语义色（success/warning/danger/info），提高信息可读性与一致性。
- 阴影、圆角已在按钮类中统一定义，页面无需重复定义。

## 6. 扩展与维护
- 如需新增品牌辅色或强调色，优先在 `app.wxss` 新增对应 `.color-*` / `.bg-*` 工具类，再在页面替换使用。
- 调整主题时，优先变更 `app.wxss` 中的工具类即可全站生效。

