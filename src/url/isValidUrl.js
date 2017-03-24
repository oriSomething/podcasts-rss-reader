// @flow

const regex = /^https?\:\/\/(?!$)/i;

function isAbsoluteHTTPURL(url: string): boolean {
  return regex.test(url);
}

function hasNoAtSign(url: string): boolean {
  return !url.includes("@");
}

export function isValidUrl(url: ?string): boolean {
  if (typeof url !== "string") return false;

  return isAbsoluteHTTPURL(url) && hasNoAtSign(url);
}
