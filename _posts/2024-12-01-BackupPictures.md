---
title: "Backup IPhone's Picture in Python [Part 1]"
author: syJoe
date: 2024-12-01 09:00:00 +0800
categories: [Review]
tags: [sql, python]
description: Struggling to retrieve photos from your iPhone's backup files? Learn how to efficiently extract and organize images using a powerful Python! Whether you're downgrading your iOS version or need to save specific photos, this step-by-step guide is tailored to help you handle iOS backup files
---

# BackUp Scripts

- After downgrading the IPhone iOS version, Backup files from higher iOS versions cannot be restored

    ![Alt text](../assets/img/blog/backup1.png)

    My iPhone 18.2v -> 18.1v (downgrade)
    
    It is the reason why, the button `Restore Backup`is disabled

- So, I made a Python Script to backup at least the important photos

### Prerequisite

- `Important!` : make sure that the backup files are already saved on your computer

    ![Alt text](../assets/img/blog/backup2.png)

    And Click it to check the backup file is existed

    ![Alt text](../assets/img/blog/backup4.png)

- Or check this path `... /Library/Application Support/MobileSync/Backup/00002110-....-165800`

    ![Alt text](../assets/img/blog/backup3.png)

    So, make sure that you already have a backup file

### Results

- `result` directory : Photos has been sorted and saved in the [Year]-[Month] format

    ![Alt text](../assets/img/blog/backupResult.png)

- Display the total number of files saved 

    ![Alt text](../assets/img/blog/backupResult2.png)

# Settings

- To access all the directory, you need to allow the permission `Full Disk Access`

    ![Alt text](../assets/img/blog/backupSettings.png)

    If you want to run this code in VSCode, then click VSCode

- I used `iBackup Viewer` to verify that my Python script successfully extracted the photos. 
    
    you can download [iBackup Viewer](https://www.imactools.com/iphonebackupviewer/) and access those features for a fee


Next step, explain it how to use this code -> CLICK(https://)
