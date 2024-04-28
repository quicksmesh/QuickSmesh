@echo off

REM USAGE: ./build-windows.bat <quicksmesh version> <go-spacemesh version>

mkdir temp

REM Set frontend build environment variables
set "QUICKSMESH_VERSION=%1"
set "SPACEMESH_VERSION=%2"

REM Build frontend
call yarn --cwd ..\frontend install
call yarn --cwd ..\frontend build --out-dir "%~dp0temp\frontend-dist" --emptyOutDir

REM Package into python executable
pyinstaller ..\backend\quicksmesh.py --add-data .\temp\frontend-dist:.\dist --icon .\icon.ico --distpath .\dist --workpath .\temp\build -y

REM Get Spacemesh version from command line arguemnt
if "%SPACEMESH_VERSION%"=="" (
    echo Error: Spacemesh version not provided
    exit /b 1
)

REM Download go-spacemesh zip
curl -o .\temp\spacemesh.zip https://storage.googleapis.com/go-spacemesh-release-builds/%SPACEMESH_VERSION%/go-spacemesh-%SPACEMESH_VERSION%-win-amd64.zip

mkdir temp\spacemesh
mkdir dist\quicksmesh\spacemesh

REM Unzip Spacmesh binaries to dist folder
tar -xf .\temp\spacemesh.zip -C .\temp\spacemesh
move /Y .\temp\spacemesh\go-spacemesh-%SPACEMESH_VERSION%-win-amd64\* .\dist\quicksmesh\spacemesh
echo %SPACEMESH_VERSION% > .\dist\quicksmesh\spacemesh\version.txt
