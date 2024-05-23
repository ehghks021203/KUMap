import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import palette from '../../../lib/styles/colorPalette';
import Loading from "../../Loading";

import { useDispatch, useSelector } from 'react-redux';
import { setLandInfo } from '../../../actions/globalValues';

import { ReactComponent as RoadViewIcon } from "../../../assets/icons/road_view.svg";

const LandInfo = ({ isMobile=false, LoadLand, setRegLandData }) => {
    // 전역 변수 관리
    const dispatch = useDispatch();
    const landInfo = useSelector(state => state.globalValues.landInfo);
    const userLoginStatus = useSelector(state => state.userStatus.userLoginStatus);
    const currUser = useSelector(state => state.userStatus.currUser);
    const selectLand = useSelector(state => state.globalValues.selectLand);
    const isLoading = useSelector(state => state.globalValues.landInfoLoading);
    
    const [roadviewOn, setRoadviewOn] = useState(false);
    const [landLike, setLandLike] = useState(false);
    const [landOwner, setLandOwner] = useState(false);

    // 토지 정보
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
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

    const [bidData, setBidData] = useState(null);
    const [bidCourtInCharge, setBidCourtInCharge] = useState("");
    const [bidCaseCd, setBidCaseCd] = useState("");
    const [bidAppraisalPrice, setBidAppraisalPrice] = useState(0);
    const [bidMinimumSalePrice, setBidMinimumSalePrice] = useState(0);
    const [bidDate, setBidDate] = useState("");
    const [bidCaseReception, setBidCaseReception] = useState("");
    const [bidStartDate, setBidStartDate] = useState("");
    const [bidDivRequestDeadline, setBidDivRequestDeadline] = useState("");
    const [bidBillableAmount, setBidBillableAmount] = useState(0);
    const [bidType, setBidType] = useState("");
    const [bidLandList, setBidLandList] = useState([]);

    const [saleData, setSaleData] = useState(null);
    const [saleLandArea, setSaleLandArea] = useState(0.0);
    const [saleLandPrice, setSaleLandPrice] = useState(0);
    const [saleLandSummary, setSaleLandSummary] = useState("");
    const [ownerNickname, setOwnerNickname] = useState("");

    const [totalLike, setTotalLike] = useState("0");
    const [userLike, setUserLike] = useState(false);



    useEffect(() => {
        if (landInfo === null) { return; }

        // 토지 정보 저장
        setLat(landInfo["lat"]);
        setLng(landInfo["lng"]);
        setAddress(landInfo["addr"]);
        setPredPrice(landInfo["pred_price"]);
        setLandPrice(landInfo["land_price"]);
        setLandArea(landInfo["land_area"]);
        setLandClassification(landInfo["land_classification"]);
        setLandUseSitt(landInfo["land_use_situation"]);
        setLandZoning(landInfo["land_zoning"]);
        setRoadSide(landInfo["road_side"]);
        setLandForm(landInfo["land_form"]);
        setLandHeight(landInfo["land_height"]);
        setLandUses(landInfo["land_uses"]);
        setLastPredictedDate(landInfo["last_predicted_date"]);
        setLandFeatureStdrYear(landInfo["land_feature_stdr_year"]);

        setDealChart(landInfo["deal_chart"]);

        setBidData(landInfo["bid_data"]);
        setSaleData(landInfo["sale_data"]);
        setTotalLike(landInfo["total_like"]);
        setUserLike(landInfo["user_like"]);

        // 경매 정보 저장
        if (landInfo["bid_data"] !== null) {
            setBidAppraisalPrice(landInfo["bid_data"]["case_info"]["appraisal_price"]);
            setBidBillableAmount(landInfo["bid_data"]["case_info"]["billable_amount"]);
            setBidCaseCd(landInfo["bid_data"]["case_cd"]);
            setBidCaseReception(landInfo["bid_data"]["case_info"]["case_reception"]);
            setBidCourtInCharge(landInfo["bid_data"]["case_info"]["court_in_charge"]);
            setBidDate(landInfo["bid_data"]["case_info"]["bid_date"]);
            setBidDivRequestDeadline(landInfo["bid_data"]["case_info"]["div_request_deadline"]);
            setBidLandList(landInfo["bid_data"]["case_info"]["land_list"]);
            setBidMinimumSalePrice(landInfo["bid_data"]["case_info"]["minimum_sale_price"]);
            setBidStartDate(landInfo["bid_data"]["case_info"]["bid_start_date"]);
            setBidType(landInfo["bid_data"]["case_info"]["bid_type"]);
        }

        // 매물 정보 저장
        if (landInfo["sale_data"] !== null) {
            setSaleLandArea(landInfo["sale_data"]["land_area"]);
            setSaleLandPrice(landInfo["sale_data"]["land_price"]);
            setSaleLandSummary(landInfo["sale_data"]["land_summary"]);
            setOwnerNickname(landInfo["sale_data"]["nickname"]);
        }
        
        // 사이드 윈도우 지도 설정
        var iframe = document.getElementsByClassName("side-window-map")[0]
        setRoadviewOn(false);
        if(iframe !== undefined) {
            // 지적도 조회
            axios.get(`${process.env.REACT_APP_API_URL}/get_land_geometry?lat=${landInfo["lat"]}&lng=${landInfo["lng"]}`)
            .then(function(geometryResponse) {
                iframe.contentWindow.postMessage(JSON.parse(JSON.stringify(geometryResponse)), '*');
                iframe.addEventListener("load", ev => {
                    document.getElementsByClassName("side-window-map")[0].contentWindow.postMessage(JSON.parse(JSON.stringify(geometryResponse)), '*');
                }); //로딩이 안끝나면 여기서 처리해준다.
            });
        }
    }, [landInfo]);

    useEffect(() => {
        if (landInfo === null) { return; }
        var iframe = document.getElementsByClassName("side-window-map")[0]
        if (iframe !== undefined) {
            // 로드맵
            var returnValue = {
                "data": {
                    "position": {
                        'lat': landInfo["lat"],
                        'lng': landInfo["lng"]
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
        if (!userLoginStatus) {
            window.alert("좋아요 기능을 이용하시려면 로그인 해 주세요.");
        } else {
            axios.post(`${process.env.REACT_APP_API_URL}/land_like`, {
                "email": currUser.email,
                "lat": lat,
                "lng": lng,
            })
            .then(function(likeResponse) {
                console.log(likeResponse);
                if (likeResponse.data.msg === "like") {
                    setLandLike(true);
                } else {
                    setLandLike(false);
                }

                // 토지 데이터 다시 로드
                LoadLand(lat, lng)
            })
        }
    }

    // 소유주 등록 버튼 핸들러
    const HandlerRegisterButton = () => {
        if (!userLoginStatus) {
            window.alert("매물 등록 기능을 이용하시려면 로그인 해 주세요.");
        } else if (saleData !== null) {
            window.alert("이미 등록되어 있는 땅입니다.");
        
        } else if (saleData === null) {
            var returnDict = landInfo;
            returnDict["type"] = "land-reg";
            setRegLandData(returnDict);
        } 
    }


    // 조건부 렌더링
    // PC 화면
    if (!isMobile) {
        if (selectLand === null) {
            return(
                <LandInfoContainer>
                    <Content>
                        <LandInfoAddrText style={{marginTop: "340px"}}>지역을 선택해주세요.</LandInfoAddrText>
                    </Content>
                </LandInfoContainer>
            );
        } else if (isLoading) {
            return (
                <Loading
                    loadingAddr={selectLand.addr}
                    type="토지 정보"
                />
            )
        } else {
            return (
            <LandInfoContainer>
                <Content>
                    <Map className="side-window-map" src="https://csgpu.kku.ac.kr/~202120990/iframe2.html"/>
                    <RoadViewButton 
                        style={roadviewOn ? {backgroundColor: palette.grayM, color: palette.whiteL} : {backgroundColor: palette.whiteL, color:palette.grayM}}
                        onClick={() => setRoadviewOn(!roadviewOn)}
                    >
                        <RoadViewIcon/>
                    </RoadViewButton>
                    <LikeButton 
                        style={landLike ? {backgroundColor: palette.grayM} : {backgroundColor: palette.whiteL}} 
                        onClick={() => HandlerLikeButton()}
                    />
                    <RegisterButton 
                        onClick={() => HandlerRegisterButton()} 
                        style={saleData === null ? {backgroundColor: palette.grayM, color: palette.whiteL} : {backgroundColor: palette.whiteL, color: palette.grayM}}
                    >
                        {saleData === null ? "매물 등록" : ownerNickname + "님의 토지"}
                    </RegisterButton>
                    <div style={{marginTop: "300px"}}></div>

                    <LikeCountText>{totalLike} 명이 이 토지를 좋아합니다.</LikeCountText>
                    
                    { bidData !== null && <BidCaseCdText>{bidCourtInCharge} {transCaseCd(bidCaseCd)}</BidCaseCdText> }
                    <LandInfoAddrText>{address}</LandInfoAddrText>
                    <DivLine/>
                    <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                        <LandInfoMiniText>토지 예측가({lastPredictedDate} 기준)</LandInfoMiniText>
                        <LandInfoPriceText>{Math.floor(predPrice * landArea).toLocaleString('ko-KR')}원</LandInfoPriceText>
                        <LandInfoPricePerText>{Math.floor(predPrice).toLocaleString('ko-KR')}원/m²당</LandInfoPricePerText>
                        <div>
                            <LandInfoMiniText>공시지가의 </LandInfoMiniText>
                            <LandInfoMiniText style={{color: "rgba(255,99,99,1)"}}>{parseInt(predPrice / landPrice * 100)}%</LandInfoMiniText>
                        </div>
                    </div>
                    <DivLine/>
                    
                    { saleData !== null && (
                        <div style={{width:"94%"}}>
                            <LandInfoTitleText>매물 정보</LandInfoTitleText><br/>
                            <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                                <SaleAreaText>{landClassification} {saleLandArea}m²</SaleAreaText>
                                <SalePriceText>{Math.floor(saleLandPrice).toLocaleString('ko-KR')}원</SalePriceText>
                                <SaleSummaryContainer>{saleLandSummary}</SaleSummaryContainer>
                            </div>
                            <DivLine/> 
                        </div>
                    )}

                    { bidData !== null && (
                        <div>
                            <LandInfoTitleText>경매 정보</LandInfoTitleText><br/>
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
                                        address === land.addr ?
                                            <BidObjButton style={{textDecoration:"none", color: "#343a40", cursor:"none"}}>{land.addr}</BidObjButton>
                                        :   <BidObjButton onClick={() => LoadLand(land.lat, land.lng)}>{land.addr}</BidObjButton>
                                    );
                                })}
                            </BidObjDiv>
                            <DivLine/>
                        </div>
                    )}
                    <LandInfoTitleText>토지 기본 정보 (기준년도: {landFeatureStdrYear}년)</LandInfoTitleText>
                    <div style={{display:"flex", flexDirection: "row", alignItems: "center"}}>
                        <LandInfoBox>
                            <LandInfoSubtitleText>지목</LandInfoSubtitleText>
                            <LandInfoText>{landClassification}</LandInfoText>
                        </LandInfoBox>
                        <LandInfoBox>
                            <LandInfoSubtitleText>이용상황</LandInfoSubtitleText>
                            <LandInfoText>{landUseSitt}</LandInfoText>
                        </LandInfoBox>
                        <LandInfoBox>
                            <LandInfoSubtitleText>용도지역</LandInfoSubtitleText>
                            <LandInfoText>{landZoning}</LandInfoText>
                        </LandInfoBox>
                        <LandInfoBox>
                            <LandInfoSubtitleText>면적</LandInfoSubtitleText>
                            <LandInfoText>{Math.floor(landArea).toLocaleString('ko-KR')}m²</LandInfoText>
                        </LandInfoBox>
                    </div>
                    <div style={{display:"flex", flexDirection: "row", alignItems: "center"}}>
                        <LandInfoBox>
                            <LandInfoSubtitleText>도로</LandInfoSubtitleText>
                            <LandInfoText>{roadSide}</LandInfoText>
                        </LandInfoBox>
                        <LandInfoBox>
                            <LandInfoSubtitleText>형상</LandInfoSubtitleText>
                            <LandInfoText>{landForm}</LandInfoText>
                        </LandInfoBox>
                        <LandInfoBox>
                            <LandInfoSubtitleText>지세</LandInfoSubtitleText>
                            <LandInfoText>{landHeight}</LandInfoText>
                        </LandInfoBox>
                        <LandInfoBox>
                            <LandInfoSubtitleText>공시지가</LandInfoSubtitleText>
                            <LandInfoText>{Math.floor(landPrice).toLocaleString('ko-KR')}원</LandInfoText>
                        </LandInfoBox>
                    </div>
                    <LandInfoUsePlanBox>
                        <LandInfoSubtitleText style={{width:"420px", marginTop:"15px", marginLeft:"2px"}}>토지 이용 계획</LandInfoSubtitleText>
                        <LandInfoText style={{ width:"420px", height:"auto", marginLeft:"2px" }}>{landUses.replaceAll("/", ", ")}</LandInfoText>
                    </LandInfoUsePlanBox>
                    <DivLine/>
                    <LandInfoTitleText>토지 실거래 내역</LandInfoTitleText>
                    { dealChart.length === 0 ? 
                        <LandInfoText style={{ width:"470px", fontSize:"15px" }}>주변 지역의 실거래 내역이 없습니다.</LandInfoText>
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
                    <div style={{marginBottom:"60px"}}/>
                </Content>
            </LandInfoContainer>
            );
        } 
    }
}

// 사이드 윈도우 스타일
const LandInfoContainer = styled.div`
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

// 토지정보 표시 시 보여줄 지도
const Map = styled.iframe`
    position: absolute;
    margin: 0;
    
    border: 0;
    border-radius: 0px;
    
    width: 100%;
    height: ${(props) => (props.isMobile ? "250px" : "300px")};
`

// 로드뷰 버튼
const RoadViewButton = styled.button`
    position: absolute;
    background: rgba(250, 250, 250, 1);
    filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3));
    
    border: 0;
    border-radius: 6px;

    top: 56px;
    right: 12px;
    width: 36px;
    height: 36px;
    z-index: 10;

    cursor: pointer;
