/* Independent senior mathematical model */
(function(){'use strict';
const definition={name:'导数与切线',desc:'拖动观察点 x₀，在 y=ax² 上比较曲线与该点切线；瞬时变化率就是切线斜率。',controls:[['a',-2,2,1,.1],['x₀',-3,3,1,.1]],expr:(x,p)=>p.a*x*x,read:p=>`f(x)= ${p.a.toFixed(1)}x²；x₀=${p.x0.toFixed(1)}，f′(x₀)=${(2*p.a*p.x0).toFixed(2)}`,assume:'这里选可导的二次函数作示例，不代表所有函数在每一点都有导数。',tangent:true};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'senior.builtin.0',level:'senior',version:'1.0.0',name:definition.name,kind:'curve',definition,run:({x,parameters})=>definition.expr(x,parameters)});
})();
