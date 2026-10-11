/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PrdSection } from './components/PrdSection';
import { ConstraintsSection } from './components/ConstraintsSection';
import { DataModelsSection } from './components/DataModelsSection';
import { AbilityRegistrySection } from './components/AbilityRegistrySection';
import { RoadmapSection } from './components/RoadmapSection';
import { SimulatorSection } from './components/SimulatorSection';
import { ExportModal } from './components/ExportModal';
import { FULL_MARKDOWN_SPEC } from './data/fullMarkdownSpec';
import {
  FileText,
  ShieldCheck,
  Code2,
  Sparkles,
  Milestone,
  SlidersHorizontal,
  Download
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('prd');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const tabs = [
    { id: 'prd', label: '01. 產品需求 (PRD)', icon: FileText },
    { id: 'constraints', label: '02. 基岩版限制與決策', icon: ShieldCheck },
    { id: 'models', label: '03. 資料模型與架構', icon: Code2 },
    { id: 'abilities', label: '04. 能力模板庫', icon: Sparkles },
    { id: 'roadmap', label: '05. 路線圖與驗收', icon: Milestone },
    { id: 'simulator', label: '06. 虛擬生成器沙盒', icon: SlidersHorizontal }
  ];

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col font-sans">
      {/* 遵守規範的頂部導覽列 (Top Bar Contract: 3-Zone Contract) */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: 單一品牌標誌 (Wordmark) */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">
              BlockForge Studio
            </span>
            <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
              Bedrock Add-On Specification
            </span>
          </div>

          {/* Zone 2: 單行無折行導覽項目 (Single-line Nav Links) */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 單一主要操作按鈕 (Primary CTA) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出規劃規格書</span>
            </button>
          </div>
        </div>

        {/* 行動端與窄螢幕次導覽列 */}
        <div className="lg:hidden border-t border-neutral-100 px-4 py-2 flex items-center gap-1 overflow-x-auto bg-neutral-50">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors flex items-center gap-1 ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span>{tab.label.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 主內容工作區 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'prd' && <PrdSection />}
        {activeTab === 'constraints' && <ConstraintsSection />}
        {activeTab === 'models' && <DataModelsSection />}
        {activeTab === 'abilities' && <AbilityRegistrySection />}
        {activeTab === 'roadmap' && <RoadmapSection />}
        {activeTab === 'simulator' && <SimulatorSection />}
      </main>

      {/* 頁尾 */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>BlockForge Studio · Minecraft 基岩版裝備模組規格與架構工作台</span>
            <span aria-hidden="true">·</span>
            <span>目標版本: Bedrock 1.20.80+ / 1.21.0+</span>
          </div>
          <div>
            <span>階段: 產品規格規劃與技術驗證 (Phase 1 Planning)</span>
          </div>
        </div>
      </footer>

      {/* 匯出規格對話方塊 */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        markdownContent={FULL_MARKDOWN_SPEC}
      />
    </div>
  );
}
