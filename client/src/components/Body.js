import React from "react";
import PropTypes from "prop-types";
import Editor from "./RichTextEditor";

/** The main rich text Editor where students write their Work. */
function Body(props) {
  const { value, onChange } = props;
  return (
    <Editor
      value={value}
      onChange={onChange}
      placeholder="Write your assignment..."
    />
  );
}

Body.propTypes = {
  /* eslint-disable */
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Body;
