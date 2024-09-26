---
title: (Essential Git Commands) Push, Fetch, Merge, Stash, and Reset
author: syJoe
date: 2023-10-30 00:00:00 +0900
categories: [Git]
tags: [git]
description: This post covers essential Git commands that every developer should know. Learn how to use git push, git fetch, git merge, git stash, and git reset to manage your version control effectively. Understand the differences between merging and rebasing, and how to temporarily save changes with stash. 
---

# Git

### 1. **Git Push**

```bash
git push --set-upstream origin <branch>
git push -u origin <branch>
```
- ```-u option``` is the same effect as ```--set-upstream```

By setting the upstream branch, you specify the default remote branch

### 2. **Git Fetch**

```bash
git fetch
```
- git pull = git fetch + git merge

- Retrieve updates from a remote repo, but without changes into your current workspace


### 3. **Git Merge & Rebase**

Both ```Git merge``` and ```Git rebase``` are used to integrate changes from dev branch into main branch

But, they do it in different ways and the result is <u>a different commmit history.</u>

- ```Git Rebase``` provides a more linear project history by <u>avoiding unnecessary merge commits.</u>

- ```Git Merge```  keeps all commits while making visible when work started on different branches (simple but potentially messy)

### 4. **Git Stash**

It is a command that allows you to temporarily save changes that you have made but do not want to commmit yet.

### When?
- If you have uncommitted changes in your working directory that <u>conflict with the changes</u> you're trying to pull or merge

- Before switching branches

### A. Stashing Changes

```bash
git stash
git stash "commit message"
```

### B. Apply stash and drop

-  apply a specifiy stash & drop

```bash
git stash apply stash@{1 ~ n}
git stash drop stash@{1 ~ n}
```

### C. Apply a recent stash & drop

```bash
git stash apply
git stash drop
```

### D. Stash pop = apply + drop

```bash
git stash pop
```

### 5. **Git Reset**

It is used to undo the last commit in your repository

```bash
git reset HEAD^
```

