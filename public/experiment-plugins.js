/* Unified trusted browser-side experiment registry. No eval or remote script loading. */
(function(){'use strict';
 const items=new Map();
 const validId=/^[a-z0-9][a-z0-9._-]*$/;
 const api={
  register(plugin){if(!plugin||!validId.test(plugin.id)||typeof plugin.run!=='function'||typeof plugin.version!=='string')throw Error('Invalid experiment plugin');if(items.has(plugin.id))throw Error('Duplicate experiment plugin: '+plugin.id);items.set(plugin.id,Object.freeze({...plugin}));return plugin.id},
  get(id){const p=items.get(id);if(!p)throw Error('Unknown experiment plugin: '+id);return p},
  list(level){return [...items.values()].filter(p=>!level||p.level===level).map(({id,version,level,name,kind})=>({id,version,level,name,kind}))},
  run(id,context){return api.get(id).run(context)},
  registerLegacy(level,experiments){experiments.forEach((experiment,index)=>api.register({id:`${level}.builtin.${index}`,version:'1.0.0',level,name:experiment.name,kind:'legacy',run:({parameters,canvas,width,height})=>{const output=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return output}}))}
 };
 Object.defineProperty(window,'PLAB_EXPERIMENT_PLUGINS',{value:Object.freeze(api)});
 window.PLAB_LEVEL_UI=Object.freeze({
  primary:{index:'00',name:'小学',title:'数学与跨学科探索'},
  junior:{index:'01',name:'初中',title:'函数与跨学科'},
  senior:{index:'02',name:'高中',title:'变化与数学建模'}
 });
 window.PLAB_PAGE_HEADER=function(level){const o=window.PLAB_LEVEL_UI[level];if(!o)throw Error('Unknown level');return `<header class="top plab-unified-header"><div><div class="kicker">◈ PRINCIPIA LAB${level==='primary'?'':' / LEVEL '+o.index}</div><h1>${o.name} · ${o.title}</h1></div><nav class="nav"><a href="index.html">首页</a>${Object.entries(window.PLAB_LEVEL_UI).map(([key,v])=>`<a href="${key}.html" class="${key===level?'active':''}">${v.name}版</a>`).join('')}</nav></header>`};
 window.PLAB_UNIFY_HEADER=function(level){const root=document.querySelector('.primary-app,.app');const h=root?.querySelector('header');if(h)h.outerHTML=window.PLAB_PAGE_HEADER(level)};
})();
