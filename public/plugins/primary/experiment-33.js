/* Primary experiment 34, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['语言与表达','句子信息完整性','谁、做什么、在何处','用三个变量组合情境信息，区分“表达细节变多”和“事实更可靠”。',[['人物数',1,5,2,1],['动作种类数',1,4,2,1],['场景数',1,5,3,1]],p=>[`可组合 ${p[0]*p[1]*p[2]} 种“人物—动作—地点”情境；表达时应说明发生了什么`,p[0]*p[1]*p[2],100],'组合计数不代表句子一定通顺、自然或真实；语言表达还受语境约束。',['sentence','story','reasoning'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.33',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
