/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PRD_CORE_SECTIONS } from '../data/specificationData';
import { CheckCircle2, ChevronRight, Layers, FileCode, Sliders, ShieldAlert } from 'lucide-react';

export const PrdSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(PRD_CORE_SECTIONS[0].id);

  const currentSection = PRD_CORE_SECTIONS.find(s => s.id === activeTab) || PRD_CORE_SECTIONS[0];

  return (
    <div className="space-y-8">
      {/* 模組總覽與導覽列 */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
            規範章節 01 · 產品功能需求規格書
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            BlockForge Studio 核心功能模組規格
          </h2>
          <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
            專門針對 Minecraft 基岩版 (Bedrock Edition) 裝備 Add-On 規劃。所有功能皆確立明確的用途、輸入資料、產出產物、技術邊界與驗收標準，杜絕空泛功能承諾。
          </p>
        </div>

        {/* 橫向切換選單 */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          {PRD_CORE_SECTIONS.map(sec => {
            const isActive = sec.id === activeTab;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                {sec.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* 模組內容展示 */}
      <div className="space-y-6">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-neutral-900">{currentSection.title}</h3>
          <p className="text-sm text-neutral-600 mt-1">{currentSection.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {currentSection.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-neutral-200 rounded-lg p-6 hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                    <span className="font-mono text-xs text-neutral-400">§ {idx + 1}</span>
                    {item.title}
                  </h4>
                  <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* 規格四方矩陣: 輸入、輸出、約束、驗收 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-neutral-100 text-xs">
                {/* 輸入規格 */}
                <div className="bg-neutral-50/70 p-4 rounded border border-neutral-200/60">
                  <div className="font-semibold text-neutral-800 flex items-center gap-1.5 mb-2">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    輸入格式 (Inputs)
                  </div>
                  <ul className="space-y-1.5 text-neutral-600">
                    {item.inputs.map((inp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-neutral-400 mt-0.5">•</span>
                        <span>{inp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 輸出產物 */}
                <div className="bg-neutral-50/70 p-4 rounded border border-neutral-200/60">
                  <div className="font-semibold text-neutral-800 flex items-center gap-1.5 mb-2">
                    <FileCode className="w-3.5 h-3.5 text-emerald-600" />
                    產出規格 (Outputs)
                  </div>
                  <ul className="space-y-1.5 text-neutral-600">
                    {item.outputs.map((out, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-neutral-400 mt-0.5">•</span>
                        <span className="font-mono">{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 技術邊界與限制 */}
                <div className="bg-neutral-50/70 p-4 rounded border border-neutral-200/60">
                  <div className="font-semibold text-neutral-800 flex items-center gap-1.5 mb-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    技術邊界與限制 (Constraints)
                  </div>
                  <ul className="space-y-1.5 text-neutral-600">
                    {item.constraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-neutral-400 mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 驗收標準 */}
                <div className="bg-neutral-50/70 p-4 rounded border border-neutral-200/60">
                  <div className="font-semibold text-neutral-800 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    嚴格驗收條件 (Acceptance Criteria)
                  </div>
                  <ul className="space-y-1.5 text-neutral-600">
                    {item.acceptance.map((acc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-neutral-400 mt-0.5">•</span>
                        <span>{acc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
