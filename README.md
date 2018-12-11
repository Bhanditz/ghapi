# ghapi

*Node.js proxy to the GitHub API to fetch and aggregate data about an organisation's repositories*

:warning: This project is discontinued, and not being actively maintained.  

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
edit conf.json # edit at least "organisation" and "token"
```

Run:

```
npm start
> ghapi@0.1.0 start /foo/bar/ghapi
> node --use_strict --throw-deprecation app
Listening on port 3000; visit http://localhost:3000/projects
GH API, token deadbeef: 4593/5000 (92%) requests available; resets in 58′36″
acme's 713 public projects:
bar, baz, foo, […] plugh, waldo, xyzzy
▐▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░▌  xyzzy
```

Wait until data about all repos is fetched (watch the progress bar), then visit [`http://localhost:3000/projects`](http://localhost:3000/projects).
