// @flow

import test from "ava";
import fs from "fs";
import path from "path";
import isString from "lodash/isString";
import isDate from "lodash/isDate";
import isObject from "lodash/isObject";
import { xmlParse } from "../xml/xmlParse";
import { getPodcastItemsFromXml } from "./getPodcastItemsFromXml";

test.beforeEach(async t => {
  const filename = path.resolve(
    __dirname,
    "../../__podcastsSnapshots__/geekonomy-2017-03-31.xml",
  );
  const rssXML = fs.readFileSync(filename);
  const xml = await xmlParse(rssXML.toString());

  // $FlowFixMe: Flow doesn't allow assigment for some reason
  t.context = {
    geekonomy: xml,
  };
});

/**
 * Misc
 */

test("Returned value is an array", async t => {
  const items = await getPodcastItemsFromXml(t.context.geekonomy);
  t.true(Array.isArray(items));
  t.is(items.length, 98);
});

/**
 * snapshot
 */

test("snapshot", async t => {
  const items = await getPodcastItemsFromXml(t.context.geekonomy);
  t.snapshot(items);
});

/**
 * types
 */

test("Types of items are correct", async t => {
  const items = await getPodcastItemsFromXml(t.context.geekonomy);

  items.forEach(item => {
    // title
    t.true(isString(item.title), "title is string");
    t.not(item.title, "", "title is not an empty string");
    // links
    t.true(isString(item.link), "link is a string");
    t.true(item.link.startsWith("http"), "link is a link");
    // comments
    t.true(isString(item.comments), "comments is string");
    t.true(item.comments.startsWith("http"), "comments is a link");
    // pubDate
    t.true(isDate(item.pubDate), "pubDate is Date");
    t.false(isNaN(Number(item.pubDate)), "pubDate is a valid date");
    // creator
    t.true(isString(item.creator), "creator is string");
    t.not(item.creator, "", "creator is not an empty string");
    // category
    t.true(isString(item.category), "category is string");
    t.not(item.category, "", "category is not an empty string");
    // description
    t.true(isString(item.description), "description is string");
    t.not(item.description, "", "description is not an empty string");
    // thumbnail
    t.true(isString(item.thumbnail), "thumbnail is string");
    t.true(item.thumbnail.startsWith("http"), "thumbnail is a link");
    // enclosure
    t.true(Array.isArray(item.enclosure), "enclosure is Array");
    t.true(item.enclosure.length > 0, "enclosure's length is begger than 0");
    item.enclosure.forEach(enclosure => {
      t.true(isObject(enclosure), "enclosure is Object");
      t.true(Number.isFinite(enclosure.length), "enclosure[].length is number");
      t.true(isString(enclosure.type), "enclosure[].type is string");
      t.true(isString(enclosure.url), "enclosure[].url is string");
      t.not(enclosure.url, "", "enclosure[].url is string");
    });
  });
});
