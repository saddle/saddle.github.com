Quick Start Guide
~~~~~~~~~~~~~~~~~

Let's take a quick tour through Saddle to get a sense of the feature set. There
are four major data structures:

- Vec, a 1D vector object
- Series, a 1D indexed vector object
- Mat, a 2D matrix object
- Frame, a 2D indexed matrix object

All are designed with immutability in mind, although since they are backed by arrays
and the library tries to be conservative in coping data, you should be careful not to
let the backing arrays escape object construction.

Let's look at each one in turn through examples. If you've got the source code and an
SBT launcher, run the following (from the directory where you've got Saddle checked
out):

.. code:: bash

  $ sbt console

If you've only got the Saddle jar in your classpath, the relevant import is:

.. code:: scala

  import org.saddle._

Note: by default, toString will print up to some number of data entries. If you would like
to see more data, simply call the print() method on the relevant object with a larger number.

Vec
---

Let's walk through some examples in an sbt console session.

First, a few ways to create Vec instances:

.. code:: scala

  scala> Vec(1, 2, 3)               // pass a sequence directly
  res0: org.saddle.Vec[Int] =
  [3 x 1]
  1
  2
  3

  scala> Vec(1 to 3 : _*)           // pass a sequence indirectly
  res1: org.saddle.Vec[Int] =
  [3 x 1]
  1
  2
  3

  scala> Vec(Array(1,2,3))          // wrap an array into a Vec
  res2: org.saddle.Vec[Int] =
  [3 x 1]
  1
  2
  3

  scala> Vec(Seq(1,2,3))            // not usually what you want!
  res3: org.saddle.Vec[Seq[Int]] =
  [1 x 1]
  List(1, 2, 3)

  scala> Vec(Seq(1,2,3) : _*)       // yes, usually what you want!
  res3: org.saddle.Vec[Int] =
  [3 x 1]
  1
  2
  3

  scala> Vec.empty[Double]          // create an empty Vec
  res4: org.saddle.Vec[Double] = Empty Vec

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
  scala> vec.randn2(2, 15)          // 100 obs normally distributed with mean 2 and stdev 15

Let's take a quick look at some operations you can do on Vec instances. All the
major arithmetic operations are supported.

.. code:: bash

  scala> Vec(1,2,3) + Vec(4,5,6)
  res0: org.saddle.Vec[Int] =
  [3 x 1]
  5
  7
  9

  scala> Vec(1,2,3) * Vec(4,5,6)
  res1: org.saddle.Vec[Int] =
  [3 x 1]
   4
  10
  18

  scala> Vec(1,2,3) dot Vec(4,5,6)
  res2: Int = 32

  scala> Vec(1,2,3) outer Vec(4,5,6)
  res3: org.saddle.Mat[Int] =
  [3 x 3]
   4  5  6
   8 10 12
  12 15 18

  scala> Vec(1,2,3) ** Vec(4,5,6)
  res4: org.saddle.Vec[Int] =
  [3 x 1]
    1
   32
  729

  scala> Vec(1,2,3) << 2
  res5: org.saddle.Vec[Int] =
  [3 x 1]
   4
   8
  12

  scala> Vec(1,2,3) & 0x1
  res6: org.saddle.Vec[Int] =
  [3 x 1]
  1
  0
  1

You can also slice out data from a Vec in various ways:

