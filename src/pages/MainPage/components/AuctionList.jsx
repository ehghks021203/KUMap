// import react
import React from "react";
import { useSelector } from "react-redux";
// import components
import Loading from "../../../components/Loading";
// import style components
import palette from "../../../constants/styles";
import {
    Container,
    Content,
    CenterAddrText,
    ListMiniText,
    NoResultsText,
    ListButton,
    ListInfo,
    CaseCdText,
    AddrText,
    DateText,
    ListPriceContent,
    ListPriceTitle,
  } from "../../../styles/AuctionList.styles";
import { setLandAddress } from "../../../store/actions/globalValues";

function AuctionList({ isMobile=false }) {
    const mapZoomLevel = useSelector(state => state.globalValues.mapZoomLevel);
    const centerAddress = useSelector(state => state.globalValues.centerAddress);
    const auctionList = useSelector(state => state.globalValues.auctionList);
    const isLoading = useSelector(state => state.globalValues.auctionListLoading);

    const transCaseCd = (caseCd) => {
        var returnStr = "";
        returnStr += caseCd.substr(0, 4);
        returnStr += "타경";
        returnStr += caseCd.substr(7).replace(/(^0+)/, "");
        return returnStr;
    }

    const handleAuctionPageOpen = (auction) => {
        const _landAddress = {
            type: LAND_TYPES.LAND_INFO,
            lat: auction.lat,
            lng: auction.lng,
            address: auction.addr,
            pnu: auction.pnu,
            scale: mapZoomLevel
        };
        dispatch(setLandAddress(_landAddress));
    }

    // 조건부 렌더링
    if (!isMobile) {
        return (
            <Container>
                <Content>
                    <CenterAddrText>{centerAddress.address}</CenterAddrText>
                    <div style={{width:"500px", display:"flex", justifyContent:"space-between"}}>
                        <ListMiniText style={{width:"130px"}}>경매 매물</ListMiniText>
                        <ListMiniText style={{width:"120px"}}>총 {auctionList.length}개</ListMiniText>
                        
                    </div>
                    <ListMiniText style={{margin:"6px", width:"420px", textAlign:"left", color:palette.grayB, fontFamily:"SC Dream 4"}}>* 오전 1시~오전 6시에는 경매 목록이 조회되지 않을 수 있습니다.</ListMiniText>
                    {isLoading ? (
                        <Loading
                            loadingAddr={centerAddr}
                            type="경매"
                        />
                    ) : (
                        auctionList.length === 0 ? (
                            <NoResultsText>조건에 맞는 검색 결과가 없습니다.</NoResultsText>
                        ) : (
                            auctionList.map((auction) => {
                                return (
                                    <ListButton key={auction.case_cd} onClick={() => handleAuctionPageOpen(auction)}>
                                        <ListInfo>
                                            <br/>
                                            <CaseCdText>{transCaseCd(auction.case_cd)} 물건번호 {auction.obj_nm}</CaseCdText>
                                            <AddrText>{auction.addr.address}</AddrText>
                                            <DateText>{auction.case_info.bid_date}</DateText>
                                        </ListInfo>
                                        <div style={{width:"100%", height:"70px", display:"flex", justifyContent:"space-between"}}>
                                            <ListPriceContent>
                                                <ListPriceTitle>감정가</ListPriceTitle><br/>
                                                {Math.floor(auction.case_info.appraisal_price).toLocaleString("ko-KR")}
                                            </ListPriceContent>
                                            <ListPriceContent style={{border:"0", color:"#0067a3"}}>
                                                <ListPriceTitle>최저가</ListPriceTitle><br/>
                                                {Math.floor(auction.case_info.min_sale_price).toLocaleString("ko-KR")}
                                            </ListPriceContent>
                                        </div>
                                    </ListButton>
                                );
                            })
                        )
                    )}
                    <div style={{marginBottom:"50px"}}/>
                </Content>
            </Container>
        );
    }
}

export default AuctionList;