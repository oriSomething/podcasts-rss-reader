// @flow

import test from "ava";
import times from "lodash/times";
import fs from "fs";
import path from "path";
import { xmlParse } from "../xml/xmlParse";
import { getSimplifiedHtml } from "./getSimplifiedHtml";

/**
 * @typedef Tag
 * @property {string}  0 - Tag name
 * @property {boolean} 1 - Is self closing tag?
 */

/** @const {Tag[]} */
const STRIPPED_TAGS = [
  ["abbr", false],
  ["address", false],
  ["area", true],
  ["article", false],
  ["aside", false],
  ["audio", false],
  ["b", false],
  ["base", true],
  ["bdi", false],
  ["bdo", false],
  ["blockquote", false],
  ["body", false],
  ["br", true],
  ["button", false],
  ["canvas", false],
  ["caption", false],
  ["cite", false],
  ["code", false],
  ["col", true],
  ["colgroup", false],
  ["command", false],
  ["datalist", false],
  ["dd", false],
  ["del", false],
  ["details", false],
  ["dfn", false],
  ["div", false],
  ["dl", false],
  ["dt", false],
  ["em", false],
  ["embed", true],
  ["fieldset", false],
  ["figcaption", false],
  ["figure", false],
  ["footer", false],
  ["form", false],
  ["h1", false],
  ["h2", false],
  ["h3", false],
  ["h4", false],
  ["h5", false],
  ["h6", false],
  ["head", false],
  ["header", false],
  ["hgroup", false],
  ["hr", true],
  ["html", false],
  ["i", false],
  ["iframe", false],
  ["input", true],
  ["ins", false],
  ["kbd", false],
  ["keygen", true],
  ["label", false],
  ["legend", false],
  ["li", false],
  ["link", true],
  ["map", false],
  ["mark", false],
  ["math", false],
  ["menu", false],
  ["menuitem", true],
  ["meta", true],
  ["meter", false],
  ["nav", false],
  ["noscript", false],
  ["object", false],
  ["ol", false],
  ["optgroup", false],
  ["option", false],
  ["output", false],
  ["p", false],
  ["param", true],
  ["pre", false],
  ["progress", false],
  ["q", false],
  ["rp", false],
  ["rt", false],
  ["ruby", false],
  ["s", false],
  ["samp", false],
  ["script", false],
  ["section", false],
  ["select", false],
  ["small", false],
  ["source", true],
  ["span", false],
  ["strong", false],
  ["style", false],
  ["sub", false],
  ["summary", false],
  ["sup", false],
  ["svg", false],
  ["table", false],
  ["tbody", false],
  ["td", false],
  ["textarea", false],
  ["tfoot", false],
  ["th", false],
  ["thead", false],
  ["time", false],
  ["title", false],
  ["tr", false],
  ["track", true],
  ["u", false],
  ["ul", false],
  ["var", false],
  ["video", false],
  ["wbr", true],
];

/**
 * falsy values
 */

test("falsy values: should return an empty string for an empty string", t => {
  return getSimplifiedHtml("").then(result => t.is(result, ""));
});

test("falsy values: should return an empty string for a null", t => {
  return getSimplifiedHtml(null).then(result => t.is(result, ""));
});

test("falsy values: should return an empty string for an undefined", t => {
  return getSimplifiedHtml(undefined).then(result => t.is(result, ""));
});

/**
 * tag striping
 */

test("tag striping: should strip all tags", t => {
  let html = STRIPPED_TAGS.map(result => {
    const tag = result[0];
    const isSelfClosingTag = result[1];

    return isSelfClosingTag ? `<${tag}>` : `<${tag}></${tag}>`;
  }).join("");

  return getSimplifiedHtml(html).then(result => t.is(result, ""));
});

test("tag striping: should strip all tags and leave the inner text", t => {
  const resultSize = STRIPPED_TAGS.filter(result => !result[1]).length;
  const expectedResult = times(resultSize, () => "x").join("");
  const html = STRIPPED_TAGS.map(result => {
    const tag = result[0];
    const isSelfClosingTag = result[1];

    return isSelfClosingTag ? `<${tag}>` : `<${tag}>x</${tag}>`;
  }).join("");

  return getSimplifiedHtml(html).then(result => t.is(result, expectedResult));
});

/**
 * tag compiling
 */

/**
 * tag compiling <a>
 */

test("tag compiling <a>: should include <a>", t => {
  return getSimplifiedHtml(`x <a></a>`).then(result =>
    t.is(result, "x <a></a>"));
});

test("tag compiling <a>: should include <a> content", t => {
  return getSimplifiedHtml(`x <a>y</a>`).then(result =>
    t.is(result, "x <a>y</a>"));
});

test("tag compiling <a>: should include href attribute if HTTP", t => {
  return getSimplifiedHtml(`x <a href="http://x"></a>`).then(result =>
    t.is(result, `x <a href="http://x"></a>`));
});

test("tag compiling <a>: should include href attribute if HTTPs", t => {
  return getSimplifiedHtml(`x <a href="https://x"></a>`).then(result =>
    t.is(result, `x <a href="https://x"></a>`));
});

test("tag compiling <a>: should not include href attribute if starts with `javascript:`", t => {
  return getSimplifiedHtml(`x <a href="javascript:"></a>`).then(result =>
    t.is(result, `x <a></a>`));
});

test("tag compiling <a>: should escape href attribute", t => {
  return getSimplifiedHtml(`x <a href="https://&/>"></a>`).then(result =>
    t.is(result, `x <a href="https://&amp;/&gt;"></a>`));
});

/**
 * tag compiling <img>
 */

test("tag compiling <img>: should omit <img> if no src", t => {
  return getSimplifiedHtml(`x <img>`).then(result => t.is(result, "x "));
});

test("tag compiling <img>: should omit <img> if src starts with `javascript`", t => {
  return getSimplifiedHtml(`x <img src="javascript:alert(1)">`).then(result =>
    t.is(result, "x "));
});

test("tag compiling <img>: should include <img> in text if src is uses HTTP", t => {
  const html = `x <img src="http://x">`;

  return getSimplifiedHtml(html).then(result => t.is(result, html));
});

test("tag compiling <img>: should include <img> in text if src is uses HTTPs", t => {
  const html = `x <img src="https://x">`;

  return getSimplifiedHtml(html).then(result => t.is(result, html));
});

test("tag compiling <img>: should escape <img> src attribute", t => {
  return getSimplifiedHtml(`x <img src="https://&'">`).then(result =>
    t.is(result, `x <img src="https://&amp;&#39;">`));
});

test("tag compiling <img>: should includes alt attribute", t => {
  return getSimplifiedHtml(`x <img src="https://x" alt="hi">`).then(result =>
    t.is(result, `x <img src="https://x" alt="hi">`));
});

test("tag compiling <img>: should escape alt attribute", t => {
  return getSimplifiedHtml(`x <img src="https://x" alt="&&">`).then(result =>
    t.is(result, `x <img src="https://x" alt="&amp;&amp;">`));
});

/**
 * Snapshots
 */

test.skip("snapshot", async t => {
  const filename = path.resolve(
    __dirname,
    "../../__podcastsSnapshots__/geekonomy-2017-03-31.xml",
  );
  const rssXML = fs.readFileSync(filename);
  const xml = await xmlParse(rssXML.toString());
  const descriptions = xml.rss.channel[0].item.map(item => item.description[0]);

  for (let description of descriptions) {
    const snapshot = await getSimplifiedHtml(description);
    t.snapshot(snapshot);
  }
});
