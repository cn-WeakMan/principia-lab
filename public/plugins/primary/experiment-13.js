/* Primary experiment 14, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['语言与表达','量词与容量','一杯水究竟是多少','杯子的容量可变化，比较“一杯”与毫升。',[['杯子容量(mL)',100,500,250,50],['杯数',1,6,3,1]],p=>[`${p[1]} 杯 × ${p[0]} mL/杯 = ${p[0]*p[1]} mL`,p[0]*p[1],3000],'假设每杯装满；“杯”不是统一的标准容量。',['countwords','measurement','plural'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.13',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
