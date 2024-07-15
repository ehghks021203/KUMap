import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from 'react-redux';
import { ScaleLoader } from "react-spinners";
import { setLandReportAddr, setLandReportLoading } from "../../../actions/globalValues";
import style from './markdown-styles.module.css';
import styled from "styled-components";
import palette from '../../../lib/styles/colorPalette';
import axios from "axios";

const LandReportModal = ({ isMobile=false }) => {
    const dispatch = useDispatch();
    const landReportAddr = useSelector(state => state.globalValues.landReportAddr);
    const landReportLoading = useSelector(state => state.globalValues.landReportLoading);
    const [markdownText, setMarkdownText] = useState("")

    useEffect(() => {
        console.log(landReportAddr);
        dispatch(setLandReportLoading(true));
        axios.post(`${process.env.REACT_APP_API_URL}/get_land_report`, {
            "pnu": landReportAddr.pnu
        }).then(function(landResponse) {
            dispatch(setLandReportLoading(false));
            setMarkdownText(landResponse.data.report);
        }).catch(function(error) {
            alert(error);
        });
    }, [landReportAddr]);

    return (
        <Background>
            <Container>
                <CloseButton onClick={() => dispatch(setLandReportAddr(null))}>
                    Close
                </CloseButton>
                <TitleText>AI 토지 분석서</TitleText>
                <Content>
                    { markdownText === "" ?
                        <div style={{paddingTop:"200px", display:"flex", flexDirection: "column", alignItems: "center"}}>
                            <ScaleLoader color={palette.blueM}/>
                            <NoticeText>토지 분석서를 생성하는 중입니다. 이 작업에는 약 1분의 시간이 소요됩니다.</NoticeText>
                        </div> :
                        <ReactMarkdown className={style.reactMarkDown}>{markdownText}</ReactMarkdown>
                    }
                </Content>
                <NoticeText>* 본 토지 분석서는 예측 모델을 기반으로 실제 토지의 데이터와 다를 수 있습니다.</NoticeText>
            </Container>
        </Background>
    );
};

const Background = styled.div`
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

const Container = styled.div`
    position: relative;
    background-color: #fafafa;
    box-sizing: border-box;
    border-radius: 10px;
    top: calc(50vh - 325px);
    width: 680px;
    height: 680px;
    z-index: 100;
`;

const TitleText = styled.h2`
    margin-top: 20px;
    margin-bottom: 6px;
    padding-left: 20px;
    text-align: left;
    text-decoration: none;
    font-family: "SC Dream 6";
    font-size: 24px;
    color: #343a40;
`;

const Content = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    width: 640px;
    height: 570px;
    overflow-x: hidden;
    overflow-y: auto;
`;

const NoticeText = styled.div`
    padding: 20px;
    font-family: "SC Dream 4";
    font-size: 12px;
    text-color: gray;
`;

const CloseButton = styled.button`
    position: absolute;
    right: 20px;
    top: 20px;
    width: 32px;
    height: 32px;
`;

export default LandReportModal;