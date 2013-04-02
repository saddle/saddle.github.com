.. Saddle documentation master file, created by
   sphinx-quickstart on Fri Mar  8 20:33:37 2013.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

==========================
Welcome to Saddle Docs
==========================

Introduction
~~~~~~~~~~~~

Saddle is a data manipulation library for Scala_ that provides array-backed,
indexed, one- and two-dimensional data structures that are judiciously
specialized on JVM primitives to avoid the overhead of boxing and unboxing.

Saddle offers vectorized numerical calculations, automatic alignment of data
along indices, robustness to missing (N/A) values, and facilities for I/O.

Saddle draws inspiration from several sources, among them the R_ programming
language & statistical environment, the numpy_ and pandas_ Python_ libraries,
and the Scala collections library.

.. _R: http://cran.us.r-project.org/
.. _numpy: http://www.numpy.org/
.. _pandas: http://pandas.pydata.org/
.. _Python: http://www.python.org/
.. _Scala: http://www.scala-lang.org/

License
~~~~~~~

Saddle is licensed under the `Apache License, Version 2.0
<http://www.apache.org/licenses/LICENSE-2.0.html>`_

Copyright
~~~~~~~~~

Copyright (c) 2013 Novus Partners, Inc.

Copyright (c) 2013 The Saddle Development Team

All rights reserved.

Saddle is subject to a shared copyright. Each contributor retains copyright to
his or her contributions to Saddle, and is free to annotate these contributions 
via code repository commit messages. The copyright to the entirety of the code 
base is held by the Saddle Development Team, which is comprised of those developers
who have made such contributions.

Current Version
~~~~~~~~~~~~~~~

The current release of Saddle is available to download from the Sonatype OSS
repository. Builds are available for Scala 2.9.2 and 2.10.0. The source and
scaladoc packages are available as well.

The latest release of Saddle is 1.0.1.

Download and Install
~~~~~~~~~~~~~~~~~~~~

Saddle is built using SBT - the deceptively named Simple Build Tool. It is anything 
but simple (yet still awesome!). Highly recommended is `sbt: The Rebel Cut`_ bash
script, which you can install and make executable, for example, with:

.. code:: bash

  $ curl https://raw.github.com/paulp/sbt-extras/master/sbt > ~/bin/sbt
  $ chmod +x ~/bin/sbt

.. _`sbt: The Rebel Cut`: https://github.com/paulp/sbt-extras

If you simply want to play with Saddle, the easiest thing to do is probably build
from source: see `Build Instructions`_.

If you want to start a new SBT project from scratch that uses Saddle, probably 
the easiest way is to use giter8_. Once you've got g8 installed, run

.. code:: bash

  $ g8 saddle/saddle.g8

follow the prompts, go to your new project directory, and run:

.. code:: bash

  $ sbt console

.. _giter8: https://github.com/n8han/giter8

If you have an existing SBT project, make sure your resolvers include Sonatype, and
your dependencies include Saddle:

.. code:: scala

  resolvers ++= Seq(
    "Sonatype Snapshots" at "http://oss.sonatype.org/content/repositories/snapshots",
    "Sonatype Releases" at "http://oss.sonatype.org/content/repositories/releases"
  )

  libraryDependencies ++= Seq(
    "org.scala-saddle" %% "saddle" % "1.0.1"
  )


If you are using Maven, this might help (e.g. for the Scala 2.9.2 build):

.. code:: html

  <repositories>
    <repository>
      <id>oss.sonatype.org</id>
      <name>releases</name>
      <url>http://oss.sonatype.org/content/repositories/releases</url>
    </repository>
    <repository>
      <id>oss.sonatype.org</id>
      <name>snapshots</name>
      <url>http://oss.sonatype.org/content/repositories/snapshots</url>
    </repository>
  </repositories>

  <dependency>
    <groupId>org.scala-saddle</groupId>
    <artifactId>saddle_2.9.2</artifactId>
    <version>1.0.1</version>
  </dependency>

Build Instructions
~~~~~~~~~~~~~~~~~~

To build from source, simply clone the git repository_, build Saddle as shown
below, and start hacking!

.. code:: bash

  ~ $ git clone git@github.com:saddle/saddle.git
  ~ $ cd saddle
  ~/saddle $ sbt
  ... loading ...

  [saddle]$ compile
  ... compilation ...

  [saddle]$ test
  ... running tests ...

  [saddle]$ console
  ... loading some modules ...

  scala> vec.rand(100)
  ...

.. _repository: https://github.com/saddle/saddle

Dependencies
~~~~~~~~~~~~

Saddle relies in whole or in part on some great open source software. It is
well worth the time to explore these libraries.

- `Joda Time`_
- `EJML`_
- `Apache Commons Math`_
- `FastUtil`_
- `DsiUtils`_
- `HDF5`_

.. _`Joda Time`: http://joda-time.sourceforge.net/
.. _`EJML`: http://code.google.com/p/efficient-java-matrix-library/
.. _`Apache Commons Math`: http://commons.apache.org/proper/commons-math/
.. _`FastUtil`: http://fastutil.di.unimi.it/
.. _`DsiUtils`: http://dsiutils.di.unimi.it/
.. _`HDF5`: http://www.hdfgroup.org/HDF5/

Next Steps
~~~~~~~~~~

.. toctree::

   quickstart
   guide
