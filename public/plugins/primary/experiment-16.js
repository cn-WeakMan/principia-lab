/* Primary experiment 17, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['语言与表达','英语时间表达','Yesterday, today, tomorrow','变化事件发生的日期偏移，练习相对时间词。',[['距今天数',-3,3,-1,1]],p=>[`时间：${p[0]===-1?'yesterday':p[0]===0?'today':p[0]===1?'tomorrow':p[0]<0?`${-p[0]} days ago`:`in ${p[0]} days`}；相对今天 ${p[0]>0?'+':''}${p[0]} 天`,p[0]+3,6],'语法时态并非只由单个时间词决定。',['tense','story','pattern'],'timeline'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.16',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
