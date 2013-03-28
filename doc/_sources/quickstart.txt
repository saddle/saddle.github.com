Quick Start Guide
~~~~~~~~~~~~~~~~~

Let's take a quick tour through Saddle to get a sense of the feature set. There are four
major data structures to be aware of:

- Vec, a 1D vector object
- Series, a 1D indexed vector object
- Mat, a 2D matrix object
- Frame, a 2D indexed matrix object

Let's look at each one in turn through examples. If you've got the source code and an SBT
launcher, run the following (from the directory where you've got Saddle checked out):

.. code:: bash

  $ sbt console

If you've only got the Saddle jar in your classpath, the relevant import is:

.. code:: scala

  import org.saddle._

Vec
---

Let's walk through some examples in an sbt console session.

First, a few ways to create Vec instances:

.. code:: bash

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

  scala> Vec(Array(1,2,3))          // wrap an array
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

Sometimes random Vec instances are useful. There are a few ways to accomplish 
this:

.. code:: bash

  scala> vec.rand(1000)             // a thousand random doubles from -1.0 to 1.0 (excluding 0)
  res16: org.saddle.Vec[Double] =
  [1000 x 1]
  -0.3647
  -0.8776
  -0.1852
   0.4713
   0.5310
   ... 
  -0.1232
  -0.3302
   0.6612
   0.1838
  -0.5100

  scala> vec.randp(1000)            // a thousand random positive doubles
  res17: org.saddle.Vec[Double] =
  [1000 x 1]
  0.4377
  0.2627
  0.7381
  0.5137
  0.1575
   ... 
  0.6006
  0.6870
  0.9352
  0.8327
  0.9287

  scala> vec.randi(1000)            // a thousand random ints
  res18: org.saddle.Vec[Int] =
  [1000 x 1]
   1486232052
     79709566
   1053064649
    -33727419
   1788415839
   ... 
   -690368198
  -1546745697
   2110715984
   1291536312
   2041370436

  scala> vec.randpi(1000) % 10      // a thousand random positive ints, from 1 to 9
  res19: org.saddle.Vec[Int] =
  [1000 x 1]
  7
  7
  2
  7
  3
   ... 
  1
  7
  2
  6
  4

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

  scala> v.at(2)                // wrapped in Scalar, in case of NA
  res0: org.saddle.scalar.Scalar[Double] = -0.19816001024987906

  scala> v.raw(2)               // raw access to primitive type
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

  scala> v( 8 -> * )
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

Note that NA (missing values) are handled within calculations by being ignored:

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

  scala> v.raw(1)                   // be careful!
  res5: Int = -2147483648

  scala> v.fillNA(_ => 5)           // ignore argument, which is index of NA
  res6: org.saddle.Vec[Int] =
  [3 x 1]
  1
  5
  2

Scalar[T] may implicitly convert to Option[T], so you may do everything you 
expect to do with an Option, such as map or flatmap over it.

Finally, if you need to treat a Vec as a sequence, you may convert it to one
explicitly by calling Vec.toSeq. Also, to access (a copy of) Vec as an array,
you may call Vec.contents.

Series
------

A Series combines a Vec with an Index that provides a key-value mapping. Let's
take a look at some things you can do.
