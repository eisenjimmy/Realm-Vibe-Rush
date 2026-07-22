/* ============================================================================
   Realm Vibe Rush — level generator (single source of truth)
   Produces data/stages.json (100 levels). The SAME buildLevels() body is
   mirrored into index.html as the offline (file://) fallback.
   Regenerate:  node scripts/gen-stages.js   ·   Deterministic (seeded RNG).
========================================================================== */
'use strict';

// ---- keep this function byte-identical to buildLevels() in index.html ----
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
  function shapesFor(L){
    if(L<=3)  return ['mouse','mouse'];                                 // tutorial: grunts only
    if(L<=6)  return ['mouse','mouse','slinger','bat'];                 // ~25% air
    if(L<=10) return ['mouse','slinger','slinger','brute','bat'];
    if(L<=30) return ['mouse','slinger','brute','brute','bat','warlock'];
    return ['slinger','brute','brute','warlock','yeti','bat'];          // late: heavies
  }
  const NAMES={Normal:['Green Meadow','Sunny Field','Rolling Downs','Quiet Pasture'],Metal:['Iron Gate','Steelworks','Rustpile Ridge','The Foundry'],Monster:['Beast Hollow','Fang Thicket','Howling Woods','Den of Maws'],Fire:['Ember Ridge','Molten Pass','Cinder Wastes','Ashfall Rim'],Water:['Tidal Shore','Coral Reach','Sunken Causeway','Mistport'],Earth:['Dust Canyon','Boulder Pass','Clay Flats','Quarry Road'],Lightning:['Storm Mesa','Thunder Peak','Static Fields','Voltcrag'],Poison:['Toxic Marsh','Bog of Fumes','Blight Fen','Miasma Reach'],Ghost:['Haunted Graveyard','Wraith Hollow','Moonlit Crypt','Pale Cairn'],Arcane:['Rune Nexus','Astral Verge','The Weave','Starfall Sanctum']};
  function rng(seed){ let a=seed>>>0; return function(){ a|=0;a=a+0x6D2B79F5|0; let x=Math.imul(a^a>>>15,1|a); x=x+Math.imul(x^x>>>7,61|x)^x; return ((x^x>>>14)>>>0)/4294967296; }; }
  const pick=(r,arr)=>arr[Math.floor(r()*arr.length)];
  const levels=[];
  for(let L=1; L<=100; L++){
    const r=rng(L*2654435761); const boss=(L%10===0);
    let element, element2=null;
    if(L<=3){ element='Normal'; }
    else if(L<=10){ element = L===10 ? 'Fire' : ['Metal','Poison','Water','Fire','Metal','Poison','Water'][(L-4)%7]; }
    else { element=TYPESN[1+((L-11)%9)]; if(L>=25) element2=TYPESN[1+((L-11+3)%9)]; if(element2===element) element2=null; }
    const th=THEME[element]||THEME.Normal;
    // difficulty curve: 1-3 easy, sharp jump at 4+, exponential after
    const baseHp = L<=3 ? Math.round(300 + L*70) : Math.round(700 * Math.pow(1.072, L-4));
    const startGold = L<=3 ? 200 : 150 + Math.floor(L/6)*10;
    const income = L<=3 ? 12 : Math.round((9.5 + L*0.28)*10)/10;
    const budgetRate = L<=3 ? Math.round((2.0 + L*0.2)*10)/10 : Math.round((4.8 + (L-4)*0.4)*10)/10;
    // roster is a weighted spawn pool (AI draws uniformly); duplicates weight it
    const roster = shapesFor(L).map((tt,idx)=>({ t:tt, el:(element2 && idx%2===1)?element2:element }));
    if(L>3){ const feat=roster[Math.floor(r()*roster.length)].t; roster.push({t:feat,el:element},{t:feat,el:element}); } // per-stage featured bias
    let bossDef=null; if(boss){ const bt=L>=50?'yeti':(L>=20?'brute':'yeti'); bossDef={t:bt,el:element,hpMul:5+Math.floor(L/20),name:'Warlord '+pick(r,['Grimtail','Cinderfang','Vorlok','Mossback','Ironhide'])}; }
    const reward=(L<=3?3:5+Math.floor(L/10)*2)+(boss?15:0);
    const parTime=Math.round(18+baseHp/55);
    const nm=(NAMES[element]?pick(r,NAMES[element]):'Stage').trim()+' · Lv'+L;
    levels.push({level:L,name:nm,theme:th.theme,element,element2,baseHp,startGold,income,budgetRate,roster,boss:bossDef,reward,parTime,sky:th.sky,ground:th.ground,hillFar:th.hillFar,hillNear:th.hillNear,tree:th.tree,tutorial:L<=3});
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
  [1,3,4,10,50,100].forEach(n=>console.log('L'+n+':', JSON.stringify(lv[n-1]).slice(0,150)));
}
module.exports = { buildLevels };
