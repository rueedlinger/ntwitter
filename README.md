ntwitter
========

Example node.js project how to fetch twitter streams. This project can be used to fecth twitter streams and
send them to a tcp server like netcat in apache flume.

+ conf/index.js - adapt the configuration to your need.
+ net - socket client which sends fetched twitter stream to a specify tcp server. 
+ util - utilities which formats tweets to readable format.
+ stream.js - listen to the public twitter stream for specific keys
+ fetch.js - fetch twitter streams from different twitter accounts.



The following flume config starts a netcat server which can be used to collect tweets from
this node.js example.


	# agent.conf: A single-node Flume configuration
	
	# Name the components on this agent
	a1.sources = r1
	a1.sinks = k1
	a1.channels = c1

	# Describe/configure the source
	a1.sources.r1.type = netcat
	a1.sources.r1.bind = localhost
	a1.sources.r1.port = 8124
	a1.sources.r1.interceptors = a
	a1.sources.r1.interceptors.a.type = org.apache.flume.interceptor.TimestampInterceptor$Builder

	# Use a channel which buffers events in memory
	a1.channels.c1.type = memory
	a1.channels.c1.capacity = 10000
	a1.channels.c1.transactionCapacity = 100

	a1.sinks.k1.type = hdfs
	a1.sinks.k1.channel = c1
	a1.sinks.k1.hdfs.path = /tweets/%Y/%m/%d
	a1.sinks.k1.hdfs.filePrefix = tweets
	a1.sinks.k1.hdfs.useLocalTimeStamp = false
	a1.sinks.k1.hdfs.fileType = DataStream
	a1.sinks.k1.hdfs.writeFormat = Text
	a1.sinks.k1.hdfs.rollInterval = 0
	a1.sinks.k1.hdfs.rollSize = 0
	a1.sinks.k1.hdfs.hdfs.batchSize = 10
	a1.sinks.k1.hdfs.rollCount = 100

	# Bind the source and sink to the channel
	a1.sources.r1.channels = c1
	a1.sinks.k1.channel = c1
	
After that start flume

	$ flume-ng agent --conf conf -f agent.conf --name a1

So now you can start the node.js example scripts to collect tweets and send them to or flume agent

	# for streams
	node stream.js
	
	# to catch the last tweets from specific users
	node fetch.js