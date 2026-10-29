/* Independent junior mathematical model */
(function(){'use strict';
const definition={name:'一次函数',desc:'调整斜率 k 与截距 b，观察匀速运动、固定单价销售与线性近似的共同图像。',controls:[['k',-4,4,1,.1],['b',-5,5,0,1]],expr:(x,p)=>p.k*x+p.b,read:p=>`y = ${p.k.toFixed(1)}x ${p.b>=0?'+':'−'} ${Math.abs(p.b).toFixed(1)}；斜率 k=${p.k.toFixed(1)}`,assume:'数学演示不带物理单位；应用到具体学科时必须重新定义 x、y 的单位。'};
window.PLAB_EXPERIMENT_PLUGINS.register({id:'junior.builtin.0',level:'junior',version:'1.0.0',name:definition.name,kind:'curve',definition,run:({x,parameters})=>definition.expr(x,parameters)});
})();
