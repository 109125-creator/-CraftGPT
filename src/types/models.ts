/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * BlockForge Studio - 核心資料模型定義 (TypeScript Data Models)
 * 遵循基岩版 (Bedrock Edition) 1.20.80+ / 1.21.0+ 規範
 * 使用者領域模型 (User Domain Model) 與 遊戲匯出產物 (Game Artifacts) 嚴格解耦
 */

export type TargetBedrockVersion = '1.20.80' | '1.21.0' | '1.21.20+';

export type EquipmentCategory = 'weapon' | 'tool' | 'armor';

export type EquipmentType =
  | 'sword'
  | 'axe'
  | 'pickaxe'
  | 'shovel'
  | 'hoe'
  | 'helmet'
  | 'chestplate'
  | 'leggings'
  | 'boots';

export type ArmorSlot =
  | 'slot.armor.head'
  | 'slot.armor.chest'
  | 'slot.armor.legs'
  | 'slot.armor.feet';

export type ToolTier = 'wood' | 'stone' | 'iron' | 'diamond' | 'netherite' | 'custom';

export type FeasibilityLevel =
  | 'level_a_native'      // 原生 JSON 元件即可實現 (完全無須 Script API)
  | 'level_b_script'      // 需搭配 Script API / custom_components 才能可靠實現
  | 'level_c_unsupported'; // 現行基岩版技術無法穩定實現 (或有重大遊戲限制)

export interface TextureAsset {
  id: string;             // 內部唯一資產 ID
  name: string;           // 檔案名稱
  type: 'item_icon' | 'armor_layer_1' | 'armor_layer_2';
  width: number;          // 需為 16, 32, 64 等 2 的冪次方
  height: number;
  dataUrl: string;        // Base64 PNG 圖片資料
  hasTransparency: boolean;
  checksum?: string;
}

export interface AbilityParameter {
  key: string;
  label: string;
  description: string;
  type: 'number' | 'string' | 'boolean' | 'enum';
  defaultValue: any;
  min?: number;
  max?: number;
  options?: string[];
}

export interface AbilityDefinition {
  id: string;                         // 唯一識別碼，如 "blockforge:fire_aspect_on_hit"
  displayName: string;                // 繁體中文顯示名稱
  category: 'combat' | 'survival' | 'mining' | 'movement' | 'utility';
  trigger: 'on_hit' | 'on_use' | 'on_wear' | 'on_mine' | 'passive';
  feasibilityLevel: FeasibilityLevel;
  supportedVersions: TargetBedrockVersion[];
  applicableTypes: EquipmentType[];
  parameters: AbilityParameter[];
  technicalMechanism: string;         // 基岩版底層實現機制說明
  requiredDependencies: string[];     // 例如 ["@minecraft/server:1.11.0"] 或 []
  knownConflicts: string[];           // 已知衝突元件或事件
  validationRules: string[];          // 驗證規則
  testCaseDescription: string;        // 遊戲內測試驗證案例
}

export interface AppliedAbility {
  abilityId: string;
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface ItemAttributes {
  // 通用屬性
  maxStackSize: number;               // 裝備通常為 1
  durability: number;                 // 耐久度 (1 ~ 65535)
  isHandEquipped: boolean;            // 是否在手持時以工具姿態渲染
  canDestroyInCreative: boolean;      // 創造模式是否能消耗/破壞
  enchantableSlot?: 'sword' | 'armor_head' | 'armor_torso' | 'armor_legs' | 'armor_feet' | 'pickaxe' | 'axe' | 'shovel' | 'hoe';
  enchantmentValue: number;           // 附魔能力值 (0 ~ 30)
  repairItems: string[];              // 可修復材料識別碼，例如 ["minecraft:diamond", "minecraft:iron_ingot"]

  // 武器/工具專屬
  attackDamage?: number;              // 攻擊傷害加成
  miningSpeed?: number;               // 挖掘速度倍率
  destroySpeedBlocks?: Array<{
    blocks: string[];
    speed: number;
  }>;

  // 防具專屬
  armorProtection?: number;           // 護甲防禦值
  armorToughness?: number;            // 護甲韌性 (若基岩版版本支援)
  knockbackResistance?: number;       // 擊退抗性 (0.0 ~ 1.0)
  armorSlot?: ArmorSlot;
}

export interface RecipeIngredient {
  item: string;                       // 例如 "minecraft:stick" 或專案內識別碼
  data?: number;                      // 舊版本支援的 data 數值，一般為 0
}

export type RecipeType = 'shaped' | 'shapeless';

export interface CraftingRecipe {
  id: string;
  type: RecipeType;
  tags: string[];                     // 一般為 ["crafting_table"]
  // 3x3 網格材料，shaped 模式使用
  pattern?: string[];                 // 如 [" X ", " X ", " S "]
  keyMap?: Record<string, RecipeIngredient>; // 如 { "X": { item: "minecraft:iron_ingot" } }
  // shapeless 模式材料清單
  ingredients?: RecipeIngredient[];
  outputCount: number;                // 產出數量，裝備一般為 1
  unlockRequirement?: string;         // 配方解鎖條件
}

export interface EquipmentItem {
  id: string;                         // 內部實體 ID
  identifier: string;                 // 基岩版命名空間識別碼，如 "my_mod:crimson_blade"
  displayName: string;                // 遊戲內顯示名稱，如 "赤紅之刃"
  description: string;                // 道具詳細說明 (Lore)
  type: EquipmentType;
  category: EquipmentCategory;
  targetVersion: TargetBedrockVersion;
  
  // 資產綁定
  iconAssetId?: string;               // 物品欄/快捷列 16x16 圖示
  armorLayer1AssetId?: string;        // 頭盔、胸甲、靴子模型貼圖 (64x32 或 64x64)
  armorLayer2AssetId?: string;        // 護腿模型貼圖 (64x32 或 64x64)
  
  // 屬性設定
  attributes: ItemAttributes;
  
  // 能力與配方
  abilities: AppliedAbility[];
  recipe?: CraftingRecipe;
  
  createdAt: number;
  updatedAt: number;
}

export interface ProjectMetadata {
  id: string;
  name: string;                       // 專案名稱
  namespace: string;                  // 唯一命名空間，預設如 "custom_equipment"
  description: string;
  version: [number, number, number];  // 如 [1, 0, 0]
  targetBedrockVersion: TargetBedrockVersion;
  author: string;
  createdAt: number;
  updatedAt: number;
}

export interface BlockForgeProject {
  metadata: ProjectMetadata;
  items: EquipmentItem[];
  assets: TextureAsset[];
}

export interface DiagnosticIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  itemIdentifier?: string;
  message: string;
  suggestedFix?: string;
}

export interface DiagnosticReport {
  timestamp: number;
  targetVersion: TargetBedrockVersion;
  passedStaticCheck: boolean;
  issues: DiagnosticIssue[];
  summary: {
    totalItems: number;
    errorCount: number;
    warningCount: number;
    infoCount: number;
  };
}

export interface GeneratedFileEntry {
  path: string;                       // 如 "BP/items/crimson_blade.json"
  content: string;                    // JSON 字串或文字
  type: 'json' | 'lang' | 'binary_image' | 'manifest';
}
