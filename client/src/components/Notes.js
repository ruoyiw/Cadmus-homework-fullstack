import React from "react";
import PropTypes from "prop-types";
import { Value } from "slate";

import Editor from "./RichTextEditor";
import notesJSON from "../utils/notes.json";

const { localStorage } = global.window;

class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.existingNotes = JSON.parse(localStorage.getItem("note"));
    this.state = {
      notesValue: Value.fromJSON(this.existingNotes || notesJSON),
      hasSaved: false,
      error: null
    };
  }

  /** Refer to https://docs.slatejs.org/slate-react/editor#onchange  */
  onChange = ({ value }) => {
    const { notesValue, hasSaved, error } = this.state;
    const { handleSaveStatus } = this.props;
    // Check to see if the document has changed before saving.
    if (value.document !== notesValue.document) {
      const notesContent = JSON.stringify(value.toJSON());
      localStorage.setItem("notes", notesContent);
    }
    this.setState({ notesValue: value });
    handleSaveStatus(hasSaved, error);
  };

  render() {
    const { notesValue } = this.state;
    return (
      <Editor
        value={notesValue}
        onChange={this.onChange}
        placeholder="Jot down your notes..."
      />
    );
  }
}

Notes.propTypes = {
  handleSaveStatus: PropTypes.func.isRequired
};

export default Notes;
