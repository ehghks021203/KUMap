import React from "react";
import styled from "styled-components";
import LandInfo from "./LandInfo";
import BidList from "./BidList";
import SaleList from "./SaleList";

import { useDispatch, useSelector } from 'react-redux';
import { setLandInfo, setBidList, setSaleList, setSideStatus } from '../../../actions/globalValues';

function SideWindow ({ isMobile=false, LoadLand, setRegLandData }) {
    // 전역 변수 관리
    const dispatch = useDispatch();
    const landInfo = useSelector(state => state.globalValues.landInfo);
    const sideStatus = useSelector(state => state.globalValues.sideStatus);
    
    // 조건부 렌더링
    if (!isMobile) {
        return (
            <SideWindowContainer>
                <TopMenu>
                    <TopButton isCheck={sideStatus === "land_info"} onClick={() => dispatch(setSideStatus("land_info"))}>토지 정보</TopButton>
                    <TopButton isCheck={sideStatus === "bid_list"}  onClick={() => dispatch(setSideStatus("bid_list"))}>경매 목록</TopButton>
                    <TopButton isCheck={sideStatus === "sale_list"} onClick={() => dispatch(setSideStatus("sale_list"))}>매물 목록</TopButton>
                </TopMenu>
                {sideStatus === "land_info" && <LandInfo LoadLand={LoadLand} setRegLandData={setRegLandData}/>}
                {sideStatus === "bid_list" && <BidList LoadLand={LoadLand} />}
                {sideStatus === "sale_list" && <SaleList LoadLand={LoadLand} />}
            </SideWindowContainer>
        );
    } else {
        return (
            <SideWindowContainer isMobile={true}>
                <MobileTopMenu isMobile={true}>
                    <LandInfoAddrText isMobile={true} style={{marginTop: "14px", fontSize: "14px"}}>{landInfo['addr']}</LandInfoAddrText>
                </MobileTopMenu>
                <LandInfo isMobile={true} />
            </SideWindowContainer>
        );
    }
}

// 사이드 윈도우 스타일
const SideWindowContainer = styled.div`
    position: ${(props) => (props.isMobile ? "fixed" : "relative")};
    background: rgba(250, 250, 250, 1);
    filter: drop-shadow(3px 0px 6px rgba(0, 0, 0, 0.161));
    
    
    width: ${(props) => (props.isMobile ? "100vw" : "500px")};
    height: 100%;
    display:flex;
    flex-wrap: nowrap;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    z-index: ${(props) => (props.isMobile ? "100" : "8")};
`

// 상단바
const TopMenu = styled.div`
    background-color: #fafafa;
    
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    flex-shrink: 0;

    width: 100%;
    height: 50px;
    z-index: 9;
`

const MobileTopMenu = styled.div`
    background-color: #fafafa;
    border-bottom: 2px solid #cecece;

    display: flex;
    flex-direction: row;
    justify-content: center;

    width: 100%;
    height: 50px;
    z-index: 9;
`

// 상단바 버튼 (토지정보, 경매목록, 매물목록 등)
const TopButton = styled.button`
    background-color: ${(props) => (props.isCheck ? "#eff8fe" : "transparent")};
    border: 0;
    border-bottom: ${(props) => (props.isCheck ? "2px solid #0067a3" : "2px solid #cecece")};

    width: 50%;

    text-align: center;
    font-family: "SC Dream 6";
    font-size: 12px;
    color: #767676;

    cursor: pointer;
`

// 토지정보의 주소
const LandInfoAddrText = styled.span`
    position: relative;
    margin-top: ${(props) => (props.isMobile ? "280px" : "340px")};
    margin-bottom: 10px;

    text-align: center;
    font-family: "SC Dream 6";
    font-size: ${(props) => (props.isMobile ? "18px" : "20px")};
    color: rgba(25,25,25,1);
`

const MyPageBackButton = styled.button`
    position: absolute;
    background-color: #fafafa;
    filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3));

    border: 0;
    border-radius: 10px;

    top: 12px;
    left: 12px;

    width: 36px;
    height: 36px;
    z-index: 20;

    cursor: pointer;
`

export default SideWindow;