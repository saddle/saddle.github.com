Quick Start Guide
~~~~~~~~~~~~~~~~~

Let's take a quick tour through Saddle to get a sense of the feature set. There
are five major array-backed, specialized data structures:

============== =======================
Class          Description
============== =======================
Vec            1D vector
Mat            2D matrix
Series         1D indexed vector
Frame          2D indexed matrix
Index          Hashmap-like
============== =======================

All are designed with immutability in mind, although since they are backed by
arrays and the library tries to be conservative in copying data, you should be
careful not to let the backing arrays escape object construction.

Let's look at each one in turn through examples. If you've got the source code
and an SBT launcher, run the following (from the directory where you've got
Saddle checked out):

.. code:: bash

  $ sbt console

If you've only got the Saddle jar in your classpath, the relevant import is:

.. code:: scala

  import org.saddle._

(This should bring in all the implicits you need for the examples below.)

Note: by default, toString will print up to some number of data entries. If you
would like to see more data, simply call the print() method on the relevant
object with a larger number.

Vec
---

Let's walk through some examples in an sbt console session.

First, a few ways to create Vec instances:

.. code:: scala

  scala> Vec(1, 2, 3)               // pass a sequence directly
  scala> Vec(1 to 3 : _*)           // pass a sequence indirectly
  scala> Vec(Array(1,2,3))          // wrap an array into a Vec
  scala> Vec(Seq(1,2,3))            // not usually what you want!
  scala> Vec(Seq(1,2,3) : _*)       // yes, usually what you want!
  scala> Vec.empty[Double]          // create an empty Vec

There are also a few special factories:

.. code:: bash

  scala> vec.ones(5)
  scala> vec.zeros(5)

Sometimes random Vec instances are useful. There are a few ways to accomplish
this:

.. code:: bash

  scala> vec.rand(1000)             // 1000 random doubles, -1.0 to 1.0 (excluding 0)
  scala> vec.randp(1000)            // a thousand random positive doubles
  scala> vec.randi(1000)            // a thousand random ints
  scala> vec.randpi(1000) % 10      // a thousand random positive ints, from 1 to 9
  scala> vec.randn(100)             // 100 normally distributed observations
  scala> vec.randn2(100, 2, 15)     // 100 obs normally distributed with mean 2 and stdev 15

Let's take a quick look at some operations you can do on Vec instances. All the
major arithmetic operations are supported between two Vec instances and between
a Vec and a scalar.

.. code:: bash

  scala> Vec(1,2,3) + Vec(4,5,6)
  scala> Vec(1,2,3) * Vec(4,5,6)
  scala> Vec(1,2,3) dot Vec(4,5,6)
  scala> Vec(1,2,3) outer Vec(4,5,6)
  scala> Vec(1,2,3) ** Vec(4,5,6)
  scala> Vec(1,2,3) << 2
  scala> Vec(1,2,3) & 0x1
  scala> Vec(1,2,3) + 2             // Note: 2 must be on right hand side (it's Vec.`+`)

You can also slice out data from a Vec in various ways:

.. code:: bash

  scala> val v = vec.rand(10)

  scala> v.at(2)                        // wrapped in Scalar, in case of NA
  res0: org.saddle.scalar.Scalar[Double] = -0.19816001024987906

  scala> v.raw(2)                       // raw access to primitive type; be careful!
  res1: Double = -0.19816001024987906

  scala> v(2,4,8)
  scala> v(2 -> 4)
  scala> v(* -> 3)
  scala> v(8 -> * )
  scala> v.slice(0,3)
  scala> v.slice(0,8,2)

There are statistical functions available:

.. code:: bash

  scala> val v = Vec(1,2,3)

  scala> v.sum
  res0: Int = 6

  scala> v.prod
  res1: Int = 6

  scala> v.mean
  res2: Double = 2.0

  scala> v.median
  res3: Double = 2.0

  scala> v.max
  res4: Option[Int] = Some(3)

  scala> v.stdev
  res5: Double = 1.0

  scala> v.variance
  res6: Double = 1.0

  scala> v.skew
  res7: Double = 0.0

  scala> v.kurt
  res8: Double = NaN

  scala> v.geomean
  res9: Double = 1.8171205928321394

  // etc ...
  scala> v.count
  scala> v.countif(_ > 0)
  scala> v.logsum
  scala> v.argmin
  scala> v.percentile(0.3, method=PctMethod.NIST)
  scala> v.demeaned
  scala> v.rank(tie=RankTie.Avg, ascending=true)

As well as a few specially-implemented rolling statistical functions:

