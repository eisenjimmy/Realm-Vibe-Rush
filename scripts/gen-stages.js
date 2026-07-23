/* ============================================================================
   Realm Vibe Rush — level generator (single source of truth)
   Produces data/stages.json (100 levels). Mirror buildLevels() into index.html
   for offline file:// fallback.
   Regenerate:  node scripts/gen-stages.js
========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

function buildLevels(){
  const TYPESN=['Normal','Metal','Monster','Fire','Water','Earth','Lightning','Poison','Ghost','Arcane'];
  const THEME={
    Normal:   {theme:'day',  sky:['#bfe7ff','#cfeecb','#e9f5c9'], ground:['#5ba14a','#3f7d33','#2f5f27'], hillFar:'#a7d98f',hillNear:'#7cc267',tree:'#3f8f4a'},
    Metal:    {theme:'day',  sky:['#c9d2dc','#aeb8c4','#8f99a6'], ground:['#8a8f96','#6f747c','#565b62'], hillFar:'#9aa3ad',hillNear:'#7c848c',tree:'#5a6b5a'},
    Monster:  {theme:'night',sky:['#2a1c3f','#3a2758','#4a3170'], ground:['#2f2440','#241a33','#160f24'], hillFar:'#3a2f52',hillNear:'#2c2340',tree:'#3a2a4a'},
    Fire:     {theme:'lava', sky:['#3a0f0a','#7a2410','#c9401a'], ground:['#5a1f10','#3a140a','#200a05'], hillFar:'#7a2f18',hillNear:'#5a2010',tree:'#3a1a0f'},
    Water:    {theme:'day',  sky:['#bfe9ff','#8fd0f5','#5ab0e8'], ground:['#3a8fb0','#2a6f8f','#1a4f6a'], hillFar:'#7fc4e0',hillNear:'#5aa8cc',tree:'#3a8f9a'},
    Earth:    {theme:'day',  sky:['#f0d9a8','#e0bd7a','#caa15a'], ground:['#b07a3a','#8a5c28','#5f3f18'], hillFar:'#c9a15a',hillNear:'#a07c3a',tree:'#8a7a3a'},
    Lightning:{theme:'night',sky:['#2a2c3f','#3a3d55','#4a4d6a'], ground:['#3a3d20','#2a2c18','#1a1c10'], hillFar:'#4a4d3a',hillNear:'#38402c',tree:'#5a5d2a'},
    Poison:   {theme:'day',  sky:['#c9e0a0','#a0c060','#7fa040'], ground:['#4a6a2a','#3a5220','#243615'], hillFar:'#7fa04a',hillNear:'#5f8030',tree:'#3f6a2a'},
    Ghost:    {theme:'night',sky:['#3a2b5c','#4a3170','#5a3d7a'], ground:['#3a3450','#2a2540','#1a1730'], hillFar:'#4a3f66',hillNear:'#38304f',tree:'#2f3a5a'},
    Arcane:   {theme:'night',sky:['#1c2a5c','#2f3d8a','#4a5db0'], ground:['#2a2f5a','#1f2444','#12172a'], hillFar:'#3a4f8f',hillNear:'#2f3d6a',tree:'#3a4a8f'},
  };
  // Elemental slime key per stage element
  const ELEM_SLIME={
    Normal:'mouse', Metal:'slime_metal', Monster:'slime_poison', Fire:'slime_fire',
    Water:'slime_water', Earth:'slime_earth', Lightning:'slime_lightning',
    Poison:'slime_poison', Ghost:'slime_ghost', Arcane:'slime_arcane'
  };
  /** Weighted spawn pool — harder tiers unlock bigger threats. Duplicates = higher weight. */
  function shapesFor(L, element){
    const es = ELEM_SLIME[element] || 'mouse';
    // Stages 1–10: Monster V3 cast (CraftPix animated GIF enemies)
    if(L<=2)  return ['mouse','mouse','fruit','virus'];
    if(L<=4)  return ['mouse','fruit','virus','floateye','skullpup'];
    if(L<=7)  return ['mouse','fruit','virus','floateye','skullpup','mouse'];
    if(L<=10) return ['mouse','fruit','virus','floateye','skullpup','slinger','bat'];
    if(L<=12) return [es, 'mouse','fruit','skullpup','slinger','bat','brute','floateye'];
    if(L<=18) return [es, 'slinger', 'brute', 'swat', 'bat', 'demon', 'virus', 'skullpup'];
    if(L<=25) return [es, 'slinger', 'brute', 'minotax', 'swat', 'warlock', 'demon', 'bat', es];
    if(L<=35) return [es, 'brute', 'minotax', 'swat', 'warlock', 'demon', 'helleye', 'bat', 'yeti', es];
    if(L<=50) return [es, 'minotax', 'warlock', 'demon', 'helleye', 'hellreaper', 'yeti', 'swat', 'bat', es, es];
    if(L<=70) return [es, 'minotax', 'hellreaper', 'helleye', 'hellhorn', 'dragonred', 'yeti', 'warlock', 'demon', es];
    return [es, 'hellhorn', 'hellreaper', 'helleye', 'dragonred', 'dragongold', 'minotax', 'yeti', 'demon', es, 'dragonred'];
  }
  const NAMES={
    Normal:['Green Meadow','Sunny Field','Rolling Downs','Quiet Pasture','Soft Hills'],
    Metal:['Iron Gate','Steelworks','Rustpile Ridge','The Foundry','Chrome Dunes'],
    Monster:['Beast Hollow','Fang Thicket','Howling Woods','Den of Maws','Gnoll March'],
    Fire:['Ember Ridge','Molten Pass','Cinder Wastes','Ashfall Rim','Furnace Trail'],
    Water:['Tidal Shore','Coral Reach','Sunken Causeway','Mistport','Brine Flats'],
    Earth:['Dust Canyon','Boulder Pass','Clay Flats','Quarry Road','Stone Trail'],
    Lightning:['Storm Mesa','Thunder Peak','Static Fields','Voltcrag','Spark Ridge'],
    Poison:['Toxic Marsh','Bog of Fumes','Blight Fen','Miasma Reach','Venom Hollow'],
    Ghost:['Haunted Graveyard','Wraith Hollow','Moonlit Crypt','Pale Cairn','Spirit Bog'],
    Arcane:['Rune Nexus','Astral Verge','The Weave','Starfall Sanctum','Sigil Road']
  };
  const STORY_EN = {
    Normal:[
      'Scouts report soft hills and softer brains — perfect starter practice.',
      'The grass is suspiciously clean. Something sticky was here.',
      'A training field… that fought back. Classic.'
    ],
    Metal:[
      'Metal clinks in the fog. The enemy brought chrome.',
      'Iron gates mean iron fists. Bring a bigger hammer.',
      'Rust or glory — both leave stains.'
    ],
    Monster:[
      'Howls at noon. Bad manners. Worse odds.',
      'Beast trails lead to a denser problem.',
      'Something with too many teeth claimed this path.'
    ],
    Fire:[
      'The air tastes like barbecue and bad decisions.',
      'Ember tracks. Do not step in the glowing ones.',
      'If it smokes, it ships — straight into your keep.'
    ],
    Water:[
      'Tide is high and so is the slime count.',
      'Coral paths hide wet surprises.',
      'Brine in the boots. War in the eyes.'
    ],
    Earth:[
      'Dust clouds mean cavalry — or angry dirt.',
      'Boulders don\'t move themselves. Usually.',
      'Clay sticks to everything. Especially plans.'
    ],
    Lightning:[
      'Hair stands up. Morale does the opposite.',
      'Static on the radio. Thunder on the ridge.',
      'If it sparks, it\'s not a friend.'
    ],
    Poison:[
      'Don\'t lick the leaves. Or the enemies.',
      'The marsh burps. That\'s not weather.',
      'Green mist ahead. Bring a nose plug and a sword.'
    ],
    Ghost:[
      'Cold spots. Warm regrets.',
      'Something unfinished still marches here.',
      'Candles go out. Spirits do not.'
    ],
    Arcane:[
      'Runes glow without permission.',
      'The sky has equations. None of them are fair.',
      'Magic pressure rising. Helmets optional, bravery not.'
    ]
  };
  const STORY_KO = {
    Normal:[
      '정찰 보고: 언덕은 부드럽고 적 지능도 부드럽다. 연습하기 딱 좋다.',
      '잔디가 수상할 정도로 깨끗하다. 점액 자국이 있었다.',
      '훈련장…이 반격했다. 역시.'
    ],
    Metal:[
      '안개 속에서 쇠소리가 난다. 적이 크롬을 가져왔다.',
      '철문은 철주먹을 뜻한다. 더 큰 망치를 가져와라.',
      '녹이든 영광이든 — 둘 다 얼룩을 남긴다.'
    ],
    Monster:[
      '한낮에 울부짖는다. 예의가 없다. 승산도 없다.',
      '짐승 발자국이 더 빽빽한 문제로 이어진다.',
      '이빨이 너무 많은 무언가가 이 길을 점령했다.'
    ],
    Fire:[
      '공기가 바베큐와 잘못된 결정 맛이다.',
      '불씨 자국. 빛나는 곳은 밟지 마라.',
      '연기 나면 배송된다 — 아군 성으로 직행.'
    ],
    Water:[
      '조수가 높고 슬라임 수도 높다.',
      '산호 길에 젖은 놀라움이 숨었다.',
      '장화에 짠물, 눈에 전쟁.'
    ],
    Earth:[
      '먼지 구름은 기병… 아니면 화난 흙이다.',
      '바위는 스스로 움직이지 않는다. 보통은.',
      '진흙이 모든 것에 붙는다. 특히 계획에.'
    ],
    Lightning:[
      '머리카락이 선다. 사기는 그 반대.',
      '무전에 잡음, 능선에 천둥.',
      '스파크가 나면 친구가 아니다.'
    ],
    Poison:[
      '잎을 핥지 마라. 적도.',
      '늪이 트림한다. 날씨가 아니다.',
      '앞쪽에 초록 안개. 코마개와 검을 챙겨라.'
    ],
    Ghost:[
      '차가운 자리. 따뜻한 후회.',
      '끝나지 않은 무언가가 아직 행군 중이다.',
      '촛불은 꺼진다. 영혼은 안 꺼진다.'
    ],
    Arcane:[
      '룬이 허락 없이 빛난다.',
      '하늘에 수식이 있다. 공정한 건 하나도 없다.',
      '마법 압력이 오른다. 헬멧은 선택, 용기는 필수.'
    ]
  };
  const BOSS_STORY_EN=[
    'Boss energy detected. Snack reserves critically low.',
    'A named threat holds the keep keys — and the Wi-Fi.',
    'Big silhouette. Bigger attitude. Time to bill overtime.'
  ];
  const BOSS_STORY_KO=[
    '보스 기운 감지. 간식 비축량이 위험 수준이다.',
    '이름이 있는 위협이 요새 열쇠 — 그리고 와이파이를 쥐고 있다.',
    '큰 실루엣. 더 큰 태도. 잔업 청구할 시간이다.'
  ];

  function rng(seed){ let a=seed>>>0; return function(){ a|=0;a=a+0x6D2B79F5|0; let x=Math.imul(a^a>>>15,1|a); x=x+Math.imul(x^x>>>7,61|x)^x; return ((x^x>>>14)>>>0)/4294967296; }; }
  const pick=(r,arr)=>arr[Math.floor(r()*arr.length)];

  const levels=[];
  for(let L=1; L<=100; L++){
    const r=rng(L*2654435761); const boss=(L%10===0);
    let element, element2=null;
    if(L<=3){ element='Normal'; }
    else if(L<=10){ element = L===10 ? 'Fire' : ['Metal','Poison','Water','Fire','Earth','Lightning','Water'][(L-4)%7]; }
    else {
      element=TYPESN[1+((L-11)%9)];
      if(L>=22) element2=TYPESN[1+((L-11+4)%9)];
      if(element2===element) element2=null;
    }
    const th=THEME[element]||THEME.Normal;

    // Difficulty: gentle tutorial → smooth ramp → late exponential pressure
    // HP: keep tankiness scales with L
    let baseHp;
    if(L<=3) baseHp = Math.round(280 + L*55);
    else if(L<=15) baseHp = Math.round(480 + (L-3)*95);
    else if(L<=40) baseHp = Math.round(1600 * Math.pow(1.055, L-15));
    else baseHp = Math.round(5800 * Math.pow(1.048, L-40));

    // Player economy: early generous, mid tight, late must have upgrades
    const startGold = L<=3 ? 220 : L<=15 ? 170 + Math.floor((L-4)*4) : 160 + Math.floor(L/5)*8;
    const income = L<=3 ? 13 : L<=20 ? Math.round((10 + L*0.22)*10)/10 : Math.round((12 + L*0.18)*10)/10;
    // Enemy spawn pressure (budget/sec) — key difficulty lever
    let budgetRate;
    if(L<=3) budgetRate = Math.round((1.6 + L*0.25)*10)/10;
    else if(L<=12) budgetRate = Math.round((3.2 + (L-3)*0.35)*10)/10;
    else if(L<=40) budgetRate = Math.round((6.5 + (L-12)*0.28)*10)/10;
    else budgetRate = Math.round((14 + (L-40)*0.22)*10)/10;

    // Roster with elemental slime bias + featured unit weight
    let pool = shapesFor(L, element);
    const roster = pool.map((tt,idx)=>{
      let el = element;
      if(element2 && idx%3===2) el = element2;
      // elemental slime enemies force matching element on their type
      if(String(tt).indexOf('slime_')===0){
        const map={slime_water:'Water',slime_fire:'Fire',slime_lightning:'Lightning',slime_poison:'Poison',
          slime_earth:'Earth',slime_metal:'Metal',slime_ghost:'Ghost',slime_arcane:'Arcane'};
        el = map[tt]||el;
      }
      return {t:tt, el};
    });
    // Featured bias: 2 extra of a mid/high threat
    if(L>4){
      const threats=roster.filter(x=>!['mouse','bat','fruit','virus','floateye','skullpup'].includes(x.t));
      const feat=(threats[Math.floor(r()*Math.max(1,threats.length))]||roster[0]).t;
      const elF = (ELEM_SLIME[element]===feat)?element:element;
      roster.push({t:feat,el:elF},{t:feat,el:element2||elF});
    }
    // Late game: extra air pressure
    if(L>=30) roster.push({t:'bat',el:element},{t:'helleye',el:element2||element});
    if(L>=55) roster.push({t:'dragonred',el:element});

    let bossDef=null;
    if(boss){
      let bt, nm;
      if(L>=80){
        bt=pick(r,['dragongold','dragonred','hellhorn','hellreaper','minotax']);
        nm = bt==='dragongold'?pick(r,['Gilded Ruin','Sun Eater','Worldburner']):
             bt==='dragonred'?pick(r,['Ash Wyrm','Crimson Tyrant','Sootfang']):
             bt==='hellhorn'?pick(r,['Infernal Horn','Magma Maw','Scarlet Colossus']):
             bt==='minotax'?pick(r,['Labyrinth King','Axe of Ages','Horned Tyrant']):
             pick(r,['Death Reaper','Soul Scythe','Verdant Wraith']);
      } else if(L>=50){
        bt=pick(r,['hellreaper','helleye','hellhorn','dragonred','yeti','minotax']);
        nm = bt==='hellreaper'?pick(r,['Death Reaper','Soul Scythe','Plague Scythe']):
             bt==='helleye'?pick(r,['Void Gaze','Cyclops Fiend','Orb of Torment']):
             bt==='hellhorn'?pick(r,['Infernal Horn','Magma Maw','Scarlet Colossus']):
             bt==='dragonred'?pick(r,['Scarlet Drake','Ember King','Sootfang']):
             bt==='minotax'?pick(r,['Labyrinth King','Double Axe','Maze Warden']):
             'Frostlord '+pick(r,['Icepaw','Snowmaw','Rimehide']);
      } else if(L>=20){
        bt=pick(r,['demon','minotax','brute','helleye','warlock']);
        nm = bt==='demon'?pick(r,['Crimson King','Hell Imp','Scarlet Horn']):
             bt==='minotax'?pick(r,['Maze Warden','Axe Captain','Hornbreaker']):
             bt==='helleye'?pick(r,['Void Gaze','Watchful Doom','Cyclops Fiend']):
             bt==='warlock'?pick(r,['Hexlord','Beast Cantor','Night Channeler']):
             'Warlord '+pick(r,['Grimclaw','Ironhide','Stonepaw','Hornmaw']);
      } else {
        bt=pick(r,['brute','yeti','demon']);
        nm = bt==='brute'?pick(r,['Horned Captain','Maze Brute','Bull of the Gate']):
             bt==='demon'?pick(r,['Ember Imp','Ash Fiend']):
             'Frostlord '+pick(r,['Icepaw','Snowmaw','Rimehide','Glacierfang']);
      }
      bossDef={t:bt, el:element, hpMul:4+Math.floor(L/15), name:nm};
    }

    const reward=(L<=3?3:4+Math.floor(L/8)*2)+(boss?12+Math.floor(L/20)*3:0);
    const parTime=Math.round(20 + baseHp/70 + budgetRate*2.2);
    const place=(NAMES[element]?pick(r,NAMES[element]):'Stage').trim();
    const nm=place+' · Lv'+L;

    const enPool=STORY_EN[element]||STORY_EN.Normal;
    const koPool=STORY_KO[element]||STORY_KO.Normal;
    let storyEn=pick(r,enPool);
    let storyKo=pick(r,koPool);
    if(boss){
      storyEn+=' '+pick(r,BOSS_STORY_EN);
      storyKo+=' '+pick(r,BOSS_STORY_KO);
    }
    if(L<=3){
      storyEn='Tutorial hills. Summon units, watch them march, crack the enemy keep.';
      storyKo='튜토리얼 언덕. 유닛을 소환하고, 행군을 보고, 적 성을 부숴라.';
    }

    levels.push({
      level:L, name:nm, theme:th.theme, element, element2,
      baseHp, startGold, income, budgetRate, roster, boss:bossDef, reward, parTime,
      sky:th.sky, ground:th.ground, hillFar:th.hillFar, hillNear:th.hillNear, tree:th.tree,
      tutorial:L<=3,
      storyEn, storyKo
    });
  }
  return levels;
}

const levels = buildLevels();
const out = path.join(__dirname, '..', 'data', 'stages.json');
fs.writeFileSync(out, JSON.stringify(levels));
console.log('Wrote', levels.length, 'stages →', out);
console.log('Sample L1:', levels[0].name, levels[0].roster, 'story:', levels[0].storyEn);
console.log('Sample L25:', levels[24].name, 'hp', levels[24].baseHp, 'budget', levels[24].budgetRate, 'roster types', [...new Set(levels[24].roster.map(x=>x.t))].join(','));
console.log('Sample L50:', levels[49].name, 'boss', levels[49].boss && levels[49].boss.name);
console.log('Sample L90:', levels[89].name, 'hp', levels[89].baseHp, 'budget', levels[89].budgetRate);
