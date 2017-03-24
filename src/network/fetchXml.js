// @flow

import fetch from "isomorphic-fetch";
import { xmlParse } from "../xml/xmlParse";

export async function fetchXml(url: string): Promise<Object> {
  const response = await fetch(url);
  const xmlRaw = await response.text();
  return await xmlParse(xmlRaw);
}
