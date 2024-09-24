import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from 'react-redux';
import { ScaleLoader } from "react-spinners";
import { setLandReportAddr, setLandReportLoading } from "../../../store/actions/globalValues";
import style from './MarkdownStyles.module.css';
import styled from "styled-components";
import palette from '../../../constants/styles';
import axios from "axios";
import { fetchLandReportData } from "../../../utils/api";
import { Background, Container, CloseButton, TitleText, Content, NoticeText } from "../../../styles/LandReportModal.styles";

const LandReportModal = ({ isMobile=false, onClose }) => {
    const dispatch = useDispatch();
    const landAddress = useSelector(state => state.globalValues.landAddress);
    const landReportLoading = useSelector(state => state.globalValues.landReportLoading);
    const [markdownText, setMarkdownText] = useState("")

    useEffect(() => {
        if (!landAddress) { return; }
        console.log(landAddress);
        dispatch(setLandReportLoading(true));
        fetchLandReportData({ pnu: landAddress.pnu })
        .then(response => {
            setMarkdownText(response.data.report);
        })
        .catch(error => {
            if (axios.isCancel(error)) {
                console.error("Request canceled", error.message);
            } else {
                console.log(error);
            }
        })
        .finally(() => {
            dispatch(setLandReportLoading(false));
        });
    }, [landAddress]);

    return (
        <Background>
            <Container>
                <CloseButton onClick={() => onClose()}>
                    X
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



export default LandReportModal;