`

// 토지 좋아요 버튼
const LikeButton = styled.button`
    position: absolute;
    background: rgba(250, 250, 250, 1);
    filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3));

    border: 0;
    border-radius: 6px;

    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    z-index: 10;

    cursor: pointer;
`

const RegisterButton = styled.button`
    position: absolute;
    background: rgba(250, 250, 250, 1);
    filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3));

    border: 0;
    border-radius: 6px;

    padding-left: 14px;
    padding-right: 14px;

    top: 256px;
    right: 12px;
    width: auto;
    height: 36px;
    z-index: 10;

    text-align: center;
    font-family: "SC Dream 4";
    font-size: 13px;
    color: #343a40;

    cursor: pointer;
`

// 토지의 좋아요 수 텍스트
const LikeCountText = styled.span`
    position: relative;

    margin-top: 4px;
    margin-bottom: 20px;
    margin-left: 12px;

    width: 100%;
    text-align: left;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #343a40;
`

// 구분선
const DivLine = styled.hr`
    margin-top: 20px;
    margin-bottom: 20px;

    border: 1px solid #cecece;

    width: ${(props) => (props.isMobile ? "90vw" : "450px")};
`
const TinyDivLine = styled.hr`
    margin-top: 10px;
    margin-bottom: 10px;

    border: 1px solid #cecece;

    width: 400px;
