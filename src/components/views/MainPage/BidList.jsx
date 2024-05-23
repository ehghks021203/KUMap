import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import styled from "styled-components";
import palette from '../../../lib/styles/colorPalette';
import Loading from "../../Loading";

function BidList({ isMobile=false, LoadLand }) {
    const centerAddr = useSelector(state => state.globalValues.centerAddr);
    const bidList = useSelector(state => state.globalValues.bidList);
    const isLoading = useSelector(state => state.globalValues.bidLoading);

    function transCaseCd(caseCd) {
        var returnStr = "";
        returnStr += caseCd.substr(0, 4);
        returnStr += "타경";
        returnStr += caseCd.substr(7).replace(/(^0+)/, "");
        return returnStr;
    }

    function handleBidPageOpen(bid) {
        LoadLand(bid.lat, bid.lng);
    }

    // 조건부 렌더링
    if (!isMobile) {
        return (
            <BidListContainer>
                <Content>
                    <CenterAddrText>{centerAddr}</CenterAddrText>
                    <div style={{width:"500px", display:"flex", justifyContent:"space-between"}}>
                        <BidListMiniText style={{width:"130px"}}>경매 매물</BidListMiniText>
                        <BidListMiniText style={{width:"120px"}}>총 {bidList.length}개</BidListMiniText>
                    </div>
                    {isLoading ? (
                        <Loading
                            loadingAddr={centerAddr}
                            type="경매"
                        />
                    ) : (
                        bidList.map((bid) => {
                            return (
                                <BidListButton onClick={() => handleBidPageOpen(bid)}>
                                    <BidListInfo>
                                        <br/>
                                        <CaseCdText>{transCaseCd(bid.case_cd)} 물건번호 {bid.obj_nm}</CaseCdText>
                                        <AddrText>{bid.addr}</AddrText>
                                        <DateText>{bid.case_info.bid_date}</DateText>
                                    </BidListInfo>
                                    <div style={{width:"100%", height:"70px", display:"flex", justifyContent:"space-between"}}>
                                        <BidListPriceContent>
                                            <BidListPriceTitle>감정가</BidListPriceTitle><br/>
                                            {Math.floor(bid.case_info.appraisal_price).toLocaleString('ko-KR')}
                                        </BidListPriceContent>
                                        <BidListPriceContent style={{border:"0", color:"#0067a3"}}>
                                            <BidListPriceTitle>최저가</BidListPriceTitle><br/>
                                            {Math.floor(bid.case_info.minimum_sale_price).toLocaleString('ko-KR')}
                                        </BidListPriceContent>
                                    </div>
                                </BidListButton>
                            );
                        })
                    )}
                    
                    <div style={{marginBottom:"50px"}}/>
                </Content>
            </BidListContainer>
        );
    } else {
        return (
            <BidListContainer>

            </BidListContainer>
        );
    }
}

// 사이드 윈도우 스타일
const BidListContainer = styled.div`
    position: relative;
    background: rgba(250, 250, 250, 1);

    flex-shrink: 1;
    width: ${(props) => (props.isMobile ? "100vw" : "500px")};
    height: calc(100% - 50px);
    
    z-index: ${(props) => (props.isMobile ? "100" : "8")};
`

const BackspaceButton = styled.button`
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
const BidListButton = styled.button`
    position: relative;
    background-color: transparent;
    margin-top: 10px;
    padding: 0;
    
    border: 2px solid #cecece;
    border-radius: 10px;
    
    width: 90%;
    min-height: 150px;

    cursor: pointer;

    &:hover {
        background-color: #f1f3f5;
    }
`

const BidListInfo = styled.div`
    border-bottom: 1px solid #cecece;

    margin: 0 auto;
    width: 90%;
    min-height: 80px;
`

const CaseCdText = styled.span`
    display: block;
    width: 400px;
    text-align: left;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #0067a3;
`

const AddrText = styled.span`
    display: block;
    width: 400px;
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 15px;
    color: #343a40;
`

const DateText = styled.span`
    display: block;
    width: 400px;
    text-align: left;
    font-family: "SC Dream 4";
    font-size: 10px;
    color: #868e96;
`

const BidListPriceTitle = styled.span`
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 10px;
    color: #868e96;
`

const BidListPriceContent = styled.div`
    margin-top: 8px;
    border-right: 1px solid #cecece;
    padding-left: 22px;
    padding-top: 1px;

    width: 50%;
    height: 50px;

    text-align: left;
    font-family: "SC Dream 6";
    font-size: 15px;
    color: #495057;
`

// 토지정보의 작은 텍스트
const BidListMiniText = styled.span`
    position: relative;

    text-align: center;
    font-family: "SC Dream 6";
    font-size: 12px;
    color: #495057;
`

export default BidList;