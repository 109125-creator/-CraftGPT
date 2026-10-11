/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BEDROCK_CONSTRAINTS } from '../data/specificationData';
import { ShieldCheck, AlertTriangle, XCircle, Info, HelpCircle } from 'lucide-react';

export const ConstraintsSection: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const filteredConstraints = BEDROCK_CONSTRAINTS.filter(c => {
    if (filter === 'all') return true;
    return c.verificationStatus === filter;
  });

  return (
    <div className="space-y-8">
      {/* 標題與說明 */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-amber-700 uppercase">
            規範章節 02 · 基岩版底層技術限制與決策矩陣
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Minecraft 基岩版 (Bedrock Edition) 技術邊界與決策
          </h2>
          <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
            基岩版使用 C++ 核心與 Bedrock Item Component 架構，與 Java 版的 NBT 標籤系統有根本性差異。
            本章節詳細分析各項真實技術限制、杜絕盲目套用 Java 概念，並將每一項假設標註驗證狀態。
          </p>
        </div>

        {/* 狀態過濾按鈕 */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            全部決策 ({BEDROCK_CONSTRAINTS.length})
          </button>
          <button
            onClick={() => setFilter('confirmed_working')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'confirmed_working'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            已確認可行 (Confirmed)
          </button>
          <button
            onClick={() => setFilter('requires_game_test')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'requires_game_test'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            待遊戲內驗證 (Pending Test)
          </button>
        </div>
      </div>

      {/* 決策對照表格 / 列表 */}
      <div className="space-y-4">
        {filteredConstraints.map(item => (
          <div
            key={item.id}
            className="bg-white border border-neutral-200 rounded-lg p-5 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                {item.topic}
              </h3>
              <div className="flex items-center gap-2 text-xs">
                {item.verificationStatus === 'confirmed_working' && (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    已確認技術可行
                  </span>
                )}
                {item.verificationStatus === 'requires_game_test' && (
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    待遊戲實體驗證
                  </span>
                )}
                {item.verificationStatus === 'known_limitation' && (
                  <span className="text-rose-700 font-medium flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    基岩版現行不可行
                  </span>
                )}
                <span className="text-neutral-400">·</span>
                <span className="text-neutral-500 font-mono capitalize">Cat: {item.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
              {/* Java 版誤區 */}
              <div className="bg-rose-50/50 p-3.5 rounded border border-rose-100">
                <span className="font-semibold text-rose-900 block mb-1.5">
                  常見 Java 版誤區 (Java Illusion)
                </span>
                <p className="text-rose-800 leading-relaxed">{item.javaVersusBedrock}</p>
              </div>

              {/* 基岩版實際現狀 */}
              <div className="bg-neutral-50 p-3.5 rounded border border-neutral-200">
                <span className="font-semibold text-neutral-800 block mb-1.5">
                  基岩版真實技術現狀 (Bedrock Reality)
                </span>
                <p className="text-neutral-600 leading-relaxed">{item.bedrockReality}</p>
              </div>

              {/* BlockForge 決策與解決方案 */}
              <div className="bg-emerald-50/50 p-3.5 rounded border border-emerald-100">
                <span className="font-semibold text-emerald-900 block mb-1.5">
                  BlockForge 架構決策 (Architectural Decision)
                </span>
                <p className="text-emerald-800 leading-relaxed">{item.solutionDecision}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 重大技術決策備忘區 */}
      <div className="bg-neutral-900 text-neutral-100 rounded-lg p-6 space-y-4">
        <h4 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400" />
          基岩版裝備製作黃金法則 (Bedrock Golden Invariants)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-300 leading-relaxed">
          <div className="space-y-1">
            <span className="text-white font-medium block">1. 裝備防具 Attachables 是必備渲染層</span>
            <p className="text-neutral-400">
              很多初學者只寫了 BP items 中的 wearable 便以為防具完成，結果穿在玩家身上透明無形。材質包的 attachables/*.json 骨架繫結絕對不可省略。
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-white font-medium block">2. 雙 UUID 必須成對綁定</span>
            <p className="text-neutral-400">
              BP 的 manifest.json 內的 dependencies 陣列必須精確指向 RP 的 header.uuid，否則在手機端與主機端載入時會導致材質包失效。
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-white font-medium block">3. 1.20.80+ 棄用舊版 minecraft:armor 與 on_use 語法</span>
            <p className="text-neutral-400">
              現代基岩版標準使用 `minecraft:wearable`。事件驅動轉移至 `minecraft:custom_components` 與 Script API，舊事件語法在未來版本隨時會完全失效。
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-white font-medium block">4. 數值邊界防禦機制</span>
            <p className="text-neutral-400">
              基岩版對 Durability 限制為整數 1 ~ 65535。若填入負數、小數或過大數值，遊戲載入該道具時可能引發 C++ Crash。編輯器必須在上游就卡死防呆。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
