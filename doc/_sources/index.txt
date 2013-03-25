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

Download and Install
~~~~~~~~~~~~~~~~~~~~

The current release of Saddle is available to download from the Sonatype OSS 
repository. Builds are available for Scala 2.9.2 and 2.10.0. The source and 
scaladoc packages are available as well.

If you'd like to start a new project which uses Saddle, you can use giter8_.

.. _giter8: https://github.com/n8han/giter8

If you are using SBT, simply add the following to your build file:

.. code:: scala

  resolvers ++= Seq(
    "Sonatype Snapshots" at "http://oss.sonatype.org/content/repositories/snapshots",
    "Sonatype Releases" at "http://oss.sonatype.org/content/repositories/releases"
  )

  libraryDependencies ++= Seq(
    "org.scala-saddle" %% "saddle" % "1.0.0"
  )


If you are using Maven, use the following (e.g. for the Scala 2.9.2 build):

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
    <version>1.0.0</version>
  </dependency>

Build Instructions
~~~~~~~~~~~~~~~~~~

Saddle uses SBT - the deceptively named Simple Build Tool, which is anything
but simple (yet still awesome). Highly recommended is `sbt: The Rebel Cut`_
bash script, which you may install and make executable as follows (be sure to
choose your own target directory; here we show ~/bin):

.. code:: bash

  curl https://raw.github.com/paulp/sbt-extras/master/sbt > ~/bin/sbt
  chmod +x ~/bin/sbt

.. _`sbt: The Rebel Cut`: https://github.com/paulp/sbt-extras

Next, clone the git repository_, build Saddle, and start hacking!

.. code:: bash

  ~ $ git clone git@github.com:saddle/saddle.git
  ~ $ cd saddle
  ~/saddle $ ~/bin/sbt
  ... loading ...

  [saddle]$ compile
  ... compilation ...

  [saddle]$ test
  ... running tests ...

  [saddle]$ console
  ... loading some modules ...

  scala>
  ... play time! ...

.. _repository: https://github.com/saddle/saddle

Next Steps
~~~~~~~~~~

.. toctree::

   quickstart
   guide
