ntwitter
========

Example node.js project how to fetch twitter streams. This project can be used to fecth twitter streams and
send them to a tcp server like netcat in apache flume.

+ conf/index.js - adapt the configuration to your need.
+ net - socket client which sends fetched twitter stream to a specify tcp server. 
+ util - utilities which formats tweets to readable format.
+ stream.js - listen to the public twitter stream for specific keys
+ fetch.js - fetch twitter streams from different twitter accounts.
