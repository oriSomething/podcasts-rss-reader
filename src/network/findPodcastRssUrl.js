// @flow

import fetch from "isomorphic-fetch";
import nodeUrl from "url";
import { getLinkTags } from "../html/getLinkTags";

type UrlObjectT = {
  protocol: string,
  slashes: boolean,
  auth: any,
  host: string,
  port: ?string,
  hostname: string,
  hash: ?string,
  search: ?string,
  query: ?string,
  pathname: string,
  path: string,
  href: string,
};

export async function findPodcastRssUrl(url: string): Promise<string> {
  const urlObject: UrlObjectT = nodeUrl.parse(url);
  const topLevelUrl: string = nodeUrl.format({
    protocol: urlObject.protocol,
    host: urlObject.host,
  });

  const response = await fetch(topLevelUrl);
  if (response.status !== 200) {
    throw new Error(
      `findPodcastRssUrl(): Returned status from "${topLevelUrl}" is ${response.status}`,
    );
  }

  const html = await response.text();
  // $FlowFixMe: href is not-Nullable string array
  const hrefs: string[] = (await getLinkTags(html))
    .filter(link => link.type === "application/rss+xml")
    .filter(link => Boolean(link.href))
    .map(link => link.href);

  if (hrefs.length === 0) {
    throw new Error("There is no RSS URL");
  }

  for (let href of hrefs) {
    const { pathname } = nodeUrl.parse(href);

    if (pathname === "/feed" || pathname === "/feed/") {
      return href;
    }
  }

  throw new Error("No RSS URL is found");
}
