const express = require("express");
const router = express.Router();

const CPUs = require('os').cpus().length;
const compression = require('compression');


const processInformation = (req, res) => {
    const info = {
        args: process.args,
        title: process.title,
        platform: process.platform,
        version: process.version,
        pid : process.pid,
        path: process.execPath,
        projectPath: process.cwd(),
        CPUs: CPUs,
        memoryUsage: process.memoryUsage()
    };

    res.send(JSONstringy(info));
};

router.get("/", processInformation);
router.get("/zip", compression(), processInformation)

module.exports = router;
