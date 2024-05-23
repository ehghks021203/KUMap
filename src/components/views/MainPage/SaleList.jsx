import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

import { useDispatch, useSelector } from 'react-redux';
import { setLandInfo } from '../../../actions/globalValues';
import Loading from "../../Loading";

const SaleList = ({ isMobile=false, LoadLand }) => {
    const centerAddr = useSelector(state => state.globalValues.centerAddr);
    const saleList = useSelector(state => state.globalValues.saleList);
    const isLoading = useSelector(state => state.globalValues.bidLoading);

    function handleSalePageOpen(sale) {
        LoadLand(sale.lat, sale.lng);
    }

    // 조건부 렌더링
    if (!isMobile) {
        return (
            <SaleListContainer>
                <Content>
                    <CenterAddrText>{centerAddr}</CenterAddrText>
                    <div style={{width:"500px", display:"flex", justifyContent:"space-between"}}>
                        <SaleListMiniText style={{width:"130px"}}>토지 매물</SaleListMiniText>
                        <SaleListMiniText style={{width:"120px"}}>총 {saleList.length}개</SaleListMiniText>
                    </div>
                    {isLoading ? (
                        <Loading
                            loadingAddr={centerAddr}
                            type="경매"
                        />
                    ) : (
                        saleList.map((sale, index) => {
                            return (
                                <SaleListButton onClick={() => handleSalePageOpen(sale)}>
                                    <SaleListInfo>
                                        <br/>
                                        <AddrText>{sale.land_info.addr}</AddrText>
                                        <DateText>{sale.reg_date}</DateText>
                                    </SaleListInfo>
                                    <SaleListPriceContent style={{border:"0", color:"#0067a3"}}>
                                        <SaleListPriceTitle>매매가</SaleListPriceTitle><br/>
                                        {Math.floor(sale.land_price).toLocaleString('ko-KR')}
                                    </SaleListPriceContent>
                                </SaleListButton>
                            );
                        }))}
                    <div style={{marginBottom:"50px"}}/>
                </Content>
            </SaleListContainer>
        );
    }
}

// 사이드 윈도우 스타일
const SaleListContainer = styled.div`
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
const SaleListButton = styled.button`
    position: relative;
    background-color: transparent;
    margin-top: 10px;
    padding: 0;
    
    border: 2px solid #cecece;
    border-radius: 10px;
    
    width: 90%;
    min-height: 60px;

    cursor: pointer;

    &:hover {
        background-color: #f1f3f5;
    }
`

const SaleListInfo = styled.div`
    border-bottom: 1px solid #cecece;

    margin: 0 auto;
    width: 90%;
    min-height: 60px;
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

const SaleListPriceTitle = styled.span`
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 10px;
    color: #868e96;
`

const SaleListPriceContent = styled.div`
    margin-top: 0px;
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
const SaleListMiniText = styled.span`
    position: relative;

    text-align: center;
    font-family: "SC Dream 6";
    font-size: 12px;
    color: #495057;
`

export default SaleList;