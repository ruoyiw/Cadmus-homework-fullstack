import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withState } from "recompose";
import { Value } from "slate";
import axios from "axios";

import { Shelf, ShelfToolbar, Desk, Primary, Alert } from "../styles/layout";
import { TabBar, TabBarItem } from "./TabBar";

import Body from "./Body";
import Notes from "./Notes";
import SaveIndicator from "./SaveIndicator";
import bodyJSON from "../utils/body.json";
import notesJSON from "../utils/notes.json";

const Count = styled.div`
  padding: 0px 18px;
`;

const Actions = styled.div`
  display: flex;
`;

/** Component for the main editing page. */
class EditingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bodyValue: Value.fromJSON(bodyJSON),
      notesValue: Value.fromJSON(notesJSON),
      hasSaved: null,
      error: null
    };
  }

  componentDidMount() {
    this.handleLoading();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  /** The function when the content in Body editor is changed  */
  onChangeBody = ({ value }) => {
    const { bodyValue } = this.state;
    // Check to see if the document has changed before saving.
    if (value.document !== bodyValue.document) {
      this.setState({
        hasSaved: false,
        error: null
      });
      // The handleSaving function will execute after 500ms in order to show the transition process of save status more clearly
      this.time = setTimeout(() => {
        this.handleSaving();
      }, 500);
    }
    this.setState({
      bodyValue: value
    });
  };

  /** The function when the content in Notes editor is changed  */
  onChangeNotes = ({ value }) => {
    const { notesValue } = this.state;
    // Check to see if the document has changed before saving.
    if (value.document !== notesValue.document) {
      this.setState({
        hasSaved: false,
        error: null
      });
      // The handleSaving function will execute after 500ms in order to show the transition process of save status more clearly
      this.time = setTimeout(() => {
        this.handleSaving();
      }, 500);
    }
    this.setState({
      notesValue: value
    });
  };

  /** Make network requests automatically to sync the save payload to the server. */
  async handleSaving() {
    const { bodyValue, notesValue } = this.state;
    const { match } = this.props;
    const url = "http://127.0.0.1:3333/api/saving";
    const postData = {
      workId: match.params.workId,
      bodySave: JSON.stringify(bodyValue),
      notesSave: JSON.stringify(notesValue)
    };
    await axios
      .post(url, postData)
      .then(response => {
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
          error: err.toString()
        });
      });
  }

  /** Make network request(s) to load its last save and populate the editors. */
  async handleLoading() {
    const { match } = this.props;
    const url = "http://127.0.0.1:3333/api/loading/";
    await axios
      .get(url + match.params.workId)
      .then(response => {
        if (response.data.status === "success") {
          if (response.data.bodyJSON) {
            this.setState({
              bodyValue: Value.fromJSON(JSON.parse(response.data.bodyJSON)),
              hasSaved: true,
              error: null
            });
          }
          if (response.data.notesJSON) {
            this.setState({
              notesValue: Value.fromJSON(JSON.parse(response.data.notesJSON)),
              hasSaved: true,
              error: null
            });
          }
          if (!response.data.bodyJSON && !response.data.notesJSON) {
            this.setState({
              hasSaved: null,
              error: null
            });
          }
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
          error: err.toString()
        });
      });
  }

  render() {
    const { tab, changeTab } = this.props;
    const { bodyValue, notesValue, hasSaved, error } = this.state;
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
            {error ? (
              <Alert>Fail to connect. Please check the network.</Alert>
            ) : null}
            <Actions>
              <SaveIndicator hasSaved={hasSaved} error={error} />
              <Count>
                <strong>Word Count:</strong> ???
              </Count>
            </Actions>
          </ShelfToolbar>
        </Shelf>
        <Desk>
          <Primary>
            {tab === "body" ? (
              <Body value={bodyValue} onChange={this.onChangeBody} />
            ) : (
              <Notes value={notesValue} onChange={this.onChangeNotes} />
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
