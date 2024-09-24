import styled from "styled-components";
import palette from "../constants/styles";

export const Container = styled.div`
    position: relative;
    background: rgba(250, 250, 250, 1);

    flex-shrink: 1;
    width: ${(props) => (props.isMobile ? "100vw" : "500px")};
    height: calc(100% - 50px);
    
    z-index: ${(props) => (props.isMobile ? "100" : "8")};
`
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
export const NoResultsText = styled.h1`
    margin-top: 171px;
    text-align: center;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: ${palette.grayB};
`
export const CenterAddrText = styled.span`
    position: relative;
    margin-top: 20px;
    margin-bottom: 10px;

    text-align: center;
    font-family: "SC Dream 6";
    font-size: ${(props) => (props.isMobile ? "18px" : "20px")};
    color: #343a40;
`
export const CaseCdText = styled.span`
    display: block;
    width: 400px;
    text-align: left;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #0067a3;
`
export const AddrText = styled.span`
    display: block;
    width: 400px;
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 15px;
    color: #343a40;
`
export const DateText = styled.span`
    display: block;
    width: 400px;
    text-align: left;
    font-family: "SC Dream 4";
    font-size: 10px;
    color: #868e96;
`
export const ListButton = styled.button`
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
export const ListInfo = styled.div`
    border-bottom: 1px solid #cecece;

    margin: 0 auto;
    width: 90%;
    min-height: 80px;
`
export const ListPriceTitle = styled.span`
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 10px;
    color: #868e96;
`
export const ListPriceContent = styled.div`
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
export const ListMiniText = styled.span`
    position: relative;

    text-align: center;
    font-family: "SC Dream 6";
    font-size: 12px;
    color: #495057;
`