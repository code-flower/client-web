
#### See the app

[web.codeflower.la](https://web.codeflower.la)


#### Running the Dev Environment

`gulp` -- if you're running the api locally

`gulp --remoteApi` -- if you want to hit api.codeflower.la


#### How to Build

`gulp build [--env=production]`

This builds the app into the `dist/` folder. The production flag
will cause assets to be minified.


#### Deploying to Production

`npm run deploy`

This will build the production version of the app (w/ minified assets),
timestamp the js and css files for cache-busting purposes, and upload
the dist/ folder to firebase hosting.

You can check that the deploy succeeded by opening a browser to
web.codeflower.la, opening the Elements tab of the Chrome inspector,
and comparing the timestamps on the js and css files to the timestamp
in the output from the deploy command.
