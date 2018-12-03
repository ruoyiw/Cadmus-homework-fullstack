import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Status = styled.div`
  color: #4c4cff;
`;
/**
 * Indicate the save status of the work
 */
function SaveIndicator(props) {
  const { hasSaved, error } = props;
  let saveStatus;
  // if nothing has been saved at the beginning and no error, the save status will be empty
  if (hasSaved === null && !error) {
    saveStatus = "";
  }
  // if hasSaved is true and no error, it will display the changes have been saved to the cloud
  else if (hasSaved && !error) {
    saveStatus = "All changes saved to the Cloud";
  }
  // if hasSaved is false and no error, the network request has not finished, it will display "saving"
  else if (!hasSaved && !error) {
    saveStatus = "Saving...";
  }
  // otherwise, it will display "unsaved changes"
  else {
    saveStatus = "Unsaved changes";
  }
  return (
    <React.Fragment>
      <Status>
        <em>{saveStatus}</em>
      </Status>
    </React.Fragment>
  );
}
SaveIndicator.defaultProps = {
  hasSaved: null,
  error: null
};
SaveIndicator.propTypes = {
  hasSaved: PropTypes.bool,
  error: PropTypes.string
};

export default SaveIndicator;
