/* Primary experiment 35, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['语言与表达','英语日期与日程','What day is it?','选择一周起始日和经过的天数，观察一周周期与英语星期词。',[['开始日(周一=1)',1,7,1,1],['经过天数',0,20,9,1]],p=>{const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];let i=(p[0]-1+p[1])%7;return[`从 ${days[p[0]-1]} 起过 ${p[1]} 天，是 ${days[i]}；完整周数 ${Math.floor(p[1]/7)}`,i+1,7]},'按整天计算，不涉及时区、日期跨月等历法因素。',['tense','pattern','story'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.34',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
