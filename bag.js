(function( window, document ) {
  'use strict';

  var head = document.head || document.getElementsByTagName('head')[0];

  //////////////////////////////////////////////////////////////////////////////
  // helpers

  function _nope() { return; }

  /*var _isString = function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  };*/

  var _isArray = Array.isArray || function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  var _isFunction = function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  };


  function _each(arr, iterator) {
    if (arr.forEach) {
      return arr.forEach(iterator);
    }
    for (var i = 0; i < arr.length; i++) {
      if (iterator(arr[i], i, arr) === false) {
        break;
      }
    }
  }


  function _asyncEach(arr, iterator, callback) {
    callback = callback || function () {};
    if (!arr.length) { return callback(); }

    var completed = 0;
    _each(arr, function (x) {
      iterator(x, function (err) {
        if (err) {
          callback(err);
          callback = _nope;
        } else {
          completed += 1;
          if (completed >= arr.length) {
            callback();
          }
        }
      });
    });
  }


  //////////////////////////////////////////////////////////////////////////////
  // Adapters for Store class

  var DomStorage = function (namespace) {
    this.ns = namespace + '__';
  };


  DomStorage.prototype.exists = function() {
    try {
      localStorage.setItem('__ls_test__','__ls_test__');
      localStorage.removeItem('__ls_test__');
      return true;
    } catch (e) {
      return false;
    }
  };


  DomStorage.prototype.init = function (callback) {
    callback();
  };


  DomStorage.prototype.remove = function (key, callback) {
    localStorage.removeItem(this.ns + key);
    callback();
  };


  DomStorage.prototype.set = function (key, value, expire, callback) {
    var obj = {};

    if (expire) {
      obj.expire = +(new Date()) + expire * 60 * 60;
    }
    obj.value = value;

    try {
      localStorage.setItem(this.ns + key, JSON.stringify(obj));
      return callback();
    } catch (e) {
      // FIXME: process possible errors & try cleanup + second attempt
      return callback(e);
    }
  };


  DomStorage.prototype.get = function (key, callback) {
    try {
      var obj = JSON.parse(localStorage.getItem(this.ns + key));
      return callback(null, obj.value);
    } catch (e) {
      return callback(e);
    }
  };


  DomStorage.prototype.clear = function (expiredOnly, callback) {
/*
    var re = new RegExp(this.ns+'.+');
    for (var item in localStorage) {
      if (item.match(re)) {
        localStorage.removeItem(item.match(re)[0]);
      }
    }
*/
    callback();
  };


  /////////////////////////////////////////////////////////////////////////////
  // key/value storage with expiration

  var storeAdapters = {
    /*'indexeddb': IDB,
    'websql': WebSql,*/
    'localstore': DomStorage
  };


  // namespace - db name or similar
  // storesList - array of allowed adapter names to use
  //
  var Storage = function (namespace, storesList) {
    var self = this;

    // States of db init singletone process
    // 'done' / 'progress' / 'failed' / undefined
    this.initState = undefined;
    this.initStack = [];

    _each(storesList, function(name) {
      if (!storeAdapters[name]) {
        console.log('Wrong storage adapter name: ' + name, storesList);
        return false;
      }
      if (storeAdapters[name].prototype.exists()) {
        self.db = new storeAdapters[name](namespace);
        return false; // terminate on success
      }
    });

    if (!self.db) {
      console.log('None of requested storages available: ' + storesList);
    }
  };


  Storage.prototype.init = function (callback) {
    var self = this;

    if (!this.db) { return callback(new Error('No available db')); }

    if (this.initState === 'done') { return callback(); }

    if (this.initState === 'progress') {
      this.initStack.push(callback);
      return;
    }

    this.initStack.push(callback);
    this.initState = 'progress';

    this.db.init(function (err) {
      self.initState = !err ? 'done' : 'failed';
      _each(self.initStack, function (cb) {
        cb(err);
      });

      // Clear expired. A bit dirty without callback,
      // but we don't care until clear compleete
      if (!err) { self.clear(); }
    });
  };


  Storage.prototype.set = function (key, value, expire, callback) {
    var self = this;
    if (_isFunction(expire)) {
      callback = expire;
      expire = undefined;
    }
    callback = callback || function () {};
    this.init(function(err) {
      if (err) { return callback(err); }
      self.db.set(key, value, expire, callback);
    });
  };


  Storage.prototype.get = function (key, callback) {
    var self = this;
    this.db.init(function(err) {
      if (err) { return callback(err); }
      self.db.get(key, callback);
    });
  };


  Storage.prototype.remove = function (key, callback) {
    var self = this;
    callback = callback || function () {};
    this.db.init(function(err) {
      if (err) { return callback(err); }
      self.db.remove(key, callback);
    });
  };


  Storage.prototype.clear = function (expiredOnly, callback) {
    var self = this;
    if (_isFunction(expiredOnly)) {
      callback = expiredOnly;
      expiredOnly = false;
    }
    callback = callback || function () {};

    this.db.init(function(err) {
      if (err) { return callback(err); }
      self.db.clear(expiredOnly, callback);
    });
  };


  //////////////////////////////////////////////////////////////////////////////
  // Bag class implementation

  function Bag(options) {

    var self = this;

    this.prefix    = options.namespace || 'bag';
    this.timeout      = options.timeout || 20*1000; // 20 seconds
    this.expire       = options.expire || 24*30*12*50; // 50 years
    this.isValidItem  = null;
    this.stores = _isArray(options.stores) ? options.stores : ['indexeddb','websql','localstore'];

    var storage = null;

    function getUrl(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open( 'GET', url );
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            callback(null, {
              content: xhr.responseText,
              type: xhr.getResponseHeader('content-type')
            });
            callback = _nope;
          } else {
            callback(new Error(xhr.statusText));
            callback = _nope;
          }
        }
      };


      setTimeout(function () {
        if (xhr.readyState < 4) {
          xhr.abort();
          callback(new Error('Timeout'));
          callback = _nope;
        }
      }, self.timeout );

      xhr.send();
    }


    function saveUrl(obj, callback) {
      getUrl(obj.url, function(err, result) {
        if (err) { return callback(err); }
        // wrap store data
        var now = +new Date();
        obj.data = result.content;
        obj.originalType = result.type;
        obj.type = obj.type || result.type;
        obj.stamp = now;
        obj.expire = now + ((obj.expire || self.expire ) * 60 * 60 * 1000);

        self.set(obj.key, obj, function() {
          // Don't check error - have to return data anyway
          callback(null, obj);
        });
      });
    }


    function isCacheValid(cached, obj) {
      return !cached ||
        cached.expire - +new Date() < 0  ||
        obj.unique !== cached.unique ||
        (self.isValidItem && !self.isValidItem(cached, obj));
    }


    function fetch(obj, callback) {

      if (!obj.url) { return callback(); }
      obj.key = (obj.key || obj.url);

      self.get(obj.key, function(err_cache, cached) {
        // don't check errors here - if can't get object from store,
        // then just load it from web.
        obj.execute = (obj.execute !== false);
        var shouldFetch = !!err_cache || isCacheValid(cached, obj);

        // If don't have to load new date - return one from cache
        if (!obj.live && !shouldFetch) {
          cached.type = obj.type || cached.originalType;
          callback(null, cached);
          return;
        }

        // start loading

        if (obj.unique) {
          // set parameter to prevent browser cache
          obj.url += ( ( obj.url.indexOf('?') > 0 ) ? '&' : '?' ) + 'bag-unique=' + obj.unique;
        }

        saveUrl(obj, function(err_load) {
          if (err_cache && err_load) { return callback(err_load); }
          if (err_load) { return callback(null, cached); }

          return callback(null, obj);
        });
      });
    }


    var handlers = {
      'application/javascript': function injectScript(obj) {
        var script = document.createElement('script');

        // add script name for dev tools
        obj.data += '\n//@ sourceURL=' + obj.url;

        // Have to use .text, since we support IE8,
        // which won't allow appending to a script
        script.text = obj.data;
        head.appendChild(script);
        return;
      },

      'text/css': function injectStyle(obj) {
        var style = document.createElement('style');

        // add style name for dev tools
        obj.data += '\n/*# sourceURL=' + obj.url + '<url> */';

        if (style.styleSheet) {
          style.styleSheet.cssText = obj.data; // IE method
        } else {
          style.appendChild(document.createTextNode(obj.data)); // others
        }

        head.appendChild(style);
        return;
      }
    };


    function execute(obj) {
      if (obj.type && handlers[obj.type]) {
        return handlers[obj.type](obj);
      }
    }


    this.require = function(resourses, callback) {
      var res = _isArray(resourses) ? resourses : [resourses];

      if (!storage) { storage = new Storage(self.namespace, self.stores); }

      _asyncEach(res, fetch, function(err) {
        if (err) { return callback(err); }

        _each(res, function(obj) {
          if (obj.execute) {
            execute(obj);
          }
        });

        callback(null, resourses);
      });
    };


    this.remove = function (key, callback) {
      if (!storage) { storage = new Storage(self.prefix, self.stores); }
      storage.remove(key, callback);
    };


    this.get = function (key, callback) {
      if (!storage) { storage = new Storage(self.prefix, self.stores); }
      storage.get(key, callback);
    };


    this.set = function (key, data, expire, callback) {
      if (!storage) { storage = new Storage(self.prefix, self.stores); }
      storage.set(key, data, expire, callback);
    };


    this.clear = function (expired, callback) {
      if (!storage) { storage = new Storage(self.prefix, self.stores); }
      storage.clear(expired, callback);
    };


    this.addHandler = function (types, handler) {
      types = _isArray(types) ? types : [types];
      _each(types, function (type) { handlers[type] = handler; });
    };


    this.removeHandler = function (types) {
      self.addHandler(types, undefined);
    };
  }


  window.Bag = Bag;

})(this, document);
