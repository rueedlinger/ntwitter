ntwitter
========

This is an example node.js project to fetch twitter streams. This project can be used to fetch twitter streams and
send them to a tcp server like netcat in Apache Flume.

To play around with this example you need a system with the following installed components
+ [Node.js](http://nodejs.org/) which uses twit node module
+ [Apache Hadoop](https://hadoop.apache.org/)
+ [Apache Flume](http://flume.apache.org/)
+ [Apache Hive](http://hive.apache.org/)


This node.js project consist of the following files:

+ conf/index.js - adapt the configuration to your need. (eg. twitter credentials, which keywords you want to collect, etc. )
+ net - mock netcat socket server and tcp client which sends fetched twitter stream (JSON) to a specify tcp Apache Flume agent server. 
+ util - utilities which formats tweets to a readable format.
+ stream.js - listen to the public twitter stream for specific keywords.
+ fetch.js - fetch twitter streams from different twitter accounts.


### Analyse twitter tweets with Apache Hive and Apache Flume

The node.js client collects tweets and send them as JSON events to a Flume agent. The flume agent receives
the json events over a TCP server. The collected tweets are then send to HDFS and split up by year, month and day. 

	JSON tweets (node client) --> source (TCP server) --> HDFS sink /tweets/${year}/${month}/${day}

The following Apache Flume config starts a netcat server which can be used to collect tweets from
the node.js twitter client.


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
	a1.sinks.k1.hdfs.rollSize = 10485760
	a1.sinks.k1.hdfs.hdfs.batchSize = 10
	a1.sinks.k1.hdfs.rollCount = 0
	a1.sinks.k1.hdfs.idleTimeout = 30

	# Bind the source and sink to the channel
	a1.sources.r1.channels = c1
	a1.sinks.k1.channel = c1
	
After that start flume

	$ flume-ng agent --conf conf -f agent.conf --name a1

So now you can start the node.js example scripts to collect tweets and send them to the Apache Flume agent

	# for streams
	node stream.js
	
	# to catch the last tweets from specific users
	node fetch.js
	
fetch.js and stream.js create the following JSON event which can be processed by flume.

	{
		"headers": {"timestamp":1391551559357},
		"id":"12345678",
		"createdYear":2013,
		"createdMonth":2,
		"createdDay":1,
		"userName":"SuperBowl",
		"userId":"19425947",
		"text":"E.J. Manuel: I would love to play for @Eagles coach Chip Kelly",
		"lang":"en",
		"rcount":66,
		"followers":155282,
		"source":"twitter"
	}
	
All tweets are then stored in the hdfs directory /tweets

	hadoop fs -ls /tweets
	
A  better way is to create a hive table. This way we can use Apache Hive to analyse the tweets.
You need the [hive-json-serde](https://code.google.com/p/hive-json-serde/) to handle JSON
with Apache Hive.

	CREATE EXTERNAL TABLE IF NOT EXISTS tweets_2014_02_05 (
			id string, 
			createdYear int, 
			createdMonth int, 
			createdDay int, 
			userName string, 
			userId string, 
			text string, 
			lang string, 
			rcount int, 
			followers int, 
			source string) 
		ROW FORMAT SERDE 'org.apache.hadoop.hive.contrib.serde2.JsonSerde' 
		LOCATION '/tweets/2014/02/05/';
		
Now we can query our data with Apache Hive.

	select * from tweets_2014_02_05;
	
More comfortable and better for the performance is to create a Hive partition by year, month and day.

	CREATE EXTERNAL TABLE IF NOT EXISTS tweets (
			id string, 
			createdYear int, 
			createdMonth int, 
			createdDay int, 
			userName string, 
			userId string, 
			text string, 
			lang string, 
			rcount int, 
			followers int, 
			source string) 
		PARTITIONED BY (year int, month int, day int) 
		ROW FORMAT SERDE 'org.apache.hadoop.hive.contrib.serde2.JsonSerde';

Then add a external partition for all stored tweets.
		
	ALTER TABLE tweets 
		ADD PARTITION(year = 2014, month = 2, day = 5) 
		LOCATION '/tweets/2014/02/05/';
	
All tweets can then be displayed with the following query.

	select * from tweets;
	
	
We can analyse the top 10 words follow the phrase 'football is ___'
	
	ADD JAR /opt/hive-0.12.0/lib/hive-json-serde-0.2.jar;
	SELECT explode(context_ngrams(sentences(lower(text)), array('football', 'is', null), 10)) from tweets;
	

Or the top 10 ngrams (here bigrams -> 2)

	ADD JAR /opt/hive-0.12.0/lib/hive-json-serde-0.2.jar;
	SELECT explode(ngrams(sentences(lower(text)), 2, 10)) AS x FROM tweets;
	
	
Compute histogram data with 10 "bars" for number of followers.

	ADD JAR /opt/hive-0.12.0/lib/hive-json-serde-0.2.jar;
	SELECT explode(histogram_numeric(followers, 10)) FROM tweets;