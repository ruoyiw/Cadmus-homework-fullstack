import React from "react";
import { Value } from "slate";

import Editor from "./RichTextEditor";
import bodyJSON from "../utils/body.json";

class Body extends React.Component {
  state = {
    value: Value.fromJSON(bodyJSON)
  };

  /** Refer to https://docs.slatejs.org/slate-react/editor#onchange  */
  onChange = ({ value }) => this.setState({ value });

  render() {
    const { value } = this.state;
    return (
      <Editor
        value={value}
        onChange={this.onChange}
        placeholder="Write your assignment..."
      />
    );
  }
}

export default Body;