.. code:: bash

  scala> val v = vec.rand(10)

  scala> v.rollingSum(5)            // with window size = 5
  scala> v.rollingMean(5)           // etc.
  scala> v.rollingMedian(5)
  scala> v.rollingCount(5)

In fact, you can do any calculation you'd like over the rolling window:

.. code:: bash

  scala> v.rolling(5, _.stdev)      // window size = 5, take stdev of vector input

Let's take a quick look at some more advanced functionality:

.. code:: bash

  scala> val v = vec.rand(10)

  scala> v filter(_ > 0.5)          // these three commands are all the same!
  scala> v where v > 0.5
  scala> v.take(v.find(_ > 0.5))

  scala> v.filterFoldLeft(_ > 0.5)(0d) { case (acc, d) => acc + d }

  scala> v shift 1

Try out some of the following for yourself:

.. code:: bash

  scala> v.reversed
  scala> v.map(_ + 1)
  scala> v.foldLeft(0d) { case (acc, d) => acc + 1.0 / d }
  scala> v.scanLeft(0d) { case (acc, d) => acc + 1.0 / d }
  scala> v without v.find(_ < 0.5)
  scala> v findOne(_ < 0.5)
  scala> v.head(2)
  scala> v.tail(2)
  scala> v(0 -> 2).mask(Vec(true, false, true))
  scala> v concat v

Note that NA (missing values) are handled within most calculations. Saddle
tries to prevent accidentally using raw NA values; only two primitive types,
Float and Double, have NA values that are safe to use in raw form: their NA
representations are Float.NaN and Double.NaN, respectively.

.. code:: bash

  scala> val v = Vec(1, na.to[Int], 2)
  scala> v sum

  res0: Int = 3

  scala> v median
  res1: Double = 1.5

  scala> v prod
  res2: Int = 2

  scala> v dropNA                           // becomes [1 2]

  scala> v.at(1)                            // boxed to prevent shooting yourself in foot
  res4: org.saddle.scalar.Scalar[Int] = NA

  scala> v.raw(1)                           // you can do this, but be careful!
  res5: Int = -2147483648

  scala> v.fillNA(x => x)                   // becomes [1 1 2]; the argument is the index of the NA

  scala> val d: Double = scalar.Scalar(1.0) // you can auto-unbox a double scalar

Also, a Scalar[T] can convert to Option[T] implicitly, so you may do everything
with it that you may do with an Option; e.g., call map() or flatmap().

Finally, if you need to treat a Vec as a sequence, you may convert it to Seq,
(specifically, an IndexedSeq). Also, you may access (a copy of) Vec as an
array, by calling Vec.contents.

.. code:: bash

  scala> v.toSeq
  scala> v.contents

Series
------

A Series combines a Vec with an Index that provides an ordered key-value
mapping.  We'll talk more about the details of Index later.  First, note a
Vec[T] can convert implicitly to a Series[Int, T]. So for instance:

.. code:: bash

  scala> val x: Series[Int, Double] = vec.rand(5)

The key type of a must have a natural ordering (ie, an Ordering of that type
within the implicit scope). However, the Series maintains the order in which
its data was supplied unless ordered othewise.

Let's look at a few constructions:

.. code:: bash

  // we already know we can convert a Vec
  scala> Series(Vec(32, 12, 9))
  res3: org.saddle.Series[Int,Int] =
  [3 x 1]
  0 -> 32
  1 -> 12
  2 -> 9

  // we can pass a pair of tuples
  scala> Series("a" -> 1, "b" -> 2, "c" -> 3)
  res4: org.saddle.Series[java.lang.String,Int] =
  [3 x 1]
  a -> 1
  b -> 2
  c -> 3

  // any series of tuples will work, eg:
  scala> Series(List("a" -> 1, "b" -> 2, "c" -> 3) : _*)

  // can pass data and index separately:
  scala> Series(Vec(1,2,3), Index("a", "b", "c"))

  // you can create an empty Series like so:
  scala> Series.empty[String, Int]

  // supplied order is maintained:
  scala> Series(Vec(1,2,3), Index("c", "b", "a"))
  res11: org.saddle.Series[java.lang.String,Int] =
  [3 x 1]
  c -> 1
  b -> 2
  a -> 3

  // unlike map, multiple keys are entirely fine:
  scala> Series(Vec(1,2,3,4), Index("c", "b", "a", "b"))
  res12: org.saddle.Series[java.lang.String,Int] = 
  [4 x 1]
  c -> 1
  b -> 2
  a -> 3
  b -> 4

