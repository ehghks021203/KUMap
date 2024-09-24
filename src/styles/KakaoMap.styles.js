import styled from "styled-components";
import palette from "../constants/styles";

export const MapContainer = styled.div`
    position: relative;
    width: ${(props) => (props.isMobile ? "100%" : "calc(100% - 500px)")};
    min-width: ${(props) => (props.isMobile ? "none" : "400px")};
    height: 100%;
    z-index: 5;
`;

export const MapButton = styled.button`
    position: absolute;
    background: rgba(250, 250, 250, 1);
    filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3));
    border: 0;
    border-radius: 6px;
    top: calc(${(props) => (props.isMobile ? "20px" : "30px")} + ${(props) => (props.number * (props.isMobile ? "45" : "60"))}px);
    right: ${(props) => (props.isMobile ? "10px" : "20px")};
    width: ${(props) => (props.isMobile ? "36px" : "42px")};
    height: ${(props) => (props.isMobile ? "36px" : "42px")};
    z-index: 10;
    text-align: center;
    font-family: "SC Dream 6";
    font-size: ${(props) => (props.isMobile ? "8px" : "12px")};
    color: #767676;
    cursor: pointer;
`;

export const MobileListOpenBtn = styled.button`
    position: absolute;
    background-color: ${palette.whiteL};
    filter: drop-shadow(0px -3px 6px rgba(0, 0, 0, 0.161));
    bottom: 10px;
    right: 20vw;
    border-radius: 20px;
    width: 60vw;
    height: 40px;
    border: 0;
    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 6";
    font-size: 15px;
    color: ${palette.blackL};
    z-index: 10;
    &:hover {
        background: ${palette.whiteM};
        cursor: pointer;
    }
`;

export const MobileSideWindowOpenButton = styled.button`
    background-color: ${palette.whiteL};
    filter: drop-shadow(0px -3px 6px rgba(0, 0, 0, 0.161));
    width: 100vw;
    height: 80px;
    border: 0;
    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 6";
    font-size: 15px;
    color: ${palette.blackL};
    &:hover {
        background: ${palette.whiteM};
        cursor: pointer;
    }
`;
