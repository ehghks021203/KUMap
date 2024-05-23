import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setPrevCenterAddr } from '../../../actions/globalValues';
import axios from "axios";
import styled from "styled-components";

const LandRegisterPage = ({ isMobile=false, currUserData, regLandData, setRegLandData, LoadLand }) => {
    // 전역변수 관리리
    const dispatch = useDispatch();
    const prevCenterAddr = useSelector(state => state.globalValues.prevCenterAddr);

    // 소유주 등록 버튼 활성화 변수
    const [activate, setActivate] = useState(false);
    
    const circleCount = 4;
    const [circleActive, setCircleActice] = useState(1);

    const [landArea, setLandArea] = useState(0);
    const [landPrice, setLandPrice] = useState(0);

    const [summary, setSummary] = useState("");
    const [summaryCount, setSummaryCount] = useState(0);



    const HandlerRegButton = () => {
        axios.post("https://csgpu.kku.ac.kr:5001/land_for_sale", {
            "email": currUserData.email,
            "lat": regLandData.lat,
            "lng": regLandData.lng,
        })
        .then(function(regResponse) {
            console.log(regResponse);
            // 토지 데이터 다시 로드
            LoadLand(regLandData.lat, regLandData.lng);
        })
        setRegLandData({"type":"none"});
    }

    useEffect(() => {
        setLandArea(regLandData.land_area);
        setLandPrice(0);
    }, [])

    useEffect(() => {
        if (circleActive === 2) {
            if (landArea !== 0 && landArea !== "") {
                setActivate(true);
            } else {
                setActivate(false);
            }
        } else if (circleActive === 3) {
            if (landPrice !== 0 && landPrice !== "") {
                setActivate(true);
            } else {
                setActivate(false);
            }
        }
    }, [activate, landArea, landPrice])

    const HandlerProgressButton = (type) => {
        if (type === "next") {
            if (circleActive < 4 && activate) {
                if (circleActive === 1 && (landArea === 0 || landArea === "")) {
                    setActivate(false);
                } else if (circleActive === 2 && (landPrice === 0 || landPrice === "")) {
                    setActivate(false);
                } else if (circleActive === 3) {
                    setActivate(false);
                }
                setCircleActice(circleActive + 1);
            } else if (circleActive === 4) {
                axios.post(`${process.env.REACT_APP_API_URL}/reg_land_for_sale`, {
                    "land_area": landArea,
                    "land_price": landPrice * 10000,
                    "land_summary": summary,
                    "lat": regLandData.lat,
                    "lng": regLandData.lng,
                }, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                        "Content-Type": "application/json",
                    }
                }).then(function(regResponse) {
                    console.log(regResponse);
                    // 토지 데이터 다시 로드
                    LoadLand(regLandData.lat, regLandData.lng);
                })
                window.alert("매물 등록이 완료되었습니다.");
                dispatch(setPrevCenterAddr(""));
                setRegLandData({"type":"none"});
            }
        } else {
            if (circleActive > 1) {
                if (circleActive > 2) {
                    setActivate(true);
                } else {
                    setActivate(false);
                }
                setCircleActice(circleActive - 1);
            }
        }
    }

    const HandlerSummaryInput = (e) => {
        setSummary(e.target.value);
        setSummaryCount(e.target.value.length);
    }

    const ReturnContent = (index) => {
        if (index === 1) {
            return (
                <div>
                    <ContentText>
                        현 위치 토지의 소유자 또는 매매권리를 가지고 있는 분만 등록해주세요.
                    </ContentText>
                    <div style={{display:"flex"}}>
                        <Checkbox type="checkbox" onClick={() => setActivate(!activate)}/> <CheckboxText>해당 토지의 소유주인가요?</CheckboxText><br/>
                    </div>
                </div> 
            );
        } else if (index === 2) {
            return (
                <div>
                    <ContentText>
                        토지 면적을 입력해 주세요.<br/>
                        지분 보유일 경우 보유하신 면적을 입력해 주세요.<br/>
                        기본 값은 해당 지번의 전체 면적입니다.
                        
                    </ContentText>
                    <div><div style={{display:"flex"}}>
                        <LandInput id="landArea" placeholder="거래 면적 입력" defaultValue={landArea} onChange={(e) => setLandArea(e.target.value)}/>
                        <UnitText>m²</UnitText>
                    </div></div>
                    
                    
                </div> 
            );
        } else if (index === 3) {
            return (
                <div>
                    <ContentText>
                        토지 매매가를 입력해 주세요.<br/>
                        가격이 높으면 거래가 잘 성사되지 않을 수 있습니다.<br/>
                        공시지가 실거래 정보를 참고해 주십시오.
                        
                    </ContentText>
                    <div style={{display:"flex"}}>
                        <LandInput id="landPrice" placeholder="거래 가격 입력" defaultValue={landPrice} onChange={(e) => setLandPrice(e.target.value)}/>
                        <UnitText>만원</UnitText>
                    </div>
                </div> 
            );
        } else {
            return (
                <div>
                    <ContentText>
                        간략하게 매물 소개글을 작성해주세요.<br/>
                        <LandSummaryInput placeholder="매물 소개" onChange={HandlerSummaryInput} maxLength={100}/>
                        <LandSummaryCountText>
                            {summaryCount}/100 자
                        </LandSummaryCountText>

                        약관에 동의해 주십시오.<br/>
                        
                        개인정보 수집 및 제3자 제공 동의<br/>
                    
                    </ContentText>
                    <div style={{display:"flex"}}>
                        <Checkbox type="checkbox" onClick={() => setActivate(!activate)}/> <CheckboxText>위 약관에 동의합니다.</CheckboxText><br/>
                    </div>
                </div> 
            );
        }
        
    }

    // PC 화면
    if (!isMobile) {
        return (
            <Background>
                <Container>
                    <CloseButton onClick={() => setRegLandData({"type":"none"})}/>
                    <TitleText>현 위치 매물 등록하기</TitleText>
                    <SubtitleText>현 위치: {regLandData.addr}</SubtitleText>
                    <ProgressContainer>
                        <Progress style={{ width: `${((circleActive - 1) / (circleCount - 1)) * 100}%` }}/>
                        {[...Array(circleCount)].map((_, index) => (
                            <Circle key={index} isActive={index < circleActive ? true : false}>
                                {index + 1}
                            </Circle>
                        ))}
                    </ProgressContainer>
                    {ReturnContent(circleActive)}
                        
                    <Button id="prev" isDisable={circleActive === 1} onClick={() => HandlerProgressButton("prev")}>이전</Button>
                    <Button id="next" isDisable={!activate} onClick={() => HandlerProgressButton("next")}>
                        {circleActive === 4 ? "매물 등록" : "다음"}
                    </Button>
                    
                </Container>
            </Background>
        );
    }
    // 모바일 화면
    else {
        return (
            <Background>
                <Container>
                    
                </Container>
            </Background>
        );
    }
    
}


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
`

const Container = styled.div`
    position: absolute;
    background-color: #fafafa;
    box-sizing: border-box;
    border-radius: 10px;
    top: calc(50vh - 125px);
    width: 620px;
    height: auto;

    z-index: 100;
