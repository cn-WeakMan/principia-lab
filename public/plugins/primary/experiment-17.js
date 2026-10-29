/* Primary experiment 18, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['语言与表达','故事先后与因果','先发生不等于造成','比较两项事件间隔，讨论记录时间和因果证据。',[['事件A(分钟)',0,30,5,5],['事件B(分钟)',5,60,25,5]],p=>[`A在第 ${p[0]} 分钟，B在第 ${p[1]} 分钟；${p[0]===p[1]?'同时记录':p[0]<p[1]?'A先发生':'B先发生'}；不能仅凭先后确定因果`,Math.abs(p[0]-p[1]),60],'时序信息不足以证明因果，需要排除其他解释。',['story','evidence','reasoning'],'timeline'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.17',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
