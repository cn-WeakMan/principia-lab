/* Primary experiment 25, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['规则与社会','多数投票','班级图书角选书','调整两本书的票数，比较结果与公平程序。',[['故事书票数',0,20,12,1],['科学书票数',0,20,8,1]],p=>[`故事书 ${p[0]} 票，科学书 ${p[1]} 票；${p[0]===p[1]?'票数相同':p[0]>p[1]?'故事书票数更多':'科学书票数更多'}`,p[0],20,p[1]],'投票方法、参与资格和少数意见也需要讨论；多数不等于必然正确。',['fairness','rules','statistics'],'dual'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.24',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