`

const TitleText = styled.h2`
    margin-top: 20px;
    margin-bottom: 6px;
    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 6";
    font-size: 24px;
    color: #343a40;
`

const SubtitleText = styled.h2`
    margin-top: 6px;
    margin-bottom: 6px;
    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: #343a40;
`

const ContentText = styled.span`
    display: block;
    margin-top: 6px;
    margin-bottom: 6px;
    margin-left: 22px;
    text-align: left;
    text-decoration: none;
    font-family: "SC Dream 4";
    font-size: 18px;
    color: #343a40;
`

const CloseButton = styled.button`
    position: absolute;
    right: 20px;
    top: 20px;
    width: 32px;
    height:32px;
`


const Checkbox = styled.input`
    position: relative;

    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;

    width: 24px;
    height: 24px;
`
const CheckboxText = styled.span`
    position: relative;
    display: block;

    width: 200px;
    
    margin-top: 10px;
    margin-left: 10px;
    text-align: left;
    text-decoration: none;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: #ff3636;
`

// 진행단계바
const ProgressContainer = styled.div`
    display: flex;
    justify-content: space-between;
    position: relative;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 30px;
    width: 400px;

    &::before {
        content: '';
        background-color: #e0e0e0;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        height: 4px;
        width: 100%;
        z-index: -1;
    }
`

const Progress = styled.div`
    background-color: #3498db;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 4px;
    width: 0%;
    z-index: -1;
    transition: 0.4s ease;    
`

const Circle = styled.div`
    background-color: #fff;
    color: #999;
    border-radius: 50%;
    height: 48px;
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 5px solid ${(props) => (props.isActive ? "#3498db" : "#e0e0e0")};
    transition: 0.4s ease;

    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 6";
	font-size: 15px;
    color: ${(props) => (props.isActive ? "#3498db" : "#e0e0e0")};
`

const Button = styled.button`
    background-color: ${(props) => (props.isDisable ? "#e0e0e0" : "#3498db")};
    color: #fff;
    border: 0;
    border-radius: 6px;

    margin-top: 5px;
    margin-left: 20px;
    margin-right: -10px;
    margin-bottom: 18px;
    bottom: 20px;
    width: 284px;
    height:42px;

    font-family: "SC Dream 6";
    font-size: 18px;
    cursor: ${(props) => (props.isDisable ? "not-allowed" : "pointer")};

    &:focus {
        outline: 0;
    }
`


// 거래 면적 및 가격 입력 창
const LandInput = styled.input`
    background: rgba(236, 236, 236, 1);
    width: 120px;
    height: 42px;
    border: none;
    border-radius: 6px;
    margin-top: 10px;
    margin-left: 20px;
    margin-bottom: 20px;
    padding-left: 20px;
    font-family: "SC Dream 4";
	font-size: 15px;
    color: rgba(127,127,127,1);
`

const UnitText = styled.span`
    margin-top: 18px;
    margin-left: 12px;
    font-family: "SC Dream 4";
    font-size: 18px;
    color: rgba(127,127,127,1);
`

// 매물 소개 입력창
const LandSummaryInput = styled.textarea`
    background: rgba(236, 236, 236, 1);
    width: 556px;
    height: 84px;
    border: none;
    border-radius: 6px;
    margin-top: 10px;

    padding: 10px;
    font-family: "SC Dream 4";
    font-size: 18px;
    color: rgba(127,127,127,1);
`;
const LandSummaryCountText = styled.span`
    display: block;
    width: 576px;
    text-align: right;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: rgba(127,127,127,1);
`;


export default LandRegisterPage;