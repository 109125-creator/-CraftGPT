/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ABILITY_REGISTRY } from '../data/specificationData';
import { Sparkles, Shield, AlertCircle, Ban, Code2, FlaskConical, CheckCircle } from 'lucide-react';
import { FeasibilityLevel } from '../types/models';

export const AbilityRegistrySection: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedAbilityId, setSelectedAbilityId] = useState<string>(ABILITY_REGISTRY[0].id);

  const filteredAbilities = ABILITY_REGISTRY.filter(a => {
    if (selectedLevel === 'all') return true;
    return a.feasibilityLevel === selectedLevel;
  });

  const selectedAbility = ABILITY_REGISTRY.find(a => a.id === selectedAbilityId) || ABILITY_REGISTRY[0];

  const getLevelBadge = (level: FeasibilityLevel) => {
    switch (level) {
      case 'level_a_native':
        return {
          label: 'Level A · 原生 JSON 元件',
          desc: '100% 純資料驅動，無須 Script API 或實驗性開關',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        };
      case 'level_b_script':
        return {
          label: 'Level B · Script API 自訂元件',
          desc: '需依賴 @minecraft/server，基岩版 1.21.0+ 支援',
          color: 'text-blue-700 bg-blue-50 border-blue-200'
        };
      case 'level_c_unsupported':
        return {
          label: 'Level C · 基岩版現行不可行',
          desc: 'Java 版機制或無官方 API 支援，禁止宣稱實裝',
          color: 'text-rose-700 bg-rose-50 border-rose-200'
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* 標題與原則 */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-purple-700 uppercase">
            規範章節 04 · 特殊能力模板庫 (Ability Registry)
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            可重複使用能力註冊表與技術可行性分級
          </h2>
          <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
            每個能力模板具備唯一識別碼、觸發條件、參數邊界、底層實現機制、版本相容性與測試驗證案例。
            嚴格禁止在未經遊戲內驗證的情況下將能力標記為已完成。
          </p>
        </div>

        {/* 分級過濾列 */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedLevel === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            全部能力 ({ABILITY_REGISTRY.length})
          </button>
          <button
            onClick={() => setSelectedLevel('level_a_native')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedLevel === 'level_a_native'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Level A 原生元件
          </button>
          <button
            onClick={() => setSelectedLevel('level_b_script')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedLevel === 'level_b_script'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Level B Script 自訂元件
          </button>
          <button
            onClick={() => setSelectedLevel('level_c_unsupported')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedLevel === 'level_c_unsupported'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Level C 不可行 / 限制
          </button>
        </div>
      </div>

      {/* 能力清單與詳情檢視器 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左側列表 */}
        <div className="lg:col-span-5 space-y-2">
          {filteredAbilities.map(ability => {
            const badge = getLevelBadge(ability.feasibilityLevel);
            const isSelected = ability.id === selectedAbilityId;
            return (
              <button
                key={ability.id}
                onClick={() => setSelectedAbilityId(ability.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{ability.displayName}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono border ${
                      isSelected
                        ? 'border-neutral-700 bg-neutral-800 text-neutral-300'
                        : badge.color
                    }`}
                  >
                    {ability.feasibilityLevel.replace('level_', 'L-').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs opacity-75 font-mono">
                  <span>觸發: {ability.trigger}</span>
                  <span>·</span>
                  <span>支援: {ability.supportedVersions[0]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 右側能力詳情 */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-lg p-6 space-y-5">
          <div className="border-b border-neutral-100 pb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-neutral-500 block">
                  {selectedAbility.id}
                </span>
                <h3 className="text-lg font-bold text-neutral-900 mt-0.5">
                  {selectedAbility.displayName}
                </h3>
              </div>
              <div
                className={`text-xs px-2.5 py-1 rounded border font-medium ${
                  getLevelBadge(selectedAbility.feasibilityLevel).color
                }`}
              >
                {getLevelBadge(selectedAbility.feasibilityLevel).label}
              </div>
            </div>
            <p className="text-xs text-neutral-600 mt-2">
              {getLevelBadge(selectedAbility.feasibilityLevel).desc}
            </p>
          </div>

          {/* 技術實現機制 */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              底層技術實現機制 (Bedrock Implementation)
            </h4>
            <div className="bg-neutral-50 p-3.5 rounded border border-neutral-200 text-xs text-neutral-700 leading-relaxed font-mono">
              {selectedAbility.technicalMechanism}
            </div>
          </div>

          {/* 參數設定 */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2">
              可設定參數與邊界 (Parameters)
            </h4>
            {selectedAbility.parameters.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">此能力為靜態屬性，無可調參數。</p>
            ) : (
              <div className="space-y-2">
                {selectedAbility.parameters.map((param, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-neutral-900">{param.label}</span>
                      <span className="font-mono text-neutral-500 ml-1.5">({param.key})</span>
                      <p className="text-neutral-500 text-xs mt-0.5">{param.description}</p>
                    </div>
                    <div className="text-right font-mono text-xs text-neutral-700">
                      預設值: {String(param.defaultValue)}
                      {param.min !== undefined && param.max !== undefined && (
                        <div className="text-neutral-400">
                          範圍: [{param.min} ~ {param.max}]
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 依賴與衝突 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-50 p-3 rounded border border-neutral-200">
              <span className="font-semibold text-neutral-800 block mb-1">所需模組相依性</span>
              <p className="text-neutral-600 font-mono">
                {selectedAbility.requiredDependencies.length > 0
                  ? selectedAbility.requiredDependencies.join(', ')
                  : '無額外相依模組 (零依賴)'}
              </p>
            </div>
            <div className="bg-neutral-50 p-3 rounded border border-neutral-200">
              <span className="font-semibold text-neutral-800 block mb-1">已知限制與衝突</span>
              <p className="text-neutral-600">
                {selectedAbility.knownConflicts.length > 0
                  ? selectedAbility.knownConflicts.join(', ')
                  : '尚無回報相容性衝突'}
              </p>
            </div>
          </div>

          {/* 測試驗證案例 */}
          <div className="bg-emerald-50/60 p-3.5 rounded border border-emerald-200 text-xs">
            <span className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
              <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
              遊戲實體驗收測試案例 (In-Game Verification Case)
            </span>
            <p className="text-emerald-800 leading-relaxed">
              {selectedAbility.testCaseDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
