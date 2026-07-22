/* ============================================================================
   Realm Vibe Rush — level generator (single source of truth)
   Produces data/stages.json (100 levels). The SAME buildLevels() body is
   mirrored into index.html as the offline (file://) fallback, so served and
   offline play are identical. Regenerate:  node scripts/gen-stages.js
   Deterministic (seeded RNG) so output never drifts.
========================================================================== */
'use strict';

// ---- keep this function byte-identical to buildLevels() in index.html ----
function buildLevels(){
  const TYPES=['Normal','Metal','Monster','Fire','Water','Earth','Lightning','Poison','Ghost','Arcane'];
  // visual palette + base enemy shapes per element (5 shapes reskinned via element tint)
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
  // which enemy shapes are allowed as difficulty grows
  const SHAPES_EASY=['mouse','mouse','slinger'];
  const SHAPES_MID=['mouse','slinger','brute'];
  const SHAPES_HARD=['slinger','brute','warlock','yeti'];
  const NAMES={
    Normal:['Green Meadow','Sunny Field','Rolling Downs','Quiet Pasture'],
    Metal:['Iron Gate','Steelworks','Rustpile Ridge','The Foundry'],
    Monster:['Beast Hollow','Fang Thicket','Howling Woods','Den of Maws'],
    Fire:['Ember Ridge','Molten Pass','Cinder Wastes','Ashfall Rim'],
    Water:['Tidal Shore','Coral Reach','Sunken Causeway','Mistport'],
    Earth:['Dust Canyon','Boulder Pass','Clay Flats','Quarry Road'],
    Lightning:['Storm Mesa','Thunder Peak','Static Fields','Voltcrag'],
    Poison:['Toxic Marsh','Bog of Fumes','Blight Fen','Miasma Reach'],
    Ghost:['Haunted Graveyard','Wraith Hollow','Moonlit Crypt','Pale Cairn'],
    Arcane:['Rune Nexus','Astral Verge','The Weave','Starfall Sanctum'],
  };
  // seeded RNG so generation is deterministic
  function rng(seed){ let a=seed>>>0; return function(){ a|=0;a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
  const pick=(r,arr)=>arr[Math.floor(r()*arr.length)];

  const levels=[];
  for(let L=1; L<=100; L++){
    const r=rng(L*2654435761);
    const boss = (L%10===0);
    // element theme
    let element, element2=null;
    if(L<=5){ element='Normal'; }
    else if(L<=10){ element = L===10 ? 'Fire' : ['Normal','Normal','Metal','Poison','Water'][(L-6)%5]; } // gentle intro
    else {
      element = TYPES[1 + ((L-11) % 9)]; // cycle non-Normal elements
      if(L>=25) element2 = TYPES[1 + ((L-11+3) % 9)]; // dual-element from L25
      if(element2===element) element2=null;
    }
    const th = THEME[element] || THEME.Normal;

    // difficulty curve
    const baseHp = L<=10 ? Math.round(480 + L*95) : Math.round(1450 * Math.pow(1.046, L-10));
    const startGold = L<=10 ? 165 : 150 + Math.floor(L/6)*10;
    const income = Math.round((9 + L*0.32) * 10)/10;
    const budgetRate = L<=10 ? Math.round((3.5 + L*0.32)*10)/10 : Math.round((6.2 + (L-10)*0.42)*10)/10;

    // roster of enemy shapes, tagged with element(s)
    const shapes = L<=10 ? SHAPES_EASY : (L<=30 ? SHAPES_MID : SHAPES_HARD);
    const count = L<=10 ? 4 : 5;
    const roster=[];
    for(let i=0;i<count;i++){
      const t = pick(r, shapes);
      const el = (element2 && r()<0.4) ? element2 : element;
      roster.push({t, el});
    }
    // boss
    let bossDef=null;
    if(boss){
      const bt = L>=50 ? 'yeti' : (L>=20 ? 'brute' : 'yeti');
      bossDef = { t:bt, el:element, hpMul: 5 + Math.floor(L/20), name:'Warlord '+pick(r,['Grimtail','Cinderfang','Vorlok','Mossback','Ironhide']) };
    }

    // rewards + score par
    const reward = (L<=10?3:5+Math.floor(L/10)*2) + (boss?15:0);
    const parTime = Math.round(18 + baseHp/55);

    levels.push({
      level:L, name:(NAMES[element]?pick(r,NAMES[element]):'Stage')+' ',
      theme:th.theme, element, element2,
      baseHp, startGold, income, budgetRate,
      roster, boss:bossDef, reward, parTime,
      sky:th.sky, ground:th.ground, hillFar:th.hillFar, hillNear:th.hillNear, tree:th.tree,
      tutorial: L<=10
    });
    // clean trailing space in name + append Lv tag for clarity
    levels[levels.length-1].name = levels[levels.length-1].name.trim() + ' · Lv'+L;
  }
  return levels;
}
// ---------------------------------------------------------------------------

if (typeof module!=='undefined' && require.main===module){
  const fs=require('fs'), path=require('path');
  const out=path.join(__dirname,'..','data','stages.json');
  fs.writeFileSync(out, JSON.stringify(buildLevels(), null, 0));
  const lv=buildLevels();
  console.log('Wrote '+lv.length+' levels -> '+out);
  console.log('L1:', JSON.stringify(lv[0]).slice(0,120));
  console.log('L15:', JSON.stringify(lv[14]).slice(0,140));
  console.log('L100:', JSON.stringify(lv[99]).slice(0,140));
}
module.exports = { buildLevels };
