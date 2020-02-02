require("dotenv").config();

const express = require("express"),
  api = express(),
  moment = require("moment"),
  { gql } = require("../utils");

api.use(express.json());

api.get("/", async (req, res) => {
  const last24Hours = `{
    logs(where: {sequence: {_eq: 1}, created_at: {_gt: "${moment
      .utc()
      .add(-24, "hours")
      .format()}"}}, order_by: {sequence: asc, created_at: desc}) {
      camera
      id
      group
      created_at
    }
  }`;

  const { data: { logs } = null, errors } = await gql({
    query: last24Hours
  });
  const items = logs.map(p => ({
    ...p,
    created_at_local:
      moment(p.created_at).format("ddd, LTS") +
      " - " +
      moment(p.created_at)
        .startOf("minutes")
        .fromNow()
  }));

  res.jsonp(items);
});

api.get("/images", async (req, res) => {
  const { id } = req.query;
  const { data } = await gql({
    query: `{ logs(where: {group: {_eq: "${id}"}}, order_by: {sequence: asc}) { base64Image } } `
  });

  res.jsonp(data);
});

api.listen(() => {
  console.log("api online");
});

module.exports = {
  path: "/api",
  handler: api
};
