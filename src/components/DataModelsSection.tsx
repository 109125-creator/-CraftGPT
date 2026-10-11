/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, FileJson, ArrowRight, Copy, Check, GitCommit, Layers } from 'lucide-react';

export const DataModelsSection: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const projectModelTs = `// 專案頂層實體 (Project Aggregate Root)
export interface BlockForgeProject {
  metadata: ProjectMetadata;      // 專案名稱、命名空間、版本號、目標遊戲版本
  items: EquipmentItem[];         // 支援同專案內收納多件裝備 (劍、鎬、防具等)
  assets: TextureAsset[];         // 圖片與貼圖資產庫 (以 assetId 關聯)
}

export interface ProjectMetadata {
  id: string;                     // 內部 UUID
  name: string;                   // 專案名稱 (如 "熾炎深淵裝備包")
  namespace: string;              // 唯一命名空間 (如 "infernal_abyss")
  description: string;
  version: [number, number, number]; // [1, 0, 0]
  targetBedrockVersion: '1.20.80' | '1.21.0' | '1.21.20+';
  author: string;
  createdAt: number;
  updatedAt: number;
}`;

  const equipmentModelTs = `// 單件裝備領域實體 (Equipment Item Domain Model)
export interface EquipmentItem {
  id: string;                     // 內部 GUID
  identifier: string;             // 基岩版完整 ID (如 "infernal_abyss:flame_reaver")
  displayName: string;            // 遊戲內語言包名稱 (如 "熾炎收割者")
  description: string;            // 物品說明 (Lore)
  type: EquipmentType;            // 'sword' | 'axe' | 'pickaxe' | 'helmet' | 'boots' 等
  category: 'weapon' | 'tool' | 'armor';
  targetVersion: TargetBedrockVersion;
  
  // 資產關聯引用 (不直接塞 Base64，保持輕量)
  iconAssetId?: string;           // 物品欄 16x16 圖示資產 ID
  armorLayer1AssetId?: string;    // 防具穿戴模型貼圖 Layer 1 (64x32/64x64)
  armorLayer2AssetId?: string;    // 護腿穿戴模型貼圖 Layer 2
  
  // 嚴格型別化裝備屬性
  attributes: {
    maxStackSize: number;         // 預設 1
    durability: number;           // 1 ~ 65535
    isHandEquipped: boolean;      // 工具持握渲染標誌
    canDestroyInCreative: boolean;
    attackDamage?: number;        // 武器攻擊力
    miningSpeed?: number;         // 工具開採速度
    armorProtection?: number;     // 防具防禦點數 (1 ~ 20)
    armorSlot?: ArmorSlot;        // 'slot.armor.head' | 'chest' | 'legs' | 'feet'
    enchantableSlot?: string;     // 附魔槽位
    enchantmentValue: number;     // 附魔能力 (0 ~ 30)
    repairItems: string[];        // 修復材料 (如 ["minecraft:diamond"])
  };
  
  abilities: AppliedAbility[];    // 掛載的特殊能力清單
  recipe?: CraftingRecipe;        // 3x3 有序或無序合成配方
}`;

  const pipelineSteps = [
    {
      step: '01. 領域資料收集',
      desc: '使用者於 UI 配置屬性、上傳貼圖與繪製配方，儲存為正規化 JSON 領域模型。',
      target: 'BlockForgeProject Model'
    },
    {
      step: '02. 靜態完整性診斷',
      desc: '執行 RFC4122 UUID 檢驗、命名空間合法性、貼圖引用完整度、數值邊界防呆。',
      target: 'Pre-Export Validation Matrix'
    },
    {
      step: '03. 確定性模板編譯',
      desc: '依目標版本 (1.20.80+) 產生 BP/items、RP/items、RP/attachables、recipes 與 lang。',
      target: 'Deterministic JSON Serialization'
    },
    {
      step: '04. 打包與雙向校驗',
      desc: '注入 manifest 雙向 UUID 依賴，將 BP 與 RP 組裝壓縮為標準 .mcaddon。',
      target: '.mcaddon Distribution Artifact'
    }
  ];

  return (
    <div className="space-y-8">
      {/* 標題與架構原則 */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-blue-700 uppercase">
            規範章節 03 · 系統資料模型與生成架構
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            領域資料結構 (Domain Models) 與 Add-On 生成管線
          </h2>
          <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
            核心架構嚴格落實「使用者裝備資料」與「最終遊戲檔案」徹底分離。專案層級支援多件裝備、資產以索引引用避免冗餘，生成引擎採用確定性狀態機轉換，杜絕不確定的黑盒生成。
          </p>
        </div>
      </div>

      {/* 三層資料模型與管線流程圖 */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-neutral-700" />
          Add-On 確定性編譯管線流程 (Deterministic Pipeline)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {pipelineSteps.map((p, idx) => (
            <div key={idx} className="bg-neutral-50 p-4 rounded border border-neutral-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 block mb-1">
                  {p.step}
                </span>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-200 text-xs font-mono text-neutral-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="truncate">{p.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TypeScript 資料模型展示 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Model */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-neutral-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              專案聚合根資料模型 (Project Model)
            </span>
            <button
              onClick={() => copyToClipboard(projectModelTs, 'project')}
              className="text-neutral-500 hover:text-neutral-900 p-1 rounded transition-colors"
              title="複製 TypeScript 原始碼"
            >
              {copiedKey === 'project' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-neutral-800 bg-neutral-950 text-neutral-100 overflow-x-auto flex-1 leading-relaxed">
            <code>{projectModelTs}</code>
          </pre>
        </div>

        {/* Equipment Model */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-neutral-800 flex items-center gap-1.5">
              <FileJson className="w-3.5 h-3.5 text-emerald-600" />
              單件裝備領域實體模型 (Equipment Item Model)
            </span>
            <button
              onClick={() => copyToClipboard(equipmentModelTs, 'equipment')}
              className="text-neutral-500 hover:text-neutral-900 p-1 rounded transition-colors"
              title="複製 TypeScript 原始碼"
            >
              {copiedKey === 'equipment' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-neutral-800 bg-neutral-950 text-neutral-100 overflow-x-auto flex-1 leading-relaxed">
            <code>{equipmentModelTs}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
