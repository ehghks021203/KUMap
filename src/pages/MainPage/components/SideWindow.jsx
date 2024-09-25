// import react
import React from "react";
import { useDispatch, useSelector } from 'react-redux';
// import components
import LandInfo from "./LandDetails";
import RegionLand from "./RegionLand";
import ClustererLand from "./ClustererLand";
// import style components
import palette from "../../../constants/styles";
import { SideWindowContainer, TopMenu, TopButton } from "../../../styles/SideWindow.styles";
// import constants
import { LAND_TYPES } from "../../../constants/enums";
// import functions
import { setSideStatus } from '../../../store/actions/globalValues';
import LandDetails from "./LandDetails";
import AuctionList from "./AuctionList";
import LandPropertyList from "./LandPropertyList";


function SideWindow ({ isMobile=false, setRegLandData, openLandReportModal }) {
    // 전역 변수 관리
    const dispatch = useDispatch();
    const landAddress = useSelector(state => state.globalValues.landAddress);
    const landInfo = useSelector(state => state.globalValues.landInfo);
    const sideStatus = useSelector(state => state.globalValues.sideStatus);
    
    // 조건부 렌더링
    if (!isMobile) {
        return (
            <SideWindowContainer>
                <TopMenu>
                    <TopButton isCheck={sideStatus === "land-info"} onClick={() => dispatch(setSideStatus("land-info"))}>토지 정보</TopButton>
                    <TopButton isCheck={sideStatus === "auction-list"}  onClick={() => dispatch(setSideStatus("auction-list"))}>경매 목록</TopButton>
                    <TopButton isCheck={sideStatus === "land-property-list"} onClick={() => dispatch(setSideStatus("land-property-list"))}>매물 목록</TopButton>
                </TopMenu>
                {sideStatus === "land-info" && (
                    landAddress === null ?
                    <LandDetails setRegLandData={setRegLandData} openLandReportModal={openLandReportModal}/> :
                    landAddress.type == LAND_TYPES.LAND_INFO || landAddress.type == LAND_TYPES.MARKER_LAND_INFO ? 
                    <LandDetails setRegLandData={setRegLandData} openLandReportModal={openLandReportModal}/> :
                    landAddress.type == LAND_TYPES.CLUSTERER_LAND ?
                    <ClustererLand/> :
                    <RegionLand/>
                )
                }
                {sideStatus === "auction-list" && <AuctionList />}
                {sideStatus === "land-property-list" && <LandPropertyList />}
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


export default SideWindow;