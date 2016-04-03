[TOC]

# Магия javascript

Каждый язык программирования имеет свои особенности и javascript не исключение. Попробую описать основные из них.

## Магия типов

Во-первых в javascript есть всего несколько примитивных типов:

  - **`String`** - строка
  - **`Number`** - число
  - **`Boolean`** - значение true или false
  - **`Object`** - объект. Является родительским классом практически для всех сущностей.
  - **`Function`** - функция/конструктор класса. Вообще говоря функции являются потомками объектов, но из-за их сильной специфики я решил записать их в этот список.

Примитивные типы `String`, `Number`, `Boolean` могут также быть представлены в виде объектов. На практике такие объекты непосредственно обычно никто не создаёт - это происходит автоматически каждый раз, при обращении к свойствам и методам данных типов. Для получения примитивных значений из данных объектов используется метод `valueOf`.

Также отдельно можно упомянуть про некоторые стандартные значения:

  - **`undefined`** - это значение не принадлежащее ни к одному из типов. Оно присваивается переменной, которая не была инциализирована, а также возвращается функцией которая ничего не возвращает.
  - **`null`** - специальный значение для описания "пустоты". Применяется с той же целью что и `undefined`, но в случаях когда надо показать, что это не просто неопределённая переменная, а специально выставленное значение.
  - **`NaN`** - специальное числовое значение, который означает некорректные данные. Например NaN будет получен, если попытаться вычислить `parseInt("abcd")`
  - **`Infinity`** - ещё одно числовое значение описывающее бесконечное число. В основном получается в результате деления на ноль. Кстати этот тип имеет знак: `1/0; // Infinity`, и `-1/0; // -Infinity`.

### Проверка типов

Для проверки типа целая куча разных конструкций: `instanceof`, `typeof`, `Array.isArray`, `isFinite`, `isNaN`. Какой из методов использовать зависит от конкретной ситуации. Поясню на примере:

#### typeof

```javascript
typeof "111"; // "string"
typeof String("111"); // "string"
typeof new String("111"); // "object"

typeof 111; // "number"
typeof Number(111); // "number"
typeof new Number(111); // "object"

typeof true; // "boolean"
typeof Boolean(true); // "boolean"
typeof new Boolean(true); // "object"

typeof function(){}; // "function"

typeof new Array(); // "object"
typeof new Object(); // "object"
typeof new RegExp(); // "object"

typeof null; // "object"
typeof undefined; // "undefined"

typeof NaN; // "number"
typeof Infinity; // "number"
```

#### instanceof

```javascript
"123" instanceof String; // false
String("123") instanceof String; // false
new String("123") instanceof String; // true

123 instanceof Number; // false
Number(123) instanceof Number; // false
new Number(123) instanceof Number; // true

true instanceof Boolean; // false
Boolean(true) instanceof Boolean; // false
new Boolean(true) instanceof Boolean; // true

(function(){}) instanceof Function; // true
(function(){}) instanceof Object; // true

new Array() instanceof Array; // true
new Array() instanceof Object; // true

new Object() instanceof Object; // true

new RegExp() instanceof RegExp; // true
new RegExp() instanceof Object; // true

null instanceof Object; // false
undefined instanceof Object; // false

NaN instanceof Object; // false
NaN instanceof Number; // false

Infinity instanceof Object; // false
Infinity instanceof Number; // false
```

Отдельно следует упомянуть про `Array.isArray`. Дело в том как браузер работает с несколькими окнами в т.ч. `<iframe>`  - в каждом окне существует своя копия `Array`. При передаче значения между окнами возможна ситуация при которой простая проверка `arr instanceof Array` выдаст `false`, т.к. у массива в другом окне другой конструктор. Именно для таких случаев используется метод `Array.isArray` - он позволяет надёжно проверить, что объект является массивом вне зависимости от его происхождения.

Когда мы делаем проверки на то, что в переменной число, обычно нас интересует наличие адекватного значения с которым можно работать, т.е. значения `NaN` и `Infinite` нас редко интересуют. К тому же часто бывает необходимо проверить, что в строковой переменной содержится число. Для этих целей есть специальные проверки:

#### isNaN

```javascript
NaN == NaN; // false
isNaN(NaN); // true
isNaN("NaN"); // true
isNaN(123); // false
isNaN("123"); // false
isNaN(Infinity); // false
isNaN("Infinity"); // false
isNaN("asdf"); // true
```
#### isFinite

