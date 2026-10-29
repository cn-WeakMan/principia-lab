/* Primary experiment 23, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['自然科学','昼夜时间模型','一天有多少光照时间','为不同季节设置假想昼长，认识昼夜互补。',[['白昼(小时)',6,18,12,1]],p=>[`白昼 ${p[0]} 小时 + 黑夜 ${24-p[0]} 小时 = 24 小时`,p[0],24],'昼长受纬度、日期等影响；这里只探索总时间分配，不计算天文位置。',['seasons','pattern','tense'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.22',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
