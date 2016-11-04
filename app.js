/**
 * Main runnable file.
 */

'use strict';

// Native packages:
const http = require('http');

// External packages:
const CLIProgressBar = require('cli-progress-bar'),
    express = require('express'),
    octonode = require('octonode');

// Settings:
const conf = require('./conf');

const app = express(),
    server = http.createServer(app),
    client = octonode.client(conf.token),
    org = client.org(conf.organisation),
    projectsList = [],
    projectsData = {};

var projectsDone = 0,
    progressBar;

/**
 * Retrieve list of all the organisation's projects (or a page of them).
 *
 * Side-effect: mutates <code>projectsList</code>.
 *
 * @param {Function} cb - callback (expects no parameters).
 */

function fetchListOfProjects(cb, pageNo=1) {

    org.repos(pageNo, conf.pageSize, (err, data, headers) => {

        if (1 === pageNo) {
            progressBar = new CLIProgressBar();
            progressBar.show('Retrieving list of all public repos');
        }
        progressBar.pulse(`page ${pageNo}`);
        if (err) {
            console.log(err);
            progressBar.hide();
            cb();
        } else
            if (!data || data.length < 1) {
                progressBar.hide();
                cb();
            } else {
                projectsList.push(...data.map((x) => { return x.name; }));
                fetchListOfProjects(cb, pageNo + 1);
            }

    });

}

/**
 * Retrieve selected metadata for all projects.
 *
 * Side-effect: mutates <code>projectsData</code>.
 *
 * @param {String} projectName - name of the repository.
 */

function fetchProjectData(projectName) {

    const repo = client.repo(`w3c/${projectName}`),
        expected = 6;
    var done = 0;

    projectsData[projectName] = {};

    function updateProgress() {
        if (++done === expected) {
            if (++projectsDone === projectsList.length)
                progressBar.hide();
            else
                progressBar.show(projectName, projectsDone / projectsList.length);
        }
    }

    repo.info((err, data, headers) => {
        projectsData[projectName]['github_url'] = `https://github.com/w3c/${projectName}/`;
        if (err)
            return console.log(err);
        projectsData[projectName]['created_at'] = (data && data.length > 0) ? data[0]['created_at'] : '';
        projectsData[projectName].description = (data && data.length > 0) ? data[0].description : '';
        projectsData[projectName].homepage = (data && data.length > 0) ? data[0].homepage : '';
        updateProgress();
    });

    repo.commits((err, data, headers) => {
        if (err)
            return projectsData[projectName]['last_commit_on'] = '';
        if (data && data.length > 0 && data[0].commit && data[0].commit.author && data[0].commit.author.date)
            projectsData[projectName]['last_commit_on'] = data[0].commit.author.date;
        updateProgress();
    });

    repo.issues((err, data, headers) => {
        if (err)
            return console.log(err);
        projectsData[projectName]['opened_issues'] = data ? data.length : 0;
        updateProgress();
    });

    repo.contributors((err, data, headers) => {
        if (err)
            return projectsData[projectName].contributors = 0;
        projectsData[projectName].contributors = data ? data.length : 0;
        updateProgress();
    });

    repo.prs((err, data, headers) => {
        if (err)
            return console.log(err);
        projectsData[projectName]['pending_pull_requests'] = data ? data.length : 0;
        updateProgress();
    });

    repo.releases((err, data, headers) => {
        if (err)
            return console.log(err);
        projectsData[projectName]['last_release'] = (data && data.length > 0) ? data[0]['tag_name'] : '';
        updateProgress();
    });

}

client.limit((err, left, max, reset) => {
    if (err)
        return console.log(err);
    const countdown = Math.round((reset * 1000 - new Date().getTime()) / 1000),
        min = Math.floor(countdown / 60),
        sec = countdown % 60;
    console.log(`GH API, token ${conf.token}: ${left}/${max} (${Math.round(100*left/max)}%) requests available; resets in ${min}′${sec}″`);
});

fetchListOfProjects(() => {
    projectsList.sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase())
            return -1;
        else if (a.toLowerCase() > b.toLowerCase())
            return +1;
        else
            return 0;
    });
    console.log(`${conf.organisation}'s ${projectsList.length} public projects:\n${projectsList.join(', ')}`);
    progressBar = new CLIProgressBar();
    projectsList.map(fetchProjectData);
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/projects', function(req,res) {
    res.json(projectsData);
});

app.get('/api/*', function(req, res) {
    if (req.url) {
        console.log(req.url);
        client.get(req.url.split('api')[1], {}, function(err, status, body, headers) {
            res.json(body);
        });
    }
});

server.listen(conf.port, function() {
    console.log(`Listening on port ${conf.port}; visit http://localhost:${conf.port}/projects`);
    setInterval(function() {
        projectsList.map(fetchProjectData);
    }, conf.refreshPeriod * 60 * 1000);
});
