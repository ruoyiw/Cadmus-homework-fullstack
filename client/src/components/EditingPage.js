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

/** Component for the main editing page. */
function EditingPage(props) {
  const { tab, changeTab } = props;

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
          <Actions>
            <em>unsaved changes</em>
            <Count>
              <strong>Word Count:</strong> ???
            </Count>
          </Actions>
        </ShelfToolbar>
      </Shelf>
      <Desk>
        <Primary>{tab === "body" ? <Body /> : <Notes />}</Primary>
      </Desk>
    </React.Fragment>
  );
}

EditingPage.propTypes = {
  /**
   * Which tab is being displayed. Can take up values: "body" |
   * "notes"
   */
  tab: PropTypes.string.isRequired,
  /* Callback to change the tab */
  changeTab: PropTypes.func.isRequired
};

/** Holds state for the current tab. */
const enhance = withState("tab", "changeTab", "body");

export default enhance(EditingPage);
