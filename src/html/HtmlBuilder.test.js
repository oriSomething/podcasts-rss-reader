// @flow

import test from "ava";
import { HtmlBuilder } from "./HtmlBuilder";

test("#constructor()", t => {
  t.notThrows(() => new HtmlBuilder());
});

test("#toString(): sould work for call .toString()", t => {
  const TEST_STRING = "testing";
  let html = new HtmlBuilder();
  html._html = TEST_STRING;
  t.is(TEST_STRING, html.toString());
});

test("#toString(): sould work for implicit call .toString()", t => {
  const TEST_STRING = "testing";
  let html = new HtmlBuilder();
  html._html = TEST_STRING;
  t.is(TEST_STRING, "" + html.toString());
});

test("#appendUnSafe(): should append unescaped string", t => {
  const TEST_STRING = "<\"`'&";
  const RESULT_STRING = TEST_STRING;
  const html = new HtmlBuilder();
  html.appendUnSafe(TEST_STRING);
  t.is(html.toString(), RESULT_STRING);
});

test("#append(): should append escaped string", t => {
  const TEST_STRING = "x<\"`'&x";
  const RESULT_STRING = "x&lt;&quot;`&#39;&amp;x";
  const html = new HtmlBuilder();
  html.append(TEST_STRING);
  t.is(html.toString(), RESULT_STRING);
});
