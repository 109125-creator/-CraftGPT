/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AbilityDefinition, EquipmentItem, BlockForgeProject } from '../types/models';

export interface PrdSectionData {
  id: string;
  title: string;
  subtitle: string;
  items: {
    title: string;
    description: string;
    inputs: string[];
    outputs: string[];
    constraints: string[];
    acceptance: string[];
  }[];
}

export const PRD_CORE_SECTIONS: PrdSectionData[] = [
  {
    id: 'equipment-editor',
    title: '1. 裝備編輯器 (Equipment Editor)',
    subtitle: '專注單件裝備深度客製化，支援劍、斧、鎬、鏟、頭盔、胸甲、護腿、靴子',
    items: [
      {
        title: '基礎標識與元資料配置',
        description: '設定裝備在 Minecraft 內的唯一識別碼 (Identifier)、遊戲內顯示名稱 (Display Name)、道具說明 (Lore) 與類別。',
        inputs: ['顯示名稱 (UTF-8 字串)', '命名空間識別碼 (符合 [a-z0-9_]+:[a-z0-9_]+ 格式)', '裝備描述', '目標基岩版版本 (如 1.21.0)'],
        outputs: ['正規化 EquipmentItem 實體資料', 'RP/texts/en_US.lang 語系鍵值映射'],
        constraints: ['識別碼必須全小寫英文、數字與下劃線，不可包含空格或大寫字元', '不可覆蓋 Minecraft 原版預留命名空間 (如 minecraft:)'],
        acceptance: ['輸入非法識別碼時即時防呆警告，不允許匯出', '同專案內禁止兩件裝備擁有相同識別碼']
      },
      {
        title: '屬性與工具層級配置',
        description: '針對武器、工具與防具分別提供符合基岩版技術規格的屬性欄位。',
        inputs: ['耐久度 (Durability: 1~65535)', '攻擊傷害 (Damage: 0~50)', '挖掘速度倍率', '護甲防禦值 (Protection: 1~20)', '擊退抗性 (0.0~1.0)'],
        outputs: ['minecraft:durability 元件設定', 'minecraft:damage 元件設定', 'minecraft:wearable 槽位與數值設定'],
        constraints: ['武器不顯示防具專屬槽位；防具不提供挖掘速度設定', '基岩版 1.20.80+ 嚴格校驗數值邊界，超標可能導致遊戲閃退'],
        acceptance: ['數值調整時即時進行邊界檢查，超過安全值顯示警示', '產生的 JSON 元件嚴格符合對應裝備類型']
      }
    ]
  },
  {
    id: 'texture-studio',
    title: '2. 貼圖工作室 (Texture Studio)',
    subtitle: '像素繪圖器與 PNG 檔案驗證器，嚴格區分「物品欄圖示」與「玩家穿戴模型貼圖」',
    items: [
      {
        title: 'PNG 檔案安全匯入與校驗',
        description: '支援使用者直接上傳透明背景 PNG 圖檔，自動執行尺寸與格式合法性檢查。',
        inputs: ['PNG 檔案物件 (File / Blob)'],
        outputs: ['TextureAsset 資產物件 (含 Base64 與雜湊碼)', 'RP/textures/items/ 實體檔案映射'],
        constraints: ['尺寸必須為 2 的冪次方 (16x16, 32x32, 64x64, 128x128)', '檔案大小不得超過 2MB', '必須具有透明通道 (Alpha Channel)'],
        acceptance: ['非 2 的冪次方貼圖自動提示裁切或等比例縮放選項', '惡意或損毀檔案直接阻擋並提供原因']
      },
      {
        title: '物品圖示 vs 穿戴 Attachables 區分',
        description: '清楚解耦「UI/物品欄手持圖示 (16x16)」與「防具 3D 穿戴層 (Layer 1: 64x32/64x64, Layer 2: 護腿)」。',
        inputs: ['物品圖示檔案', '防具 Layer 1 貼圖', '防具 Layer 2 貼圖'],
        outputs: ['item_texture.json 定義', 'RP/attachables/ 定義與幾何關聯'],
        constraints: ['基岩版防具如果缺少 Attachables 渲染定義，穿在身上會呈現全透明或隱形！此為基岩版重大盲點'],
        acceptance: ['製作防具時明確引導上傳穿戴貼圖，否則提供標準預設貼圖模板', '預覽介面明確標示「物品欄視圖」與「穿戴視圖」']
      }
    ]
  },
  {
    id: 'ability-registry',
    title: '3. 特殊能力模板庫 (Ability Registry)',
    subtitle: '建立受控、具版本相容性並嚴格分級的能力註冊表，不宣稱未驗證效果',
    items: [
      {
        title: '能力分級制度 (Level A / B / C)',
        description: '將所有特殊能力依據技術可行性劃分為三大等級，杜絕 Java 版幻想與未實裝承諾。',
        inputs: ['使用者勾選能力與輸入參數 (如點燃秒數、抗性等級)'],
        outputs: ['元件 JSON 配置或 Script API 腳本模板'],
        constraints: ['Level A: 原生 JSON 元件即可達成 (純資料驅動)', 'Level B: 需依賴 Script API (@minecraft/server)', 'Level C: 基岩版現行不可行'],
        acceptance: ['介面強制標註能力等級與技術實現依據', '若專案包含 Level B 能力，打包引擎必須自動注入 Script 模組與相應權限']
      }
    ]
  },
  {
    id: 'recipe-editor',
    title: '4. 合成配方編輯器 (Recipe Editor)',
    subtitle: '3x3 有序 (Shaped) 與無序 (Shapeless) 配方編輯，相容基岩版 1.20.80+ 格式',
    items: [
      {
        title: '3x3 網格合成與材料校驗',
        description: '可視化 3x3 合成台網格，拖放或選取原版材料，即時產生對應配方定義。',
        inputs: ['9 格材料佈局', '原版材料識別碼 (如 minecraft:diamond)', '輸出數量'],
        outputs: ['BP/recipes/*.json 符合 minecraft:recipe_shaped 規格'],
        constraints: ['材料識別碼必須為真實存在的原版物品或專案自定義物品', '避免與原版現有合成配方完全衝突'],
        acceptance: ['自動產生 pattern 陣列與 key 對應物件', '防呆檢查空白網格與孤立 key']
      }
    ]
  },
  {
    id: 'pack-engine',
    title: '5. Add-On 生成引擎 (Engine & Packager)',
    subtitle: '確定性模板編譯，生成行為包 (BP) 與材質包 (RP)，打包為標準 .mcaddon',
    items: [
      {
        title: '確定性序列化與雙 UUID 鏈接',
        description: '非依賴 AI 自由生成，而是使用確定性 TypeScript 編譯管線產生標準格式。',
        inputs: ['BlockForgeProject 完整資料模型'],
        outputs: ['BP manifest.json', 'RP manifest.json', 'BP/items/*.json', 'RP/items/*.json', 'RP/attachables/*.json', 'item_texture.json', 'en_US.lang', '.mcaddon ZIP 套件'],
        constraints: ['BP 與 RP 必須具備各自獨立且合法的 UUID v4，並在 dependencies 互相綁定', 'manifest format_version 必須為 2'],
        acceptance: ['雙擊 .mcaddon 可直接被 Minecraft 基岩版一鍵匯入無報錯', '靜態診斷報告在下載前逐條驗證']
      }
    ]
  }
];

