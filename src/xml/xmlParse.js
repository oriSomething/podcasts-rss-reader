/**
 * Promise wrapper for xml2js
 * @flow
 */
import xml2js from "xml2js";

export function xmlParse(xmlString: string) {
  return new Promise((resolve, reject) => {
    const parseOptions = {
      trim: true,
    };

    xml2js.parseString(xmlString, parseOptions, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
