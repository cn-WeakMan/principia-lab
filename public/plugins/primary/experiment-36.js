/* Primary experiment 37, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['自然科学','种子发芽率','种子观察记录','改变种子总数与发芽数，计算观察样本的发芽比例。',[['种子数',5,50,20,5],['发芽数',0,50,12,1]],p=>{let n=Math.min(p[0],p[1]);return[`观察 ${p[0]} 粒种子，其中 ${n} 粒发芽，样本发芽率 ${(n/p[0]*100).toFixed(1)}%`,n,p[0]]},'发芽数不可超过种子总数；样本发芽率不能保证未来批次相同。',['growth','statistics','observation'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.36',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
