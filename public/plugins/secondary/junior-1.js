/* Independent junior mathematical model */
(function(){'use strict';
const definition={name:'二次函数',desc:'调整 a、b、c，查看抛物线顶点与开口。可联想到抛球高度和嵌套循环操作量。',controls:[['a',-3,3,1,.1],['b',-5,5,0,.5],['c',-5,5,0,.5]],expr:(x,p)=>p.a*x*x+p.b*x+p.c,read:p=>`y=${p.a.toFixed(1)}x² ${p.b>=0?'+':'−'} ${Math.abs(p.b).toFixed(1)}x ${p.c>=0?'+':'−'} ${Math.abs(p.c).toFixed(1)}；${Math.abs(p.a)>1e-9?'顶点 x='+(-p.b/(2*p.a)).toFixed(2):'a=0 时退化为一次函数'}`,assume:'二次函数是数学关系；抛体模型还需要恒定重力加速度与忽略空气阻力等条件。'} ;
window.PLAB_EXPERIMENT_PLUGINS.register({id:'junior.builtin.1',level:'junior',version:'1.0.0',name:definition.name,kind:'curve',definition,run:({x,parameters})=>definition.expr(x,parameters)});
})();