export interface BedrockConstraint {
  id: string;
  topic: string;
  category: 'format' | 'armor' | 'script' | 'attribute' | 'manifest';
  javaVersusBedrock: string;
  bedrockReality: string;
  solutionDecision: string;
  verificationStatus: 'confirmed_working' | 'requires_game_test' | 'known_limitation';
}

export const BEDROCK_CONSTRAINTS: BedrockConstraint[] = [
  {
    id: 'constraint-1',
    topic: '基岩版格式版本躍遷 (Format Version 1.20.80 vs 1.21.0+)',
    category: 'format',
    javaVersusBedrock: 'Java 版使用 JSON 資料包與自訂屬性修飾符 (Attribute Modifiers)。',
    bedrockReality: '基岩版物品元件在 1.20.80+ 發生重大重構，例如 minecraft:armor 正式棄用，整合進 minecraft:wearable 的 protection 欄位；minecraft:digger 替換舊版挖掘事件。',
    solutionDecision: 'BlockForge Studio 預設以 1.20.80 / 1.21.0+ 作為標準 target_version，不使用舊版已棄用元件，以確保未來版本穩定性。',
    verificationStatus: 'confirmed_working'
  },
  {
    id: 'constraint-2',
    topic: '防具穿戴模型必須具備 Attachables 渲染定義',
    category: 'armor',
    javaVersusBedrock: 'Java 版只需指定 armor layer 貼圖路徑即可直接包覆在玩家骨架上。',
    bedrockReality: '基岩版防具若僅在行為包定義 minecraft:wearable，玩家穿戴時在遊戲世界中將呈現「完全隱形」！必須在材質包 RP/attachables/ 目錄下建立獨立的 JSON，綁定幾何骨架 (geometry.humanoid.armor.xxx) 與材質貼圖。',
    solutionDecision: '生成引擎在遇到防具類型時，自動生成標準人型骨架 Attachables 定義與對應的材質變數 (materials: { default: "armor" })。',
    verificationStatus: 'confirmed_working'
  },
  {
    id: 'constraint-3',
    topic: '被動屬性加成 (手持/穿戴增加移動速度或力量)',
    category: 'attribute',
    javaVersusBedrock: 'Java 版可以在 item JSON 內直接聲明 generic.movement_speed 等 NBT 屬性修飾符。',
    bedrockReality: '基岩版物品目前不支援以純 JSON 聲明「手持時直接增加移動速度或生命值上限」。純 JSON 無法直接監聽裝備穿戴並給予常駐屬性 modifier。',
    solutionDecision: '將手持/穿戴被動效果劃分為 Level B 能力。若使用者選用，生成引擎自動引入 @minecraft/server Script API 進行常態 Tick 檢查或事件監聽給予效果 (Effect)。純 JSON 模式下禁止宣稱此功能。',
    verificationStatus: 'requires_game_test'
  },
  {
    id: 'constraint-4',
    topic: '攻擊擊中事件 (On-Hit Effects, 如燃燒、凋零)',
    category: 'script',
    javaVersusBedrock: 'Java 版可藉助附魔或直接指令處理擊中目標。',
    bedrockReality: '基岩版 1.20.80 之後，舊版的 minecraft:on_hit 事件元件被棄用，官方轉向 minecraft:custom_components 與 Script API (itemComponentRegistry) 機制。',
    solutionDecision: '提供兩套策略：(1) 簡單擊退抗性與傷害屬性使用純 JSON；(2) 複雜擊中效果 (燃燒/中毒) 使用基岩版 1.21.0+ 的 custom_components 腳本註冊。明確告知使用者需開啟「測試版功能 (Beta API)」。',
    verificationStatus: 'confirmed_working'
  },
  {
    id: 'constraint-5',
    topic: '雙 UUID 規範與相依性死鎖',
    category: 'manifest',
    javaVersusBedrock: 'Java 包只需 pack.mcmeta，無 UUID 要求。',
    bedrockReality: '基岩版要求 BP 與 RP 擁有各自唯一的 UUID v4。如果 BP manifest 中的 dependencies 指向的 RP UUID 與實際 RP header.uuid 不一致，遊戲匯入時會出現「缺少相依性套件」提示並拒絕套用材質。',
    solutionDecision: '打包引擎每次生成專案時，自動生成成對且嚴格匹配的 RFC4122 UUID v4，並提供專案常駐 UUID 機制以利覆蓋更新。',
    verificationStatus: 'confirmed_working'
  }
];

