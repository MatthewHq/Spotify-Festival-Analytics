# Spotify-Festival-Analytics
### Node.js project for using Spotify api
to be used for analyzing a festival lineup of artists and helping with where to look for what aspect

### [Make sure to scroll to "Module Walkthrough" for more program specifics](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/README.md#module-walkthrough)
## Features:
  * In depth async / await implementation for both file writes and api calls (http reqs)  
  * CSV Export for Artists and for Top Tracks, JSON Import of artist list (by name)
  * Automatic artist search verification, optimization and finally manual correction per artist search if needed
  * Query Chaching
    * Retains all query data to avoid making additional calls when unecessary
  * Use of Spotify "Bulk" api calls
    * Collects eligable items in batches of 100 (spotify's limit per call)
  * Token Expiration Efficiency
    * Will not make additional token requests until token expires  

Note the example festival used here is "CRSSD FEST 2022"

Click on image below to go to spreadsheet below containing exported CSV data results
[![image](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/readmeSources/googleSheet.jpg?raw=true)](https://docs.google.com/spreadsheets/d/1mtFT8Uqi2-639NRQHsrvIffb3SRx6czsqH5JREp7WNs/edit?usp=sharing)

With 435 top tracks to sort through, this examplem shows the usefulness of using a pivot table to quickly sort top track data by danceability, constantly showcasing two particular artists that would otherwise most likely be looked over per their low follower count, actually being good choices for attendees who might want to dance. Adding the track url then allows the browser to look at the actual song and decide based on listening
[![video discussion](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/readmeSources/pivot.jpg?raw=true)](https://docs.google.com/spreadsheets/d/1mtFT8Uqi2-639NRQHsrvIffb3SRx6czsqH5JREp7WNs/edit#gid=502333132)

A chart using artist CSV data sorting them by Spotify followers
![byFollowers](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/readmeSources/artistsByFollowers.jpg?raw=true)



## Module Walkthrough
[App.js](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/app.js) holds the main function to be executed with each function call in the correct order. All implemented with promises to ensure correct order in the midst of the async chaos

 ```javascript
 await spotifyRequests.bulkArtistCache(festivalTitle) 
 ```
located in [spotifyRequests.js](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/spotifyRequests.js) will call upon spotify API to search every entry in [artists.json](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/CRSSD2022/mainDB/artists.json). All of this search query data is collected in the [/festivalTitle/searchQueryBank](https://github.com/MatthewHoque/Spotify-Festival-Analytics/tree/main/CRSSD2022/searchQueryBank) dir as individual .json files per query.

As one might guess, everything that makes a call to spotify is within the [spotifyRequests.js](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/spotifyRequests.js)

As opposed to the other module [dbManage.js](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/dbManage.js) which is responsible for processing any data collected without triggering any http calls. Following into the next call...

 ```javascript
 await dbManage.artistCollect(festivalTitle)
 ```
 
 this collects all the correct artists and double checks artist name with the initial [artists.json](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/CRSSD2022/mainDB/artists.json) and reports to the terminal any inconsistencies and optimizations in finding and picking of the artist. All artists are collected into [/festivalTitle/artistDB](https://github.com/MatthewHoque/Spotify-Festival-Analytics/tree/main/CRSSD2022/artistDB) dir for further processing. Some artists do not pass any further if they do not meet a similarity score by name to the original input, these artists can be added in the following step along with others that might need to be corrected.
 
  ```javascript
 await spotifyRequests.overWriteArtists(festivalTitle)
 ```
 
 allows for some corrections on the user end by specifying the correct artistId within the [/festivalTitle/mainDB/artistsOverwrite.json](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/CRSSD2022/mainDB/artistsOverwrite.json) file. Any artists to be overwritten will trigger an API call to fetch the correct data. There is room for improvement here by checking if the id is already withing the initially stored query to avoid one additionmal api call, but I spent a little too much time refining my understanding of async properties in this project to get to it
 
  ```javascript
 await spotifyRequests.bulkArtistTopTrack(festivalTitle)
 ```
 
 Once all artists are corrected an api call per artists can be made to collect their most popular tracks, this track data is saved under [/festivalTitle/topTrackDataDB](https://github.com/MatthewHoque/Spotify-Festival-Analytics/tree/main/CRSSD2022/topTracksDB) ready to be processed in the next step
 
   ```javascript
 await spotifyRequests.getAllTrackAudioFeatures(festivalTitle)
 ```
 
track audio feature data does not come with base track data, however unlike the other api calls we have seen so far, this one allows for bulk calls of 100 tracks per call. Seeing as in this example case we have 435 tracks throughout our database, only 5 api calls are needed to gather this data, after a little bit of parsing and math games of course
 
 ```javascript
await dbManage.consolidateTopTracks(festivalTitle)
await dbManage.consolidateArtists(festivalTitle)
 ```
 These two parallel sets gather all the previous database information into a singular json file of artists: [allArtistsData.json](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/CRSSD2022/mainDB/allArtistsData.json), a singularr json file of tracks: [topTracksData.json](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/CRSSD2022/mainDB/topTracksData.json) 
 
 
  ```javascript
await dbManage.allArtistsToCSVcustom(festivalTitle)
await dbManage.allTracksToCSVcustom(festivalTitle)
 ```
 
 These then jump into that data to extract only specific points of interest that can be changed at any time by changing their object properties.
 We finally end up with our clean data ready to be placed in a pivot table or chart!
 
 [allArtists.CSV](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/CRSSD2022/mainDB/allArtists.CSV)
 
 [allTopTracks.CSV](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/CRSSD2022/mainDB/allTopTracks.CSV)

 
 * NO HELPER LIBRARIES USED, only native node.
  * Decided to go a little purist on this one with the libraries after trying out spotify's own recommended starting guide and realizing that it was using a recently deprecated    module: "request" 
  * REVISION: Actually started implementing user auth with 'express' after coming back to potentially add some features. The original non user-specific code is still true to only native node
  * Reason for using express is to listen in on a spotify authorization callback
 




