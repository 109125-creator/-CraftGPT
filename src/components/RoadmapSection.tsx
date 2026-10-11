/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, CheckCircle2, AlertOctagon, Calendar, Milestone, ArrowDown } from 'lucide-react';

export const RoadmapSection: React.FC = () => {
  const phases = [
    {
      phase: '第一階段 · MVP 最小可行產品 (目前規劃範疇)',
      badge: 'Current Scope (MVP)',
      color: 'border-emerald-600 bg-emerald-50/20',
      description: '鎖定單件與多件基礎裝備的核心生命週期，建立穩固的 JSON 規範與打包管線。',
      deliverables: [
        '單件裝備屬性編輯器 (劍、斧、鎬、鏟、頭盔、胸甲、護腿、靴子)',
        '基礎原生物理屬性 (耐久度、傷害值、挖掘速度、防具防禦值、擊退抗性)',
        'PNG 圖片上傳校驗器 (2 的冪次方檢查、透明通道檢查)',
        '防具 3D 穿戴模型 Attachables 自動綁定管線',
        '基礎 3x3 有序合成配方編輯器與材料識別碼檢測',
        '本機專案儲存 (IndexedDB / LocalStorage) 與 JSON 備份匯入/匯出',
        '雙 UUID v4 關聯 manifest 生成與 .mcaddon ZIP 套件打包下載',
        '匯出前靜態診斷報告 (Diagnostic Report)'
      ],
      exclusions: '不包含：像素在線繪圖器、Script API 特殊腳本能力、裝備套裝連攜、雲端帳號'
    },
    {
      phase: '第二階段 · 體驗升級與受控能力 (Phase 2)',
      badge: 'Planned Next',
      color: 'border-blue-600 bg-blue-50/20',
      description: '加入內建像素繪製體驗，並引入經過實機嚴格驗證的 Level B 自訂元件能力。',
      deliverables: [
        '16x16 / 32x32 像素繪圖器 (格線、色盤、吸管、油漆桶、撤銷/重做)',
        '少數已驗證之 Level B 能力 (例如：攻擊點燃目標、持握常駐加速)',
        '自動注入 @minecraft/server Script 模組與 main.js 腳本生成',
        '多裝備同捆套裝加成 (Set Bonus) 腳本邏輯',
        '進階診斷面板 (自動檢測 Minecraft 原版標籤衝突)'
      ],
      exclusions: '不包含：AI 貼圖生成、跨版本降級轉換器'
    },
    {
      phase: '第三階段 · 智慧輔助與生態拓展 (Phase 3)',
      badge: 'Future Vision',
      color: 'border-purple-600 bg-purple-50/20',
      description: '拓展更多遊戲版本相容性，加入可控的 AI 設計建議與自動化測試套件。',
      deliverables: [
        'AI 輔助像素紋理生成 (受控調色盤與風格約束)',
        '自動化無頭 (Headless) 遊戲測試腳本與語法驗證器',
        '更多自訂工具類別 (例如：釣竿、弓、弩、剪刀、盾牌)',
        '社群模組範本分享與單鍵克隆機制'
      ],
      exclusions: '不包含：大規模 Java 版模組轉譯'
    }
  ];

  const risks = [
    {
      risk: 'Minecraft 基岩版版本更新頻繁導致元件棄用 (Component Deprecation)',
      impact: '高',
      probability: '高',
      mitigation: '將版本規格集中於 Version Schema Registry，避免寫死在 UI 元件中；預設採用當前正式發布之 1.20.80 / 1.21.0 規範。'
    },
    {
      risk: '使用者填寫錯誤的材料識別碼導致合成配方無效',
      impact: '中',
      probability: '高',
      mitigation: '在配方編輯器內建 Minecraft 原版合法物品識別碼自動補全字典，禁止隨意鍵入不存在的材料。'
    },
    {
      risk: '防具穿在身上隱形或材質跑版 (Missing Attachables)',
      impact: '極高',
      probability: '中',
      mitigation: '打包引擎強制檢查防具項目；若缺少自訂貼圖，自動 Fallback 套用標準預設骨架與材質變數。'
    },
    {
      risk: '虛報測試狀態引發使用者信任危機',
      impact: '極高',
      probability: '低',
      mitigation: '嚴格在 UI 上分離「靜態檢查通過」、「套件生成成功」、「真機已驗證」三大狀態，杜絕未測先報成功。'
    }
  ];

  const devSequence = [
    { step: 1, title: '底層 Schema 與型別系統確定', detail: '定義 EquipmentItem, CraftingRecipe, BlockForgeProject TypeScript 介面。' },
    { step: 2, title: '確定性 Bedrock 序列化器實作', detail: '撰寫 BP/items, RP/items, RP/attachables, manifests 純函數生成邏輯與單元測試。' },
    { step: 3, title: '靜態診斷器 (Diagnostic Engine)', detail: '實作識別碼防呆、數值邊界、UUID 驗證、缺失貼圖警告機制。' },
    { step: 4, title: '裝備與屬性編輯介面開發', detail: '打造武器、工具、防具之專屬欄位表單與數值調整器。' },
    { step: 5, title: '貼圖上傳校驗器與配方編輯器', detail: '完成 PNG 2 的冪次方自動檢驗與 3x3 合成網格互動。' },
    { step: 6, title: '專案管理與 .mcaddon 打包匯出', detail: '結合 JSZip 進行標準行為包與材質包打包，生成可匯入之 .mcaddon。' }
  ];

  return (
    <div className="space-y-8">
      {/* 標題與原則 */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-rose-700 uppercase">
            規範章節 05 · MVP 範疇、風險清單與開發順序
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            階段路徑規劃 (Roadmap) 與品質驗收標準
          </h2>
          <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
            嚴格劃分 MVP 與未來功能界線，避免專案範疇無止境膨脹 (Scope Creep)。每一步開發皆遵循「架構先於 UI、驗證先於發布」的工程準則。
          </p>
        </div>
      </div>

      {/* 階段規劃卡片 */}
      <div className="space-y-4">
        {phases.map((ph, idx) => (
          <div key={idx} className={`bg-white border rounded-lg p-5 ${ph.color}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/60 pb-3">
              <div>
                <span className="text-xs font-mono font-semibold text-neutral-500 uppercase">
                  {ph.badge}
                </span>
                <h3 className="text-base font-bold text-neutral-900 mt-0.5">{ph.phase}</h3>
              </div>
            </div>

            <p className="text-xs text-neutral-600 mt-2.5">{ph.description}</p>

            <div className="mt-4 pt-3 border-t border-neutral-200/50">
              <span className="text-xs font-semibold text-neutral-800 block mb-2">核心交付項目：</span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-neutral-700">
                {ph.deliverables.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 pt-2 text-xs text-neutral-500 italic">
              邊界約束：{ph.exclusions}
            </div>
          </div>
        ))}
      </div>

      {/* 推薦開發順序流程 */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2 mb-4">
          <Milestone className="w-4 h-4 text-neutral-700" />
          建議開發循序 (Chronological Engineering Sequence)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devSequence.map(seq => (
            <div key={seq.step} className="bg-neutral-50 p-4 rounded border border-neutral-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-neutral-400 block mb-1">
                  STEP 0{seq.step}
                </span>
                <h4 className="text-sm font-semibold text-neutral-900 mb-1.5">{seq.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">{seq.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 風險清單與緩解策略 */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2 mb-4">
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          關鍵風險註冊表 (Risk Register)
        </h3>

        <div className="divide-y divide-neutral-100">
          {risks.map((r, i) => (
            <div key={i} className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="md:w-1/2">
                <span className="font-semibold text-neutral-900 block mb-1">{r.risk}</span>
                <p className="text-neutral-500">緩解方案: {r.mitigation}</p>
              </div>
              <div className="flex items-center gap-4 text-neutral-600 font-mono">
                <span>影響度: <strong className="text-rose-700">{r.impact}</strong></span>
                <span>發生機率: <strong className="text-amber-700">{r.probability}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
