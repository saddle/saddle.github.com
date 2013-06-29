===========
What's New
===========

1.3
---

Improvements / Fixes

- Integrate Google RFC 2445, an implementation of the ical standard for
  recurrence rule generation, which facilitates construction of indexes
  containing DateTimes that follow particular intervals (e.g., weekly).
- Add addition Index construction method for DateTime index creation
- Allow for levels beyond the first within HDF5 file creation; ie, datasets
  may be attached to groups other than root.
- Fix Frame.empty bug
- Fix resource leak in readGroupNames in HDF5 API
- Fix takeType method of Frame to work properly with type hierarchy
- Add support for heterogenous Frame data to be read/written to HDF5
- Fix rFilter losing column type information

1.2
---

A few API changes and bug fixes are part of this release.

Improvements / Fixes

- Additional pseudorandom number generator implementations Ziff98 and LFib4
  have been added, and the default Marsiglia XorShift implementation has been
  fixed. All three have been subjected to the Crush suite of random number
  tests.
- A bug discovered in left/right/inner joins where the indices are both
  non-unique and monotonic has been fixed.
- Flatmap added to Series and Frame
- Semantics of map has been changed
- Single saddle module has been split into core and hdf5, to prevent any
  unnecessary dependency on the latter.

API Changes

- Map semantics have changed for Mat/Vec

1.1
---

The first new major release of Saddle contains several improvements.

Improvements / Fixes

- Adhoc polymorphism is achieved through the typeclass pattern for compile-time
  selection of implementation based on scalar type.
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
