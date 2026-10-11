/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BlockForgeProject,
  EquipmentItem,
  GeneratedFileEntry,
  DiagnosticReport,
  DiagnosticIssue
} from '../types/models';

/**
 * 簡易 RFC4122 v4 UUID 生成器 (確定性或隨機性支援)
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 取得物品短名稱 (例如 "custom:flame_blade" -> "flame_blade")
 */
export function getItemShortName(identifier: string): string {
  const parts = identifier.split(':');
  return parts.length > 1 ? parts[1] : parts[0];
}

/**
 * 決定物品在創造模式物品欄的分類群組
 */
function getBedrockItemGroup(item: EquipmentItem): string {
  switch (item.type) {
    case 'sword':
      return 'itemGroup.name.sword';
    case 'axe':
      return 'itemGroup.name.axe';
    case 'pickaxe':
      return 'itemGroup.name.pickaxe';
    case 'shovel':
      return 'itemGroup.name.shovel';
    case 'hoe':
      return 'itemGroup.name.hoe';
    case 'helmet':
      return 'itemGroup.name.helmet';
    case 'chestplate':
      return 'itemGroup.name.chestplate';
    case 'leggings':
      return 'itemGroup.name.leggings';
    case 'boots':
      return 'itemGroup.name.boots';
    default:
      return 'itemGroup.name.misc';
  }
}

/**
 * 生成行為包 (Behavior Pack) 物品定義 JSON
 * 採用 Minecraft 基岩版 1.20.80+ / 1.21.0+ 格式
 */
export function generateBehaviorPackItemJson(item: EquipmentItem): string {
  const components: Record<string, any> = {
    'minecraft:max_stack_size': item.attributes.maxStackSize || 1,
    'minecraft:hand_equipped': item.attributes.isHandEquipped,
    'minecraft:can_destroy_in_creative': item.attributes.canDestroyInCreative ?? false,
    'minecraft:icon': {
      texture: getItemShortName(item.identifier)
    }
  };

  // 耐久度元件
  if (item.attributes.durability > 0) {
    components['minecraft:durability'] = {
      max_durability: item.attributes.durability,
      damage_chance: {
        min: 100,
        max: 100
      }
    };
  }

  // 修復材料元件
  if (item.attributes.repairItems && item.attributes.repairItems.length > 0) {
    components['minecraft:repairable'] = {
      repair_items: item.attributes.repairItems.map(itemIdent => ({
        items: [itemIdent],
        repair_amount: Math.floor(item.attributes.durability * 0.25)
      }))
    };
  }

  // 附魔能力值
  if (item.attributes.enchantableSlot && item.attributes.enchantmentValue > 0) {
    components['minecraft:enchantable'] = {
      slot: item.attributes.enchantableSlot,
      value: item.attributes.enchantmentValue
    };
  }

  // 武器攻擊傷害
  if (item.attributes.attackDamage !== undefined && item.attributes.attackDamage > 0) {
    components['minecraft:damage'] = item.attributes.attackDamage;
  }

  // 工具挖掘配置 (digger)
  if (item.attributes.miningSpeed && item.attributes.miningSpeed > 1) {
    let targetTag = 'minecraft:is_pickaxe_destructible';
    if (item.type === 'axe') targetTag = 'minecraft:is_axe_destructible';
    if (item.type === 'shovel') targetTag = 'minecraft:is_shovel_destructible';
    if (item.type === 'hoe') targetTag = 'minecraft:is_hoe_destructible';

    components['minecraft:digger'] = {
      use_efficiency: true,
      destroy_speeds: [
        {
          block: {
            tags: `q.any_tag('${targetTag}')`
          },
          speed: item.attributes.miningSpeed
        }
      ]
    };
  }

  // 防具穿戴元件 (基岩版 1.20.80+ 統一使用 minecraft:wearable)
  if (item.category === 'armor' && item.attributes.armorSlot) {
    components['minecraft:wearable'] = {
      slot: item.attributes.armorSlot,
      protection: item.attributes.armorProtection || 0
    };

    if (item.attributes.knockbackResistance && item.attributes.knockbackResistance > 0) {
      components['minecraft:knockback_resistance'] = {
        protection: item.attributes.knockbackResistance
      };
    }
  }

  // 特殊能力掛載 (若有 Level B 自訂元件)
  const scriptComponents = item.abilities
    .filter(a => a.enabled && a.abilityId.includes('custom_'))
    .map(a => a.abilityId);

  if (scriptComponents.length > 0) {
    components['minecraft:custom_components'] = scriptComponents;
  }

  const bpItemDefinition = {
    format_version: '1.20.80',
    'minecraft:item': {
      description: {
        identifier: item.identifier,
        menu_category: {
          category: 'equipment',
          group: getBedrockItemGroup(item)
        }
      },
      components
    }
  };

  return JSON.stringify(bpItemDefinition, null, 2);
}

