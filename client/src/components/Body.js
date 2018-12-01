import React from "react";
import { Value } from "slate";
import axios from "axios";

import Editor from "./RichTextEditor";
import bodyJSON from "../utils/body.json";

const { localStorage } = global.window;

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.existingBody = JSON.parse(localStorage.getItem("body"));
    this.state = {
      bodyValue: Value.fromJSON(this.existingBody || bodyJSON),
      hasSaved: false,
      error: null
    };
  }

  /** Refer to https://docs.slatejs.org/slate-react/editor#onchange  */
  onChange = ({ value }) => {
    const { bodyValue } = this.state;

    // Check to see if the document has changed before saving.
    if (value.document !== bodyValue.document) {
      const bodyContent = JSON.stringify(value.toJSON());
      localStorage.setItem("body", bodyContent);
      this.handleSaveBody();
    }
    this.setState({ bodyValue: value });
  };

  async handleSaveBody() {
    const { bodyValue } = this.state;
    const { workId } = this.props;
    const url = "http://127.0.0.1:3333/api/saving";
    let notes;
    if (JSON.parse(localStorage.getItem("notes"))) {
      notes = JSON.stringify(JSON.parse(localStorage.getItem("notes")));
    } else {
      notes = null;
    }
    const postData = {
      work: workId,
      bodySave: JSON.stringify(bodyValue),
      notesSave: notes
    };
    await axios
      .post(url, postData)
      .then(response => {
        console.log("call2")
        if (response.data.status === "success") {
          this.setState({
            hasSaved: true,
            error: null
          });
        } else {
          this.setState({
            hasSaved: false,
            error: response.data.status
          });
        }
      })
      .catch(err => {
        this.setState({
          hasSaved: false,
          error: err.toString
        });
      });
  }

  render() {
    const { bodyValue } = this.state;
    return (
      <Editor
        value={bodyValue}
        onChange={this.onChange}
        placeholder="Write your assignment..."
      />
    );
  }
}

export default Body;
