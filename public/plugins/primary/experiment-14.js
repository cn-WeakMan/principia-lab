/* Primary experiment 15, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['语言与表达','英语名词单复数','One apple, many apples','改变苹果数量，观察英语名词的单复数形式。',[['苹果数量',0,12,3,1]],p=>[`${p[0]} ${p[0]===1?'apple':'apples'} · 中文：${p[0]} 个苹果`,p[0],12],'仅示范 apple；其他名词可能有不规则复数。',['plural','number','countwords'],'icons'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.14',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
