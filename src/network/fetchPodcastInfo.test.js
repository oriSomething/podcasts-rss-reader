// @flow

import test from "ava";
import nock from "nock";
import fs from "fs";
import path from "path";
import { fetchPodcastInfo } from "./fetchPodcastInfo";

test.serial.beforeEach(() => {
  const filename = path.resolve(
    __dirname,
    "../../__podcastsSnapshots__/geekonomy-2017-03-31.xml",
  );
  const rssXML = fs.readFileSync(filename);
  nock("https://geekonomy.net/").get("/feed/").reply(200, rssXML);
});

test.serial.afterEach(() => {
  nock.cleanAll();
});

test.serial("fetchPodcastInfo()", async t => {
  const result = await fetchPodcastInfo("https://geekonomy.net/feed/");
  t.deepEqual(result, {
    copyright: "",
    imageUrl: "",
    language: "he-IL",
    lastBuildDate: new Date("2017-03-31T06:51:58.000Z"),
    pubDate: null,
    title: "Geekonomy",
    url: "https://geekonomy.net",
  });
});
