# Homework

This document can be read online at:
https://gist.github.com/ashutoshrishi/49482c92373b715449609017b1710fd7

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->
**Table of Contents**

- [Homework](#homework)
- [Introduction](#introduction)
- [Task Setup](#task-setup)
- [Rubrics](#rubrics)
- [Prerequisites](#prerequisites)
- [Terminology](#terminology)
- [Primary task - Auto Saving and Loading](#primary-task---auto-saving-and-loading)
    - [Saving](#saving)
    - [Client functionality](#client-functionality)
    - [Server functionality](#server-functionality)
- [Secondary Tasks (optional and not required)](#secondary-tasks-optional-and-not-required)
    - [Secondary Task 1 - Word count](#secondary-task-1---word-count)
    - [Secondary Task 2 - Reactive Loading](#secondary-task-2---reactive-loading)
- [Code Style](#code-style)
- [Submitting the task](#submitting-the-task)
- [Screenshots and Design](#screenshots-and-design)
    - [Save indicator and Word count](#save-indicator-and-word-count)

<!-- markdown-toc end -->


# Introduction

Welcome to the Cadmus Homework task.

This task is setup to introduce you to the Cadmus Student front-end client,
technically and conceptually. You will be adding full-stack features to a
bare-bone version of the client app with the freedom to choose your backend
implementation.

The Cadmus Student environment is where the students access information on their assignment (provided by the Lecturer environment) and complete their assignment. While students write their work, the environment regularly saves their current work to the cloud. Eventually a final submission can be made from within the client.

The code-base provided contains a simplified React front-end client code in the `client/`
folder. See it's README for a brief description on its content and running the app.

For more information on Cadmus and its engineering team see: https://medium.com/cadmus-io/cadmus-engineering-4c00a6b37246

# Task Setup

The homework task contains one **Primary** task which you are required to
complete. This task involves building a *auto-saving* mechanism for the two rich text editors present in the provided client app. You will have to write a simple backend API and add a few React features to the front-end to complete this task.

A **successful solution** should behave similar to the saving in Google Docs or Dropbox Paper.

There are a other **Secondary** tasks which are completely optional. You don't have to attempt these tasks, and if you do you should do only one. We are more interested in the primary task. Therefore you should show us your work for the primary task before you decide to spend some time on a secondary task.

You are free to extend the client code and add more features to it as you see fit. The provided client code is intentionally kept simple. Your solutions might require Redux, Apollo + Graphql, RxJS, websockets, Rambda, Immutable .etc. We would love to see how you compose different solutions together.

The backend can be written in any language. The requirements for the backend aren't too complex. It should be a simple web server providing a JSON API.

Don't spend too much time in isolation, open a discussion through emails if you are stuck. Not all problems can be solved alone.

A written discussion on pitfalls, performance, and other considerations is appreciated. You can do this via a `NOTES.md` file in your submission, or start emailing us directly with your questions and solution.

# Rubrics

Your code will be reviewed on the following points:

* *Does it work?*
  - making changes in both editors and refreshing should keep the changes
* *Are there any React usage errors?*
  - check for idiomatic usage and data flow in a React component tree
* *Are the side-effects being contained properly?*
  - check how the side-effects are tied to the lifetime of a React component
    tree
* *Has the React rendering performance been considered?*
  - check for unnecessary renders using the React dev tool
* *Has the network connectivity status / latency been considered?*
  - check for behaviour when the server is down or request speed is slow.
* *Correct usage of data structures.*
* *Is the API design sensible?*
* *Is the code style up to mark?*
  - check for unused variables and bad assignments
  - prefer a functional style over an imperative style and mutations
* *Are there any ES6/Java script errors or warnings?*
  - check browser console and terminal

# Prerequisites

The client is a `create-react-app` based React application. It contains no special state management library (we love Redux, but have not included it for the task).

The client contains two rich text editors built using the `slate` and `slate-react` editor framework. You don't need to completely understand how Slate works, but you should read its usage documentation.

**Front-end libraries used:**

* [React](https://reactjs.org/)
* [react-router](https://reacttraining.com/react-router/) - Client side URL routing for react.
* [recompose](https://github.com/acdlite/recompose) - React utility belt for higher order components
* [Slate Editor](https://docs.slatejs.org/) - Rich text editing framework in React.
* [styled-components](https://www.styled-components.com/) - this is our preferred CSS-in-JS solution and we use it extensively.

# Terminology

A few Cadmus specific terminology used in the README:

* **Work:** students make changes to their "Work" (starting from a blank state)
as they complete their assignment. Every student creates a unique Work within an assignment which is eventually submitted.
* **Body:** the name for the main rich text Editor where students write their Work.
* **Notes:** the name for an additional rich text Editor which is used to write additional research notes attached to a Work. This is not submitted, but is synced/saved to the cloud.
* **Save:** a snapshot of the Work state (Body and Notes), made regularly.

The Student Environment has multiple Rich Text React Editors (using [slate editor](https://docs.slatejs.org/)). These Editors are named after the type of content they hold: **Body** (main content), **Notes**, and **References** (this is not used in this project).

A Slate `<Editor />` stores its immutable data model in memory, which is transformed by applying **changes** on it. This model is called the *Value* (refer to the `slate` documentation for more details).

A Students' **Work** state is a combination of all the Editor contents (alongside other metadata). Over time a *Work* state should have many *Saves*. Each *Save* is a persisted value of the *Work* state and follows some form of ordering (time based or version number based).

A Work is unique to a student and is referenced by a unique UUID. This
ID is part of the main editing URL route of the client app: `/work/:workId/editing`. Saves should be linked to this `:workId`.


# Primary task - Auto Saving and Loading

The **first part** of this task requires implementing automatic *Saving* (or *Syncing*) of the editor contents over the network. See the section on [*Saving*](#saving) below for more information on how saving should work.

The **second part** requires implementing *Loading*. A simple *Saving* implementation will provide *Normal Loading*: the changes you make to
both the editors should persist across browser refreshes.

You should design your save payload(s) to persist both the *Body* and
*Notes* editor contents. The format of the Save payload is up to you. Slate provides serialisation and de-serialisation utilities (using JSON). As mentioned above, Saves are persisted against a `workId` (foreign key in a relational database). You should pull the `:workId` from the editing route parameter.

There should also be some UI/UX based feedback on the current save/sync status. Use the `<Shelf />` component (in `<EditingPage />` to add an indicator component. You can refer to the screenshot below for a design inspiration. Look at Google Docs and Dropbox Paper for more ideas on the ways to provide sync feedback.

Your solution should provide enough confidence to the student on the current sync status of their Work, and let them know when there is an error / interruption.

## Saving

A *Saving* process involves persisting regular snapshots of the Client Editor Values associated with the Work that is being written in any editor.

An automating *Saving* process, or auto-save, does this network syncing transparently in the background. This automatic step should be frequent enough to not require the user to click some Save button. Again, see how Google Docs and Dropbox Paper perform saving.

A Work is unique to a student and is referenced by a UUID. This ID is part of the main editing URI route in student client: `/work/:workId/editing`. Saves should be linked to this `:workId`. Note that we are ignoring authentication for this task, if you have any `:workId`, you can access its saves regardless of who created them.

Both the editor values should be saved and loaded, either together or independently. The main data structure you are Saving from the client is the Slate editor `Value`. These can be serialised and de-serialised from JSON strings.

On the server, Saves can either be **immutable** or **mutable**. We prefer immutable: each save is a distinct record. The saves are ordered and at any given point in time, we can compute the latest save record based on that ordering. This gives us a full history of saves.

If you choose to persist saves in a mutable store, every new save will replace the previous one. There will be no history here, but the choice of the latest save record is obvious.

The save/sync requests should happen automatically and asynchronously in the background. You will need to come up with a heuristic on when to trigger this process and when to avoid it. The time window you choose to trigger the save process will directly affect the client and server load + performance.

A good saving implementation should be non-intrusive but still provide enough confidence to the user that their latest work has been synced to the cloud. A bad UX flow here would involve the user being informed that everything is saved, but the network requests have not finished. You will have to manage this feedback information using a save indicator component (and anything else you want to add).

In general, *Saving* should come with a *Loading* process too. That is, the *last* thing saved should be loaded onto the client on the next refresh. How you manage ordering here is up to you.

## Client functionality

* Client makes network requests automatically to sync the save payload to the
  server.
* Client makes network request(s) to load its last save and populate the
  editors.
* A save/sync feedback component.

## Server functionality

You will have to implement your own backend server, persistence layer, and API. We use Elixir, PostgreSQL + S3, and GraphQL in Production. Feel free to use any language and storage you want and feel is well suited for persisting a large throughput of saves.

Since there is no production deployment involved, you might choose simpler local alternatives to bigger frameworks and stacks. We are more interested in your intentions behind the choices. For example, you can use a single Sqlite DB file or a simple in-memory object store to emulate a production relational DB or Redis cache respectively. If you want model persisted saves as a streaming data structure, you don't have to instantiate Kinesis or Kafka, just using an in-memory channel or stream.

**Full persistence is not necessary.** You don't need to worry about data being persisted across server restarts. It's alright if the server starts fresh every time.

**Features:**

* API endpoint to accept saves payloads over HTTP.
* Some form of storage for all the saves against the Work ID.
* API endpoint to serve the last save for the given Work ID back over HTTP.

# Secondary Tasks (optional and not required)

## Secondary Task 1 - Word count

There is a placeholder for the active word count in the top **Shelf**. This task involves replacing that placeholder with a working almost real-time word count.

The word count should be for the current editor being display: **Body** or **Notes**. The word count should **appear** to update in real time as a student writes in the editor.

An active word count calculation is going to be an intensive process and can cause performance problems if done on every keystroke. There are a lot of strategies you could employ to optimise the live word count so that we can give the student's the best experience possible.

**Notes:**

* You can change how and where the body Editor `Value` is stored to make it easy to perform computations on it.
* You will have to skim the slate editor documentation to learn how to pull the text from a slate Value, or just ask.
* The definition of what counts as a word can vary and that's alright. We aren't too worried about getting the word count super accurate, as long as it is consistent, easy to understand, and handles trivial cases.

## Secondary Task 2 - Reactive Loading

There is another form of loading called the *Reactive Load*. In a *Reactive Load*, **all open tabs of the client should reflect the latest saved content *Reactively* without a refresh** whenever any one of the tabs performs a save.

In a successful implementation you should be able to the following things:
* Open 2 tabs of the client.
* Add some content in the first tab and let it auto save.
* The second tab should display the same content as the first without refresh.

The server maintains stateful connections to clients and broadcasts received saves to all open clients.

The heuristic for deciding on the latest correct version can get complicated once you allow offline sessions.

# Code Style

There is an [eslint](https://eslint.org/) configuration included in the project. It also sets up [prettier](https://prettier.io/).

We recommend setting your favourite editor use prettier automatically. It will enforce a uniform style guide.

# Submitting the task

You should add your code and NOTES.md to under this folder tree. Perhaps a separate `server` folder for your server code. There is an existing top-level `Makefile`, you can use it for instructions on building your server. Alternatively, just provide documentation on how to run your code.

To bundle everything in an archive you can use the existing make rule:

    make bundle

This runs a simple `git archive`.

# Screenshots and Design

These are the reference designs for the tasks above. Don't take these designs as gospel or final. We want you to employ your creativity and make your own UX decisions.

You can build your own components or use the pre-existing component
libraries like `material-ui`.

## Save indicator and Word count

![Word count](/screenshots/toolbar-actions.png?raw=true "Save and Word
Count")

Every few seconds, Cadmus will autosave your work. The save status of your work can be found in the top-right corner, right next to the Submit button. When this displays saved, the latest version of your work has been saved to the cloud.

Adjacent to the save status is the word count. The word count updates every time you stop typing. Depending on what section of Cadmus you’re working in (Notes, Body or References), the word count displays accordingly. If you highlight a section of text, the word count gives you the number of words selected.
