# mock-sonos-http-api
A mock for (parts of) the api op [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api). 

_**Current state**: work in progress. Grouping not yet implemented._

For a project I'm building, I am using the marvelous API [node-sonos-http-api]. 
This API provides me with a clean bridge to communicate with various SONOS
devices, but I simply do not have enough speakers available to be able to test
all my use-cases.

That led me to implement a _mock_ version of the API's needed for my specific 
application. Currently I only need to list all the zones, group them and set the
volumes. 

Small requirements, leading to a small and hopefully simple app. Feel free to
contribute, if you think this might be useful for your own project.

[node-sonos-http-api]: https://github.com/jishi/node-sonos-http-api