.. code:: bash

  scala> val v = vec.rand(10)
  v: org.saddle.Vec[Double] =
  [10 x 1]
   0.2856
   0.0315
  -0.1982
  -0.0759
   0.8767
  -0.9438
   0.9350
   0.4167
   0.6785
   0.2523

  scala> v.at(2)                        // wrapped in Scalar, in case of NA
  res0: org.saddle.scalar.Scalar[Double] = -0.19816001024987906

  scala> v.raw(2)                       // raw access to primitive type
  res1: Double = -0.19816001024987906

  scala> v(2,4,8)
  res2: org.saddle.Vec[Double] =
  [3 x 1]
  -0.1982
   0.8767
   0.6785

  scala> v(2 -> 4)
  res3: org.saddle.Vec[Double] =
  [3 x 1]
  -0.1982
  -0.0759
   0.8767

  scala> v(* -> 3)
  res4: org.saddle.Vec[Double] =
  [4 x 1]
   0.2856
   0.0315
  -0.1982
  -0.0759

  scala> v(8 -> * )
  res5: org.saddle.Vec[Double] =
  [2 x 1]
  0.6785
  0.2523

  scala> v.slice(0,3)
  res6: org.saddle.Vec[Double] =
  [3 x 1]
   0.2856
   0.0315
  -0.1982

  scala> v.slice(0,8,2)
  res7: org.saddle.Vec[Double] =
  [4 x 1]
   0.2856
  -0.1982
   0.8767
   0.9350

There are statistical functions available:

.. code:: bash

  scala> val v = Vec(1,2,3)
  v: org.saddle.Vec[Int] =
  [3 x 1]
  1
  2
  3

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

As well as rolling statistical functions:

.. code:: bash

  scala> val v = vec.rand(10)
  v: org.saddle.Vec[Double] =
  [10 x 1]
  -0.9886
  -0.2744
  -0.9658
  -0.6449
  -0.6503
   0.9905
   0.7850
  -0.2355
  -0.1104
   0.9301

  scala> v.rollingSum(5)            // window size = 5
  res0: org.saddle.Vec[Double] =
  [6 x 1]
  -3.5240
  -2.2592
  -0.5084
  -0.0990
   0.4410
   0.3806

  scala> v.rollingMean(5)
  res1: org.saddle.Vec[Double] =
  [6 x 1]
  -0.7048
  -0.4518
  -0.1017
  -0.0198
   0.0882
   0.0761

  scala> v.rollingMedian(5)
  res2: org.saddle.Vec[Double] =
  [6 x 1]
  -0.6503
  -0.6449
  -0.6449
  -0.2355
  -0.1104
   0.7850

In fact, you can do any calculation you'd like over the rolling window:

.. code:: bash

  scala> v.rolling(5, _.stdev)      // window size = 5, take stdev of vector input
  res0: org.saddle.Vec[Double] =
  [6 x 1]
  0.5456
  0.3810
  0.3685
  0.2678
  0.6302
  0.4969


Let's take a quick look at some more advanced functionality:

.. code:: bash

  scala> val v = vec.rand(10)
  v: org.saddle.Vec[Double] =
  [10 x 1]
  -0.0137
   0.8427
  -0.0089
   0.2083
   0.9968
  -0.3560
  -0.5520
  -0.2475
  -0.5036
  -0.3474

  scala> v filter(_ > 0.5)
  res0: org.saddle.Vec[Double] =
  [2 x 1]
  0.8427
  0.9968

  scala> v where v > 0.5
  res1: org.saddle.Vec[Double] =
  [2 x 1]
  0.8427
  0.9968

  scala> v.take(v.find(_ > 0.5))
  res2: org.saddle.Vec[Double] =
  [2 x 1]
  0.8427
  0.9968

  scala> v.filterFoldLeft(_ > 0.5)(0d) { case (acc, d) => acc + d }
  res3: Double = 1.8394622034464525

  scala> v shift 1
  res4: org.saddle.Vec[Double] =
  [10 x 1]
       NA
  -0.0137
   0.8427
  -0.0089
   0.2083
   0.9968
  -0.3560
  -0.5520
  -0.2475
  -0.5036

Try out the following:

.. code:: bash

  scala> v.map(_ + 1)
  scala> v.foldLeft(0d) { case (acc, d) => acc + 1.0 / d }
  scala> v without v.find(_ < 0.5)
  scala> v findOne(_ < 0.5)
  scala> v.head(2)
  scala> v.tail(2)
  scala> v(0 -> 2).mask(Vec(true, false, true))
  scala> v concat v

