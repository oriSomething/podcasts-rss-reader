// @flow

import test from "ava";
import { xmlParse } from "./xmlParse";

test("should work", t => {
  const xml = `
      <a>
        <b />
      </a>
    `;
  const expected = {
    a: {
      b: [""],
    },
  };

  return xmlParse(xml).then(result => t.deepEqual(result, expected));
});
