// @flow

import test from "ava";
import { getUrl } from "./getUrl";

test("should return an url for valid url in object", t => {
  let $ = "http://url.com";
  let result = getUrl({ $ }, "$");
  t.is(result, $);
});

test("should return an empty string for non valid url in object", t => {
  let $ = "blahblah";
  let result = getUrl({ $ }, "$");
  t.is(result, "");
});

test("should return an empty string for non string", t => {
  let result = getUrl(null, "$");
  t.is(result, "");
});
