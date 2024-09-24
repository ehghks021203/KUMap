import React from "react";
import styled from "styled-components";
import Loading from "../../../components/Loading";

import { useDispatch, useSelector } from 'react-redux';
import { setLandAddress } from '../../../store/actions/globalValues';
import { LAND_TYPES } from "../../../constants/enums";
import palette from '../../../constants/styles';

function RegionLand ({ isMobile=false }) {
    const dispatch = useDispatch();
    const landAddress = useSelector(state => state.globalValues.landAddress);

    const handleLandPageOpen = (land) => {
        console.log(land)
        dispatch(setLandAddress({ type: LAND_TYPES.LAND_INFO, lat: land.lat, lng: land.lng, address: land.address, pnu: land.pnu }));
    }

    // 조건부 렌더링
    if (!isMobile) {
        return (
            <Container>
                    {landAddress.type === LAND_TYPES.REGION_LAND_UNLOAD ? (
                        <Content>
                            <Loading/>
                        </Content>
                    ) : (
                        <Content>
                            <CenterAddrText>{landAddress.address}</CenterAddrText>
                            {landAddress.avg_predict_land_price != 0 ? (
                                <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                                    <LandInfoMiniText>예측된 토지: 총 {landAddress.total_land_count}개</LandInfoMiniText><br/>
                                
                                    <LandInfoMiniText>평균 토지 예측가: </LandInfoMiniText>
                                    <LandInfoPriceText style={landAddress.price_ratio > 100 ? {color: palette.redM} : {color: palette.blueM}}>{Math.floor(landAddress.avg_predict_land_price).toLocaleString('ko-KR')}원/m²당</LandInfoPriceText>
                                    <div>
                                        <LandInfoMiniText>공시지가의 </LandInfoMiniText>
                                        <LandInfoMiniText style={landAddress.price_ratio > 100 ? {color: palette.redM} : {color: palette.blueM}}>{landAddress.price_ratio}%</LandInfoMiniText>
                                    </div>
                                </div>
                                ) : (
                                    <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                                        <LandInfoMiniText>예측된 토지: 총 {landAddress.total_land_count}개</LandInfoMiniText><br/>
                                        <NoResultsText>예측된 토지가 존재하지 않습니다.</NoResultsText>
                                    </div>
                                )}
                            <br/>
                            {landAddress.land.map((land, i) => (
                                <RegionButton onClick={() => handleLandPageOpen(land)}>
                                    <RegionContent>
                                        <AddrText>{land.address.address}</AddrText>
                                        <div style={{display: "flex-direction"}}>
                                            <RegionPriceContent>
                                                <RegionPriceTitle>토지 예측가</RegionPriceTitle><br/>
                                                {Math.floor(land.predict_land_price).toLocaleString('ko-KR')}
                                            </RegionPriceContent>
                                            <RegionPriceContent style={land.price_ratio > 100 ? {color: palette.redM, border:"0"} : {color: palette.blueM, border:"0"}}>
                                                <RegionPriceTitle>공시지가의</RegionPriceTitle><br/>
                                                {land.price_ratio}%
                                            </RegionPriceContent>
                                        </div>
                                    </RegionContent>
                                </RegionButton>
                            ))}
                        </Content>
                    )}
                    
                    
                    
                    <div style={{marginBottom:"50px"}}/>
                
            </Container>
        );
    }
}

// 사이드 윈도우 스타일
const Container = styled.div`
    position: relative;
    background: rgba(250, 250, 250, 1);

    flex-shrink: 1;
    width: ${(props) => (props.isMobile ? "100vw" : "500px")};
    height: calc(100% - 50px);

    z-index: ${(props) => (props.isMobile ? "100" : "8")};
`

// 사이드윈도우에 표시될 컨텐츠
const Content = styled.div`
    position: relative;
    background: rgba(250, 250, 250, 1);

    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-x: hidden;
    overflow-y: auto;
    margin: 0 auto; 

    width: 100%;
    height: 100%;    
    z-index: 8;
`
const NoResultsText = styled.h1`
    margin-top: 200px;
    text-align: center;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: ${palette.grayB};
`

// 토지정보의 주소
const CenterAddrText = styled.span`
    position: relative;
    margin-top: 20px;
    margin-bottom: 10px;

    text-align: left;
    font-family: "SC Dream 6";
    font-size: ${(props) => (props.isMobile ? "18px" : "20px")};
    color: #343a40;
`

// 토지정보 표시 시 보여줄 지도
const RegionButton = styled.button`
    position: relative;
    background-color: transparent;
    margin-top: 10px;
    padding: 0;

    border: 2px solid #cecece;
    border-radius: 10px;

    justify-content: center;

    width: 90%;
    min-height: 135px;

    cursor: pointer;

    &:hover {
        background-color: #f1f3f5;
    }
`

const AddrText = styled.span`
    display: flex;
    align-items: center; 
    width: 235px;
    padding: 15px;
    border-right: 1px solid #cecece; 
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 15px;
    color: ${palette.blackB};
`

const RegionContent = styled.div`
display: flex;
margin-top: 0px;
padding-left: 22px;
padding-top: 1px;

width: 100%;
height: 135px;

text-align: left;
font-family: "SC Dream 6";
font-size: 15px;
color: #495057;
`

const RegionPriceTitle = styled.span`
text-align: left;
font-family: "SC Dream 6";
font-size: 10px;
color: #868e96;
`

const RegionPriceContent = styled.div`
margin-top: 8px;
border-bottom: 1px solid #cecece;
padding-left: 22px;
padding-top: 1px;

width: 120px;
height: 56px;

text-align: left;
font-family: "SC Dream 6";
font-size: 15px;
color: #495057;
`

// 토지정보의 작은 텍스트
const LandInfoMiniText = styled.span`
    position: relative;

    text-align: center;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #343a40;
`

// 토지의 가격
const LandInfoPriceText = styled.span`
    margin-top: 0px;
    position: relative;
    text-align: center;
    font-family: "SC Dream 6";
    font-size: ${(props) => (props.isMobile ? "20px" : "24px")};
    color: rgba(255,99,99,1);
`

export default RegionLand;