With construction out of the way, let's look at a few ways we can get data out
of a Series.

.. code:: bash

  scala> val q = Series(Vec(1,3,2,4), Index("c", "b", "a", "b"))

  // get the values or index
  scala> q.values
  scala> q.index

  // extract value by numerical offset
  scala> q.at(2)
  res20: org.saddle.scalar.Scalar[Int] = 3

  scala> q.at(2,3,1)
  res0: org.saddle.Vec[Int] =
  [3 x 1]
  2
  4
  3

  // or extract key
  scala> q.keyAt(2)
  res21: org.saddle.scalar.Scalar[java.lang.String] = a

  scala> q.keyAt(2,3,1)
  res24: org.saddle.Index[java.lang.String] = 
  [Index 3 x 1]
  a
  b
  b

  // sort by index ordering
  scala> q.sortedIx
  res16: org.saddle.Series[java.lang.String,Int] = 
  [4 x 1]
  a -> 3
  b -> 2
  b -> 4
  c -> 1

  // sort by value ordering
  scala> q.sorted
  res17: org.saddle.Series[java.lang.String,Int] = 
  [4 x 1]
  c -> 1
  b -> 2
  a -> 3
  b -> 4

  // extract elements matching the index
  scala> q("b")
  res19: org.saddle.Series[java.lang.String,Int] =
  [2 x 1]
  b -> 2
  b -> 4

  scala> q("a", "b")
  res1: org.saddle.Series[java.lang.String,Int] = 
  [3 x 1]
  a -> 2
  b -> 3
  b -> 4

  // notice ordering subtleties:
  scala> q("b", "a")
  res2: org.saddle.Series[java.lang.String,Int] = 
  [3 x 1]
  b -> 3
  b -> 4
  a -> 2

  // get first or last values
  scala> q.first
  scala> q.last

  // or key
  scala> q.firstKey
  scala> q.lastKey

  // "reindex" to a new index:
  scala> q.reindex(Index("a","c","d"))
  res4: org.saddle.Series[java.lang.String,Int] = 
  [3 x 1]
  a ->  2
  c ->  1
  d -> NA

  // or just by a sequence of keys:
  scala> q.reindex("a","c","d")

  // notice that 'slicing' ignores unknown keys:
  scala> q("a", "d")
  res5: org.saddle.Series[java.lang.String,Int] = 
  [1 x 1]
  a -> 2

  // we cannot reindex with "b", because it isn't unique.
  // (the problem is, which "b" would we choose?)
  scala> q.reindex("a", "b")
  java.lang.IllegalArgumentException: requirement failed: Could not reindex unambiguously
  ...

  // we can "reset" the index to integer labels
  scala> q.resetIndex

  // or to a new index altogether
  scala> q.setIndex(Index("w", "x", "y", "z"))

  // to 'slice', we need a sorted index; slice is inclusive by default
  scala> val s = q.sortedIx
  scala> s.sliceBy("b", "c")
  res7: org.saddle.Series[java.lang.String,Int] = 
  [3 x 1]
  b -> 3
  b -> 4
  c -> 1

  // syntactic sugar is provided:
  scala> s.sliceBy("b" -> "c")
  scala> s.sliceBy(* -> "b")

  // where slice is by offset, exclusive by default, and the
  // index doesn't have to be sorted:
  scala> q.slice(0,2)
  res8: org.saddle.Series[java.lang.String,Int] = 
  [2 x 1]
  c -> 1
  b -> 3

  // there are head/tail methods:
  scala> q.head(2)
  scala> q.tail(2)

Aside from extracting values, there are many fun ways to compute with Series.
Try the following:

.. code:: bash

  scala> val q = Series(Vec(1,3,2,4), Index("c", "b", "a", "b"))
  scala> q.mapValues(_ + 1)
  scala> q.mapIndex(_ + "x")
  scala> q.shift(1)
  scala> q.filter(_ > 2)
  scala> q.filterIx(_ != "b")
  scala> q.find(2)
  scala> q.findKey("b")
  scala> q.findOneKey("b")
  scala> q.minKey
  scala> q.contains("a")
  scala> q.scanLeft(0) { case (acc, v) => acc + v }
  scala> q.reversed

  scala> val m = q.mask(q.values > 2)
  scala> m.hasNA
  scala> m.dropNA
  scala> m.pad

  scala> q.rolling(2, _.minKey)
  scala> q.splitAt(2)
  scala> q.sortedIx.splitBy("b")

We can of course convert to a Vec or a Seq if we need to. The Series.toSeq
method yields a sequence of key/value tuples.

