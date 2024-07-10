# Subtitles for SVT

A homemade solution for translating subtitles on Swedish Television's streaming service [SVT Play](https://www.svtplay.se/).

The project is initially made for Swedish -> English translation, but can be adapted to target other languages supported by [LibreTranslate](https://libretranslate.com/).


_Projektet är utvecklat för att göra det lättare att översätta undertexter på SVT Play. Undertexterna kan översättas till språken som stöds av  [LibreTranslate](https://libretranslate.com/)._


## Setup and Project Structure
The project has three parts:
1. Remote translations server
2. Local proxy server (optional)
3. Browser script

#### Remote translation server

You'll need to set up an instance of [LibreTranslate](https://libretranslate.com/) to handle the translation. The easiest way to do this is using Docker.
If you only plan to run translations on your own computer, you can run it locally in Docker. Otherwise, use a cloud solution to host the translation server + local proxy server.

Instructions for setting up LibreTranslate can be found on the LibreTranslate site or GitHub.


#### Local proxy server

This step is only required if running a remote/cloud based Translation service.

In the file `localServer.py`, you'll need to change the `url` variable inside the function `make_translation_request` to point to your remote server.


#### Browser script

The script to run can be found in `browserScript.js`.

Make sure the port (and host) are correctly configured inside the `translate` function, depending on your setup.

## Run
Once you've configured the above, you can get instructions for how to watch by launching `index.html`.