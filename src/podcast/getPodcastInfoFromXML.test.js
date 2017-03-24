// @flow

import test from "ava";
import isDate from "lodash/isDate";
import { xmlParse } from "../xml/xmlParse";
import { getPodcastInfoFromXml } from "./getPodcastInfoFromXml";

function createXml(xml: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><rss><channel>${xml}</channel></rss>`;
}

type TT = {
  xml: string,
  property: string,
  expected: string | Date | null,
};

function propertyMacro(t, { xml, property, expected }: TT) {
  xml = createXml(xml);

  return xmlParse(xml).then(getPodcastInfoFromXml).then(podcastInfo => {
    if (isDate(expected)) {
      t.true(isDate(podcastInfo[property]), "type of Date");
      t.is(Number(podcastInfo[property]), Number(expected), "timestamp");
    } else {
      t.is(podcastInfo[property], expected);
    }
  });
}

/**
 * channel
 */

test("shouldn't throw an exception for an empty channel", () => {
  return xmlParse(createXml("")).then(getPodcastInfoFromXml);
});

/**
 * copyright attribute
 */

test("copyright: should extract", propertyMacro, {
  xml: "<copyright>(c) hi copyright</copyright>",
  property: "copyright",
  expected: "(c) hi copyright",
});

test("copyright: should extract empty string for none", propertyMacro, {
  xml: "",
  property: "copyright",
  expected: "",
});

/**
 * imageUrl attribute
 */

test("imageUrl should extract empty string for no imageUrl", propertyMacro, {
  xml: "",
  property: "imageUrl",
  expected: "",
});

test("imageUrl <itunes:image>: should extract HTTPs URL", propertyMacro, {
  xml: `<image><url>https://someurl.com/some-image.png</url></image>`,
  property: "imageUrl",
  expected: "https://someurl.com/some-image.png",
});

test("imageUrl <image>: should ignore none HTTP/s urls", propertyMacro, {
  xml: `<image><url>some-image.png</url></image>`,
  property: "imageUrl",
  expected: "",
});

test("imageUrl <itunes:image>: should extract HTTPs URL", propertyMacro, {
  xml: `<itunes:image href="https://someurl.com/some-image.png" />`,
  property: "imageUrl",
  expected: "https://someurl.com/some-image.png",
});

test("imageUrl <itunes:image>: should ignore none HTTP/s urls", propertyMacro, {
  xml: `<itunes:image href="some-image.png" />`,
  property: "imageUrl",
  expected: "",
});

/**
 * language attribute
 */

test("language: should extract empty string for none", propertyMacro, {
  xml: "",
  property: "language",
  expected: "",
});

test("language: should extract", propertyMacro, {
  xml: "<language>en-US</language>",
  property: "language",
  expected: "en-US",
});

/**
 * lastBuildDate attribute
 */

test("lastBuildDate: should extract", propertyMacro, {
  xml: "<lastBuildDate>Fri, 1 Jan 2016 01:00:00 +0000</lastBuildDate>",
  property: "lastBuildDate",
  expected: new Date(1451610000000),
});

test("lastBuildDate: should extract null for none", propertyMacro, {
  xml: "",
  property: "lastBuildDate",
  expected: null,
});

/**
 * pubDate attribute
 */

test("pubDate: should extract", propertyMacro, {
  xml: "<pubDate>Fri, 1 Jan 2016 01:00:00 +0000</pubDate>",
  property: "pubDate",
  expected: new Date(1451610000000),
});

test("pubDate: should extract null for none", propertyMacro, {
  xml: "",
  property: "pubDate",
  expected: null,
});

/**
 * title attribute
 */

test("title: should extract", propertyMacro, {
  xml: "<title>Software Engineering Daily</title>",
  property: "title",
  expected: "Software Engineering Daily",
});

test("title: should extract empty string for none", propertyMacro, {
  xml: "",
  property: "title",
  expected: "",
});

/**
 * url attribute
 */

test("url: should extract empty string for none", propertyMacro, {
  xml: "",
  property: "url",
  expected: "",
});

test("url: should extract HTTP/s link", propertyMacro, {
  xml: "<link>https://someurl.com</link>",
  property: "url",
  expected: "https://someurl.com",
});

test(
  "url: it should ignore not allowed links with no protocol",
  propertyMacro,
  {
    xml: "<link>someurl.com</link>",
    property: "url",
    expected: "",
  },
);
