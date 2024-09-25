import React, { useEffect } from "react";
import styled from "styled-components";

import axios from "axios";
import palette from '../../../constants/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setLandAddress } from '../../../store/actions/globalValues';
import { ZOOM_LEVELS, LAND_TYPES } from "../../../constants/enums";

function ClustererLand ({ isMobile=false, landAddressByPNU, setRegLandData }) {
    const dispatch = useDispatch();
    const centerAddress = useSelector(state => state.globalValues.centerAddress);
    const landAddress = useSelector(state => state.globalValues.landAddress);

    function handleRegionPageOpen(idx) {
        const land = {
            type: LAND_TYPES.REGION_LAND_UNLOAD,
            addr: landAddress.region[idx],
            pnu: landAddress.pnu[idx],
        };
        dispatch(setLandAddress(land));
    }

    // 조건부 렌더링
    if (!isMobile) {
        return (
            <Container>
                <Content>
                    <CenterAddrText>{landAddress.addr}</CenterAddrText>
                    
                    {landAddress.pnu.length === 0 ? (
                            <NoResultsText>조건에 맞는 검색 결과가 없습니다.</NoResultsText>
                        ) : (
                            landAddress.pnu.map((pnu, i) => (
                                <RegionButton onClick={() => handleRegionPageOpen(i)}>
                                    <RegionContent>
                                        <AddrText>{landAddress.region[i]}</AddrText>
                                        <div style={{display: "flex-direction"}}>
                                            <RegionPriceContent>
                                                <RegionPriceTitle>토지 예측가</RegionPriceTitle><br/>
                                                {landAddress.price[i] != 0 ? Math.floor(landAddress.price[i]).toLocaleString('ko-KR') : "-"}
                                            </RegionPriceContent>
                                            <RegionPriceContent style={landAddress.ratio[i] > 100 ? {color: palette.redM, border:"0"} : {color: palette.blueM, border:"0"}}>
                                                <RegionPriceTitle>공시지가의</RegionPriceTitle><br/>
                                                {landAddress.ratio[i] != 0 ? landAddress.ratio[i] : "-"}%
                                            </RegionPriceContent>
                                        </div>
                                    </RegionContent>
                                </RegionButton>
                            ))
                        )
                    }
                    <div style={{marginBottom:"50px"}}/>
                </Content>
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

    text-align: center;
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
    width: 250px;
    border-right: 1px solid #cecece; 
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 20px;
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

    width: 100px;
    height: 50px;

    text-align: left;
    font-family: "SC Dream 6";
    font-size: 15px;
    color: #495057;
`


export default ClustererLand;