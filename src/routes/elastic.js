const router = require("express").Router();

const ELASTICSEARCH_Service = require("../utils/elastic/index.js");

router.use("/elastic/ping", function (req, res) {
    ELASTICSEARCH_Service.ping(req, res);
});

router.post("/elastic/index/init", function (req, res) {
    // [ 1 ] Create an index
    const index = req.param("index_name");
    ELASTICSEARCH_Service.initIndex(req, res, index);
});

router.post("/elastic/add", function (req, res) {
    //  [ 4 ] Add data to index

    const { payload, index_name, _id, type } = req.body;
    // const payload = req.param("payload");
    // const index = req.param("index_name");
    // const _id = req.param("_id");
    // const docType = req.param("type");

    ELASTICSEARCH_Service.addDocument(req, res, index, _id, type, payload);
    return null;
});

router.post("/elastic/search", function (req, res, next) {
    // [ 6 ] Search an index
    const index = req.param("index_name");
    const payload = req.param("payload");
    const docType = req.param("type");
    ELASTICSEARCH_Service.search(req, res, index, docType, payload);
});

router.put("/elastic/update", function (req, res) {
    //  [ 5 ] Update a document
    const payload = req.param("payload");
    const index = req.param("index_name");
    const _id = req.param("_id");
    const docType = req.param("type");
    ELASTICSEARCH_Service.updateDocument(
        req,
        res,
        index,
        _id,
        docType,
        payload
    );
    return null;
});
