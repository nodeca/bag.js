4.0.0 / WIP
------------------

- Drop ancient browsers (before IE9) support.



3.0.0 / 2016-11-12
------------------

- Removed callbacks support.
- Now require separate promise polyfill for old browsers.


2.0.2 / 2016-02-13
------------------

- Fixed loading errors due indexeddb limitations in firefox private mode.


2.0.1 / 2016-02-11
------------------

- Maintenance release.


2.0.0 / 2016-02-05
------------------

- Rewritten to promises. All methods now supports both promises
  and callbacks.
- `.get()` now returns `undefined` for mossed keys instead of error.
- Dropped `.require()` chaining (now used by promises).


1.0.0 / 2016-01-08
------------------

- Maintenance release. Now also available in npm as `bagjs`.


0.1.4 / 2015-06-21
------------------

- Fixed IE8 compatibility.
- Fixed Android Browser IndexedDB capabilities test.
- Added IE8-10 css load workaround for files with `@import` & `@fontface`.


0.1.3 / 2014-12-12
------------------

- Added processing for outdated JS mime types (can happen on CDNs).
- Changed wrapper to be more universal (to support amd & browserify).


0.1.2 / 2014-03-25
------------------

- Care about embedded urls for soure maps (do address absolute on js/css ingect).


0.1.1 / 2013-11-30
------------------

- Fixed prefixes support.
- More tests.
- Cleanup.


0.1.0 / 2013-11-30
------------------

- First release.
