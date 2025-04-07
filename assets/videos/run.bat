@echo off
setlocal

:: Set output file name
set OUTPUT_FILE=video_files_list.txt

:: Clear the output file if it exists
echo MP4 Files in Directory > %OUTPUT_FILE%
echo ============================= >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

:: List each MP4 file with its size and modification date
echo Listing MP4 files...
for %%F in (*.mp4) do (
    echo Found: %%F
    echo File: %%F >> %OUTPUT_FILE%
    echo Size: %%~zF bytes >> %OUTPUT_FILE%
    echo Last Modified: %%~tF >> %OUTPUT_FILE%
    echo. >> %OUTPUT_FILE%
)

echo Done! Check %OUTPUT_FILE% for the list of MP4 files.
pause