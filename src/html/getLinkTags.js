// @flow

import htmlParser from "htmlparser2";

type HashMapT = { [key: string]: string };

type LinkTagT = {
  href: ?string,
  title: ?string,
  type: ?string,
};

export function getLinkTags(html: string): Promise<LinkTagT[]> {
  return new Promise((resolve, reject) => {
    const links: LinkTagT[] = [];

    const parser = new htmlParser.Parser(
      {
        onopentag(tagName: string, attributes: HashMapT) {
          if (tagName === "link") {
            links.push({
              href: attributes.href,
              title: attributes.title,
              type: attributes.type,
            });
          }
        },

        onerror: reject,

        onend() {
          resolve(links);
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
