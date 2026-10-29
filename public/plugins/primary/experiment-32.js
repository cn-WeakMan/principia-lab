/* Primary experiment 33, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['数学与生活','平均数的陷阱','平均分相同，成绩就一样吗？','保持五个数的总和，改变一个人的数值，看平均数是否能够代表每个人。',[['第一人分值',0,100,60,5],['其余四人分值',0,100,60,5]],p=>[`五人平均 ${((p[0]+4*p[1])/5).toFixed(1)} 分；最高 ${Math.max(...p)} 分，最低 ${Math.min(...p)} 分`,(p[0]+4*p[1])/5,100],'仅是假设分值分布；同样的平均数可以对应不同的个体差异。',['statistics','evidence','fairness'],'dual'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.32',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
