/* Primary experiment 07, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['数学与生活','分数与百分数','彩色格子的秘密','涂色格数如何变成分数和百分数？',[['涂色格数',0,20,8,1]],p=>[`${p[0]}/20 = ${(p[0]*5)}%，未涂色 ${20-p[0]} 格`,p[0],20],'整体固定为20格；分数要说明整体。',['fraction','number','fairness'],'grid'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.6',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
