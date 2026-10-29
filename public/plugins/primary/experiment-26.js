/* Primary experiment 27, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['规则与社会','劳动分工合作','班级整理教室','调整人数，计算平均分工所需时间。',[['任务总量(份)',6,60,24,6],['参与人数',1,12,6,1]],p=>[`平均每人 ${(p[0]/p[1]).toFixed(2)} 份任务`,p[0]/p[1],60],'假设任务可拆分且每个人能力相同；实际合作有协调成本。',['sharing','fairness','ratio'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.26',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