export const ABILITY_REGISTRY: AbilityDefinition[] = [
  {
    id: 'blockforge:fire_aspect_native',
    displayName: '烈焰打擊 (Fire Strike - 原生附魔相容)',
    category: 'combat',
    trigger: 'on_hit',
    feasibilityLevel: 'level_a_native',
    supportedVersions: ['1.20.80', '1.21.0', '1.21.20+'],
    applicableTypes: ['sword', 'axe'],
    parameters: [
      { key: 'enchantability', label: '附魔適性等級', description: '決定裝備在附魔台獲得火焰附加的機率', type: 'number', defaultValue: 15, min: 1, max: 30 }
    ],
    technicalMechanism: '透過 minecraft:enchantable 元件聲明 slot 為 "sword"，在遊戲附魔台與鐵砧中天然繼承原版火焰附加附魔特性，不需任何額外腳本。',
    requiredDependencies: [],
    knownConflicts: [],
    validationRules: ['必須為武器類型', 'enchantability 必須介於 1 至 30 之間'],
    testCaseDescription: '進入遊戲開啟附魔台，確認該武器可接受火焰附加附魔並正常擊中燃燒怪物。'
  },
  {
    id: 'blockforge:custom_ignition_hit',
    displayName: '熾炎灼燒 (Ignite Target on Hit - 自訂元件)',
    category: 'combat',
    trigger: 'on_hit',
    feasibilityLevel: 'level_b_script',
    supportedVersions: ['1.21.0', '1.21.20+'],
    applicableTypes: ['sword', 'axe'],
    parameters: [
      { key: 'duration_seconds', label: '燃燒秒數', description: '命中實體後燃燒的持續時間 (秒)', type: 'number', defaultValue: 5, min: 1, max: 30 }
    ],
    technicalMechanism: '在物品 JSON 中聲明 minecraft:custom_components: ["blockforge:ignite_hit"]，並在 BP/scripts/main.js 中調用 system.run 或 itemComponentRegistry 監聽實體受擊並調用 entity.setOnFire()。',
    requiredDependencies: ['@minecraft/server: 1.11.0+'],
    knownConflicts: ['未啟用實驗性 Beta API 功能之遊戲世界'],
    validationRules: ['duration_seconds 必須為正整數', '目標基岩版版本必須 >= 1.21.0'],
    testCaseDescription: '持武器攻擊一隻殭屍，觀察殭屍頭頂是否出現燃燒特效並扣除燃燒傷害持續 5 秒。'
  },
  {
    id: 'blockforge:speed_while_held',
    displayName: '迅捷步伐 (Swift Pace - 持握加速)',
    category: 'movement',
    trigger: 'passive',
    feasibilityLevel: 'level_b_script',
    supportedVersions: ['1.21.0', '1.21.20+'],
    applicableTypes: ['sword', 'axe', 'boots'],
    parameters: [
      { key: 'amplifier', label: '加速等級', description: '給予迅捷效果等級 (1~3)', type: 'number', defaultValue: 1, min: 1, max: 3 }
    ],
    technicalMechanism: '純 JSON 無法直接達成。需在 Script API 使用 system.runInterval 週期監聽玩家裝備欄位，若檢測到手持或穿戴此物品則給予 speed 狀態效果。',
    requiredDependencies: ['@minecraft/server: 1.11.0+'],
    knownConflicts: ['效能負擔：高頻玩家 Tick 監聽在多人伺服器需小心節流'],
    validationRules: ['amplifier 必須為 1、2 或 3'],
    testCaseDescription: '玩家穿戴靴子或手持武器時，視野 FOV 產生加速拉伸並出現迅捷粒子效果。'
  },
  {
    id: 'blockforge:life_steal_java_nbt',
    displayName: '絕對吸血 (Absolute Lifesteal - Java 屬性修飾符)',
    category: 'combat',
    trigger: 'on_hit',
    feasibilityLevel: 'level_c_unsupported',
    supportedVersions: ['1.21.0'],
    applicableTypes: ['sword'],
    parameters: [
      { key: 'steal_ratio', label: '吸血比例', description: '每次攻擊恢復傷害的百分比', type: 'number', defaultValue: 0.2, min: 0.1, max: 1.0 }
    ],
    technicalMechanism: '【基岩版限制 - 不可行】基岩版純 JSON 完全無 Java 版 Generic Attribute Modifiers 語法；若未開啟實驗性腳本，無法直接讀取單次傷害輸出實時回調。現行 MVP 不支援此類別，列為第三階段實驗性研究。',
    requiredDependencies: [],
    knownConflicts: ['所有純 JSON 原生基岩版環境'],
    validationRules: ['目前禁止在正式打包中標記為已實裝'],
    testCaseDescription: '未經驗證，不得列入可使用選項。'
  }
];

