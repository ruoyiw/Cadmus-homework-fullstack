import styled from "styled-components";

export const Shelf = styled.div`
  width: 100%;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.09), 0 -9px 18px 0 rgba(0, 0, 0, 0.18);
  z-index: 2;
  flex: none;
  font-size: 14px;
`;

export const ShelfToolbar = styled.div`
  width: 100%;
  height: 39px;
  background-color: white;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Desk = styled.div`
  height: 0;
  display: flex;
  flex: auto;
  position: relative;
  z-index: 1;
`;

export const Primary = styled.div`
  display: flex;
  flex: auto;
  min-height: 0;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.09), 0 2px 4px 0 rgba(0, 0, 0, 0.27);
  position: relative;
  overflow-y: auto;
`;

export const Alert = styled.div`
  padding: 10px;
  background-color: #fff0b3;
  border-style: solid;
  border-width: 1px;
  border-color: #ffcc80;
  color: black;
  margin-top: 15px;
  margin-bottom: auto;
  box-shadow: 2px 2px 2px #aaaaaa;
  height: 10px;
  line-height: 10px;
  font-size: 13px;
  text-align: center;
`;