/**
 * 生成材質包 (Resource Pack) 物品定義 JSON
 */
export function generateResourcePackItemJson(item: EquipmentItem): string {
  const shortName = getItemShortName(item.identifier);
  const rpItemDefinition = {
    format_version: '1.20.80',
    'minecraft:item': {
      description: {
        identifier: item.identifier
      },
      components: {
        'minecraft:icon': shortName
      }
    }
  };

  return JSON.stringify(rpItemDefinition, null, 2);
}

/**
 * 生成防具穿戴模型 Attachables 定義 (基岩版防具可視化必備)
 */
export function generateResourcePackAttachableJson(item: EquipmentItem): string | null {
  if (item.category !== 'armor' || !item.attributes.armorSlot) {
    return null;
  }

  const shortName = getItemShortName(item.identifier);
  let geometrySlot = 'helmet';
  let textureLayer = 'layer_1';

  if (item.type === 'chestplate') geometrySlot = 'chestplate';
  if (item.type === 'boots') geometrySlot = 'boots';
  if (item.type === 'leggings') {
    geometrySlot = 'leggings';
    textureLayer = 'layer_2';
  }

  const attachable = {
    format_version: '1.10.0',
    'minecraft:attachable': {
      description: {
        identifier: item.identifier,
        materials: {
          default: 'armor',
          enchanted: 'armor_enchanted'
        },
        textures: {
          default: `textures/models/armor/${shortName}_${textureLayer}`,
          enchanted: 'textures/misc/enchanted_actor_glint'
        },
        geometry: {
          default: `geometry.humanoid.armor.${geometrySlot}`
        },
        scripts: {
          parent_setup: 'variable.armor_stand_offset = 0.0;'
        },
        render_controllers: ['controller.render.armor']
      }
    }
  };

  return JSON.stringify(attachable, null, 2);
}

/**
 * 生成 item_texture.json 映射清單
 */
export function generateItemTextureJson(project: BlockForgeProject): string {
  const textureData: Record<string, { textures: string }> = {};

  project.items.forEach(item => {
    const shortName = getItemShortName(item.identifier);
    textureData[shortName] = {
      textures: `textures/items/${shortName}`
    };
  });

  const content = {
    resource_pack_name: project.metadata.namespace,
    texture_name: 'atlas.items',
    texture_data: textureData
  };

  return JSON.stringify(content, null, 2);
}

/**
 * 生成合成配方 JSON (BP/recipes/*.json)
 */
export function generateRecipeJson(item: EquipmentItem): string | null {
  if (!item.recipe) return null;

  const shortName = getItemShortName(item.identifier);

  if (item.recipe.type === 'shaped' && item.recipe.pattern && item.recipe.keyMap) {
    const keyDefinition: Record<string, { item: string; data?: number }> = {};
    Object.entries(item.recipe.keyMap).forEach(([char, ing]) => {
      keyDefinition[char] = {
        item: ing.item
      };
    });

    const shapedRecipe = {
      format_version: '1.20.80',
      'minecraft:recipe_shaped': {
        description: {
          identifier: `${item.identifier}_recipe`
        },
        tags: item.recipe.tags || ['crafting_table'],
        pattern: item.recipe.pattern,
        key: keyDefinition,
        result: {
          item: item.identifier,
          count: item.recipe.outputCount || 1
        }
      }
    };
    return JSON.stringify(shapedRecipe, null, 2);
  }

  return null;
}

