// @flow

import test from "ava";
import { isValidUrl } from "./isValidUrl";

test("returns true for a url that begins with http", t => {
  const url = "http://url.com";
  t.true(isValidUrl(url));
});

test("returns true for a url that begins with https", t => {
  const url = "https://url.com";
  t.true(isValidUrl(url));
});

test("returns false for only including a protocol", t => {
  const url = "https://";
  t.false(isValidUrl(url));
});

test("returns false for a url that without protocol", t => {
  const url = "url.com";
  t.false(isValidUrl(url));
});

test("returns false for a url that without protocol or domain type", t => {
  const url = "url";
  t.false(isValidUrl(url));
});

test("returns false for a url with `@` sign", t => {
  const url = "https://url@sign.com";
  t.false(isValidUrl(url));
});

test("returns false for non string value", t => {
  // $FlowExpectedError
  t.false(isValidUrl(1));
  // $FlowExpectedError
  t.false(isValidUrl({}));
  t.false(isValidUrl());
  t.false(isValidUrl(null));
});
