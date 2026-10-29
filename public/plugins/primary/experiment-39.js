/* Primary experiment 40, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['规则与社会','排队等待时间','公共秩序为什么重要','模拟队列人数与单人服务时间，计算最后一人的预计等待。',[['前面排队人数',0,15,5,1],['每人办理(分钟)',1,10,3,1]],p=>[`排在你前面的 ${p[0]} 人，每人 ${p[1]} 分钟，预计等待 ${p[0]*p[1]} 分钟`,p[0]*p[1],150],'假设只有一个窗口且耗时相同；优先服务规则需考虑实际情况。',['rules','ratio','fairness'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.39',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