.. code:: bash

  scala> q.toVec
  scala> q.toSeq

We can also group by key in order to transform or combine the groupings, which
themselves are Series. For example:

.. code:: bash

  scala> q.groupBy.combine(_.sum)
  res19: org.saddle.Series[java.lang.String,Int] = 
  [3 x 1]
  a -> 2
  b -> 7
  c -> 1

  scala> q.groupBy.transform(s => s - s.mean)
  res20: org.saddle.Series[java.lang.String,Double] = 
  [4 x 1]
  c ->  0.0000
  b -> -0.5000
  a ->  0.0000
  b ->  0.5000

You can also group by another index, or by a transformation of the current
index, by passing an argument into groupBy. See the Saddle API for more info.

The expressive nature of working with Series becomes apparent when you need to
align data:

.. code:: bash

  scala> val a = Series(Vec(1,4,2,3), Index("a","b","c","d"))
  scala> val b = Series(Vec(5,2,1,8,7), Index("b","c","d","e","f"))

  scala> a + b
  res21: org.saddle.Series[java.lang.String,Int] = 
  [6 x 1]
  a -> NA
  b ->  9
  c ->  4
  d ->  4
  e -> NA
  f -> NA

You see that the indexes have been aligned prior to operation being performed.
Because there is a missing observation in each label of a, e, and f, the
summation is not done and instead an NA value is inserted into the result.

Generally, a full-outer join is performed. So, for instance:

.. code:: bash

  scala> val a = Series(Vec(1,4,2), Index("a","b","b"))
  scala> val b = Series(Vec(5,2,1), Index("b","b","d"))

  scala> a + b
  res22: org.saddle.Series[java.lang.String,Int] = 
  [6 x 1]
  a -> NA
  b ->  9
  b ->  6
  b ->  7
  b ->  4
  d -> NA

Most basic math and boolean operations are supported between two Series, as
well as between a Series and a scalar value.

We mentioned joins. Let's look at a few join operations; the result is a Frame,
which we will touch on a bit later. These are similar in nature to SQL joins.

.. code:: bash

  scala> val a = Series(Vec(1,4,2), Index("a","b","b"))
  scala> val b = Series(Vec(5,2,1), Index("b","b","d"))

  scala> a.join(b, how=index.LeftJoin)
  res24: org.saddle.Frame[java.lang.String,Int,Int] = 
  [4 x 2]
        0  1
       -- --
  a ->  1 NA
  b ->  4  5
  b ->  4  2
  b ->  2  2

  scala> a.join(b, how=index.RightJoin)
  res25: org.saddle.Frame[java.lang.String,Int,Int] = 
  [4 x 2]
        0  1
       -- --
  b ->  4  5
  b ->  2  5
  b ->  2  2
  d -> NA  1

  scala> a.join(b, how=index.InnerJoin)
  res28: org.saddle.Frame[java.lang.String,Int,Int] = 
  [3 x 2]
        0  1
       -- --
  b ->  4  5
  b ->  4  2
  b ->  2  2

  scala> a.join(b, how=index.OuterJoin)
  res29: org.saddle.Frame[java.lang.String,Int,Int] = 
  [6 x 2]
        0  1
       -- --
  a ->  1 NA
  b ->  4  5
  b ->  4  2
  b ->  2  5
  b ->  2  2
  d -> NA  1

Finally, let's take a look at a multiply indexed Series:

.. code:: bash

  scala> val t = Series(Vec(1,2,3,4), Index((1,1),(1,2),(2,1),(2,2)))
  t: org.saddle.Series[(Int, Int),Int] = 
  [4 x 1]
  1 1 -> 1
    2 -> 2
  2 1 -> 3
    2 -> 4

Sometimes you want to move the innermost row label to be a column label
instead. You can achieve this as follows:

.. code:: bash

  scala> val f = t.pivot
  f: org.saddle.Frame[Int,Int,Int] = 
  [2 x 2]
        1  2
       -- --
  1 ->  1  2
  2 ->  3  4

And this is how you get back the original Series:

.. code:: bash

  scala> f.melt
  res32: org.saddle.Series[(Int, Int),Int] = 
  [4 x 1]
  1 1 -> 1
    2 -> 2
  2 1 -> 3
    2 -> 4

This generalizes to tuples of higher order.

Mat
---

A Mat[T] represents a Matrix of values. Internally it is stored as a single
contiguous array; sometimes, a duplicate array is created which stores the same
values, but transposed, for speed of access having to do with memory locality.

