import React from "react";
import PropTypes from "prop-types";
import Editor from "./RichTextEditor";

/** The additional rich text Editor which is used to write additional research notes attached to a Work. */
function Notes(props) {
  const { value, onChange } = props;
  return (
    <Editor
      value={value}
      onChange={onChange}
      placeholder="Jot down your notes..."
    />
  );
}

Notes.propTypes = {
  /* eslint-disable */
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Notes;
