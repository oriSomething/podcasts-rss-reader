// @flow

import get from "lodash/get";
import { isValidUrl } from "./isValidUrl";

export function getUrl(obj: any, path: string): string {
  const url: any = get(obj, path, "");
  return isValidUrl(url) ? url : "";
}
