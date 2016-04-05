[К оглавлению](readme.md)

## Магия замыканий

Лично мне не очень нравится слово замыкание, это достаточно грубый перевод closure, который вызывает совершенно неверную ассоциацию с электричеством. В данном случае лучше было бы слово заключение - оно хотя бы вызывает более близкую по смыслу ассоциацию с тюрьмой.

Итак, замыкание - это функция вместе со всеми доступными ей данными. Всё что попадает в замыкание остаётся там навсегда, точнее не навсегда, а ровно до тех пор пока существует замыкание (поэтому термин заключение мне нравится больше - лучше описывает суть).

В какой момент создаётся замыкание? Оно создаётся каждый раз когда мы объявляем некую функцию. Причём в данном случае под объявлением стоит понимать не синтаксическую конструкцию, а именно интерпретацию этой конструкции. Поясню на примерах:

Простой случай
```javascript
var fn;
for (i = 0; i < 5; i++) {
    // замыкание этой функции будет создано на каждой итерации, т.е. 5 раз.
    fn = function(...) {
       ...
    };
}
```

Более сложный случай
```javascript
// замыкание этой функции будет создано только 1 раз в момент, когда будет выполняться этот код
var someFn = function(a) {
    // замыкание этой функции будет создано 2 раза - в момент вызова someFn(1) и someFn(2)
    var innerFn = function() {
        ...
    }
}

someFn(1);
someFn(2);
```

В чём смысл замыканий и где тут магия? Смысл замыканий в том, что они хранят всю информацию о том в каком окружении в котором были созданы.

В частности в первом примере все замыкания будут хранить ссылку на `i` и `fn`. Причём стоит учитывать что храниться будет именно ссылка, а не конкретные значения этих переменных, т.е. после выхода из цикла все эти замыкания будут считать, что `i == 5`, а `fn` будет содержать последнее созданное замыкание.

Со вторым примером несколько сложнее, `someFn` будет помнить про переменную someFn в которой оно собственно и хранится. При этом можно сделать например так:

```javascript
var fn = someFn;
someFn = null
```

В этом случае, наше замыкание будет доступно через `fn`, оно не будет знать ничего про эту переменную `fn` (если она объявлена вне области видимости данного замыкания), а при обращении к `someFn` внутри функции мы получим `null`. Кстати стоит сразу отметить, что при вызове `var fn = someFn` не будет создано новое замыкание, т.к. нет ключевого слова `function` - мы просто записываем объект уже существующего замыкания в перменную. Ещё интереснее ситуация с `innerFn` - она будет иметь ссылки на `someFn`, `innerFn` и `a`, при этом первый экземпляр данного замыкания будет считать, что `a == 1`, а второй, что `a == 2`.

Звучит как магия, запутанно и непонятно? Тогда разберёмся по порядку с такими понятиями как области видимости и контекст исполнения.

## Области видимости

Под областью видимости обычно подразумевают так называемую лексическую область видимости. Она напрямую определяется самой структурой кода. Код структурируется блоками, которые вложены друг в друга. При этом (если не брать ES 2015 - про это чуть позже), нас будут интересовать только блоки самих функций. Каждый такой блок "видит" своё непосредственное содержимое (но не содержимое вложенный блоков) и содержимое всех родительских блоков. Т.е. функции всегда "смотрят" наружу и "видят" всё, что выше по иерархии блоков. Это значит что внутри функции можно обратиться к любой переменной которая объявлена в ней самой или в любой обрамляющей её функции. Рассмотрим пример:

```javascript
var a;
var fn1 = function(b) {
  var c;
  var fn2 = function(d) {
    var e;
  };

  var fn3 = function(f) {
    var g;
  };
};
var fn4 = function(h) {
  var i;
};
```

Какими будут области видимости для функций?

  - **`fn1`:** `a`, `fn1`, `fn4`, `b`, `c`, `nf2`, `fn3`
  - **`fn2`:** `a`, `fn1`, `fn4`, `b`, `c`, `fn2`, `fn3`, `d`, `e`
  - **`fn3`:** `a`, `fn1`, `fn4`, `b`, `c`, `fn2`, `fn3`, `f`, `g`
  - **`fn4`:** `a`, `fn1`, `fn4`, `h`, `i`

Как видно порядок самих блоков не важен - `fn1` "видит" `fn4`, а `fn2` "видит" `fn3`, хотя они объявлены позже. Важна только сама вложенность.

В ES 2015 появилась ещё одна магическая конструкция - `let`. Это замена для `var`, которая позволяет ограничивать область видимости для переменных. При использовании `let` блоками считаются уже не только функции, но и все другие типы блоков, типа `for`, `while` и т.д. Это позволяет объявлять переменные более локально. Это полезно по двум причинам:

  - из-за особенностей управления памятью в javascript - чем меньше ссылок на переменную тем быстрее будет освобождена занимаемая ей память (об этом будет рассказано в [магии памяти](memory.md))
  - из-за перекрытия объявлений. Т.е. если в родительском блоке объявлена переменная `a` и в дочернем блоке объявлена переменная `a`, то внутри дочернего блока будет доступ только к дочерней переменной, доступ к родительской будет перекрыт. Использование `let` позволяет меньше беспокоиться из-за подобных перекрытий при использовании часто встречающихся имён типа `name`, `item`, `object` и т.д.

## Контекст исполнения

Если область видимости отвечает за то, к каким переменным можно обращаться, то контекст исполнения отвечает за то, какие данные будут находиться в этих переменных в момент обращения.