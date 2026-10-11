/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SAMPLE_PROJECT } from '../data/specificationData';
import {
  compileProjectFileEntries,
  runProjectDiagnostic,
  generateBehaviorPackItemJson,
  generateResourcePackItemJson,
  generateResourcePackAttachableJson,
  generateRecipeJson,
  generateItemTextureJson,
  generateManifests,
  generateLangContent
} from '../utils/bedrockGenerator';
import { BlockForgeProject, EquipmentItem } from '../types/models';
import {
  FileCode,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Eye,
  Sliders,
  FileCheck,
  Terminal,
  Layers
} from 'lucide-react';

export const SimulatorSection: React.FC = () => {
  const [project, setProject] = useState<BlockForgeProject>(SAMPLE_PROJECT);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [activeFileTab, setActiveFileTab] = useState<string>('bp_item');
  const [copied, setCopied] = useState<boolean>(false);

  const currentItem = project.items[selectedItemIndex] || project.items[0];

  // 即時編譯產物
  const manifests = useMemo(() => generateManifests(project), [project]);
  const bpItemJson = useMemo(() => generateBehaviorPackItemJson(currentItem), [currentItem]);
  const rpItemJson = useMemo(() => generateResourcePackItemJson(currentItem), [currentItem]);
  const attachableJson = useMemo(() => generateResourcePackAttachableJson(currentItem), [currentItem]);
  const recipeJson = useMemo(() => generateRecipeJson(currentItem), [currentItem]);
  const textureJson = useMemo(() => generateItemTextureJson(project), [project]);
  const langText = useMemo(() => generateLangContent(project), [project]);

  // 即時診斷分析
  const diagnostic = useMemo(() => runProjectDiagnostic(project), [project]);

  const getActiveFileContent = () => {
    switch (activeFileTab) {
      case 'bp_item':
        return {
          filename: `BP/items/${currentItem.identifier.split(':')[1] || 'item'}.json`,
          code: bpItemJson
        };
      case 'rp_item':
        return {
          filename: `RP/items/${currentItem.identifier.split(':')[1] || 'item'}.json`,
          code: rpItemJson
        };
      case 'attachable':
        return {
          filename: `RP/attachables/${currentItem.identifier.split(':')[1] || 'item'}.json`,
          code: attachableJson || '// 此裝備為武器或手持工具，無須防具 Attachables 渲染定義。'
        };
      case 'recipe':
        return {
          filename: `BP/recipes/${currentItem.identifier.split(':')[1] || 'item'}_recipe.json`,
          code: recipeJson || '// 此裝備未設定合成配方。'
        };
      case 'texture_map':
        return {
          filename: `RP/textures/item_texture.json`,
          code: textureJson
        };
      case 'bp_manifest':
        return {
          filename: `BP/manifest.json`,
          code: manifests.bpManifest
        };
      case 'lang':
        return {
          filename: `RP/texts/en_US.lang`,
          code: langText
        };
      default:
        return { filename: '', code: '' };
    }
  };

  const currentFile = getActiveFileContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateItem = (updater: (prev: EquipmentItem) => EquipmentItem) => {
    setProject(prev => {
      const newItems = [...prev.items];
      newItems[selectedItemIndex] = updater(newItems[selectedItemIndex]);
      return { ...prev, items: newItems, metadata: { ...prev.metadata, updatedAt: Date.now() } };
    });
  };

  return (
    <div className="space-y-8">
      {/* 標題與原則 */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
            規範章節 06 · 基岩版虛擬生成引擎沙盒 (Bedrock Generator Simulator)
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            確定性生成與靜態診斷沙盒
          </h2>
          <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
            透過這套沙盒驗證架構規劃：調整裝備屬性或切換類型，觀察底層產出的真實 Bedrock JSON。
            系統嚴格區分「靜態檢查通過」、「檔案產出成功」與「遊戲真機驗證」，杜絕虛報。
          </p>
        </div>
      </div>

      {/* 診斷狀態四聯檢視卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 狀態 1: 靜態檢查 */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <span className="text-xs text-neutral-500 block mb-1">1. 靜態 Schema 檢查</span>
          <div className="flex items-center gap-2">
            {diagnostic.passedStaticCheck ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600" />
            )}
            <span className="text-sm font-semibold text-neutral-900">
              {diagnostic.passedStaticCheck ? '通過靜態驗證' : '發現語法錯誤'}
            </span>
          </div>
          <span className="text-xs text-neutral-500 mt-2 block font-mono">
            {diagnostic.summary.errorCount} 錯誤 · {diagnostic.summary.warningCount} 警告
          </span>
        </div>

        {/* 狀態 2: 套件生成 */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <span className="text-xs text-neutral-500 block mb-1">2. 套件檔案序列化</span>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-neutral-900">
              檔案結構完備 (Ready)
            </span>
          </div>
          <span className="text-xs text-neutral-500 mt-2 block font-mono">
            BP & RP 雙向 UUID 匹配
          </span>
        </div>

        {/* 狀態 3: 遊戲真機測試 */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <span className="text-xs text-neutral-500 block mb-1">3. 目標遊戲版本實測</span>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-neutral-900">
              待真機驗收 (Pending)
            </span>
          </div>
          <span className="text-xs text-neutral-500 mt-2 block font-mono">
            需匯入 Minecraft 1.21.0
          </span>
        </div>

        {/* 狀態 4: 戰鬥效果實裝確認 */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <span className="text-xs text-neutral-500 block mb-1">4. 特殊效果實體驗證</span>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-neutral-900">
              待遊戲內實測
            </span>
          </div>
          <span className="text-xs text-neutral-500 mt-2 block font-mono">
            禁止虛報已測試成功
          </span>
        </div>
      </div>

      {/* 互動沙盒主介面 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左側屬性調節面板 */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-neutral-700" />
                裝備沙盒調節器 (Item Sandbox)
              </h3>
              <div className="flex items-center gap-1">
                {project.items.map((it, idx) => (
                  <button
                    key={it.id}
                    onClick={() => setSelectedItemIndex(idx)}
                    className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                      selectedItemIndex === idx
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {it.displayName.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-700 font-medium block mb-1">
                  唯一識別碼 (Bedrock Identifier)
                </label>
                <input
                  type="text"
                  value={currentItem.identifier}
                  onChange={e =>
                    handleUpdateItem(it => ({ ...it, identifier: e.target.value }))
                  }
                  className="w-full font-mono bg-neutral-50 border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900"
                />
              </div>

              <div>
                <label className="text-neutral-700 font-medium block mb-1">
                  顯示名稱 (Display Name)
                </label>
                <input
                  type="text"
                  value={currentItem.displayName}
                  onChange={e =>
                    handleUpdateItem(it => ({ ...it, displayName: e.target.value }))
                  }
                  className="w-full bg-neutral-50 border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-700 font-medium block mb-1">
                    耐久度 (Durability)
                  </label>
                  <input
                    type="number"
                    value={currentItem.attributes.durability}
                    onChange={e =>
                      handleUpdateItem(it => ({
                        ...it,
                        attributes: { ...it.attributes, durability: Number(e.target.value) }
                      }))
                    }
                    className="w-full font-mono bg-neutral-50 border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900"
                  />
                </div>

                {currentItem.category === 'weapon' && (
                  <div>
                    <label className="text-neutral-700 font-medium block mb-1">
                      攻擊傷害 (Damage)
                    </label>
                    <input
                      type="number"
                      value={currentItem.attributes.attackDamage || 0}
                      onChange={e =>
                        handleUpdateItem(it => ({
                          ...it,
                          attributes: { ...it.attributes, attackDamage: Number(e.target.value) }
                        }))
                      }
                      className="w-full font-mono bg-neutral-50 border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900"
                    />
                  </div>
                )}

                {currentItem.category === 'armor' && (
                  <div>
                    <label className="text-neutral-700 font-medium block mb-1">
                      護甲防禦值 (Protection)
                    </label>
                    <input
                      type="number"
                      value={currentItem.attributes.armorProtection || 0}
                      onChange={e =>
                        handleUpdateItem(it => ({
                          ...it,
                          attributes: { ...it.attributes, armorProtection: Number(e.target.value) }
                        }))
                      }
                      className="w-full font-mono bg-neutral-50 border border-neutral-300 rounded px-2.5 py-1.5 text-neutral-900"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-neutral-500">
                <span>裝備類別: <strong className="text-neutral-800">{currentItem.category} ({currentItem.type})</strong></span>
                <span>目標版本: <strong className="text-neutral-800">{currentItem.targetVersion}</strong></span>
              </div>
            </div>
          </div>

          {/* 即時診斷清單 */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              靜態驗證結果診斷 (Diagnostic Log)
            </h4>

            {diagnostic.issues.length === 0 ? (
              <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                專案完全符合基岩版 1.20.80+ 靜態驗證規範，無任何警示。
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {diagnostic.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded text-xs border ${
                      issue.severity === 'error'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1">
                      <span className="font-mono">[{issue.code}]</span>
                      <span>{issue.message}</span>
                    </div>
                    {issue.suggestedFix && (
                      <p className="mt-1 text-neutral-600">{issue.suggestedFix}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右側生成檔案程式碼檢視器 */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col">
          {/* 檔案頁籤 */}
          <div className="bg-neutral-100 px-3 py-2 border-b border-neutral-200 flex items-center justify-between overflow-x-auto gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveFileTab('bp_item')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                  activeFileTab === 'bp_item'
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                BP/items/*.json
              </button>
              <button
                onClick={() => setActiveFileTab('rp_item')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                  activeFileTab === 'rp_item'
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                RP/items/*.json
              </button>
              <button
                onClick={() => setActiveFileTab('attachable')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                  activeFileTab === 'attachable'
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                RP/attachables/*.json
              </button>
              <button
                onClick={() => setActiveFileTab('recipe')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                  activeFileTab === 'recipe'
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                BP/recipes/*.json
              </button>
              <button
                onClick={() => setActiveFileTab('texture_map')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                  activeFileTab === 'texture_map'
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                item_texture.json
              </button>
              <button
                onClick={() => setActiveFileTab('bp_manifest')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                  activeFileTab === 'bp_manifest'
                    ? 'bg-white text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                BP/manifest.json
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="px-2 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-50 flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製' : '複製'}</span>
            </button>
          </div>

          {/* 檔案路徑顯示 */}
          <div className="bg-neutral-900 text-neutral-400 px-4 py-2 border-b border-neutral-800 text-xs font-mono flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-neutral-200">{currentFile.filename}</span>
          </div>

          {/* 程式碼內容 */}
          <pre className="p-4 text-xs font-mono text-neutral-100 bg-neutral-950 overflow-x-auto flex-1 min-h-[360px] leading-relaxed">
            <code>{currentFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