This format was chosen to be compatible with DenseMatrix of EJML_, a high
performance linear algebra library which provides the default matrix multiply
routine for Saddle. One or two properly placed implicit conversions can extend
Saddle to be a powerful linear algebra system.

.. _EJML: http://code.google.com/p/efficient-java-matrix-library/

Let's start off with construction:

.. code:: bash

  scala> Mat(2,2, Array(1,2,3,4))
  res41: org.saddle.Mat[Int] =
  [2 x 2]
  1 2
  3 4

  // all same:
  scala> Mat(Array(1,3), Array(2,4))
  scala> Mat(Array(Array(1,3), Array(2,4)))
  scala> Mat(Vec(1,3), Vec(2,4))
  scala> Mat(Array(Vec(1,3), Vec(2,4)))

  // identity matrix:
  scala> mat.ident(2)

  // empty matrix:
  scala> Mat.empty[Double]

  // zeros:
  scala> Mat[Int](2, 2)

Again, sometimes we want to create instances filled with random observations.
As to Vec, we can do the following:

.. code:: bash

  scala> mat.rand(2,2)       // random doubles from within [-1.0, 1.0] excluding 0
  scala> mat.randp(2,2)      // random positive doubles
  scala> mat.randn(2,2)      // random normally distributed doubles
  scala> mat.randn(2,2,3,12) // random normally distributed with mean=3, stdev=12

There are a few other factory methods available:

.. code:: bash

  scala> mat.ones(2,2)
  scala> mat.zeros(2,2)
  scala> mat.diag(Vec(1,2))

Let's look at some basic operations with Mat. As with Vec, you may perform
calculations on two Mat instances, or on a Mat and a scalar value.

.. code:: bash

  // element-wise multiplication
  scala> Mat(2,2,Array(1,2,3,4)) * Mat(2,2,Array(4,1,2,3))
  res55: org.saddle.Mat[Int] = 
  [2 x 2]
   4  2
   6 12

  // matrix multiplication; note implicit conversion to Double
  // instead of `dot`, can also use `mult`
  scala> Mat(2,2,Array(1,2,3,4)) dot Mat(2,2,Array(4,1,2,3))
  res53: org.saddle.Mat[Double] = 
  [2 x 2]
   8.0000  7.0000
  20.0000 15.0000


  // matrix-vector multiplication
  scala> Mat(2,2,Array(1,2,3,4)) dot Vec(2,1)
  res56: org.saddle.Mat[Double] = 
  [2 x 1]
   4.0000
  10.0000

  // as expected
  scala> Mat(2,2,Array(1,2,3,4)) * 2
  scala> Mat(2,2,Array(1,2,3,4)) + 2
  scala> Mat(2,2,Array(1,2,3,4)) << 2
  // etc...

  // transpose
  scala> Mat(2,2,Array(1,2,3,4)).T
  scala> Mat(2,2,Array(1,2,3,4)).transposed

  // properties of Mat
  scala> val m = Mat(2,2,Array(1,2,3,4))
  scala> m.numRows
  scala> m.numCols
  scala> m.isSquare
  scala> m.isEmpty

There are a few ways to extract values from a Mat.

.. code:: bash

  scala> m.at(0,1)
  res1: org.saddle.scalar.Scalar[Int] = 2

  // be careful with this one!
  scala> m.raw(0,1)
  res2: Int = 2

  scala> m.takeRows(0)
  res0: org.saddle.Mat[Int] =
  [1 x 2]
  1 2

  scala> m.withoutRows(0)
  res0: org.saddle.Mat[Int] =
  [1 x 2]
  3 4

  scala> m.takeCols(0)
  res1: org.saddle.Mat[Int] =
  [2 x 1]
  1
  3

  scala> m.col(0)
  scala> m.row(0)
  scala> m.rows()
  scala> m.cols()

Some other interesting methods on Mat:

.. code:: bash

  scala> val m = Mat(2,2,Array(1,2,na.to[Int],4))
  m: org.saddle.Mat[Int] =
  [2 x 2]
   1  2
  NA  4

  scala> m.rowsWithNA
  res4: List[Int] = List(1)

  scala> m.dropRowsWithNA

  scala> m.reshape(1,4)
  res6: org.saddle.Mat[Int] =
  [1 x 4]
   1  2 NA  4

  scala> mat.rand(2,2).roundTo(2)
  res8: org.saddle.Mat[Double] = 
  [2 x 2]
  -0.3400  0.0000 
  -0.3800  0.2500

Finally, if you want to print, say, 100 rows and 10 columns:

