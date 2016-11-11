bag.js - JS / CSS loader + KV storage
=====================================

[![Build Status](https://travis-ci.org/nodeca/bag.js.svg?branch=master)](https://travis-ci.org/nodeca/bag.js)
[![NPM version](https://img.shields.io/npm/v/bagjs.svg?style=flat)](https://www.npmjs.org/package/bagjs)

> __bag.js__ is loader for `.js` / `.css` and other files, that uses
IndexedDB/ WebSQL / localStorage for caching. Consider it as alternative for
other types of loaders for modern browsers, that reduce number of server
requests, especially for mobile devices. Also __bag.js__  can be used as simple
key/value storage, that doesn't require you to know details about IndexedDB
and WebSQL.

This project is inspired by __[basket.js](http://addyosmani.github.io/basket.js/)__,
but provides more safe storages for big assets and universal key/value interface.
Key features are:

- Parallel load and sequential execution for JS / CSS and other types of files
- Use IndexedDB / WebSQL / localStorage - no size limits for big assets.
- KV storage for objects, with simple interface.
- You can use multiple instances with different storage options. For example
  Indexeddb + WebSQL for assets and localStorage for user settings.
- Partial compatibility with [basket.js](http://addyosmani.github.io/basket.js/).

__Requirements:__

This package requires Promise polyfill for old browsers. We recommend
__[lie](https://github.com/calvinmetcalf/lie)__, it's small enougth and fast.

__Install__

via bower:

```bash
bower install bag.js
```

via npm:

```bash
bower install bagjs --save
```


Examples
--------

Simple:

```js
var bag = new window.Bag();

bag.require(['/site.css', '/jquery.js', '/site.js'])
  .then(() => {
    // code to run after loading
    // ...
  })
  .catch(err => console.log('loading error: ', err));
```

Advanced:

```js
var bag = new window.Bag({
  prefix: 'my_namespace',
  stores: ['indexeddb', 'websql'],
  timeout: 20000,
  expire: 24
});

bag.isValidItem = function(source, obj) {
  return (source && (source.url === obj.url)) ? true : false;
};

var files = [
  { url: '/site.css', expire: 1 },
  { url: '/jquery.js', expire: 10 },
  { url: '/site.js' },
  { url: '/more_styles.css', expire: 5, execute: false }
];

bag.require(files)
  .then(data => {
    console.log('loaded', data);
  })
  .catch(err => console.log(err));
})
```

You can skip `new` keyword. Also, you can use callbacks:

```js
window.Bag().require([ '/site.css', '/site.js']
  .then(data => {
    console.log(data);
  })
  .catch(err => console.log(err));
```

Using as key/value storage:

```js
var obj = { lorem: 'ipsum' };
var bag = new window.Bag();

bag.set('dolorem', obj)
  .then(() => bag.get('dolorem'));
  .then(data => console.log('Loaded data:\n', data));
  .catch(err => console.log(err));
  .then(() => bag.remove('dolorem'));
```


API
---

__Note__, all methods with optional callbacks will return promises if callback
is not set.


### new Bag([options])

Object constructor. You can also define options after constructor call, via
instance properties (they have the same names). Options (hash):

- `prefix` - Data namespace. Default - `bag`. Used to separate data for
   multiple instances.
- `stores` - Array of storage names to use, ordered by preference.
  Default `['indexeddb', 'websql', 'localstorage']`.
- `timeout` - files loading timeout, in seconds. Default 20.
- `expire` - `require()` data expiration, in hours. Default - 1 month. 0 or
  unset - don't expire.

Note 1: you can skip `new` keyword, calling `Bag()` will return you new instance anyway.

Note 2: `prefix` must be set before `require`/`get`/`set`/`remove`/`clear` calls. Other options can be changed anytime.


### .require(files) -> Promise

1. Load files from server or from cache.
2. Inject known types into page (js/css by default), unless execution is disabled.
   When multiple files requested (files are `Array`), those are loaded in
   parallel, but injected in defined order.
3. Also, content of the files is returned in the result.

`files` param can be:

- `Object` - resource info (see details below).
- `String` - just resource url, other params will be default.
- `Array(Object|String)` - list of resources to load in parallel.

resource info:

- `url` - resource URI, required.
- `expire` - optional, expiration time in hours. 0 or not set - don't expire.
- `key` - the name, used to store loaded file, if not defined, then `url`
   will be used.
- `unique` - a token stored with the cached item. If you request the same item
  again with a different token the script will be fetched and cached again.
- `live` - force cache bypass, for development needs.
- `cached` - force request from cache only.

result (Promise):

- (Array|String) with loaded content, depending on `files` type. If
  a single resource is requested (`Object`|`String`), `data` is `String`. If
  an `Array` of resources is requested, or chained call done, data is array
  of strings.

Note, unless you pass resources info in short form, input objects are extended
with loaded data.


### .get(key) -> Promise

Load data by `key` name. Not existing values are returned as `undefined`.


### .set(key, data [, expire]) -> Promise

Put data into storage under `key` name.

- `key` - String to address data.
- `data` - JS object to store. We currently support only objects, serializable
  by JSON. Don't try to put functions or arraybuffers.
- `expire` - Expiration time in seconds. Don't expire by default.


### .remove(key) -> Promise

Remove `key` data from store.


### .clear([expiredOnly]) -> Promise

Clear all storage data (in your namespace), or just expired objects when called
as `bag.clear(true)`.


### .addHandler(types, handler)

Add handler for loaded files with specified mime types. By default, handlers
for `application/javascript` and `text/css` already exist. If you set
`execute: false` in resource info, then handler will not be applied.

- `types` - `String` with mime type or `Array` of strings.
- `handler` - function to "execute" file of that type.


### .removeHandler(types)

Remove handler for specified mime type (opposite to `addHandler`).


Related projects
----------------

- [basket.js](http://addyosmani.github.io/basket.js/)
- [PortableCache.js](https://github.com/agektmr/PortableCache.js)
- [Lawnchair](http://brian.io/lawnchair/)
- [LABjs](https://github.com/getify/LABjs)
- [yepnope.js](https://github.com/SlexAxton/yepnope.js)


License
-------

[MIT](https://github.com/nodeca/bag.js/blob/master/LICENSE)
