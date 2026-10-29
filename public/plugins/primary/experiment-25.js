/* Primary experiment 26, independently editable */
(function(){'use strict';
const {label,axes,bar,extraDraw}=window.PLAB_PRIMARY_DRAWING;
const [group,name,title,description,params,compute,limit,links,kind]=['规则与社会','公共图书借阅','阅读与归还的约定','调整图书总量和借阅量，模拟库存变化。',[['图书总数',10,50,30,5],['借出数',0,30,10,1]],p=>[`总书 ${p[0]} 本；借出 ${Math.min(p[0],p[1])} 本；在架 ${Math.max(0,p[0]-p[1])} 本`,Math.max(0,p[0]-p[1]),p[0]],'借出量不能超过馆藏；归还损坏和逾期规则需另行讨论。',['rules','sharing','number'],'bar'];
const experiment={group,name,title,description,params,calc:p=>{const info=compute(p);return {text:info[0],limit,links,chart:info};},draw:(ctx,W,H,p)=>extraDraw(kind,ctx,W,H,p,compute(p))};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'primary.builtin.25',level:'primary',version:'1.0.0',name:experiment.name,kind:'primary',definition:experiment,run:({parameters,canvas,width,height})=>{const result=experiment.calc(parameters);if(canvas&&experiment.draw)experiment.draw(canvas.getContext('2d'),width,height,parameters);return result;}});
})();
