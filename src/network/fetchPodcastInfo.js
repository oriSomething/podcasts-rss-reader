// @flow

import { getPodcastInfoFromXml } from "../podcast/getPodcastInfoFromXml";
import { fetchXml } from "./fetchXml";

export async function fetchPodcastInfo(url: string) {
  const xml = await fetchXml(url);
  return getPodcastInfoFromXml(xml);
}
