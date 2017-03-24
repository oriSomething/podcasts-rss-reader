// @flow

import test from "ava";
import nock from "nock";
import { fetchXml } from "./fetchXml";

test.beforeEach(() => {
  const responseBody = `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
      	<title>My awesome channel</title>
      </channel>
    </rss>
  `;

  nock("https://podcast.domain/").get("/").reply(200, responseBody);
});

test.afterEach(() => {
  nock.cleanAll();
});

test("should fetch XML from given URL", async t => {
  const result = await fetchXml("https://podcast.domain/");
  t.deepEqual(result, {
    rss: {
      $: {
        version: "2.0",
      },
      channel: [
        {
          title: ["My awesome channel"],
        },
      ],
    },
  });
});