`

// 토지정보의 주소
const LandInfoAddrText = styled.span`
    position: relative;
    margin-top: 4px;
    margin-bottom: 10px;

    text-align: center;
    font-family: "SC Dream 6";
    font-size: ${(props) => (props.isMobile ? "18px" : "20px")};
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

// 토지의 가격 (제곱미터당)
const LandInfoPricePerText = styled.span`
    margin-top: 4px;
    position: relative;
    text-align: center;
    font-family: "SC Dream 4";
    font-size: ${(props) => (props.isMobile ? "10px" : "14px")};
    color: rgba(255,99,99,1);
`

// 매물 스타일
const SaleAreaText = styled.span`
    display: block;
    width: 100%;
    margin-top: 20px;
    text-align: center;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #343a40;
`

const SalePriceText = styled.h2`
    width: 100%;
    margin-top: 0px;
    text-align: center;
    font-family: "SC Dream 6";
    font-size: 24px;
    color: #0067a3;
`

const SaleSummaryContainer = styled.div`
    background-color: #b8dff8;
    width: 420px;
    height: 68px;
    padding: 10px;
    margin-top: 15px;

    text-align: left;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: #343a40;

`


const BidCaseCdText = styled.span`
    display: block;
    margin-top: -21px;
    width: 450px;
    text-align: center;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: #0067a3;
`

