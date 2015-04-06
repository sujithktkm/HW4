#####Homework 4

#####1 Git/hook setup for triggering deployment on push

As instructed, for this step I followed all the instructions given in Deployment workshop which are:
- To create a folder structure like 
* deploy/
  * blue.git/
  * blue-www/
  * green.git/
  * green-www/

I also created a post-receive hook for each of blue and green.

For example, for blue.git -

```
#!/bin/sh
GIT_WORK_TREE=C:/Users/Sujith\ Katakam/Documents/Queues/Deployment/deploy/blue-www/ git checkout -f
npm install
```

Then I set the remotes using

```
git remote add blue file:///C:/Users/Sujith\ Katakam/Documents/Queues/Deployment/deploy/blue.git
git remote add green file:///C:/Users/Sujith\ Katakam/Documents/Queues/Deployment/deploy/green.git
```


#####2 Create blue/green infrastructure

For this I created two redis instances and named one as blue at 6379 and the other as green at 6380.

![img](\screenshots\5img.jpg)
![img](\screenshots\3img.jpg)

I also made sure they are running and acitve.

As instrcuted, i gave the default TARGET = BLUE

![img](\screenshots\4img.jpg)

#####3 Demonstrate Switch

I created a new route '/switch' using app. get in the infrastructure.js file and for switching between BLUE AND GREEN I have created an if else construct which handles this case.

```
    app.get('/switch', function(req, res) {
      if (TARGET == BLUE) {
        blue.lrange("queue1", 0, -1, function(err, message) {
          green.del("queue1");
          message.foreach(function(item) {
            green.lpush("queue1",item);
          })
        })
        TARGET = GREEN;
        console.log("Successfully switched to GREEN from BLUE");
      } else {
        green.lrange("queue1", 0, -1, function(err, message) {
          blue.del("queue1");
          message.foreach(function(item) {
            blue.lpush("queue1",item);
          })
        })
        TARGET = BLUE;
        console.log("Successfully switched to BLUE from GREEN")
      }
      res.send("switch done");
    });
```
Once the switch is executed, it switches between blue redis instance and green redis instance.

![img](\screenshots\7img.jpg)