.. code:: bash

  scala> m.print(100, 10)

Frame
-----

A Frame combines a Mat with a row index and a column index which provides a way
to index into the Mat. First, note a Mat[T] converts implicitly to a Frame[Int,
Int, T]. So for instance

.. code:: bash

  scala> val f: Frame[Int, Int, Double] = mat.rand(2, 2)

A Frame is represented internally as a sequence of column Vec instances all
sharing the same row index; additionally a transpose of the data is created
lazily if cross sections of data are requested.

Let's look at some ways to instantiated a Frame:

.. code:: bash

  scala> val v = Vec(1, 2)                              // given the following
  scala> val u = Vec(3, 4)
  scala> val s = Series("a" -> 1, "b" -> 2)
  scala> val t = Series("b" -> 3, "c" -> 4)

  scala> Frame(v, u)                                    // two-column frame

  scala> Frame("x" -> v, "y" -> u)                      // with column index

  scala> Frame(s, t)                                    // aligned along rows
  [3 x 2]
        0  1
       -- --
  a ->  1 NA
  b ->  2  3
  c -> NA  4

  scala> Frame("x" -> s, "y" -> t)                      // with column index
  [3 x 2]
        x  y
       -- --
  a ->  1 NA
  b ->  2  3
  c -> NA  4

  scala> Frame(Seq(s, t), Index("x", "y"))              // explicit column index

  scala> Frame(Seq(v, u), Index(0, 1), Index("x", "y")) // row & col indexes specified explicitly

  scala> Frame(Seq(v, u), Index("a", "b"))              // col index specified

You'll notice that if an index is not provided, a default int index is set
where the index ranges between 0 and the length of the data.

Frame elements are all recognized as the same type by the compiler. But if you
want to work with frames whose columns contain heterogenous data, there are a
few facilities to make it easier. You can construct Frame[_, _, Any] using the
Panel() constructor, which mirrors the Frame() constructor, eg:

.. code:: bash

  scala> val p = Panel(Vec(1,2,3), Vec("a","b","c"))

You may then extract columns of a particular type as follows:

.. code:: bash

  scala> p.colType[Int]
  scala> p.colType[Int, String]

Speaking of types, if you want to generate an empty row or column of the right type:

.. code:: bash

  scala> f.emptyRow
  scala> f.emptyCol

Back to homogenous Frames. If you want to set or reset the index, these methods
are your friends:

.. code:: bash

  scala> val f = Frame("x" -> s, "y" -> t)

  scala> f.setRowIndex(Index(10, 20))
  scala> f.setColIndex(Index("p", "q"))
  scala> f.resetRowIndex()
  scala> f.resetColIndex()

(Note: frame ``f`` will carry through the next examples.)

You also have the following index transformation tools at hand:

.. code:: bash

  f.mapRowIndex { case rx => ... }
  f.mapColIndex { case cx => ... }

Let's next look at how to extract data from the Frame.

.. code:: bash

  scala> f.rowAt(2)    // extract row at offset 2, as Series
  scala> f.rowAt(1,2)  // extract frame of rows 1 & 2
  scala> f.rowAt(1->2) // extract frame of rows 1 & 2

  scala> f.colAt(1)    // extract col at offset 1, as Series
  scala> f.colAt(0,1)  // extract frame of cols 1 & 2
  scala> f.colAt(0->1) // extract frame of cols 1 & 2

``rowAt`` and ``colAt`` are used under the hood for the ``at`` extractor:

.. code:: bash

  scala> f.at(1,1)              // Scalar value
  scala> f.at(Array(1,2), 0)    // extract rows 1,2 of column 0
  scala> f.at(0->1, 1)          // extract rows 0,1 of column 1
  scala> f.at(0->1, 0->1)       // extract rows 0,1 of columns 0, 1
  // etc...

If you want more control over slicing, you can use these methods:

.. code:: bash

  scala> f.colSlice(0,1)        // frame slice consisting of column 0
  scala> f.rowSlice(0,3,2)      // row slice from 0 until 3, striding by 2

Of course, this is an bi-indexed data structure, so we can use its indexes to
select out data using keys:

.. code:: bash

  scala> f.row("a")             // row series 'a', with all columns
  scala> f.col("x")             // col series 'x', with all rows
  scala> f.row("a", "c")        // select two rows
  scala> f.row("a"->"b")        // slice two rows (index must be sorted)
  scala> f.row(Vec("a", "c"))   // another way to select

A more explict way to slice with keys is as follows, and you can specify
whether the right bound is inclusive or exclusive. Again, to slice, the index
keys must be ordered.

