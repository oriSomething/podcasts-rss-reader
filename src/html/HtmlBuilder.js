/**
 * TODO: performances solution if needed
 * @flow
 */
import escape from "lodash/escape";

export class HtmlBuilder {
  _html: string;

  constructor() {
    this._html = "";
    Object.seal(this);
  }

  append(text: string) {
    this.appendUnSafe(escape(text));
  }

  appendUnSafe(text: string) {
    this._html += text;
  }

  toString() {
    return this._html;
  }
}
