---
title: "Backup IPhone's Picture in Python [Part 2]"
author: syJoe
date: 2024-12-03 09:00:00 +0800
categories: [Review]
tags: [sql, python]
description: Struggling to retrieve photos from your iPhone's backup files? Learn how to efficiently extract and organize images using a powerful Python! Whether you're downgrading your iOS version or need to save specific photos, this step-by-step guide is tailored to help you handle iOS backup files
---
# Steps

### 1. Git Clone

- [iOS Backup](https://github.com/syjoe02/iOS-Backcup) git repository

    ```cli
    git clone https://github.com/syjoe02/iOS-Backcup.git
    ```

### 2. Install Packages

```cli
pip install pillow-heif pillow
```

### 3. Run

```cli
python3 backup_script.py
```

### 4. Result

- Go to the Desktop (~/Desktop)

- Check `results` Directory :\)

# However, It is not a Pefect

- At least, I can backup all the photos without the photo dates

- The date of photos will changes to the backup date despite being taken earlier

    - Loss of EXIF Metadata

    - During the backup or copying process, the modification date may be overwritten with the backup date