const BidInfoDiv = styled.div`
    position: relative;
    background-color: rgba(250, 250, 250, 1);
    display:flex;
    margin: 0 auto; 
    margin-top: 4px;
    margin-bottom: 4px;
    flex-direction: column;
    align-items: center;
    border: 2px solid #b8b8b8;
    border-radius: 4px;

    width: 442px;
    padding-top: 12px;
    padding-bottom: 12px;
`

const BidDateSubtitleText = styled.span`
    position: relative;
    margin-left: 45px;

    width: 442px;

    text-align: left;
    font-family: "SC Dream 6";
    font-size: 12px;
    color: #343a40;
`

const BidDateText = styled.span`
    position: relative;
    margin-left: 45px;

    width: 442px;

    text-align: left;
    font-family: "SC Dream 4";
    font-size: 11px;
    color: #343a40;
`

const BidPriceDiv = styled.div`
    border-right: 2px solid #b8b8b8;
    
    padding-left: 20px;
    
    width: 200px;
    height: 40px;
`

const BidPriceText = styled.span`
    position: relative;
    display: block;
    margin-left: 0px;

    width: 200px;

    text-align: left;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: #343a40;
`

const BidInfoSubtitleText = styled.span`
    display: block;
    margin-top:0px;
    width: 200px;
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 12px;
    color: #343a40;
`