/**
 * 生成多國語言檔 en_US.lang 與 zh_TW.lang
 */
export function generateLangContent(project: BlockForgeProject): string {
  const lines: string[] = [
    `## BlockForge Studio Generated Localization`,
    `## Pack: ${project.metadata.name} [v${project.metadata.version.join('.')}]`,
    ``
  ];

  project.items.forEach(item => {
    lines.push(`item.${item.identifier}.name=${item.displayName}`);
    if (item.description) {
      lines.push(`item.${item.identifier}.desc=${item.description}`);
    }
  });

  return lines.join('\n');
}

/**
 * 生成行為包與材質包 manifests (具備雙 UUID 與依賴綁定)
 */
export function generateManifests(project: BlockForgeProject): {
  bpManifest: string;
  rpManifest: string;
  bpUuid: string;
  rpUuid: string;
} {
  const bpHeaderUuid = generateUUID();
  const bpModuleUuid = generateUUID();
  const rpHeaderUuid = generateUUID();
  const rpModuleUuid = generateUUID();

  const minEngineVersion = project.metadata.targetBedrockVersion === '1.20.80' ? [1, 20, 80] : [1, 21, 0];

  const bpManifest = {
    format_version: 2,
    header: {
      name: `${project.metadata.name} (Behavior Pack)`,
      description: `${project.metadata.description} - Generated by BlockForge Studio`,
      uuid: bpHeaderUuid,
      version: project.metadata.version,
      min_engine_version: minEngineVersion
    },
    modules: [
      {
        type: 'data',
        uuid: bpModuleUuid,
        version: project.metadata.version
      }
    ],
    dependencies: [
      {
        uuid: rpHeaderUuid,
        version: project.metadata.version
      }
    ]
  };

  const rpManifest = {
    format_version: 2,
    header: {
      name: `${project.metadata.name} (Resource Pack)`,
      description: `${project.metadata.description} - Generated by BlockForge Studio`,
      uuid: rpHeaderUuid,
      version: project.metadata.version,
      min_engine_version: minEngineVersion
    },
    modules: [
      {
        type: 'resources',
        uuid: rpModuleUuid,
        version: project.metadata.version
      }
    ]
  };

  return {
    bpManifest: JSON.stringify(bpManifest, null, 2),
    rpManifest: JSON.stringify(rpManifest, null, 2),
    bpUuid: bpHeaderUuid,
    rpUuid: rpHeaderUuid
  };
}

/**
 * 完整專案靜態分析與校驗診斷 (Pre-export Verification)
 */
