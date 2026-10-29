/* Primary experiment 21, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['自然科学','食物链数量','草与小兔的假想模型','估算若每只兔子每天吃一定数量的草。',[['兔子数量',1,10,4,1],['每只食草(份/天)',1,8,3,1]],p=>[`每天需 ${p[0]*p[1]} 份草；七天需 ${p[0]*p[1]*7} 份`,p[0]*p[1],80],'这是食物需求算术模型，不代表生态系统真实捕食和再生过程。',['ratio','growth','observation'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.20',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
