# TypeScript

### 1. 为什么需要 TypeScript
A: 最直接的原因是 TS 提供的**类型系统**和**静态检查能力**可以减少运行时错误，降低协同开发的难度以及提高项目的可维护性。

- 类型声明一定程度上可以充当文档
- IDE 提示友好

### 2. TS 有哪些特性
A: 
- 可以和 JS 共存，能够实现就项目到TS的渐进式迁移。可以选择
  1. 在不修改 js 文件的前提下为其编写**类型声明文件**
  2. 新文件使用 TS 编写，逐步迁移旧的 js 文件
- 类型系统
  - TS是静态类型【在编译阶段就能确定每个变量的类型】
  - 类型推论
- 与 ES 标准同步发展【一个语法进入到 Stage 3 阶段后，TypeScript 就会实现它。】
- 支持 Enums、 namespace 和 Decorator

### 3. TS 内置了哪些类型
A: number string boolean null undefined void

### 4. mixn 是什么

### 5. ts 是否支持函数重载

### 6. TSD 是什么
A: TypeScript Definition Manager (TSD) 是一个包管理器，用于直接从社区驱动的DefinitelyTyped 存储库中搜索和安装TypeScript 定义文件。

```
npm install tsd -g
tsd init
tsd query jquery --action install
```
即可在 js文件 中引用声明文件
```
/// <reference path="typings/jquery/jquery.d.ts" />  
```

### 7. ts 的泛型是什么
A: Generics. 泛型是一种工具，它提供了一种创建可重用组件的方法。它能够创建可以处理多种数据类型而不是单一数据类型的组件。泛型在不影响性能或生产力的情况下提供类型安全(对比 any)。

泛型允许创建 泛型类、泛型函数、泛型方法和泛型接口。

### 8. ts 中的接口是什么
A: interface declaration 用于定义对象类型，TS 编译器使用接口进行类型检查。

### 9. Type Aliases 和 Interfaces 的区别
A: 二者很相似，很多情况下用哪一个都可以。关键区别是 type 别名无法 re-open, 即我们无法向其中增加新的属性，而 interface 则可以扩展。

1. type 可以声明基本类型，联合类型，元组
2. type 可以使用 typeof 获取实例的类型进行赋值
3. 多个相同的 interface 声明可以自动合并

> 使用 interface 描述‘数据结构’，使用 type 描述‘类型关系’

- 类型别名可以为任何类型引入名称。例如基本类型，联合类型等
- 类型别名不支持继承
- 类型别名不会创建一个真正的名字
- 类型别名无法被实现(implements)，而接口可以被派生类实现
- 类型别名重名时编译器会抛出错误，接口重名时会产生合并

### 10. ts 是否支持面向对象所有原则
A: 是
封装
继承
抽象
多态

### 11. TS中类型断言是什么
A: 类似类型转换，为编译器提供有关我们希望如何分析代码的提示，纯粹由编译器使用，对运行时没有影响。

### 12. TS 中 as 是什么语法
A: 类型断言的附加语法。

引入 as-syntax 的原因是原始语法 (`<type>`) 与 JSX 冲突。
```
let empCode:
any = 111;
let employeeCode = code as number; 
```
将 TypeScript 与 JSX 一起使用时，只允许使用 as 样式的断言。


### 13. TS 声明合并是什么
A: 声明合并是编译器合并两个或多个单独声明的过程。将同名的声明声明为单个定义。这个合并的定义具有两个原始声明的特征。最简单，也许是最常见的声明合并类型是接口合并。在最基本的层面上，合并将两个声明的成员机械地连接到一个同名的接口中。

> 同名的 interface 会自动合并，同名的 interface 和 class 会自动聚合。

```
interface Cloner {  
    clone(animal: Animal): Animal;  
}  
interface Cloner {  
    clone(animal: Sheep): Sheep;  
}  
interface Cloner {  
    clone(animal: Dog): Dog;  
    clone(animal: Cat): Cat;  
}
```
将被合并为
```
interface Cloner {  
    clone(animal: Dog): Dog;  
    clone(animal: Cat): Cat;  
    clone(animal: Sheep): Sheep;  
    clone(animal: Animal): Animal;  
}
```

> 注意：并非所有的合并都在 TypeScript 中被允许。目前，类不能与其他类或变量合并

### 14. const 和 readonly 的区别
A: 
- const用于变量，readonly用于属性
- const在运行时检查，readonly在编译时检查
- 使用const变量保存的数组，可以使用push，pop等方法。但是如果使用ReadonlyArray<number>声明的数组不能使用push，pop等方法。


### 15. any、never、unknown、null & undefined 和 void 的使用场景
A:
- any: 为编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。
- never: 永不存在的值的类型。例如：never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。
- unknown: 任何类型的值都可以赋给 unknown 类型，但是 unknown 类型的值只能赋给 unknown 本身和 any 类型。
- null & undefined: 默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和  undefined 赋值给 number 类型的变量。
  > 当你指定了 `--strictNullChecks` 标记，null 和 undefined 只能赋值给 void 和它们各自。