export function runProjectDiagnostic(project: BlockForgeProject): DiagnosticReport {
  const issues: DiagnosticIssue[] = [];

  // 1. 專案命名空間檢查
  if (!project.metadata.namespace || !/^[a-z0-9_]+$/.test(project.metadata.namespace)) {
    issues.push({
      severity: 'error',
      code: 'ERR_INVALID_NAMESPACE',
      message: `專案命名空間 "${project.metadata.namespace}" 不合法，必須僅含小寫英數字與下劃線。`,
      suggestedFix: '請至專案設定修正命名空間名稱。'
    });
  }

  // 2. 物品唯一識別碼與欄位檢查
  const identifierMap = new Map<string, number>();

  project.items.forEach(item => {
    // 格式檢查
    if (!/^[a-z0-9_]+:[a-z0-9_]+$/.test(item.identifier)) {
      issues.push({
        severity: 'error',
        code: 'ERR_INVALID_ITEM_IDENTIFIER',
        itemIdentifier: item.identifier,
        message: `物品識別碼 "${item.identifier}" 不符合 "namespace:item_id" 格式規範。`,
        suggestedFix: '確認僅包含英文小寫、數字與冒號分隔。'
      });
    }

    // 重複檢查
    const count = identifierMap.get(item.identifier) || 0;
    identifierMap.set(item.identifier, count + 1);

    // 耐久度邊界
    if (item.attributes.durability <= 0 || item.attributes.durability > 65535) {
      issues.push({
        severity: 'warning',
        code: 'WARN_DURABILITY_RANGE',
        itemIdentifier: item.identifier,
        message: `耐久度 ${item.attributes.durability} 超過標準安全範圍 (1~65535)。`
      });
    }

    // 防具穿戴貼圖防呆
    if (item.category === 'armor') {
      if (!item.armorLayer1AssetId) {
        issues.push({
          severity: 'warning',
          code: 'WARN_MISSING_ARMOR_TEXTURE',
          itemIdentifier: item.identifier,
          message: `防具 "${item.displayName}" 尚未指定 3D 穿戴層貼圖 (Layer 1)，在遊戲世界穿戴可能呈現隱形。`,
          suggestedFix: '請在貼圖工作室上傳對應的 64x32 或 64x64 防具模型貼圖。'
        });
      }
    }

    // 檢查能力模板相容性
    item.abilities.forEach(ability => {
      if (ability.abilityId.includes('unsupported') || ability.abilityId.includes('lifesteal')) {
        issues.push({
          severity: 'error',
          code: 'ERR_UNSUPPORTED_ABILITY',
          itemIdentifier: item.identifier,
          message: `能力 "${ability.abilityId}" 屬於 Level C (基岩版現行不可行)，禁止發布於正式 Add-On 中。`,
          suggestedFix: '請移除該項特殊能力或切換至原生附魔替代方案。'
        });
      }
    });

    // 配方防呆
    if (item.recipe) {
      if (item.recipe.type === 'shaped' && (!item.recipe.pattern || item.recipe.pattern.length === 0)) {
        issues.push({
          severity: 'error',
          code: 'ERR_EMPTY_RECIPE_PATTERN',
          itemIdentifier: item.identifier,
          message: `有序合成配方缺少 3x3 網格 pattern。`
        });
      }
    }
  });

  identifierMap.forEach((cnt, ident) => {
    if (cnt > 1) {
      issues.push({
        severity: 'error',
        code: 'ERR_DUPLICATE_IDENTIFIER',
        itemIdentifier: ident,
        message: `偵測到重複的物品識別碼 "${ident}"，將導致遊戲載入時發生定義覆蓋與未知錯誤。`
      });
    }
  });

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  return {
    timestamp: Date.now(),
    targetVersion: project.metadata.targetBedrockVersion,
    passedStaticCheck: errorCount === 0,
    issues,
    summary: {
      totalItems: project.items.length,
      errorCount,
      warningCount,
      infoCount
    }
  };
}

/**
 * 模擬編譯所有檔案結構清單
 */
export function compileProjectFileEntries(project: BlockForgeProject): GeneratedFileEntry[] {
  const entries: GeneratedFileEntry[] = [];
  const manifests = generateManifests(project);

  // 1. Manifests
  entries.push({
    path: 'BP/manifest.json',
    content: manifests.bpManifest,
    type: 'manifest'
  });
  entries.push({
    path: 'RP/manifest.json',
    content: manifests.rpManifest,
    type: 'manifest'
  });

  // 2. Items
  project.items.forEach(item => {
    const shortName = getItemShortName(item.identifier);
    // BP item
    entries.push({
      path: `BP/items/${shortName}.json`,
      content: generateBehaviorPackItemJson(item),
      type: 'json'
    });

    // RP item
    entries.push({
      path: `RP/items/${shortName}.json`,
      content: generateResourcePackItemJson(item),
      type: 'json'
    });

    // RP attachable (防具)
    const attachable = generateResourcePackAttachableJson(item);
    if (attachable) {
      entries.push({
        path: `RP/attachables/${shortName}.json`,
        content: attachable,
        type: 'json'
      });
    }

    // Recipe
    const recipe = generateRecipeJson(item);
    if (recipe) {
      entries.push({
        path: `BP/recipes/${shortName}_recipe.json`,
        content: recipe,
        type: 'json'
      });
    }
  });

  // 3. Textures mapping
  entries.push({
    path: 'RP/textures/item_texture.json',
    content: generateItemTextureJson(project),
    type: 'json'
  });

  // 4. Lang
  entries.push({
    path: 'RP/texts/en_US.lang',
    content: generateLangContent(project),
    type: 'lang'
  });
  entries.push({
    path: 'RP/texts/zh_TW.lang',
    content: generateLangContent(project),
    type: 'lang'
  });

  return entries;
}
