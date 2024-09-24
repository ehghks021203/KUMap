import React from 'react';
import styled from "styled-components";
import palette from '../../constants/styles';

function ErrorPage() {
    return (
        <Background>
            <ErrorText>서버가 일시적으로 중단되었습니다.</ErrorText>
            <Content>
                해당 오류가 지속된다면 아래 메일로 연락 부탁드립니다.
                <br/>
                Email: ehghks021203@gmail.com
            </Content>
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

const ErrorText = styled.h1`
    text-align: center;
    font-family: "SC Dream 6";
    font-size: 32px;
    color: ${palette.blueM};
`

const Content = styled.span`
    display: block;
    text-align: center;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: ${palette.blackM};
`

export default ErrorPage;