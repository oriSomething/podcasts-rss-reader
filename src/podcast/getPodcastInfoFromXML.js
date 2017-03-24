// @flow

import get from "lodash/get";
import { getUrl } from "../url/getUrl";

type PodcastInfoT = {|
  copyright: string,
  imageUrl: string,
  language: string,
  lastBuildDate: ?Date,
  pubDate: ?Date,
  title: string,
  url: string,
|};

type ChannelT = {
  +copyright: [?string],
  +image: [?{ url: [?string] }],
  +"itunes:image"?: [{ $: { herf: string } }],
  +language: [?string],
  +lastBuildDate: [?string],
  +pubDate: [?string],
  +title: [?string],
  +link: [?string],
};

type XmlT = {
  +rss: {
    +channel: ChannelT[],
  },
};

function getPodcastImageFromXML(channel: ?ChannelT): string {
  const imageUrl = getUrl(channel, "image.0.url.0") ||
    getUrl(channel, "itunes:image.0.$.href");

  return imageUrl;
}

function getDate(channel: ?ChannelT, path: string): ?Date {
  var date = get(channel, path);
  return date ? new Date(date) : null;
}

export function getPodcastInfoFromXml(rssXml: XmlT): PodcastInfoT {
  const channel: ?ChannelT = get(rssXml, "rss.channel.0", null);

  return {
    copyright: get(channel, "copyright.0", ""),
    imageUrl: getPodcastImageFromXML(channel),
    language: get(channel, "language.0", ""),
    lastBuildDate: getDate(channel, "lastBuildDate.0"),
    pubDate: getDate(channel, "pubDate.0"),
    title: get(channel, "title.0", ""),
    url: getUrl(channel, "link.0"),
  };
}
