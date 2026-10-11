/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const FULL_MARKDOWN_SPEC = `# BlockForge Studio — Minecraft 基岩版裝備模組生成器規格與技術架構書

**版本**: v1.0.0-PROPOSAL (規劃階段)  
**目標遊戲平台**: Minecraft: Bedrock Edition (Windows / iOS / Android / Xbox / PS / Switch)  
**目標遊戲版本**: 1.20.80+ / 1.21.0+ (統一採用現代 Item Component 規格)  
**核心定位**: 輕量、直覺、高度可靠的基岩版專用裝備 Add-On 生成器。非全功能通用模組引擎，專注單件/多件自訂裝備、武器、防具與工具之完整生命週期。

---

## 一、產品原則與設計哲學

1. **單件精細度，多件底層架構**：以單件裝備的極致配置體驗為核心，但專案底層支援集合多件自訂物品打包為單一 .mcaddon。
2. **基岩版原生優先，拒絕 Java 誤導**：嚴格依循基岩版 C++ 引擎的 \`minecraft:item\` 元件體系，禁止使用不存在的 Java NBT Modifier 語法。
3. **明確能力分級 (Level A / B / C)**：
   - **Level A (原生元件)**：100% 由純 JSON 元件實現 (耐久、防禦、附魔適性、開採速度)，零腳本依賴。
   - **Level B (Script API 自訂元件)**：需依賴 \`@minecraft/server\` 腳本實現 (擊中點燃、常駐加速)，需明確標記實驗性依賴。
   - **Level C (現行基岩版不可行)**：目前官方 API 無法穩定支持者 (如直接篡改玩家屬性上限、無回調吸血)，嚴格禁止虛假宣稱。
4. **領域模型與遊戲檔案徹底分離**：使用者編輯的是型別化領域模型 (\`EquipmentItem\`)，由確定性編譯管線轉換為 Bedrock JSON。
5. **四重驗證狀態分開呈現**：
   - 狀態 1：靜態 Schema 檢查通過
   - 狀態 2：套件物理結構生成完備
   - 狀態 3：目標遊戲版本真機測試通過
   - 狀態 4：特定能力遊戲內效果實裝確認
   絕不在靜態編譯成功時謊稱「遊戲測試成功」。

---

## 二、基岩版關鍵技術限制與架構決策

### 1. 現代格式版本 (Format Version 1.20.80+ / 1.21.0+)
- **背景**：基岩版在 1.20.80 對物品元件做了大幅重構，棄用了舊版 \`minecraft:armor\` 與 \`minecraft:on_use\`。
- **決策**：全系統預設產出 \`format_version: "1.20.80"\` 或 \`"1.21.0"\`。
- **防具設定**：統一使用 \`minecraft:wearable\`，包含 \`slot\` 與 \`protection\`。

### 2. 防具 3D 穿戴模型 Attachables 必備性
- **基岩版限制**：若僅在行為包聲明 \`minecraft:wearable\`，玩家穿戴時在世界中呈現「全透明/隱形」。
- **決策**：生成引擎自動於材質包 \`RP/attachables/\` 生成對應的 attachable JSON，綁定標準人型骨架幾何 (\`geometry.humanoid.armor.helmet/chestplate/leggings/boots\`) 與雙層材質。

### 3. 雙向 UUID v4 與相依性綁定
- **基岩版限制**：Behavior Pack 與 Resource Pack 必須擁有不同 UUID v4，且 BP 的 \`dependencies\` 必須精確指向 RP 的 \`header.uuid\`。
- **決策**：打包器生成成對綁定的 UUID，杜絕遊戲載入時出現「找不到相依材質包」之致命錯誤。

---

## 三、三層資料模型 (TypeScript Data Models)

\`\`\`typescript
export interface BlockForgeProject {
  metadata: {
    id: string;
    name: string;
    namespace: string; // 如 "custom_pack"
    version: [number, number, number];
    targetBedrockVersion: '1.20.80' | '1.21.0';
  };
  items: EquipmentItem[];
  assets: TextureAsset[];
}

export interface EquipmentItem {
  id: string;
  identifier: string; // "namespace:item_id"
  displayName: string;
  type: 'sword' | 'axe' | 'pickaxe' | 'shovel' | 'helmet' | 'chestplate' | 'leggings' | 'boots';
  attributes: {
    durability: number;
    attackDamage?: number;
    miningSpeed?: number;
    armorProtection?: number;
    armorSlot?: string;
    enchantmentValue: number;
    repairItems: string[];
  };
  abilities: AppliedAbility[];
  recipe?: CraftingRecipe;
}
\`\`\`

---

## 四、功能優先級與里程碑規劃

- **第一階段 (MVP)**：
  - 8 種核心裝備屬性編輯器
  - PNG 圖片上傳校驗 (2 的冪次方、透明通道檢查)
  - 3x3 有序合成配方編輯器
  - 確定性 Bedrock 檔案生成 (BP/RP/Attachables/Lang)
  - 靜態診斷引擎與 .mcaddon 打包下載
- **第二階段 (Phase 2)**：
  - 內建 16x16 / 32x32 像素繪圖器
  - 受控的 Level B 能力與自動 Script API 腳本注入
  - 裝備套裝 (Set Bonus) 連攜
- **第三階段 (Phase 3)**：
  - AI 輔助像素調色與草稿建議
  - 自動化 Headless 遊戲驗證
`;
