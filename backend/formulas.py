import ast,math
SAFE={'abs':abs,'min':min,'max':max,'sqrt':math.sqrt,'sin':math.sin,'cos':math.cos,'tan':math.tan,'log':math.log,'exp':math.exp,'pow':pow,'floor':math.floor,'ceil':math.ceil}
ALLOWED=(ast.Expression,ast.BinOp,ast.UnaryOp,ast.Constant,ast.Name,ast.Load,ast.Add,ast.Sub,ast.Mult,ast.Div,ast.Pow,ast.Mod,ast.USub,ast.UAdd,ast.Call)
def validate(expression,params):
 if not isinstance(expression,str) or not expression or len(expression)>300:raise ValueError('公式为空或过长')
 tree=ast.parse(expression.replace('^','**'),mode='eval')
 if len(list(ast.walk(tree)))>100:raise ValueError('公式过于复杂')
 for node in ast.walk(tree):
  if not isinstance(node,ALLOWED):raise ValueError('包含不支持的公式语法')
  if isinstance(node,ast.Constant) and (type(node.value) not in (int,float) or abs(node.value)>1e10):raise ValueError('非法常量')
  if isinstance(node,ast.Name) and node.id not in set(params)|{'x','pi','e'}|set(SAFE):raise ValueError('未知变量：'+node.id)
  if isinstance(node,ast.Call) and (not isinstance(node.func,ast.Name) or node.func.id not in SAFE or node.keywords):raise ValueError('只支持白名单数学函数')
  if isinstance(node,ast.Pow) and any(isinstance(n,ast.Pow) for n in ast.walk(node)):pass
 return True
