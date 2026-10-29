/* Primary experiment 20, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['自然科学','水温变化','降温观察记录','用简单线性近似估算水温变化。',[['初始温度(℃)',30,90,65,5],['每分钟下降(℃)',0,5,2,0.5],['经过时间(分)',0,10,5,1]],p=>[`估计温度 ${Math.max(20,p[0]-p[1]*p[2]).toFixed(1)} ℃（设最低到20℃）`,Math.max(20,p[0]-p[1]*p[2]),90],'线性降温仅是课堂近似，真实冷却速率随温差变化。',['weather','measurement','observation'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.19',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
