---
title: "Backup IPhone's Picture in Python [Part 3]"
author: syJoe
date: 2024-12-06 09:00:00 +0800
categories: [Review]
tags: [sql, python]
description: Struggling to retrieve photos from your iPhone's backup files? Learn how to efficiently extract and organize images using a powerful Python! Whether you're downgrading your iOS version or need to save specific photos, this step-by-step guide is tailored to help you handle iOS backup files
---
# iOS Backup code

### Python

```python
from PIL import Image, ExifTags
import os
import sqlite3
import shutil
from datetime import datetime
import pillow_heif

# pip insatll pillow-heif
pillow_heif.register_heif_opener()

def get_backup_dir():
    potential_dir = os.path.expanduser("~/Library/Application Support/MobileSync/Backup")

    if os.path.exists(potential_dir):
        backups = [os.path.join(potential_dir, d) for d in os.listdir(potential_dir) if os.path.isdir(os.path.join(potential_dir, d))]

        if backups:
            print("Found the following backup directories:")

            for idx, b_dir in enumerate(backups, start=1):
                print(f"{idx}: {b_dir}")
            
            # select number 1.
            choice = int(input("Select the backup directory by entering the number: ")) - 1
            return backups[choice]
    
    print("No backup directory found. Please specify manually.")
    return input("Enter the full path to the backup directory: ").strip()

def extract_photos(backup_dir, output_dir):
    db_path = os.path.join(backup_dir, "Manifest.db")
    if not os.path.exists(db_path):
        print(f"Manifest.db file not found: {db_path}")
        return

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    query = """
    SELECT fileID, relativePath
    FROM Files
    WHERE relativePath LIKE '%DCIM/%'
    """
    cursor.execute(query)

    for file_id, relative_path in cursor.fetchall():
        file_folder = file_id[:2]
        source_path = os.path.join(backup_dir, file_folder, file_id)
        file_name = os.path.basename(relative_path)
        target_path = os.path.join(output_dir, file_name)

        if os.path.exists(source_path):
            shutil.copy2(source_path, target_path)
            print(f"Photo saved: {target_path}")
        else:
            print(f"File not found: {source_path}")

    conn.close()
    print("All photo files have been successfully extracted.")

def get_month_folder(date):
    # create directory name (YYYY_MM)
    return date.strftime("%Y_%m")

def get_creation_date(file_path):
    try:
        # Open the image and extract EXIF data
        img = Image.open(file_path)
        exif_data = img._getexif()

        if exif_data:
            for tag, value in ExifTags.TAGS.items():
                if value == "DateTimeOriginal":
                    date_taken = exif_data.get(tag)
                    if date_taken:
                        return datetime.strptime(date_taken, "%Y:%m:%d %H:%M:%S")

        return datetime.fromtimestamp(os.path.getmtime(file_path))
    except Exception as e:
        print(f"Could not get creation date for {file_path}: {e}")
    return datetime.fromtimestamp(os.path.getmtime(file_path))

def organize_photos(source_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    total_photos = 0

    for root, _, files in os.walk(source_dir):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            try:
                if not file_name.lower().endswith(("jpg", "jpeg", "png", "heic", "mov", "mp4")):
                    continue

                creation_date = get_creation_date(file_path)
                folder_name = get_month_folder(creation_date)
                target_dir = os.path.join(output_dir, folder_name)

                if not os.path.exists(target_dir):
                    os.makedirs(target_dir)

                shutil.move(file_path, os.path.join(target_dir, file_name))
                print(f"Moved {file_name} to {target_dir}")
                total_photos += 1

            except Exception as e:
                print(f"Error processing {file_path}: {e}")

    print(f"Total photos organized: {total_photos}")

if __name__ == "__main__":
    # Find backup directory
    BACKUP_DIR = get_backup_dir()

    OUTPUT_DIR = os.path.expanduser("~/Desktop/results")
    print(f"Photos will be extracted to: {OUTPUT_DIR}")

    # Extract photos from backup
    print("Extracting photos from backup...")
    extract_photos(BACKUP_DIR, OUTPUT_DIR)

    FINAL_OUTPUT_DIR = os.path.expanduser("~/Desktop/results")
    print(f"Photos will be organized into: {FINAL_OUTPUT_DIR}")

    print("Organizing photos into year-month folders...")
    organize_photos(OUTPUT_DIR, FINAL_OUTPUT_DIR)
```

- `manifest.db` : Database file in iOS backups created using iTunes

    It acts as an `index` or `map` of the backup, helping to organize and locate all files stored

- `/DCIM/` path : for photos

    ```sql
    SELECT fileID, relativePath FROM Files
    WHERE relativePath LIKE '%DCIM/%';
    ```

    FileID (hashed filename) and the path for all photos stored in the `DCIM` directory

- After executed the SQL query, It is stored temporaily in the `SQLite cursor object memory` until the data is processed by Python code

- If `exif_data` is not exist, use the file's last modification timestamp `os.path.getmtime(file_path)`

    - In exif value, `DateTimeOriginal` and `DateTime` are same

    - If `DateTimeOriginal` not exist, then print `Original Date : None`