Note that NA (missing values) are handled within calculations as if they were
not there. Saddle tries to prevent you from accidentally using the primitive
value whose bit pattern represents NA (the only two primitives where it is safe
to extract a raw NA value are Float and Double, whose native NA representations
are Float.NaN and Double.NaN respectively.)

.. code:: bash

  scala> val v = Vec(1, na.to[Int], 2)
  v: org.saddle.Vec[Int] =
  [3 x 1]
   1
  NA
   2

  scala> v sum
  res0: Int = 3

  scala> v median
  res1: Double = 1.5

  scala> v prod
  res2: Int = 2

  scala> v dropNA
  res3: org.saddle.Vec[Int] =
  [2 x 1]
  1
  2

  scala> v.at(1)                    // boxed to prevent shooting yourself in foot
  res4: org.saddle.scalar.Scalar[Int] = NA

  scala> v.raw(1)                   // you can do this, but be careful!
  res5: Int = -2147483648

  scala> v.fillNA(_ => 5)           // ignore argument, which is index of NA
  res6: org.saddle.Vec[Int] =
  [3 x 1]
  1
  5
  2

Scalar[T] can convert to Option[T] implicitly, so you may do everything with
it that you may do with an Option; e.g., call map or flatmap.

Finally, if you need to treat a Vec as a sequence, you may convert it to Seq,
(specifically, an IndexedSeq), by calling Vec.toSeq. Also, you may access (a
copy of) Vec as an array, by calling Vec.contents.

Series
------

A Series combines a Vec with an Index that provides a key-value mapping. The
first thing to know is a Vec[T] can implicitly convert to a Series[Int, T]. So
for instance:

.. code:: bash

  scala> val x: Series[Int, Double] = vec.rand(5)
  x: org.saddle.Series[Int,Double] = 
  [5 x 1]
  0 -> -0.7846
  1 ->  0.0297
  2 -> -0.2634
  3 -> -0.0976
  4 ->  0.1756

A Series is sort of like a Map, but the key type must have a natural ordering
(ie, an Ordering of that type within the implicit scope). However, the Series 
maintains the order in which its data was supplied.

Let's look at a few constructions:

.. code:: bash

  // we already know we can convert a Vec
  scala> Series(Vec("a", "b", "c"))  
  res3: org.saddle.Series[Int,java.lang.String] =
  [3 x 1]
  0 -> a
  1 -> b
  2 -> c

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

With construction out of the way, let's look at a few ways
we can get data out of a Series.

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

  // or key
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

  // "reindex" by supplying a new index:
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
  // the problem is, which "b" would we choose?
  scala> q.reindex("a", "b")
  java.lang.IllegalArgumentException: requirement failed: Could not reindex unambiguously
  ...

  // we can "reset" the index to integer labels
  scala> q.resetIndex

  // or to a new index altogether
  scala> q.setIndex(Index("w", "x", "y", "z"))

  // to 'slice', we need a sorted index:
  // it's inclusive by default
  scala> val s = q.sortedIx
  scala> s.sliceBy("b", "c")
  res7: org.saddle.Series[java.lang.String,Int] = 
  [3 x 1]
  b -> 3
  b -> 4
  c -> 1

  // syntactic sugar is provided:
  scala> s.sliceBy("b" -> "c")

  // slice is by location, is exclusive by default, and the index doesn't have to be
  // sorted:
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

We can of course convert to a Vec or a Seq if we need to:

.. code:: bash

  scala> q.toVec
  scala> q.toSeq

We can also group by key in order to transform or combine the groupings. For
example:

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

You can also group by another index, or by a transformation of the current index.
See the API for more info.

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

You see that the indexes have been aligned prior to operation being performed. Because
there is a missing observation in each label of a, e, and f, the summation is not done
and instead an NA value is inserted into the result.

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

Most basic math and boolean operations are supported between two Series, as well as between
a Series and a scalar value.

We mentioned joins. Let's look at a few join operations; the result is a Frame, which we will
touch on a bit later. These are similar in nature to SQL joins.

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

Sometimes you want to move the innermost row label to be a column label instead.
You can achieve this as follows:

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

Mat
---



