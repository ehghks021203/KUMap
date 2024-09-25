import styled from "styled-components";
import palette from "../constants/styles";

// 사이드 윈도우 스타일
export const LandDataContainer = styled.div`
    position: relative;
    background: rgba(250, 250, 250, 1);

    flex-shrink: 1;
    width: ${(props) => (props.isMobile ? "100vw" : "500px")};
    height: calc(100% - 50px);
    
    z-index: ${(props) => (props.isMobile ? "100" : "8")};
`

// 사이드윈도우에 표시될 컨텐츠
export const Content = styled.div`
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
export const Map = styled.iframe`
    position: absolute;
    margin: 0;
    
    border: 0;
    border-radius: 0px;
    
    width: 100%;
    height: ${(props) => (props.isMobile ? "250px" : "300px")};
`

// 로드뷰 버튼
export const RoadViewButton = styled.button`
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
export const LikeButton = styled.button`
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

export const RegisterButton = styled.button`
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
export const LikeCountText = styled.span`
    position: relative;

    margin-top: 4px;
    margin-bottom: 20px;
    margin-left: 12px;

    width: 100%;
    text-align: left;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: ${palette.blackL};
`

// 구분선
export const DivLine = styled.hr`
    margin-top: 20px;
    margin-bottom: 20px;

    border: 1px solid #cecece;

    width: ${(props) => (props.isMobile ? "90vw" : "450px")};
`
export const TinyDivLine = styled.hr`
    margin-top: 10px;
    margin-bottom: 10px;

    border: 1px solid #cecece;

    width: 400px;
`

// 토지정보의 주소
export const LandDataAddrText = styled.span`
    position: relative;
    margin-top: 4px;
    margin-bottom: 10px;

    text-align: center;
    font-family: "SC Dream 6";
    font-size: ${(props) => (props.isMobile ? "18px" : "22px")};
    color: ${palette.blackB};
`

// 토지의 가격
export const LandDataPriceText = styled.span`
    margin-top: 0px;
    position: relative;
    text-align: center;
    font-family: "SC Dream 6";
    font-size: ${(props) => (props.isMobile ? "20px" : "24px")};
    color: rgba(255,99,99,1);
`

// 토지의 가격 (제곱미터당)
export const LandDataPricePerText = styled.span`
    margin-top: 4px;
    position: relative;
    text-align: center;
    font-family: "SC Dream 4";
    font-size: ${(props) => (props.isMobile ? "10px" : "14px")};
    color: rgba(255,99,99,1);
`

// 토지 분석서 보기 버튼
export const ViewLandReportButton = styled.button`
    background: ${palette.blueL};
    margin-top: 30px;
    margin-bottom: 10px;

    border: 0;
    border-radius: 6px;

    padding-left: 14px;
    padding-right: 14px;
    height: 56px;

    text-align: center;
    font-family: "SC Dream 4";
    font-size: 18px;
    color: ${palette.whiteL};

    cursor: pointer;

    width: ${(props) => (props.isMobile ? "90vw" : "450px")};

    &:hover {
        background: ${palette.blueB};
        cursor: pointer;
    }
`


// 매물 스타일
export const LandPropertyAreaText = styled.span`
    display: block;
    width: 100%;
    margin-top: 20px;
    text-align: center;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #343a40;
`

export const LandPropertyPriceText = styled.h2`
    width: 100%;
    margin-top: 0px;
    text-align: center;
    font-family: "SC Dream 6";
    font-size: 24px;
    color: #0067a3;
`

export const LandPropertySummaryContainer = styled.div`
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


export const BidCaseCdText = styled.span`
    display: block;
    margin-top: -21px;
    width: 450px;
    text-align: center;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: #0067a3;
`

export const BidInfoDiv = styled.div`
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

export const BidDateSubtitleText = styled.span`
    position: relative;
    margin-left: 45px;

    width: 442px;

    text-align: left;
    font-family: "SC Dream 6";
    font-size: 12px;
    color: #343a40;
`

export const BidDateText = styled.span`
    position: relative;
    margin-left: 45px;

    width: 442px;

    text-align: left;
    font-family: "SC Dream 4";
    font-size: 11px;
    color: #343a40;
`

export const BidPriceDiv = styled.div`
    border-right: 2px solid #b8b8b8;
    
    padding-left: 20px;
    
    width: 200px;
    height: 40px;
`

export const BidPriceText = styled.span`
    position: relative;
    display: block;
    margin-left: 0px;

    width: 200px;

    text-align: left;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: #343a40;
`

export const BidInfoSubtitleText = styled.span`
    display: block;
    margin-top:0px;
    width: 200px;
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 12px;
    color: #343a40;
`

export const BidInfoText = styled.span`
    display: block;
    margin-top:0px;
    width: 200px;
    text-align: right;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #343a40;
`

export const BidSubtitleText = styled.span`
    display: block;
    margin-top:20px;
    margin-left: 4px;
    width: 450px;
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 15px;
    color: #343a40;
`

export const BidObjDiv = styled.div`
    display: flex;
    margin-left: 4px;
    flex-direction: column;
    align-items: left;
    width: 450px;

`

export const BidObjButton = styled.button`
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
export const LandDataMiniText = styled.span`
    position: relative;

    text-align: center;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #343a40;
`

export const LandDataTitleText = styled.span`
    position: relative;
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 4px;

    width: ${(props) => (props.isMobile ? "90vw" : "450px")};
    
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 20px;
    color: #343a40;
`

export const LandDataSubtitleText = styled.span`
    position: relative;
    margin-top: 10px;

    width: ${(props) => (props.isMobile ? "45vw" : "175px")};

    text-align: left;
    font-family: "SC Dream 6";
    font-size: 18px;
    color: ${palette.blackB};
`

export const LandDataText = styled.span`
    position: relative;

    width: ${(props) => (props.isMobile ? "45vw" : "175px")};

    text-align: left;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: ${palette.blackL};
`

export const LandDataBox = styled.div`
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

    width: ${(props) => (props.isMobile ? "44vw" : "215px")};
    height: 68px;
`

export const LandDataUsePlanBox = styled.div`
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

export const DealList = styled.table`
    width: ${(props) => (props.isMobile ? "91vw" : "442px")};
    border-collapse: collapse;
`

export const DealListTH = styled.th`
    border-bottom: 2px solid rgba(204, 204, 204, 1.0);
    padding-top: 5px;
    padding-bottom: 5px;

    text-align: center;
    font-family: "SC Dream 6";
    font-weight: normal;
    font-size: ${(props) => (props.isMobile ? "10px" : "12px")};
    color: #767676;
`

export const DealListTD = styled.td`
    border-bottom: 2px solid rgba(204, 204, 204, 1.0);
    padding-top: 5px;
    padding-bottom: 5px;

    text-align: center;
    font-family: "SC Dream 4";
    font-weight: normal;
    font-size: 10px;
    color: rgba(118,118,118,1);
`