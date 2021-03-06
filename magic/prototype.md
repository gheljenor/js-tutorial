[К оглавлению](readme.md)

## Магия прототипов

В отличие от множества других объектно-ориентированных языков программирования в javascript'е используется не классовое наследование, а прототипное. Это является камнем преткновения для множества разработчиков, хотя на самом деле всё очень просто. Если описывать этот трюк в двух словах, то у каждого объекта есть некий прототип - это тоже объект с некоторыми свойствами. Когда мы пытаемся получить доступ к свойству объекта, сначала оно ищется в списке собственных свойств объекта, если оно не найдено, то далее идёт попытка найти это свойство у прототипа, далее у его прототипа и т.д. Всё почти как с классами, но т.к. в качестве родителя в данном случае используется не класс, а объект, то появляются некоторые особенности:

 - класс является всего лишь шаблоном-описанием и хранилищем статический свойств
 - прототип является полноценным объектом, свойства которого доступны сами по себе, а не только через экземпляры класса
 - описание класса обычно нельзя изменять "налету"
 - описание прототипа можно как угодно изменять "налету" - можно добавлять, перезаписывать и удалять любые свойства
 - классы как правило объявляются заранее
 - прототипы всегда создаются уже в рантайме, как и любые другие объекты (исключением являются только встроенные объекты)

Может несколько смущать сам синтаксис описания прототипов и конструкторов. Особенно если делать всё по-уму.

```javascript
var ClassName = function(...) {
    // Инициализация супер-класса
    SuperClass.apply(this, arguments);

    // Здесь происходит инициализация текущего класса
};

ClassName.prototype = (function() {
    // Нам не нужно вызывать конструктор родительского класса при создании прототипа,
    // так что создадим временный класс с пустым конструктором и тем же прототипом
    var SuperClassPrototype = function() {};
    SuperClassPrototype.prototype = SuperClass.prototype;

    return new SuperClassPrototype();
})();

// Добавляем дополнительные свойства в прототип
ClassName.prototype.someMethod = function() {
 ...
};
```

Тут есть целый ряд смущающих моментов:

  1. вместо привычного ключевого слова `class` мы просто объявляем функцию, которая выполняет роль конструктора.
  2. вторых конструкция которая создаёт прототип, наследуя его от родительского "класса" выглядит вообще загадочно и непонятно на первый взгляд
  3. инициализация родительского класса тоже выглядит не совсем понятно

Разберёмся с каждым пунктом отдельно. С отсутствием ключевого слова `class` придётся смириться. Чтобы отличать "классы" от функций стоит использовать правило именования. "Классы" должны начинаться с заглавной буквы, функции и методы - со строчной.

С наследованием несколько сложнее. Во-первых следует понимать то как работает `instanceof`. Проверка на принадлежность "классу" происходит путём поиска в цепочке прототипов объекта свойства `prototype` указанного конструктора. При этом сам конструктор никак не учитывается.

```javascript
var prototype = {};

var ClassA = function() {};
ClassA.prototype = prototype;

var ClassB = function() {};
ClassB.prototype = prototype;

var obj = new ClassA();

obj instanceof ClassA; // true
obj instanceof ClassB; // true
```

Далее стоит разобраться с конструкцией `(function() { return ... })()`. Эта конструкция объявляет функцию, тут же вызывает её и подставляет возвращаемое значение на место данной конструкции. Для этого даже придумали аббревиатуру **IIFE** - immediately invoked function expression, если переводить дословно - немедленно вызываемое функциональное выражение.

Теперь разберёмся с данной конструкцией детально. Для организации наследования нам нужно, чтобы у прототипа текущего "класса" прототипом являлся объект класса-родителя. Однако стоит помнить, что в конструкторе могут объявляться различные свойства и в общем случае нам нужно, чтобы эти свойства оставались свойствами экземпляра, а не прототипа. Так что следует избежать вызова конструктора родительского "класса", поэтому мы создаём промежуточный "класс" с пустым конструктором и тем же прототипом, что у родительского "класса".

Насчёт инициализации родительского "класса" пока что скажу только то, что для этого требуется вызвать конструктор данного "класса" с контекстом текущего экземпляра объекта и нужными аргументами. Об этих возможностях будет рассказано позднее более подробно. В данном коде мы вызываем конструктор родительского "класса" с теми же аргументами, с которыми был вызван конструктор текущего класса.
