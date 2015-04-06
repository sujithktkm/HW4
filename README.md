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

'''
#!/bin/sh
GIT_WORK_TREE=C:/Users/Sujith\ Katakam/Documents/Queues/Deployment/deploy/blue-www/ git checkout -f
npm install
'''

Then I set the remotes using

'''
git remote add blue file:///C:/Users/Sujith\ Katakam/Documents/Queues/Deployment/deploy/blue.git
git remote add green file:///C:/Users/Sujith\ Katakam/Documents/Queues/Deployment/deploy/green.git
'''

