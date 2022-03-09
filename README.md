# Spotify-Festival-Analytics
### Node.js project for interacting with Spotify api
to be used for analyzing a festival lineup of artists and helping with where to look for what aspect

* NO HELPER LIBRARIES USED, only native node.
  * Decided to go a little purist on this one with the libraries after trying out spotify's own recommended starting guide and realizing that it was using a recently deprecated    module: "request" 

Features:
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
[![video discussion](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/readmeSources/googleSheet.jpg?raw=true)](https://docs.google.com/spreadsheets/d/1mtFT8Uqi2-639NRQHsrvIffb3SRx6czsqH5JREp7WNs/edit?usp=sharing)

With 435 top tracks to sort through, this examplem shows the usefulness of using a pivot table to quickly sort top track data by danceability, constantly showcasing two particular artists that would otherwise most likely be looked over per their low follower count, actually being good choices for attendees who might want to dance. Adding the track url then allows the browser to look at the actual song and decide based on listening
[![video discussion](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/readmeSources/pivot.jpg?raw=true)](https://docs.google.com/spreadsheets/d/1mtFT8Uqi2-639NRQHsrvIffb3SRx6czsqH5JREp7WNs/edit#gid=502333132)

A chart using artist CSV data sorting them by Spotify followers
![byFollowers](https://github.com/MatthewHoque/Spotify-Festival-Analytics/blob/main/readmeSources/artistsByFollowers.jpg?raw=true)