export const SAMPLE_PROJECT: BlockForgeProject = {
  metadata: {
    id: 'proj_sample_01',
    name: '熾炎深淵裝備包 (Infernal Abyss Equipment)',
    namespace: 'infernal_abyss',
    description: '專為下界探險家打造的烈焰裝備與工具組',
    version: [1, 0, 0],
    targetBedrockVersion: '1.21.0',
    author: 'BlockForge Studio Architect',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now()
  },
  items: [
    {
      id: 'item_sword_01',
      identifier: 'infernal_abyss:flame_reaver',
      displayName: '熾炎收割者 (Flame Reaver)',
      description: '從地獄熔岩精煉而成的重劍，揮舞時散發熾熱氣息。',
      type: 'sword',
      category: 'weapon',
      targetVersion: '1.21.0',
      iconAssetId: 'asset_icon_sword',
      attributes: {
        maxStackSize: 1,
        durability: 1800,
        isHandEquipped: true,
        canDestroyInCreative: false,
        attackDamage: 9,
        enchantableSlot: 'sword',
        enchantmentValue: 18,
        repairItems: ['minecraft:netherite_ingot', 'minecraft:blaze_rod']
      },
      abilities: [
        {
          abilityId: 'blockforge:fire_aspect_native',
          parameters: { enchantability: 18 },
          enabled: true
        }
      ],
      recipe: {
        id: 'recipe_flame_reaver',
        type: 'shaped',
        tags: ['crafting_table'],
        pattern: [' B ', ' B ', ' S '],
        keyMap: {
          B: { item: 'minecraft:blaze_rod' },
          S: { item: 'minecraft:nether_brick' }
        },
        outputCount: 1
      },
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now()
    },
    {
      id: 'item_boots_01',
      identifier: 'infernal_abyss:magma_boots',
      displayName: '熔岩漫步之靴 (Magma Strider Boots)',
      description: '耐高溫的黑曜石合金重靴，賦予穿著者堅毅的步伐。',
      type: 'boots',
      category: 'armor',
      targetVersion: '1.21.0',
      iconAssetId: 'asset_icon_boots',
      armorLayer1AssetId: 'asset_armor_layer_1',
      attributes: {
        maxStackSize: 1,
        durability: 520,
        isHandEquipped: false,
        canDestroyInCreative: false,
        armorProtection: 4,
        knockbackResistance: 0.1,
        armorSlot: 'slot.armor.feet',
        enchantableSlot: 'armor_feet',
        enchantmentValue: 12,
        repairItems: ['minecraft:magma_cream', 'minecraft:obsidian']
      },
      abilities: [],
      recipe: {
        id: 'recipe_magma_boots',
        type: 'shaped',
        tags: ['crafting_table'],
        pattern: ['M M', 'O O'],
        keyMap: {
          M: { item: 'minecraft:magma_block' },
          O: { item: 'minecraft:obsidian' }
        },
        outputCount: 1
      },
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now()
    }
  ],
  assets: [
    {
      id: 'asset_icon_sword',
      name: 'flame_reaver_icon.png',
      type: 'item_icon',
      width: 16,
      height: 16,
      dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAYElEQVR42mNkQAaMjIz/GQgDbBiG6mBgYGDAqphwBvLVDx5g/P/3rwE2Pli1YQz0twpDA8M/hGkY+gE+vfg0Y+sH7HpQ9IP4mOrw6yE6mPHrwWc6GOHXA9ODr57Q8QA28xwhm5yAkgAAAABJRU5ErkJggg==',
      hasTransparency: true
    },
    {
      id: 'asset_icon_boots',
      name: 'magma_boots_icon.png',
      type: 'item_icon',
      width: 16,
      height: 16,
      dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZklEQVR42mNkQAaMjIz/GQgDbBiG6mBgYGDAqphwBvLVDx5g/P/3rwE2Pli1YQz0twpDA8M/hGkY+gE+vfg0Y+sH7HpQ9IP4mOrw6yE6mPHrwWc6GOHXA9ODr57Q8QA28xwhm5yAkgAAAABJRU5ErkJggg==',
      hasTransparency: true
    }
  ]
};
