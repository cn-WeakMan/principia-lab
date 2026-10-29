/* Primary experiment 30, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['规则与社会','价格与消费选择','每周零花钱计划','比较固定收入与计划花费，探索盈余。',[['预算(元)',10,100,50,10],['计划花费(元)',0,100,35,5]],p=>[`预算 ${p[0]} 元，计划花费 ${p[1]} 元，${p[1]<=p[0]?'剩余 '+(p[0]-p[1])+' 元':'超出 '+(p[1]-p[0])+' 元'}`,Math.min(p[1],p[0]),p[0]],'不包含价格变化、必要开支优先级或长期储蓄。',['shopping','number','reasoning'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.29',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