.. code:: bash

  scala> f.rowSliceBy("a", "b", inclusive=false)
  scala> f.colSliceBy("x", "x", inclusive=true)

The ``row`` and ``col`` methods are used under the hood for the ``apply`` method:

.. code:: bash

  scala> f("a", "x")             // extract a one-element frame by keys
  scala> f("a"->"b", "x")        // two-row, one-column frame
  scala> f(Vec("a", "c"), "x")   // same as above, but extracting, not slicing

The methods of extracting multiple rows shown above can of course be done on
columns as well.

You can also split up the Frame by key or index:

.. code:: bash

  scala> f.colSplitAt(1)          // split into two frames at column 1
  scala> f.colSplitBy("y")

  scala> f.rowSplitAt(1)
  scala> f.rowSplitBy("b")

You extract some number of rows or columns:

.. code:: bash

  scala> f.head(2)                // operates on rows
  scala> f.tail(2)
  scala> f.headCol(1)             // operates on cols
  scala> f.tailCol(1)

Or the first & last of some key (which is helpful when you've got a multi-key
index):

.. code:: bash

  scala> f.first("b")              // first row indexed by "b" key
  scala> f.last("b")               // last row indexed by "b" key
  scala> f.firstCol("x")
  scala> f.lastCol("x")

There are a few other methods of extracting data:

.. code:: bash

  scala> f.filter { case s => s.mean > 2.0 }  // any column whose series satisfies predicate
  scala> f.filterIx { case x => x == "x" }    // col where index matches key "x"
  scala> f.where(Vec(false, true))            // extract second column

There are analogous methods to operate on rows rather then columns:

- ``rfilter``
- ``rfilterIx``
- ``rwhere``

etc... in general, methods operate on a column-wise basis, whereas the
``r``-counterpart does so on a row-wise basis.

You can drop cols (rows) containing *any* NA values:

.. code:: bash

  scala> f.dropNA
  scala> f.rdropNA

Let's take a look at some operations we can do with Frames. We can do all the
normal binary math operations with Frames, with either a scalar value or with
another Frame. When two frames are involved, they are reindexed along both axes
to match the outer join of their indices, but any missing observation in either
will carry through the calculations.

.. code:: bash

  scala> f + 1
  scala> f * f
  scala> val g = Frame("y"->Series("b"->5, "d"->10))
  scala> f + g                      // one non-NA entry, ("b", "y", 8)

You can effectively supply your own binary frame operation using joinMap, which
lets you control the join style on rows and columns:

.. code:: bash

  scala> f.joinMap(g, rhow=index.LeftJoin, chow=index.LeftJoin) { case (x, y) => x + y }

If you want simply to align one frame to another without performing an operation,
use the following method:

.. code:: bash

  scala> val (fNew, gNew) = f.align(g, rhow=index.LeftJoin, chow=index.OuterJoin)

If you want to treat a Frame as a matrix to use in linear algebraic fashion,
call the ``toMat`` method.

We can sort a frame in various ways:

.. code:: bash

  scala> f.sortedRIx                // sorted by row index
  scala> f.sortedCIx                // sorted by col index
  scala> f.sortedRows(0,1)          // sort rows by (primary) col 0 and (secondary) col 1
  scala> f.sortedCols(1,0)          // sort cols by (primary) row 1 and (secondary) row 0

We can also sort by an ordering provided by the result of a function acting on
rows or cols:

.. code:: bash

  scala> f.sortedRowsBy { case r => r.at(0) }   // sort rows by first element of row
  scala> f.sortedColsBy { case c => c.at(0) }   // sort cols by first element of col

There are several mapping functions:

.. code:: bash

  scala> f.mapValues { case t => t + 1 }        // add one to each element of frame
  scala> f.mapVec { case v => v.demeaned }      // map over each col vec of the frame
  scala> f.reduce { case s => s.mean }          // collapse each col series to a single value
  scala> f.transform { case s => s.reversed }   // transform each series; outerjoin results

We can mask out values:

.. code:: bash

  scala> f.mask(_ > 2)                          // mask out values > 2
  scala> f.mask(Vec(false, true, true))         // mask out rows 1 & 2 (keep row 0)

Columns (rows) containing *only* NA values can be dropped as follows:

.. code:: bash

  scala> f.mask(Vec(true, false, false)).rsqueeze   // drop rows containing NA values
  scala> f.rmask(Vec(false, true)).squeeze          // takes "x" column

We can groupBy in order to combine or transform:

