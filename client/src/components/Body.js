import React from "react";
import PropTypes from "prop-types";
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

  componentDidMount() {
    this.handleLoadBody();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  /** Refer to https://docs.slatejs.org/slate-react/editor#onchange  */
  onChange = ({ value }) => {
    const { bodyValue, hasSaved, error } = this.state;
    const { handleSaveStatus } = this.props;
    // Check to see if the document has changed before saving.
    if (value.document !== bodyValue.document) {
      this.setState(
        {
          hasSaved: false,
          error: null
        },
        () => handleSaveStatus(hasSaved, error)
      );
      const bodyContent = JSON.stringify(value.toJSON());
      localStorage.setItem("body", bodyContent);
      this.time = setTimeout(() => {
        this.handleSaveBody();
      }, 2000);
      console.log("saved: " + hasSaved);
    }
    this.setState({
      bodyValue: value
    });
  };

  async handleSaveBody() {
    const { bodyValue, hasSaved, error } = this.state;
    const { workId, handleSaveStatus } = this.props;
    const url = "http://127.0.0.1:3333/api/saving";
    let notes;
    console.log(localStorage.getItem("notes"));
    if (localStorage.getItem("notes") === "undefined") {
      notes = null;
    } else {
      notes = localStorage.getItem("notes");
    }
    const postData = {
      work: workId,
      bodySave: JSON.stringify(bodyValue),
      notesSave: notes
    };
    await axios
      .post(url, postData)
      .then(response => {
        console.log("call1");
        if (response.data.status === "success") {
          this.setState(
            {
              hasSaved: true,
              error: null
            },
            () => handleSaveStatus(hasSaved, error)
          );
        } else {
          this.setState(
            {
              hasSaved: false,
              error: response.data.status
            },
            () => handleSaveStatus(hasSaved, error)
          );
        }
      })
      .catch(err => {
        this.setState(
          {
            hasSaved: false,
            error: err.toString
          },
          () => handleSaveStatus(hasSaved, error)
        );
      });
  }

  async handleLoadBody() {
    const { hasSaved, error } = this.state;
    const { workId, handleSaveStatus } = this.props;
    const url = "http://127.0.0.1:3333/api/loading/";
    await axios
      .get(url + workId)
      .then(response => {
        console.log("call2");
        if (response.data.status === "success") {
          if (response.data.bodyJSON) {
            this.setState(
              {
                bodyValue: Value.fromJSON(JSON.parse(response.data.bodyJSON)),
                hasSaved: true,
                error: null
              },
              () => handleSaveStatus(hasSaved, error)
            );
            localStorage.setItem("notes", response.data.notesJSON);
          } else {
            this.setState(
              {
                hasSaved: null,
                error: null
              },
              () => handleSaveStatus(hasSaved, error)
            );
          }
        } else {
          this.setState(
            {
              hasSaved: false,
              error: response.data.status
            },
            () => handleSaveStatus(hasSaved, error)
          );
        }
      })
      .catch(err => {
        this.setState(
          {
            hasSaved: false,
            error: err.toString
          },
          () => handleSaveStatus(hasSaved, error)
        );
      });
    console.log("saved: " + hasSaved);
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

Body.propTypes = {
  handleSaveStatus: PropTypes.func.isRequired,
  workId: PropTypes.string.isRequired
};

export default Body;
