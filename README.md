# ensemble

## what is ensemble?

ensemble is a video syncing platform. So basically a Zoom meeting, but everyone is watching the same video.

## live demo
[hosted on heroku](https://ensemble-rla.herokuapp.com)

## technologies used:

1. socket.io (used for syncing data between clients)
2. express (web server)
3. typescript (javascript, but better)
4. gulp (task runner)
5. snowpack (bundling the website)
6. nix (used to create reproducible development environments)

## build it for yourself!

1. install/enter the nix environment: `nix-shell`
2. run the start script, which will build and start the site: `yarn start`
3. the site will be running @ `localhost:3000`