.. code:: bash

  scala> f.groupBy(_ == "a").combine(_.count)       // # obs in each column that have/not row key "a"
  scala> f.groupBy(_ == "a").transform(_.demeaned)  // contrived, but you get the idea hopefully!

We can join against another frame, or against a series:

.. code:: bash

  scala> f.join(g, how=index.LeftJoin)              // left joins on row index, drops col indexes
  scala> f.join(s, how=index.LeftJoin)              // implicitly promotes s to Frame
  scala> f.joinS(s, how=index.LeftJoin)             // use Series directly

Btw, to join a Frame to a series, the call looks like this:

.. code:: bash

  scala> s.joinF(g, how=index.LeftJoin)

Of course, if you want to join along the column index instead, there is a
``rjoin`` method.

Let's look at a few data reshaping commands. Try the following:

.. code:: bash

  scala> f.melt
  scala> f.melt.mapRowIndex { case (a, b) => (b, a) } colAt(0) pivot
  scala> f.mapColIndex { case c => (1, c) } stack
  scala> f.mapRowIndex { case r => (1, r) } unstack

There are statistics available on Frames on a column-wise basis that are
NA-aware. They are provided via an implicit conversion to ``FrameStats``; look
there to see what's available.

Finally, note that ``toSeq`` converts a Frame to a sequence of (row, col,
value) triples.

Index
-----

Index provides constant-time lookup of a value within array-backed storage, and
support for joining and slice operations. There are a few factory methods for
creating an Index:

.. code:: bash

  scala> Index("a", "b", "c")           // from seq of values
  scala> Index(Vec("a", "b", "c"))      // from vec
  scala> Index(Array("a", "b", "c"))    // from array

To create a multi-level index, you may do the following. In this example, the
Index is comprised of (1,a), (2,b), and (3,c):

.. code:: bash

  scala> Index.make(Vec(1, 2, 3), Vec("a", "b", "c"))

You likely do not want to utilize the methods of Index directly very often, but
rather attach them to data (in Series and Frames) to achieve your goals in a
more indirect manner. Still, there are a few useful tools:

.. code:: bash

  scala> val x = Index("a", "a", "b", "b", "c", "c")
  scala> val x.next("a")                                // returns "b"
  scala> val x.prev("b")                                // returns "a"

For next and prev to work, the Index must be contiguous in values, although
sortedness is unnecessary. By contiguous, we mean a-b-a-b would not be a valid
ordering of data, but a-a-b-b would be.

For Index instances with Set semantics (ie, no duplicate keys), you have
fast ``union`` and ``intersect`` methods.

For map-like functionality, there is ``contains`` and ``exists``, although
since Index is really a multi-map, the ``get`` function returns an array of
locations within the backing array, and ``count`` gives you how many entries
exist for a particular key. ``uniques`` allows you to get all the unique keys,
and the methods ``getFirst`` and ``getLast`` retrieve the location offsets of a
particular key. The API is worth exploring further.

I/O
---

The ``org.saddle.io._`` module provides some basic, and not-so-basic, I/O
functionality, although there is still much to be developed. There is a fast
parallel csv file reader which you may access as follows:

.. code:: bash

  scala> val csvfile = CsvFile("/tmp/file.csv")
  scala> CsvParser.parsePar(CsvParser.parseDouble, List(1,2))(csvfile)

There is also HDF5 reading/writing available for Series and Frame objects that
is essentially compatible with the basic pandas format (as of version 0.9).
Note that it only supports certain primitive types like Int/Long/Double, and
DateTime objects, but not all Serializable java classes.

Utilities
---------

There some neat helper functions in the ``org.saddle.array._`` module to work
with arrays of primitives:

- range
- shuffle
- tile
- random array generators
- linspace
- filter
- flatten
- argsort
- argmin, argmax

The ``org.saddle.util.Random`` class provides a xorshift Marsiglia primitive
value pseudorandom number generator the underlies the random number
generation throughout Saddle.

Finally, the ``org.saddle.time._`` module provides a helpful constructor for
joda DateTime objects, ``datetime``, and for doing fast manipulations on Vec
and Index instances of type DateTime via implicit conversion to TimeAccessors.

A note on optimization
----------------------

The data structures above attempt to operate on primitives whenever possible,
although the specialization is not to every primitive JVM data type as of yet.
For example, ``Vec`` is specialized on Boolean, Int, Long, and Double; but not
yet Float, yet, so Vec[Float] operations will (un)box.

Try to avoid looping through these structures; they were meant for terse lines
of code which operate in a vectorized manner. If you find yourself looping
through them, you're probably doing it wrong!

