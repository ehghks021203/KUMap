import React from 'react';
import styled from "styled-components";
import palette from '../../constants/styles';

import Spinner from "../../assets/images/spinners/loadingpage_loading.gif";

function LoadingPage() {

    return (
        <Background>
            <LoadingText>잠시만 기다려 주세요.</LoadingText>
            <img src={Spinner} alt="로딩중" width="10%" />
        </Background>
    );
}

const Background = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: ${palette.whiteM};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const LoadingText = styled.h1`
    margin-bottom: 0px;
    text-align: center;
    font-family: "SC Dream 6";
    font-size: 32px;
    color: ${palette.blueM};
`

export default LoadingPage;