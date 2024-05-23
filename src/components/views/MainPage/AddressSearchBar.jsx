/*global kakao*/
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const AddressSearchBar = ({ map=null }) => {
    const [select, setSelect] = useState(0);
    // 주소 딕셔너리
    const [addrCategory, setAddrCategory] = useState({});
    // 시/도, 시/군/구, 읍/면/동에 해당하는 지번 리스트
    const [currCategory, setCurrCategory] = useState([]);
    // 현재 선택되어 있는 시/도
    const [currSido, setCurrSido] = useState("");
    // 현재 선택되어 있는 시/군/구
    const [currSigungu, setCurrSigungu] = useState("");
    // 현재 선택되어 있는 읍/면/동
    const [currEupmyeondong, setCurrEupmyeondong] = useState("");
    // 지도 좌표 이동 버튼 ref
    const addrButton = useRef();


    // 컴포넌트 생성 시 처음 한 번 실행
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/load_addr_csv`)
        .then(function(addrResponse) {
            setAddrCategory(addrResponse.data.data);
        }).catch(function(error) {
            alert("주소 목록을 받아오는 과정에서 문제가 생겼습니다.");
        });
    }, []);

    // 지도가 변경될 때 실행
    useEffect(() => {
        // 지도 객체가 생성되지 않았다면 리턴
        if (!map) { return; }

        // 검색 기능
        function SearchAddressToLatLng (address) {
            var geoCoder = new kakao.maps.services.Geocoder();

            var callback = function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    var bounds = new kakao.maps.LatLngBounds();
        
                    bounds.extend(new kakao.maps.LatLng(result[0].y, result[0].x));
        
                    map.setBounds(bounds);
                }
            };
            geoCoder.addressSearch(address, callback);
        }
                
        function AddrSearch (addr) {
            var address = addr;
            SearchAddressToLatLng(address);
        }

        const onClickSearch = (e) => {
            AddrSearch(addrButton.current.value);
            setSelect(0);
        };

        addrButton.current.addEventListener("click", onClickSearch);
    }, [map])

    // 시/도, 시/군/구, 읍/면/동 에 따른 카테고리 리스트 변경 및 select 넘버 변경
    const HandlerAddrCategory = (type) => {
        if (select === type) {
            setSelect(0);
        }
        else {
            if (type === 3 && currSigungu !== "") {
                setCurrCategory(addrCategory[currSido][currSigungu]);
                setSelect(3);
            } else if (type === 2 && currSido !== "") {
                setCurrCategory(Object.keys(addrCategory[currSido]));
                setSelect(2);
            } else {
                setCurrCategory(Object.keys(addrCategory));
                setSelect(1);
            }
        }
    }

    // 시/도, 시/군/구, 읍/면/동 선택 시 (SelectButton 핸들러)
    const HandlerAddrSelect = (type, addr) => {
        if (type === 1) {
            // 현재 주소 변경
            setCurrSido(addr);
            setCurrSigungu("");
            setCurrEupmyeondong("");
            // 카테고리 넘버 변경 (시군구(2))
            setSelect(2);
            // 카테고리 리스트 변경 (시군구)
            setCurrCategory(Object.keys(addrCategory[addr]));
        } else if (type === 2) {
            // 현재 주소 변경
            setCurrSigungu(addr);
            setCurrEupmyeondong("");
            // 카테고리 넘버 변경 (시군구(2))
            setSelect(3);
            // 카테고리 리스트 변경 (읍면동)
            setCurrCategory(addrCategory[currSido][addr]);
        } else if (type === 3) {
            // 현재 주소 변경
            setCurrEupmyeondong(addr);
        } 
    }

    // 상단에 표기되는 주소 텍스트 포멧팅
    const CategoryText = (type) => {
        if (type === 3 && currEupmyeondong !== "") {
            return currSido + " > " + currSigungu + " > " + currEupmyeondong;
        } else if (type === 3 && currSigungu !== "") {
            return currSido + " > " + currSigungu
        } else if (type === 2 && currSido !== "") {
            return currSido;
        } else if (type === 1 && currSido !== "") {
            return currSido;
        } else {
            return "시/도";
        }
    }

    return (
        <Container>
            <TextButton onClick={() => HandlerAddrCategory(1)}>{currSido !== "" ? currSido : "시/도"}</TextButton>
            <hr/>
            <TextButton onClick={() => HandlerAddrCategory(2)}>{currSigungu !== "" ? currSigungu : "시/군/구"}</TextButton>
            <hr/>
            <TextButton onClick={() => HandlerAddrCategory(3)}>{currEupmyeondong !== "" ? currEupmyeondong : "읍/면/동"}</TextButton>
            <SelectDiv style={select === 0 ? {visibility:"hidden"} : {visibility:"visible"}}>
                <SelectTopText>{CategoryText(select)}</SelectTopText>
                <SelectGrid>
                    {
                    currCategory.map((addr) => {
                        return (
                            <SelectButton onClick={() => HandlerAddrSelect(select, addr)}>{addr}</SelectButton>
                        );
                    })}
                </SelectGrid>
                <ViewMapButton ref={addrButton} value={currSido + " " + currSigungu + " " + currEupmyeondong}>지도로 보기</ViewMapButton>
                

            </SelectDiv>
        </Container>
    );
}

const Container = styled.div`
    position: absolute;
    background-color: white;
    display: flex;

    border-radius: 40px;
    padding-left: 10px;
    padding-right: 10px;

    top: 20px;
    left: calc(50% - 140px);

    width: 280px;
    height: 36px;

    z-index: 5;
`

const TextButton = styled.button`
    position: relative;
    background-color: transparent;

    border: 0;
    border-radius: 40px;
    padding-bottom: 4px;

    width: 100px;

    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 4";
	font-size: 11px;
    color: #343a40;

    cursor: pointer;
`

const SelectDiv = styled.div`
    position: absolute;
    background-color: white;

    border: 0;
    border-radius: 10px;
    padding-bottom: 10px;

    top: 50px;
    left: calc(50% - 140px);

    width: 280px;
    height: auto;
`

const SelectTopText = styled.span`
    position: relative;
    display: block;
    background-color: transparent;

    border: 0;
    border-bottom: 1px solid #343a40;
    padding-top: 6px;
    padding-bottom: 6px;
    margin-left: 10px;


    width: 260px;
    height: auto;

    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 4";
    font-size: 11px;
    color: #343a40;
`

const SelectGrid = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 90px 90px 90px;
    padding-top: 4px;
    padding-bottom: 4px;



    width: 260px;
`

const SelectButton = styled.button`
    position: relative;
    background-color: transparent;

    border: 0;
    padding-bottom: 4px;

    width: 100px;

    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 4";
	font-size: 11px;
    color: #343a40;

    cursor: pointer;
`

const ViewMapButton = styled.button`
    position: relative;
    background-color: #f05650;

    border: 0;
    border-radius: 6px;
    padding-top: 6px;
    padding-bottom: 6px;
    margin-top: 10px;
    margin-left: 10px;

    width: 260px;

    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 6";
    font-size: 11px;
    color: #fafafa;

    cursor: pointer;
`

export default AddressSearchBar;