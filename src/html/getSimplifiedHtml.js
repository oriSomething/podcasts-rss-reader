/**
 * TODO:
 * - Change the HTMLBuilder to write a descriptor that the HTML is generated
 *   from it, So reparse won't needed to problem like `<a>` tags with no
 *   attributes, or Maybe event to convert to MarkDown in future
 *
 * @flow
 */

import htmlParser from "htmlparser2";
import isString from "lodash/isString";
import { HtmlBuilder } from "./HtmlBuilder";
import { isValidUrl } from "../url/isValidUrl";

type HashMapT = { [key: string]: string };

/**
 * Attributes currently allowed are link and sources in other sites.
 * @private
 * @param  {Object.<string, *>} attributes Tag's attributes
 * @param  {string} attributeName
 * @return {boolean}
 */
function isAllowedAttribute(attributes: HashMapT, attributeName: string) {
  return Boolean(attributes[attributeName]) &&
    isValidUrl(attributes[attributeName]);
}

function appendATagOpening(builder: HtmlBuilder, attributes: HashMapT) {
  builder.appendUnSafe("<a");
  if (isAllowedAttribute(attributes, "href")) {
    builder.appendUnSafe(` href="`);
    builder.append(attributes.href);
    builder.appendUnSafe(`"`);
  }
  builder.appendUnSafe(">");
}

function appendImgTagSelfClosing(builder: HtmlBuilder, attributes: HashMapT) {
  if (isAllowedAttribute(attributes, "src")) {
    builder.appendUnSafe(`<img src="`);
    builder.append(attributes.src);
    if (isString(attributes.alt) && attributes.alt !== "") {
      builder.appendUnSafe(`" alt="`);
      builder.append(attributes.alt);
    }
    builder.appendUnSafe(`">`);
  }
}

/**
 * The result is supposed to be simplified version of the HTML that supposed to
 * be XSS free.
 * The only tags that are allowed are `<a>` and `<img>`. When their link is of
 * an absolute URL.
 */
export function getSimplifiedHtml(html: ?string): Promise<string> {
  if (!html) {
    return Promise.resolve("");
  }

  return new Promise((resolve, reject) => {
    const builder = new HtmlBuilder();
    const parser = new htmlParser.Parser(
      {
        onopentag(tagName: string, attributes: HashMapT) {
          if (tagName === "a") {
            appendATagOpening(builder, attributes);
          } else if (tagName === "img") {
            appendImgTagSelfClosing(builder, attributes);
          }
        },

        ontext(text: string) {
          builder.append(text);
        },

        onclosetag(tagName: string) {
          if (tagName === "a") {
            builder.appendUnSafe("</a>");
          }
        },

        onerror: reject,

        onend() {
          resolve(builder.toString());
        },
      },
      {
        decodeEntities: true,
        lowerCaseAttributeNames: true,
        lowerCaseTags: true,
        recognizeSelfClosing: true,
      },
    );

    parser.write(html);
    parser.end();
  });
}