```javascript
Infinity == Infinity; // true
isFinite(NaN); // false
isFinite("NaN"); // false
isFinite(123); // true
isFinite("123"); // true
isFinite(Infinity); // false
isFinite("Infinity"); // false
isFinite("adsf"); // false
```

### Приведение типов

Приведение типов бывает либо автоматическим, либо непосредственным. Непосредственное приведение типов выполняется с помощью специальных методов или с помощью вызова конструктора:

```javascript
(123).toString(); // "123"
String(123); // "123"

parseInt("123"); // 123
parseFloat("123.45"); // 123.45
Number("123.45"); // 123.45

Boolean(1); // true
Boolean(0); // false
```

Отдельно стоит упомянуть про создание объектов-обёрток для примитивных типов:

```javascript
Object(1) instanceof Number; // true
new Object(1) instanceof Number; // true
Number(1) instanceof Number; // false - данный метод возвращает примитивный тип, а не объект
new Number(1) instanceof Number; // true

Object("asdf") instanceof String; // true
new Object("asdf") instanceof String; // true
String("asdf") instanceof String; // false - данный метод возвращает примитивный тип, а не объект
new String("asdf") instanceof String; // true

Object(true) instanceof Boolean; // true
new Object(true) instanceof Boolean; // true
Boolean(true) instanceof Boolean; //  false - данный метод возвращает примитивный тип, а не объект
new Boolean(true) instanceof Boolean; // true
```

Автоматическое приведение типов происходит в целом ряде случаев:

  - **унарные операторы + и -** - значение приводится к типу `Number`
  - **операторы конкатенации + и +=** - если слева стоит значение типа `String`, то значение справа приводится к типу `String`, в противном случае эти операторы трактуются как арифметические.
  - **арифметические операторы +, -, \*, /, %, +=, -=, \*=, /=** - перед вычислением данные приводятся к типу `Number`
  - **побитовые операторы ~, &, |, ^, \<\<, \>\>, \>\>\>, &=, |=, ^=, \<\<=, \>\>=, \>\>\>=** - перед вычислением данные приводятся к типу `Number`
  - **унарные операторы ++ и --** - перед вычислением значения данные приводятся к типу `Number`
  - **операторы сравнение ==, !=** - перед проведением сравнения тип справа приводится к типу слева: `1 == "1"; // true`
  - **операторы сравнения >, <, >=, <=** - если данные с обоих сторон не относятся к типу `String`, то они приводятся к типу `Number`, в противном случае проиходит лексикографическое сравнение.
  - **оператор отрицания !** - перед вычислением итогового значения тип переменной приводится к `Boolean`.
  - **операторы || и &&** - перед вычислением значения данные слева приводятся к типу `Boolean`. Про эти операторы чуть позже будет рассказано отдельно.
  - **условия в блоках `if`, `while`, `do`, `for`, а также в тренарных операторах** - данные приводятся к типу `Boolean`
  - во многих других случаях, когда требуются данные одного типа, а предоставлены данные другого

В случае с операторами `||` и `&&` приведение типов работает очень специфично. Наиболее точно можно переписать работу этих операторов в тренарной форме:

```javascript
// a || b
Boolean(a) == true ? a : b;

// a && b
Boolean(a) == true ? b : a;
```

Т.е. возвращаемое значение всегда имеет тот же тип, что и один из аргуметов и проверка на истину происходит только для первого аргумента.

Сразу стоит заметить, что автоматическое приведение типов не происходит в случае использования операторов сравнения `===` и `!==`. Менее очевидными случаями являются сравнения, в блоке `switch`, а также в методе `indexOf`.

#### Boolean

Порой бывает не совсем очевидно каким образом различные значения приводятся к типу `Boolean`. Тут простое правило, есть короткий список данных которые интерпретируются как `false`, все остальные значения интерпретируются как `true`

```javascript
Boolean(0); // false
Boolean(""); // false
Boolean(null); // false
Boolean(NaN); // false
Boolean(undefined); // false
```

#### Number

Приведение к типу `Number` происходит несколько сложнее:

```javascript
Number(undefined); // NaN
Number(null); // NaN
Number([]); // 0
Number([q]); // Number(q)
Number([1, 2]); // NaN
Number(object); // Number(object.valueOf())
Number(string); // parseFloat(string)
```

#### String

Приведение к типу `String` происходит путём вызова метода `toString`. Если данный метод отсутствует, будет брошено исключение `TypeError`.
