import React from "react";
import styled from "styled-components";
import palette from '../constants/styles';
import { MoonLoader } from "react-spinners";


function Loading({ loadingAddr="", type="" }) {
    if (type === "") {
        return (
            <Background>
                <MoonLoader color={palette.blueM}/>
                <LoadingText>데이터 로딩중..</LoadingText>
            </Background>
        )
    } else {
        return (
            <Background>
                <MoonLoader color={palette.blueM}/>
                <LoadingText>{loadingAddr}의 {type} 정보 로딩중..</LoadingText>
            </Background>
        )
    }
}



const Background = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const LoadingText = styled.h1`
    margin-bottom: 0px;
    text-align: center;
    font-family: "SC Dream 6";
    font-size: 18px;
    color: ${palette.blueM};
`

export default Loading;