- void: 没有任何类型。例如：一个函数如果没有返回值，那么返回值可以定义为void。

> never，never表示永远不存在的类型。比如一个函数总是抛出错误，而没有返回值。或者一个函数内部有死循环，永远不会有返回值。函数的返回值就是never类型。
> void, 没有显示的返回值的函数返回值为void类型。如果一个变量为void类型，只能赋予undefined或者null。

### 16. TypeScript 中 interface 可以给 Function / Array / Class（Indexable）做声明吗？
A: 可以

函数声明
```
interface Say {
 (name: string): viod;
}
let say: Say = (name: string):viod => {}
```

Array 声明
```
interface NumberArray { 
 [index: number]: number; 
} 
let fibonacci: NumberArray = [1, 1, 2, 3, 5];

```

Class 声明
```
interface PersonalIntl {
 name: string
 sayHi (name: string): string
}
```

### 17. 使用 Union Types 时有哪些注意事项
A: 属性或方法访问: 当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法。
```
function getLength(something: string | number): number {
   return something.length;
}
// index.ts(2,22): error TS2339: Property 'length' does not exist on type >'string | number'.
//   Property 'length' does not exist on type 'number'.

function getString(something: string | number): string {
   return something.toString();
}
// 公共方法和属性可以访问
```

### 18. ?.、??、!、!.、_ 等符号的含义
A: 
- `?.` 可选链 遇到 null 和 undefined 可以立即停止表达式的运行
- `??` 空值合并运算符 当左侧操作数为 null 或 undefined 时，其返回右侧的操作数，否则返回左侧的操作数。
- `!`  非空断言运算符 `x!` 将从 x 值域中排除 null 和 undefined
- `!.` 在变量名后添加，可以断言排除undefined和null类型
- `_`  数字分隔符 分隔符不会改变数值字面量的值，使人更容易读懂数字 .e.g  `1_101_324`。

### 19. TS 模块加载机制

假设有一个导入语句 import { a } from "moduleA";
 1. 首先，编译器会尝试定位需要导入的模块文件，通过绝对或者相对的路径查找方式；
 2. 如果上面的解析失败了，没有查找到对应的模块，编译器会尝试定位一个外部模块声明（.d.ts）；
 3. 最后，如果编译器还是不能解析这个模块，则会抛出一个错误 error TS2307: Cannot find module 'moduleA'.


### 20. 如何使 TypeScript 项目引入并识别编译为 JavaScript 的 npm 库包？
A: 选择安装 ts 版本，npm install @types/包名 --save；
对于没有类型的 js 库，需要编写同名的.d.ts文件

### 21. declare，declare global是什么？
A:
declare 是用来定义全局变量、全局函数、全局命名空间、js modules、class等

declare global 为全局对象 window 增加新的属性

### 22. 类成员修饰符
- public: 成员都默认为public，被此限定符修饰的成员是可以被外部访问；
- private: 被此限定符修饰的成员是只可以被类的内部访问；
- protected: 被此限定符修饰的成员是只可以被类的内部以及类的子类访问;
- readonly: 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。


### 23. keyof 和 typeof 关键字的作用？
- keyof 索引类型查询操作符 获取索引类型的属性名，构成联合类型。
- typeof 获取一个变量或对象的类型。


### 24. 简述工具类型 Exclude、Omit、Merge、Intersection、Overwrite的作用。


- `Exclude<T, U>` 从 T 中排除出可分配给 U的元素。
- `Omit<T, K>` 的作用是忽略T中的某些属性。
- `Merge<O1, O2>` 是将两个对象的属性合并。
- `Compute<A & B>` 是将交叉类型合并
- `Intersection<T, U>` 的作用是取T的属性,此属性同样也存在与U。
- `Overwrite<T, U>` 是用U的属性覆盖T的相同属性。

### 25. 定义数组的两种方式
```ts
type Foo= Array<string>;
interface Bar { 
     baz: Array<{ name: string, age: number}>
}

type Foo = string[];
interface Bar { 
     baz : { name: string, age: number }[] 
}
```


### 26. implements 与 extends 的区别
- extends, 子类会继承父类的所有属性和方法。
- implements，使用 implements 关键字的类将需要实现需要实现的类的所有属性和方法。

---

## ts 常见配置项
```json
{
  "files": [],
  "include": [],
  "exclude": [],
  "compileOnSave": false,
  "extends": "",
  "compilerOptions": { ... }
}
```

## tsc 常用命令
### 1. 从 ts 文件生成 定义文件
```
tsc --devlaration fiel.ts
```

### 2. 


> https://segmentfault.com/a/1190000040403067