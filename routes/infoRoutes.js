const express = require('express');
const router = express.Router();

router.get('/info', (req, res)=>{
    res.send(`<div>
                <h3>Object Process Information</h3>
                <h3>Project File: </h3> <p>${process.cwd()}</p>
                <h3>Execution Path: </h3><p> ${process.execPath}</p>
                <h3>Platform name: </h3><p> ${process.platform}</p>
                <h3>Execution Argument: </h3><p>${process.argv}</p>
                <h3>Node Version: </h3><p>${process.version}</p>
                <h3>Process Id: </h3><p>${process.pid}</p>
                <h3>Memory Usage: </h3><p>${process.memoryUsage.rss()}</p>
            </div>`)
});

module.exports = router;
