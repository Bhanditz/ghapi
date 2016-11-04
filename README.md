# ghapi

A proxy to use the GitHub API auth and store data about an organisation's repositories.

## Howto

Clone and install dependencies:

```bash
git clone https://github.com/w3c/ghapi.git
cd ghapi/
npm install
```

Set up (you'll need a [GitHub access token](https://github.com/settings/tokens)):

```bash
cp conf.json.example conf.json
edit conf.json    # edit appropriately
```

Run:

```bash
npm start
> ghapi@0.1.0 start /foo/bar/ghapi
> node --use_strict --throw-deprecation app
Listening on port 3000; visit http://localhost:3000/projects
GH API, token deadbeefdeadbeef: 4593/5000 (92%) requests available; resets in 58′36″
w3c's 409 public projects:
2dcontext, a11ySlackers, accelerometer ⋯⋯⋯⋯ xinclude, xml-entities, XMLHttpRequest
▐▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░▌  XMLHttpRequest
```

Wait until data about all repos is fetched (watch the progress bar), then visit [`http://localhost:3000/projects`](http://localhost:3000/projects).
