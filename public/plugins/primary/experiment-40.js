/* Primary experiment 41, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['规则与社会','交通信号灯','遵守规则与周期','改变红灯和绿灯时长，计算一个周期中两种信号的时间比例。',[['红灯(秒)',10,90,30,5],['绿灯(秒)',10,90,45,5]],p=>[`假设红绿交替，一个周期 ${p[0]+p[1]} 秒；绿灯占比 ${(p[1]/(p[0]+p[1])*100).toFixed(1)}%`,p[1],p[0]+p[1]],'不包含黄灯、行人信号、相位冲突或道路工程设计；真实交通必须遵守现场信号。',['rules','fraction','pattern'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.40',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