const BidInfoText = styled.span`
    display: block;
    margin-top:0px;
    width: 200px;
    text-align: right;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #343a40;
`

const BidSubtitleText = styled.span`
    display: block;
    margin-top:20px;
    margin-left: 4px;
    width: 450px;
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 15px;
    color: #343a40;
`

const BidObjDiv = styled.div`
    display: flex;
    margin-left: 4px;
    flex-direction: column;
    align-items: left;
    width: 450px;

`

const BidObjButton = styled.button`
    position: relative;
    background-color: transparent;

    padding: 0;
    border: 0;
    
    width: auto;
    max-width: 250px;

    text-align: left;
    text-decoration: underline;
    font-family: "SC Dream 4";
    font-size: 12px;
    color:  #0067a3;

    cursor: pointer;
`

// 토지정보의 작은 텍스트
const LandInfoMiniText = styled.span`
    position: relative;

    text-align: center;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #343a40;
`

const LandInfoTitleText = styled.span`
    position: relative;
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 4px;

    width: ${(props) => (props.isMobile ? "90vw" : "450px")};
    
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 18px;
    color: #343a40;
`

const LandInfoSubtitleText = styled.span`
    position: relative;
    margin-top: 10px;
    margin-left: 20px;

    width: ${(props) => (props.isMobile ? "45vw" : "100px")};

    text-align: left;
    font-family: "SC Dream 6";
    font-size: 12px;
    color: #343a40;
`

const LandInfoText = styled.span`
    position: relative;
    margin-left: 20px;

    width: ${(props) => (props.isMobile ? "45vw" : "100px")};

    text-align: left;
    font-family: "SC Dream 4";
    font-size: 10px;
    color: #343a40;
`

const LandInfoBox = styled.div`
    position: relative;
    background-color: rgba(250, 250, 250, 1);
    display:flex;
    margin: 0 auto; 
    margin-left: ${(props) => (props.isMobile ? "1vw" : "5px")};
    margin-right: ${(props) => (props.isMobile ? "1vw" : "5px")};
    margin-top: 4px;
    margin-bottom: 4px;
    flex-direction: column;
    align-items: center;
    border: 2px solid rgba(184, 184, 184, 1);
    border-radius: 4px;

    width: ${(props) => (props.isMobile ? "44vw" : "100px")};
    height: 52px;
`

const LandInfoUsePlanBox = styled.div`
    position: relative;
    background-color: rgba(250, 250, 250, 1);
    display:flex;
    margin: 0 auto; 
    margin-top: 4px;
    margin-bottom: 4px;
    flex-direction: column;
    align-items: center;
    border: 2px solid rgba(184, 184, 184, 1);
    border-radius: 4px;

    width: ${(props) => (props.isMobile ? "91vw" : "442px")};
    padding-bottom: 16px;
`

const DealList = styled.table`
    width: ${(props) => (props.isMobile ? "91vw" : "442px")};
    border-collapse: collapse;
`

const DealListTH = styled.th`
    border-bottom: 2px solid rgba(204, 204, 204, 1.0);
    padding-top: 5px;
    padding-bottom: 5px;

    text-align: center;
    font-family: "SC Dream 6";
    font-weight: normal;
    font-size: ${(props) => (props.isMobile ? "10px" : "12px")};
    color: #767676;
`

const DealListTD = styled.td`
    border-bottom: 2px solid rgba(204, 204, 204, 1.0);
    padding-top: 5px;
    padding-bottom: 5px;

    text-align: center;
    font-family: "SC Dream 4";
    font-weight: normal;
    font-size: 10px;
    color: rgba(118,118,118,1);
`

export default LandInfo;