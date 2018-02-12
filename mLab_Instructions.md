# #bootcamp/mLab#
## Creating a Mongo DB on Heroku and connecting to it

1. Create your Github repo (e.g., mongo-news-shulme801) on github.com.
2. Clone your repo to your laptop’s file  system in the usual way. 
3. Use your browser to log in to Heroku.
4. Click on “new” — on the right hand side of main screen.
5. Click on the sub-choice “Create new app”.
![](mLab_Instructions/Screenshot%202018-02-10%2008.49.png)
4. On the “create app” screen give it a name and click “Create app”.
![](mLab_Instructions/Screenshot%202018-02-10%2008.48.53.png)
5. Now, open up a terminal window, and go to the folder your cloning created (step 2).
6. From your command line, log in to heroku and run the heroku addons command with the “-a” flag (the part the instructions left out). For example, ```heroku addons:create mongolab -a mongo-news-shulme801
![](mLab_Instructions/Screenshot%202018-02-10%2008.58.00.png)
7. Step 6 will have created an instance of the free mLabs mongo and attached it to your app.  It also inserted the database name into MONGODB_URI. Now, you can use MONGODBURI in your code.
8. If you now view your app on heroku.com, you will see something like this:

![](mLab_Instructions/Screenshot%202018-02-10%2009.00.42.png)
9. To retrieve MONGODB_URI from the command line, use ```$ heroku config:get -a mongo-news-shulme801 MONGODB_URI```