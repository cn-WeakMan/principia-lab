/* Independent senior mathematical model */
(function(){'use strict';
const definition={name:'指数增长与衰减',desc:'改变初始值 A 和速率 k，观察 y=A·e^(kt) 的曲线。',controls:[['A',0.5,4,1,.1],['k',-1,1,.3,.05]],expr:(x,p)=>p.A*Math.exp(p.k*x),read:p=>`y=${p.A.toFixed(1)}·e^(${p.k.toFixed(2)}t)；初始增长率=${(p.A*p.k).toFixed(2)}`,assume:'只适用于变化速率正比于当前量、参数 k 恒定等假设；未考虑承载上限。',domain:[0,5]};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'senior.builtin.1',level:'senior',version:'1.0.0',name:definition.name,kind:'curve',definition,run:({x,parameters})=>definition.expr(x,parameters)});
})();
