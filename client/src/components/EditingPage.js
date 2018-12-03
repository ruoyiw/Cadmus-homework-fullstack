import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withState } from "recompose";

import { Shelf, ShelfToolbar, Desk, Primary } from "../styles/layout";
import { TabBar, TabBarItem } from "./TabBar";

import Body from "./Body";
import Notes from "./Notes";

const Count = styled.div`
  padding: 0px 18px;
`;

const Actions = styled.div`
  display: flex;
`;

const Alert = styled.div`
  padding: 10px;
  background-color: #f44336; /* Red */
  color: white;
  margin-top: 10px;
  margin-bottom: auto;
  box-shadow: 2px 2px 2px grey;
`;

/** Component for the main editing page. */
class EditingPage extends React.Component {
  state = {
    hasSaved: null,
    error: null
  };

  handleSaveStatus = (save, err) => {
    this.setState({
      hasSaved: save,
      error: err
    });
  };

  render() {
    const { tab, changeTab, match } = this.props;
    const { hasSaved, error } = this.state;
    let saveStatus;
    if (hasSaved === null) {
      saveStatus = "";
    } else if (hasSaved && !error) {
      saveStatus = "All changes saved to the Cloud";
    } else if (!hasSaved && !error) {
      saveStatus = "Saving...";
    } else {
      saveStatus = "Unsaved changes";
    }
    return (
      <React.Fragment>
        <Shelf>
          <ShelfToolbar>
            <TabBar>
              <TabBarItem
                selected={tab === "body"}
                onClick={() => changeTab("body")}
              >
                Body
              </TabBarItem>
              <TabBarItem
                selected={tab === "notes"}
                onClick={() => changeTab("notes")}
              >
                Notes
              </TabBarItem>
            </TabBar>
            {error ? <Alert>Fail to connect</Alert> : null}
            <Actions>
              {/* {hasSaved && !error ? (
                <em>All changes saved to the Cloud</em>
              ) : (
                <em>Saving...</em>
              )} */}
              <em>{saveStatus}</em>
              <Count>
                <strong>Word Count:</strong> ???
              </Count>
            </Actions>
          </ShelfToolbar>
        </Shelf>
        <Desk>
          <Primary>
            {tab === "body" ? (
              <Body
                workId={match.params.workId}
                handleSaveStatus={this.handleSaveStatus}
              />
            ) : (
              <Notes
                workId={match.params.workId}
                handleSaveStatus={this.handleSaveStatus}
              />
            )}
          </Primary>
        </Desk>
      </React.Fragment>
    );
  }
}

EditingPage.propTypes = {
  /**
   * Which tab is being displayed. Can take up values: "body" |
   * "notes"
   */
  tab: PropTypes.string.isRequired,
  /* Callback to change the tab */
  changeTab: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      workId: PropTypes.string
    }).isRequired
  }).isRequired
};

/** Holds state for the current tab. */
const enhance = withState("tab", "changeTab", "body");

export default enhance(EditingPage);
