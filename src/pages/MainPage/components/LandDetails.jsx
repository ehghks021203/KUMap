// import react
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import components
import { BeatLoader } from "react-spinners";
import Loading from "../../../components/Loading";
// import style components
import palette from "../../../constants/styles";
import { LandDataAddrText, LandDataBox, LandDataContainer, LandDataMiniText, LandDataPricePerText, LandDataPriceText, LandDataSubtitleText, LandDataText, LandDataTitleText, LandDataUsePlanBox, Content, RoadViewButton, LikeButton, RegisterButton, LikeCountText, DivLine, ViewLandReportButton, Map } from "../../../styles/LandDetails.styles";
// import constants
import { LAND_TYPES } from "../../../constants/enums";
// import functions
import axios from "axios";
import { fetchLandData, fetchLandLike, fetchLandPolygonData, fetchLandPredictPriceData } from "../../../utils/api";
import { setLandDataLoading } from '../../../store/actions/globalValues';
// import icons
import { ReactComponent as RoadViewIcon } from "../../../assets/images/icons/road_view.svg";
import { ReactComponent as StarIcon } from "../../../assets/images/icons/star_icon.svg";
import { ReactComponent as FilledStarIcon } from "../../../assets/images/icons/filled_star_icon.svg";


const LandDetails = ({ isMobile=false, setRegLandData, openLandReportModal }) => {
    // 전역 변수 관리
    const dispatch = useDispatch();
    const landAddress = useSelector(state => state.globalValues.landAddress);
    const isLoading = useSelector(state => state.globalValues.isLandDataLoading)

    //const landData = useSelector(state => state.globalValues.landData);
    const userLoginStatus = useSelector(state => state.userStatus.userLoginStatus);
    const currUser = useSelector(state => state.userStatus.currUser);
    //const selectLand = useSelector(state => state.globalValues.selectLand);
    
    const [roadviewOn, setRoadviewOn] = useState(false);
    const [landLike, setLandLike] = useState(false);
    const [landOwner, setLandOwner] = useState(false);

    // 토지 정보
    const [address, setAddress] = useState("");
    const [predPrice, setPredPrice] = useState(0);
    const [landPrice, setLandPrice] = useState(0);
    const [landArea, setLandArea] = useState(0.0);
    const [landClassification, setLandClassification] = useState("");
    const [landUseSitt, setLandUseSitt] = useState("");
    const [landZoning, setLandZoning] = useState("");
    const [roadSide, setRoadSide] = useState("");
    const [landForm, setLandForm] = useState("");
    const [landHeight, setLandHeight] = useState("");
    const [landUses, setLandUses] = useState("");
    const [lastPredictedDate, setLastPredictedDate] = useState("");
    const [landFeatureStdrYear, setLandFeatureStdrYear] = useState(0);
    const [dealChart, setDealChart] = useState([]);

    const [auctionData, setAuctionData] = useState(null);
    const [auctionCourtInCharge, setAuctionCourtInCharge] = useState("");
    const [auctionCaseCd, setAuctionCaseCd] = useState("");
    const [auctionAppraisalPrice, setAuctionAppraisalPrice] = useState(0);
    const [auctionMinimumSalePrice, setAuctionMinimumSalePrice] = useState(0);
    const [auctionDate, setAuctionDate] = useState("");
    const [auctionCaseReception, setAuctionCaseReception] = useState("");
    const [auctionStartDate, setAuctionStartDate] = useState("");
    const [auctionDivRequestDeadline, setAuctionDivRequestDeadline] = useState("");
    const [auctionBillableAmount, setAuctionBillableAmount] = useState(0);
    const [auctionType, setAuctionType] = useState("");
    const [auctionLandList, setAuctionLandList] = useState([]);

    const [propertyData, setPropertyData] = useState(null);
    const [propertyArea, setPropertyArea] = useState(0.0);
    const [propertyPrice, setPropertyPrice] = useState(0);
    const [propertySummary, setPropertySummary] = useState("");
    const [ownerNickname, setOwnerNickname] = useState("");

    const [totalLike, setTotalLike] = useState("0");
    const [userLike, setUserLike] = useState(false);

    useEffect(() => {
        if (!landAddress) { return; }
        if (landAddress.type === LAND_TYPES.CLUSTERER_LAND || landAddress.type === LAND_TYPES.REGION_LAND) { return; }
        dispatch(setLandDataLoading(true));
        //dispatch(setSideStatus("land-info"))
        fetchLandData({ pnu: landAddress.pnu })
        .then(response => {
            // 토지 정보 저장
            setAddress(response.data.data.addr);
            setPredPrice(response.data.data.land_info.predict_land_price);
            setLandPrice(response.data.data.land_info.official_land_price);
            setLandArea(response.data.data.land_info.land_area);
            setLandClassification(response.data.data.land_info.land_classification);
            setLandUseSitt(response.data.data.land_info.land_use_situation);
            setLandZoning(response.data.data.land_info.land_zoning);
            setRoadSide(response.data.data.land_info.road_side);
            setLandForm(response.data.data.land_info.land_form);
            setLandHeight(response.data.data.land_info.land_height);
            setLandUses(response.data.data.land_info.land_uses);
            setLastPredictedDate(response.data.data.last_predicted_date);
            setLandFeatureStdrYear(response.data.data.land_feature_stdr_year);
            console.log(response.data.data);

            setDealChart(response.data.data.land_trade_list);

            setAuctionData(response.data.data.bid_data);
            setPropertyData(response.data.data.property_data);
            setTotalLike(response.data.data.total_like);
            //setUserLike(landData["user_like"]);s
            
            // 경매 정보 저장
            if (response.data.data.bid_data !== null) {
                setAuctionAppraisalPrice(response.data.data.bid_data.case_info.appraisal_price);
                setAuctionBillableAmount(response.data.data.bid_data.case_info.billable_amount);
                setAuctionCaseCd(response.data.data.bid_data.case_cd);
                setAuctionCaseReception(response.data.data.bid_data.case_info.case_reception);
                setAuctionCourtInCharge(response.data.data.bid_data.case_info.court_in_charge);
                setAuctionDate(response.data.data.bid_data.case_info.bid_date);
                setAuctionDivRequestDeadline(response.data.data.bid_data.case_info.div_request_deadline);
                setAuctionLandList(response.data.data.bid_data.case_info.land_list);
                setAuctionMinimumSalePrice(response.data.data.bid_data.case_info.min_sale_price);
                setAuctionStartDate(response.data.data.bid_data.case_info.bid_start_date);
                setAuctionType(response.data.data.bid_data.case_info.bid_type);
            }

            // 매물 정보 저장
            if (response.data.data.property_data !== null) {
                setPropertyLandArea(response.data.data.property_data.land_area);
                setPropertyLandPrice(response.data.data.property_data.land_price);
                setPropertyLandSummary(response.data.data.property_data.land_summary);
                setOwnerNickname(response.data.data.property_data.nickname);
            }
        })
        .catch(error => {
            if (axios.isCancel(error)) {
                console.error("Request canceled", error.message);
            } else {
                console.log(error);
            }
        })
        .finally(() => {
            dispatch(setLandDataLoading(false));
            fetchLandPredictPriceData({ pnu: landAddress.pnu })
            .then(response => {
                console.log(response)
                setPredPrice(response.data.data.land_info.predict_land_price);
                setLastPredictedDate(response.data.data.last_predicted_date);
            })
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.error("Request canceled", error.message);
                } else {
                    console.log(error);
                }
            });
        });
    }, [landAddress]);

    useEffect(() => {
        console.log(isLoading)

        if (isLoading === false) {
            // 사이드 윈도우 지도 설정
            var iframe = document.getElementsByClassName("side-window-map")[0]
            setRoadviewOn(false);
            if(iframe !== undefined) {
                // 지적도 조회
                fetchLandPolygonData({ pnu: landAddress.pnu })
                .then(response => {
                    iframe.contentWindow.postMessage(JSON.parse(JSON.stringify(response)), '*');
                    iframe.addEventListener("load", ev => {
                        document.getElementsByClassName("side-window-map")[0].contentWindow.postMessage(JSON.parse(JSON.stringify(response)), '*');
                    }); //로딩이 안끝나면 여기서 처리해준다.
                })
                .catch(error => {
                    if (axios.isCancel(error)) {
                        console.error("Request canceled", error.message);
                    } else {
                        console.log(error);
                    }
                });
            }
        }
    }, [isLoading]);

    useEffect(() => {
        if (landAddress === null) { return; }
        var iframe = document.getElementsByClassName("side-window-map")[0]
        if (iframe !== undefined) {
            // 로드맵
            var returnValue = {
                "data": {
                    "position": {
                        'lat': landAddress.lat,
                        'lng': landAddress.lng
                    },
                    "isOpen": roadviewOn,
                    "result": "success"
                },
                "status": 200
            }
            document.getElementsByClassName("side-window-map")[0].contentWindow.postMessage(JSON.parse(JSON.stringify(returnValue)), '*');
        }
    }, [roadviewOn]);

    const transCaseCd = (caseCd) => {
        var returnStr = "";
        returnStr += caseCd.substr(0, 4);
        returnStr += "타경";
        returnStr += caseCd.substr(7).replace(/(^0+)/, "");
        return returnStr;
    }

    // 좋아요 버튼 핸들러
    const HandlerLikeButton = () => {
        if (!landAddress) { return; }
        if (!userLoginStatus) {
            window.alert("좋아요 기능을 이용하시려면 로그인 해 주세요.");
        } else {
            fetchLandLike({ email: currUser.email, pnu: landAddress.pnu })
            .then(response => {
                if (response.data.msg === "like") {
                    setLandLike(true);
                } else {
                    setLandLike(false);
                }
            })
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.error("Request canceled", error.message);
                } else {
                    console.log(error);
                }
            });
        }
    }

    // 소유주 등록 버튼 핸들러
    const HandlerRegisterButton = () => {
        if (!userLoginStatus) {
            window.alert("매물 등록 기능을 이용하시려면 로그인 해 주세요.");
        } else if (propertyData !== null) {
            window.alert("이미 등록되어 있는 땅입니다.");
        
        } else if (propertyData === null) {
            let land = landAddress;
            land["land_area"] = landArea;
            land["land_predict_price"] = Math.floor(predPrice * landArea);
            setRegLandData(land);
        } 
    }

    // 조건부 렌더링
    // PC 화면
    if (!isMobile) {
        if (landAddress === null) {
            return(
                <LandDataContainer>
                    <Content>
                        <LandDataAddrText style={{marginTop: "340px"}}>지역을 선택해주세요.</LandDataAddrText>
                    </Content>
                </LandDataContainer>
            );
        } else if (isLoading) {
            return (
                <Loading
                    loadingAddr={landAddress.address.address}
                    type="토지 정보"
                />
            )
        } else {
            return (
            <LandDataContainer>
                <Content>
                    <Map className="side-window-map" src="https://csgpu.kku.ac.kr/~202120990/iframe2.html"/>
                    <RoadViewButton 
                        style={roadviewOn ? {backgroundColor: palette.grayM, color: palette.whiteL} : {backgroundColor: palette.whiteL, color:palette.grayM}}
                        onClick={() => setRoadviewOn(!roadviewOn)}
                    >
                        <RoadViewIcon/>
                    </RoadViewButton>
                    <LikeButton 
                        style={landLike ? {} : {backgroundColor: palette.whiteL}} 
                        onClick={() => HandlerLikeButton()}
                    >
                        { landLike ? <FilledStarIcon/> : <StarIcon/> }
                    </LikeButton>
                    <RegisterButton 
                        onClick={() => HandlerRegisterButton()} 
                        style={propertyData === null ? {backgroundColor: palette.grayM, color: palette.whiteL} : {backgroundColor: palette.whiteL, color: palette.grayM}}
                    >
                        {propertyData === null ? "매물 등록" : ownerNickname + "님의 토지"}
                    </RegisterButton>
                    <div style={{marginTop: "300px"}}></div>

                    <LikeCountText>{totalLike} 명이 이 토지를 좋아합니다.</LikeCountText>
                    
                    { auctionData !== null && <BidCaseCdText>{bidCourtInCharge} {transCaseCd(bidCaseCd)}</BidCaseCdText> }
                    <LandDataAddrText>{address}</LandDataAddrText>
                    <DivLine/>
                    {predPrice !== null 
                        ? 
                        <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                            <LandDataMiniText>토지 예측가({lastPredictedDate} 기준)</LandDataMiniText>
                            <LandDataPriceText style={predPrice / landPrice > 1 ? {color: palette.redM} : {color: palette.blueM}}>{Math.floor(predPrice * landArea).toLocaleString('ko-KR')}원</LandDataPriceText>
                            <LandDataPricePerText style={predPrice / landPrice > 1 ? {color: palette.redM} : {color: palette.blueM}}>{Math.floor(predPrice).toLocaleString('ko-KR')}원/m²당</LandDataPricePerText>
                            <div>
                                <LandDataMiniText>공시지가의 </LandDataMiniText>
                                <LandDataMiniText style={predPrice / landPrice > 1 ? {color: palette.redM} : {color: palette.blueM}}>{parseInt(predPrice / landPrice * 100)}%</LandDataMiniText>
                            </div>
                            <ViewLandReportButton onClick={() => openLandReportModal()} >AI 토지 분석서 확인하기</ViewLandReportButton>
                        </div>
                        :
                        <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                            <LandDataMiniText>토지 예측가</LandDataMiniText>
                            <br/>
                            <BeatLoader color={palette.blueM}/>
                            <br/>
                            <LandDataMiniText>토지 가격을 예측하는 중입니다...</LandDataMiniText>
                            
                        </div>
                    }
                    <DivLine/>
                    { propertyData !== null && (
                        <div style={{width:"94%"}}>
                            <LandDataTitleText>매물 정보</LandDataTitleText><br/>
                            <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                                <SaleAreaText>{landClassification} {saleLandArea}m²</SaleAreaText>
                                <SalePriceText>{Math.floor(saleLandPrice).toLocaleString('ko-KR')}원</SalePriceText>
                                <SaleSummaryContainer>{saleLandSummary}</SaleSummaryContainer>
                            </div>
                            <DivLine/> 
                        </div>
                    )}

                    { auctionData !== null && (
                        <div>
                            <LandDataTitleText>경매 정보</LandDataTitleText><br/>
                            <BidInfoDiv style={{marginTop: "20px"}}>
                                <div style={{display:"flex"}}>
                                    <BidPriceDiv>
                                        <BidInfoSubtitleText>감정가</BidInfoSubtitleText>
                                        <BidPriceText>{Math.floor(bidAppraisalPrice).toLocaleString('ko-KR')}</BidPriceText>
                                    </BidPriceDiv>
                                    <BidPriceDiv style={{border:"0"}}>
                                        <BidInfoSubtitleText>최저가</BidInfoSubtitleText>
                                        <BidPriceText style={{color:"#0067a3"}}>{Math.floor(bidMinimumSalePrice).toLocaleString('ko-KR')}</BidPriceText>
                                    </BidPriceDiv>
                                    
                                </div>
        
                                
                            </BidInfoDiv>
                            <BidInfoDiv>
                                <BidDateSubtitleText>매각기일</BidDateSubtitleText>
                                <BidDateText>{bidDate}</BidDateText>
                            </BidInfoDiv>
                            <BidInfoDiv>
                                <div style={{display:"flex"}}>
                                    <BidInfoSubtitleText>사건접수</BidInfoSubtitleText>
                                    <BidInfoText>{bidCaseReception}</BidInfoText>
                                </div>
                                <TinyDivLine/>
                                <div style={{display:"flex"}}>
                                    <BidInfoSubtitleText>경매개시일</BidInfoSubtitleText>
                                    <BidInfoText>{bidStartDate}</BidInfoText>
                                </div>
                                <TinyDivLine/>
                                <div style={{display:"flex"}}>
                                    <BidInfoSubtitleText>배당요구종기</BidInfoSubtitleText>
                                    <BidInfoText>{bidDivRequestDeadline}</BidInfoText>
                                </div>
                                <TinyDivLine/>
                                <div style={{display:"flex"}}>
                                    <BidInfoSubtitleText>청구금액</BidInfoSubtitleText>
                                    <BidInfoText>{Math.floor(bidBillableAmount).toLocaleString('ko-KR')}원</BidInfoText>
                                </div>
                            </BidInfoDiv>
                            <BidInfoDiv>
                                <div style={{display:"flex"}}>
                                    <BidInfoSubtitleText>입찰방법</BidInfoSubtitleText>
                                    <BidInfoText>{bidType}</BidInfoText>
                                </div>
                                <TinyDivLine/>
                                <div style={{display:"flex"}}>
                                    <BidInfoSubtitleText>담당</BidInfoSubtitleText>
                                    <BidInfoText>{bidCourtInCharge}</BidInfoText>
                                </div>
                            </BidInfoDiv>
        
                            <BidSubtitleText>{transCaseCd(bidCaseCd)} 물건 내역</BidSubtitleText>
                            <BidObjDiv>
                                {bidLandList.map((land, index) => {
                                    return (
                                        address === land.addr.address ?
                                            <BidObjButton style={{textDecoration:"none", color: "#343a40", cursor:"default"}}>{land.addr.address}</BidObjButton>
                                        :   <BidObjButton onClick={() => dispatch(setLandAddress({ type: LAND_TYPES.LAND_INFO, lat: land.lat, lng: land.lng, addr: land.addr, pnu: land.pnu }))}>{land.addr.address}</BidObjButton>
                                    );
                                })}
                            </BidObjDiv>
                            <DivLine/>
                        </div>
                    )}

                    <LandDataTitleText>토지 기본 정보 (기준년도: {landFeatureStdrYear}년)</LandDataTitleText>
                    <div style={{display:"flex", flexDirection: "row", alignItems: "center"}}>
                        <LandDataBox>
                            <LandDataSubtitleText>지목</LandDataSubtitleText>
                            <LandDataText>{landClassification}</LandDataText>
                        </LandDataBox>
                        <LandDataBox>
                            <LandDataSubtitleText>이용상황</LandDataSubtitleText>
                            <LandDataText>{landUseSitt}</LandDataText>
                        </LandDataBox>
                    </div>
                    <div style={{display:"flex", flexDirection: "row", alignItems: "center"}}>
                        <LandDataBox>
                            <LandDataSubtitleText>용도지역</LandDataSubtitleText>
                            <LandDataText>{landZoning}</LandDataText>
                        </LandDataBox>
                        <LandDataBox>
                            <LandDataSubtitleText>면적</LandDataSubtitleText>
                            <LandDataText>{Math.floor(landArea).toLocaleString('ko-KR')}m²</LandDataText>
                        </LandDataBox>
                    </div>
                    <div style={{display:"flex", flexDirection: "row", alignItems: "center"}}>
                        <LandDataBox>
                            <LandDataSubtitleText>도로</LandDataSubtitleText>
                            <LandDataText>{roadSide}</LandDataText>
                        </LandDataBox>
                        <LandDataBox>
                            <LandDataSubtitleText>형상</LandDataSubtitleText>
                            <LandDataText>{landForm}</LandDataText>
                        </LandDataBox>
                    </div>
                    <div style={{display:"flex", flexDirection: "row", alignItems: "center"}}>
                        <LandDataBox>
                            <LandDataSubtitleText>지세</LandDataSubtitleText>
                            <LandDataText>{landHeight}</LandDataText>
                        </LandDataBox>
                        <LandDataBox>
                            <LandDataSubtitleText>공시지가</LandDataSubtitleText>
                            <LandDataText>{Math.floor(landPrice).toLocaleString('ko-KR')}원</LandDataText>
                        </LandDataBox>
                    </div>
                    <LandDataUsePlanBox>
                        <LandDataSubtitleText style={{width:"405px", marginTop:"15px", marginLeft:"2px"}}>토지 이용 계획</LandDataSubtitleText>
                        <LandDataText style={{width:"405px", height:"auto", marginLeft:"2px"}}>{landUses.replaceAll("/", ", ")}</LandDataText>
                    </LandDataUsePlanBox>
                    <DivLine/>
                    <LandDataTitleText>토지 실거래 내역</LandDataTitleText>
                    { dealChart.length === 0 ? 
                        <LandDataText style={{marginTop:"80px", width:"450px", fontSize:"15px", textAlign:"center"}}>주변 지역의 실거래 내역이 없습니다.</LandDataText>
                    : (
                        <DealList>
                            <thead>
                                <tr>
                                    <DealListTH style={{width:"80px"}}>거래일자</DealListTH>
                                    <DealListTH>거래유형</DealListTH>
                                    <DealListTH>거래금액 (원)</DealListTH>
                                    <DealListTH>거래면적 (㎥)</DealListTH>
                                    <DealListTH>단가</DealListTH>
                                </tr>
                            </thead>
                            <tbody>
                                {dealChart.map((deal, index) => {
                                    return (
                                        <tr key={index}>
                                            <DealListTD>{deal.deal_year + deal.deal_month.padStart(2, '0')}</DealListTD>
                                            <DealListTD>{deal.deal_type}</DealListTD>
                                            <DealListTD>{Math.floor(deal.land_real_price).toLocaleString('ko-KR')}원</DealListTD>
                                            <DealListTD>{Math.floor(deal.deal_area).toLocaleString('ko-KR')}m²</DealListTD>
                                            <DealListTD>{parseInt(deal.land_real_price / deal.deal_area).toLocaleString('ko-KR') + "원/m²"}</DealListTD>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </DealList>
                    )}
                    <div style={{marginBottom:"150px"}}/>
                </Content>
            </LandDataContainer>
            );
        } 
    }
}


export default LandDetails;