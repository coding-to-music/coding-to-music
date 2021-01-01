
# Instructions.md

# Instructions - How to Create a Self-Updating README.md for Your GitHub Profile  

## Next Steps and Task List
```java
// Have time generated
// Bring in Weather
// Bring in phase of moon
// Bring in Tide
// Bring in tweets
// Bring in Instagram
// Bring in LinkedIn Posts
// Bring in latest posts scraped somewhere
// Bring in virus counts
```

- [Instructions.md](#instructionsmd)
- [Instructions - How to Create a Self-Updating README.md for Your GitHub Profile](#instructions---how-to-create-a-self-updating-readmemd-for-your-github-profile)
  - [Next Steps and Task List](#next-steps-and-task-list)
- [Original Idea and description is in this Medium article by THomas Guibert](#original-idea-and-description-is-in-this-medium-article-by-thomas-guibert)
  - [go to your project directory](#go-to-your-project-directory)
  - [code main.mustache](#code-mainmustache)
  - [code index.js](#code-indexjs)
    - [With that, you can now run](#with-that-you-can-now-run)
    - [Awesome! Commit and push everything.](#awesome-commit-and-push-everything)
    - [Now, you can see that your README.md displayed on your Profile page has been updated.](#now-you-can-see-that-your-readmemd-displayed-on-your-profile-page-has-been-updated)
  - [Generate your README automatically with Github Actions:](#generate-your-readme-automatically-with-github-actions)
    - [With Actions, you can create workflows to automate tasks.](#with-actions-you-can-create-workflows-to-automate-tasks)
  - [Summary](#summary)
    - [So far we have done:](#so-far-we-have-done)
- [Count visitors for your README.md, Issues, PRs in GitHub](#count-visitors-for-your-readmemd-issues-prs-in-github)
- [run and see what else is missing](#run-and-see-what-else-is-missing)
- [Count visitors for your README.md, Issues, PRs in GitHub](#count-visitors-for-your-readmemd-issues-prs-in-github-1)

# Original Idea and description is in this Medium article by THomas Guibert

From this medium article by Thomas Guibert, French programmer living in Stockholm  
(How to Create a Self-Updating README.md for Your GitHub Profile)[https://medium.com/swlh/how-to-create-a-self-updating-readme-md-for-your-github-profile-f8b05744ca91]  

(Link to his working repo)[https://github.com/thmsgbrt/thmsgbrt]

GitHub recently released a feature that allows users to create a profile-level `README.md` file, that is displayed on your profile page, above repositories.

- Create a new repo with the same name as your github name
- Mine is coding-to-music/coding-to-music  
- If you check the box to have a Readme supplied you can see it in your profile immediately  

## go to your project directory
```java
git clone the repo
cd coding-to-music
npm init
npm i mustache
```

## code main.mustache  
```java
// main.mustache 
My name is {{name}} and today is {{date}}.
```

## code index.js
```javascript
// index.js
const Mustache = require('mustache');
const fs = require('fs');
const MUSTACHE_MAIN_DIR = './main.mustache';
/**
  * DATA is the object that contains all
  * the data to be provided to Mustache
  * Notice the "name" and "date" property.
*/
let DATA = {
  name: 'Thomas',
  date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Stockholm',
  }),
};
/**
  * A - We open 'main.mustache'
  * B - We ask Mustache to render our file with the data
  * C - We create a README.md file with the generated output
  */
function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) =>  {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}
generateReadMe();
```

This was the version I ended up putting in my own  
```java
let DATA = {
  name: 'Tom',
  refresh_date: new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'America/New_York',
  }),
};
```

### With that, you can now run  
```java
node index.js 
```
in your terminal and it should generate a brand new `README.md` file in the same directory:  
```java
// Generated content in README.md
My name is Thomas and today is Wednesday, December 10.
```

### Awesome! Commit and push everything. 
### Now, you can see that your README.md displayed on your Profile page has been updated. 

<p align="center">...</p>

## Generate your README automatically with Github Actions:  

That’s great but you don’t want to be having to commit a new version of your `README.md` every day. Let’s automate this!  

We are going to use GitHub Actions for that. If you have never used it before, this is going to be a good first project.  

### With Actions, you can create workflows to automate tasks. 
Actions live in the same place as the rest of the code, in a special directory: ./.github/worflows .
```java
$ mkdir .github && cd .github && mkdir workflows
```   

In this ./workflows folder, create a ./main.yaml file that will hold our Action.
```java
$ cd ./workflows && touch main.yaml
```
Fill it with this content:

```yaml
name: README build

on:
  push:
    branches:
      - master
  schedule:
    - cron: '0 */6 * * *'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout current repository to Master branch
        uses: actions/checkout@v1
      - name: Setup NodeJs 13.x
        uses: actions/setup-node@v1
        with:
          node-version: '13.x'
      - name: Cache dependencies and build outputs to improve workflow execution time.
        uses: actions/cache@v1
        with:
          path: node_modules
          key: ${{ runner.os }}-js-${{ hashFiles('package-lock.json') }}
      - name: Install dependencies
        run: npm install
      - name: Generate README file
        run: node index.js
      - name: Commit and Push new README.md to the repository
        uses: mikeal/publish-to-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This Action has one Job, `build` , that runs on the specified machine, `ubuntu-latest` .  
Lines 3 to 8 define when is triggered this action:
```java
- On every push to the Master branch,
- Or on a specified schedule, here 6 hours.
```
- The scheduler allows you to trigger a workflow at a scheduled time. 
- The cron syntax has five fields separated by a space, and each field represents a unit of time.
- If you want to know more about it and set your own schedule, read the Scheduled Events documentation.
- When triggered, this job will execute the steps one after the other.
- For the rest of the file, read what I wrote next to `name`: to understand what is happening for each step.

Here is what was performed:
```java
connorstom@penguin:~/aprojects/coding-to-music$ git pull origin master
From github.com:coding-to-music/coding-to-music
 * branch            master     -> FETCH_HEAD
Already up to date!
Merge made by the 'recursive' strategy.
connorstom@penguin:~/aprojects/coding-to-music$ git push
fatal: The current branch master has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin master

connorstom@penguin:~/aprojects/coding-to-music$ git push --set-upstream origin master
Enumerating objects: 18, done.
Counting objects: 100% (18/18), done.
Delta compression using up to 2 threads
Compressing objects: 100% (10/10), done.
Writing objects: 100% (13/13), 6.90 KiB | 883.00 KiB/s, done.
Total 13 (delta 3), reused 0 (delta 0)
remote: Resolving deltas: 100% (3/3), completed with 2 local objects.
To github.com:coding-to-music/coding-to-music.git
   c1986ec..4caf76e  master -> master
Branch 'master' set up to track remote branch 'master' from 'origin'.
```
## Summary
### So far we have done:
- index.js
- main.mustache
- puppeteer.service.js
- main.yaml 

# Count visitors for your README.md, Issues, PRs in GitHub   
```java
# you can see I needed to npm install dotenv
connorstom@penguin:~/aprojects/coding-to-music$ node index.js
node:internal/modules/cjs/loader:922
  throw err;
  ^

Error: Cannot find module 'dotenv'
Require stack:
- /home/connorstom/aprojects/coding-to-music/index.js
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:919:15)
    at Function.Module._load (node:internal/modules/cjs/loader:763:27)
    at Module.require (node:internal/modules/cjs/loader:991:19)
    at require (node:internal/modules/cjs/helpers:92:18)
    at Object.<anonymous> (/home/connorstom/aprojects/coding-to-music/index.js:2:1)
    at Module._compile (node:internal/modules/cjs/loader:1102:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1131:10)
    at Module.load (node:internal/modules/cjs/loader:967:32)
    at Function.Module._load (node:internal/modules/cjs/loader:807:14)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:76:12) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ '/home/connorstom/aprojects/coding-to-music/index.js' ]
}
connorstom@penguin:~/aprojects/coding-to-music$ npm install dotenv

added 55 packages, and audited 56 packages in 43s

8 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
connorstom@penguin:~/aprojects/coding-to-music$ npm install node-fetch

up to date, audited 56 packages in 2s

8 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
connorstom@penguin:~/aprojects/coding-to-music$ npm install puppeteer

up to date, audited 56 packages in 2s

8 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

# run and see what else is missing
```java
connorstom@penguin:~/aprojects/coding-to-music$ node index.js
/home/connorstom/aprojects/coding-to-music/index.js:28
      DATA.city_temperature = Math.round(r.main.temp);
                                                ^

TypeError: Cannot read property 'temp' of undefined
    at /home/connorstom/aprojects/coding-to-music/index.js:28:49
    at processTicksAndRejections (node:internal/process/task_queues:93:5)
    at async setWeatherInformation (/home/connorstom/aprojects/coding-to-music/index.js:23:3)
    at async action (/home/connorstom/aprojects/coding-to-music/index.js:63:3)
```


# Count visitors for your README.md, Issues, PRs in GitHub   
(Count visitors for your README.md, Issues, PRs in GitHub)[https://visitor-badge.glitch.me/#docs]  

![visitors](https://visitor-badge.glitch.me/badge?page_id=page.id)

In which, the url parameter page_id is REQUIRED, please use the unique string to best represent your page.

I recommend you to follow page_id rules below:
1. For `README.md` file, use ${your.username}.${your.repo.id}, https://visitor-badge.glitch.me/badge?page_id=jwenjian.visitor-badge for example.
2. For Issue body, use ${your.username}.${your.repo.id}.issue.${issue.id}, https://visitor-badge.glitch.me/badge?page_id=jwenjian.visitor-badge.issue.1 for example.  

or any other markdown content, please give an unique string to distinguish

Mine:
```java
const your.username  
const your.repo.id
![visitors](https://visitor-badge.glitch.me/badge?page_id=page.id)
![visitors](https://visitor-badge.glitch.me/badge?${your.username}.${your.repo.id})
![visitors](https://visitor-badge.glitch.me/badge?page_id=coding-to-music.coding-to-music)

```