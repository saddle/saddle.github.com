===========
What's New
===========

1.1
---

The first new major release of Saddle contains several improvements.

Improvements / Fixes

- Adhoc polymorphism is achieved through the typeclass pattern for
  compile-time selection of implementation based on scalar type.
- Fix CSV parsing issue and corner cases
- Added cross-build for Scala 2.9.3
- Fixed flawed HDF5 multithreading test
- Upgraded FastUtil dependency to latest version
- Cleaned up dependencies in project build

API Changes

- Additional Mat accessors are available (GH #4, #18)
- Improved CSV parsing API
- Added methods to slice results of HDF5 access
- Improved consistency of the semantics of ``map``, and ``mapValues``

Credits & Thanks

- Adam Klein
- Chris Lewis
