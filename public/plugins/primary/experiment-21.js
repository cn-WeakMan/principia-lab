/* Primary experiment 22, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['自然科学','雨量与统计','一个星期的降雨','比较每天平均降雨和总降雨量。',[['雨天数',0,7,4,1],['每雨天雨量(mm)',0,30,10,5]],p=>[`一周总雨量 ${p[0]*p[1]} mm；按7天计算日均 ${(p[0]*p[1]/7).toFixed(1)} mm`,p[0]*p[1],210],'假设每个雨天雨量相同；不能由周平均推断某天雨量。',['weather','statistics','weatherenglish'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.21',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
