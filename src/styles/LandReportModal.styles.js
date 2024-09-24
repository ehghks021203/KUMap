import styled from "styled-components";
import palette from "../constants/styles";

export const Background = styled.div`
    position: fixed;
    right: 0px;
    bottom: 0px;
    background-color: rgba(0, 0, 0, 0.4);
    width: 100vw;
    min-width: ${(props) => (props.isMobile ? "none" : "900px")};
    height: 100vh;
    z-index: 100;
    display: flex;
    justify-content: center;
`;

export const Container = styled.div`
    position: relative;
    background-color: #fafafa;
    box-sizing: border-box;
    border-radius: 10px;
    top: calc(50vh - 325px);
    width: 680px;
    height: 680px;
    z-index: 100;
`;

export const TitleText = styled.h2`
    margin-top: 20px;
    margin-bottom: 6px;
    padding-left: 20px;
    text-align: left;
    text-decoration: none;
    font-family: "SC Dream 6";
    font-size: 24px;
    color: #343a40;
`;

export const Content = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    width: 640px;
    height: 570px;
    overflow-x: hidden;
    overflow-y: auto;
`;

export const NoticeText = styled.div`
    padding: 20px;
    font-family: "SC Dream 4";
    font-size: 12px;
    text-color: gray;
`;

export const CloseButton = styled.button`
    position: absolute;
    right: 20px;
    top: 20px;
    width: 32px;
    height: 32px;
`;