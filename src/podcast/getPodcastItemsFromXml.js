// @flow

import get from "lodash/get";
import { getUrl } from "../url/getUrl";
import { getSimplifiedHtml } from "../html/getSimplifiedHtml";

type LinkT = string;

type EnclosureT = {|
  length: number,
  type: string,
  url: string,
|};

type ItemT = {|
  title: string,
  link: LinkT,
  comments: LinkT,
  pubDate?: ?Date,
  creator: string,
  category: string,
  description: string,
  enclosure: EnclosureT[],
  thumbnail: LinkT,
|};

type XmlT = {
  +rss: {
    +channel: Array<{
      +item: ItemT[],
    }>,
  },
};

function getDescription(item: { +description: any }): Promise<string> {
  const description = get(item, "description.0", "");
  return getSimplifiedHtml(description);
}

function getEnclosure(item: { +enclosure: any[] }): EnclosureT[] {
  if (!Array.isArray(item.enclosure)) {
    return [];
  }

  return item.enclosure.map(enclosure => {
    return {
      length: Number(enclosure.$.length),
      type: enclosure.$.type,
      url: getUrl(enclosure, "$.url"),
    };
  });
}

export async function getPodcastItemsFromXml(xml: XmlT): Promise<ItemT[]> {
  const item: any[] = xml.rss.channel[0].item;

  const items = item.map(async item => {
    const pubDate: ?string = get(item, "pubDate", null);
    const description = await getDescription(item);

    return {
      category: get(item, "category.0", ""),
      comments: getUrl(item, "comments.0"),
      creator: get(item, "dc:creator.0", ""),
      description,
      enclosure: getEnclosure(item),
      link: getUrl(item, "link.0"),
      pubDate: pubDate == null ? null : new Date(pubDate),
      thumbnail: getUrl(item, "media:thumbnail.0.$.url"),
      title: get(item, "title.0", ""),
    };
  });

  // NOTE: We need to filter posts which aren't considerate as a podcast
  return (await Promise.all(items)).filter((item: ItemT) => {
    return item.enclosure.length !== 0;
  });
}
