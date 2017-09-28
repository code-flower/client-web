
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

`gulp deploy --env production`

This will build the production version of the app (w/ minified assets),
timestamp the js and css files for cache-busting purposes, and upload
the dist/ folder to the s3 bucket specified in the config.

You can check that the deploy succeeded by opening a browser to 
web.codeflower.la, opening the Elements tab of the Chrome inspector,
and comparing the timestamps on the js and css files to the timestamp
in the output form the `gulp deploy` command. 

Note that the files are ultimately served through a Cloudfront distribution
in front of the s3 bucket. That distro serves the letsencrypt SSL
certificate, which needs to be rotated every 90 days. The certificate itself
is in the Certificate Manager, N. Virginia region. Rotating the cert involves
creating a new cert in the Certificate Manager, and then updating the 
Cloudfront distro to point to the new cert.
