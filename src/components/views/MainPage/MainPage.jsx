/*global kakao*/
import React, { useState, useRef, useEffect } from "react";
import { ConsoleView, isMobile } from 'react-device-detect';
import styled from "styled-components";
import axios from "axios";
import palette from '../../../lib/styles/colorPalette';
import { ZOOM_LEVELS, LAND_TYPES } from "../../../enums";

import { useDispatch, useSelector } from 'react-redux';
import { setCenterAddr, setPrevCenterAddr, setSelectLand, setLandInfo, setLandInfoLoading, setBidList, setSaleList, setBidLoading, setSaleLoading, setSideStatus } from '../../../actions/globalValues';
import { setUserLoginStatus, setCurrUser } from '../../../actions/userStatus';

import Sidebar from "./Sidebar";
import SideWindow from "./SideWindow";
import LandRegisterPage from "./LandRegisterPage";
import LandReportModal from "./LandReportModal";
import AddressSearchBar from "./AddressSearchBar";

import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";
import { ReactComponent as CurrentPosIcon } from "../../../assets/icons/current_pos.svg";
import { ReactComponent as CurrentPosOnIcon } from "../../../assets/icons/current_pos_on.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";

import "./MainPage.css";

function MainPage() {
    const cancelTokenSource = useRef();

    // 전역 변수 관리
    const dispatch = useDispatch();
    const centerAddr = useSelector(state => state.globalValues.centerAddr);
    const prevCenterAddr = useSelector(state => state.globalValues.prevCenterAddr);
    const selectLand = useSelector(state => state.globalValues.selectLand);
    const landInfo = useSelector(state => state.globalValues.landInfo);
    const landReportAddr = useSelector(state => state.globalValues.landReportAddr);
    const bidList = useSelector(state => state.globalValues.bidList);
    const saleList = useSelector(state => state.globalValues.saleList);

    const currUser = useSelector(state => state.userStatus.currUser);

    // 지도 및 중심좌표 변수
    const [map, setMap] = useState(null);
    const [centerPos, setCenterPos] = useState(null);
    const [landPolygon, setLandPolygon] = useState([]);
    const [customOverlay, setCustomOverlay] = useState(null);

    // 현재 보고있는 지역 주변의 경매 및 매물 마커
    const [bidMarkers, setBidMarkers] = useState({});
    const [saleMarkerData, setSaleMarkerData] = useState({});
    const [regionMarkers, setRegionMarkers] = useState({});
    const [regionCluster, setRegionCluster] = useState(null);

    // 지번 검색 관련 변수
    const [addrSearch, setAddrSearch] = useState("");
    const addrInput = useRef();

    // 스카이뷰 관련 변수
    const [isSkyView, setSkyView] = useState(false);

    // 매물 및 경매 관련 변수
    const [showBid, setShowBid] = useState(true);
    const [showSale, setShowSale] = useState(true);

    // 사이드바 기능 관련 변수
    // 사이드바 상태
    const [regLandData, setRegLandData] = useState({"type":"none"});


    const [mapZoomLevel, setMapZoomLevel] = useState(4);
    const [geoList, setGeoList] = useState([]);
    const [multiPolygon, setMultiPolygon] = useState([]);
    const [visNo, setVisNo] = useState(0);
    

    // 페이지 렌더링이 끝난 후 실행 (1회 실행)
    useEffect(() => {
        UserVerification();
        InitMap();
    }, []);

    // 유저 토큰 검증 함수
    const UserVerification = () => {
        // 유저의 로컬스토리지에 있는 토큰 유효성 검사
        axios.get(`${process.env.REACT_APP_API_URL}/protected`, {
            headers: {Authorization: "Bearer " + localStorage.getItem("access_token"),},
        }).then(function(response) {
            // 유저의 토큰이 유효함
            dispatch(setCurrUser({
                user: response.data.user,
                name: response.data.name,
                email:response.data.email,
            }));
            dispatch(setUserLoginStatus(true));
        }).catch(function(error) {
            // 유저의 토큰이 유효하지 않음
            dispatch(setUserLoginStatus(false));
        });
    }

    // 카카오맵 초기화
    const InitMap = () => {
        // 마지막으로 보고 있었던 위경도 좌표 불러오기
        let lvLat = localStorage.getItem("last_view_lat");
        let lvLng = localStorage.getItem("last_view_lng");
        if (lvLat !== null && lvLng !== null) {
            var _center = new kakao.maps.LatLng(lvLat, lvLng);
        } else {
            // 없다면 기본값으로 지정
            var _center = new kakao.maps.LatLng(37.536172, 126.976978);
        }

        // 지도 설정
        const container = document.getElementById("map");
        const options = {
            center: _center,
            level: 3,
        };
        const map = new kakao.maps.Map(container, options);

        // 지도 위에 표시할 폴리곤 생성
        const polygonList = []
        for (var i=0; i<20; i++) {
            const polygon = new kakao.maps.Polygon({
                strokeWeight: 2,        // 선의 두께
                strokeColor: palette.blueB, // 선의 색깔
                strokeOpacity: 0.8,     // 선의 불투명도. 1에서 0 사이의 값이며 0에 가까울수록 투명함
                strokeStyle: "solid",   // 선의 스타일
                fillColor: palette.whiteL,      // 채우기 색깔
                fillOpacity: 0.7,       // 채우기 불투명도
            });
            polygonList.push(polygon);
        }

        // 커스텀 오버레이 생성
        const customOverlay = new kakao.maps.CustomOverlay({ 
            // 지도 중심좌표에 마커를 생성
            map: map,
            position: null,
            content: "",
            yAnchor: 0
        }); 

        // 마커 클러스터 생성
        const regionCluster = new kakao.maps.MarkerClusterer({
            map: map,
            averageCenter: true,
            disableClickZoom: true,
            gridSize: 100,
            minLevel: 5,
            styles: [{
                padding: "4px 10px 4px 10px",
                background: '#FFF',
                filter: "drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.2))",
                borderRadius: '20px',
                color: '#FFF',
                textAlign: 'center',
                fontWeight: 'bold',
                zIndex: "20"
            }]
        });

        setMap(map);
        setLandPolygon(polygonList);
        setCustomOverlay(customOverlay);
        setRegionCluster(regionCluster);
    };

    // map 객체가 새로 생성되거나 변경될 때 실행
    useEffect(() => {
        // Exception: 지도 객체가 생성되지 않았다면 리턴
        if (!map) { return; }

        // 커스텀 오버레이와 지적도 표시를 위한 폴리곤 맵 위에 세팅                
        customOverlay.setMap(map);
        for (var i = 0; i < landPolygon.length; i++) {
            landPolygon[i].setMap(map);
        }
        // polygon.setMap(map);
        
        // 카카오맵에 클릭 시 실행되는 리스너 추가
        kakao.maps.event.addListener(map, "click", (mouseEvent) => {
            // if (map.getLevel() >= 4) { return; }    // 맵의 확대 정도가 4레벨보다 크거나 같으면 동작 X
            customOverlay.setMap(null);        
            customOverlay.setContent("");
            
            var latlng = mouseEvent.latLng;             // 클릭한 위도, 경도 정보를 가져옵니다
            SelectLandByCoordinates(latlng.getLat(), latlng.getLng());   // 토지 선택 이벤트
        });

        // 타일 로드 시 실행되는 함수
        kakao.maps.event.addListener(map, "tilesloaded", () => {
            var _centerPos = map.getCenter();
            setCenterPos(_centerPos);
        });
        
        // 줌 인, 줌 아웃 시 실행되는 함수
        kakao.maps.event.addListener(map, "zoom_changed", () => {
            var zoomLevel = map.getLevel();
            setMapZoomLevel(zoomLevel);
        });

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

        const handlerEnterKey = (e) => {
            if (e.key == "Enter") {
                AddrSearch(addrInput.current.value);
            }
        };
        addrInput.current.addEventListener("keydown", handlerEnterKey);
    }, [map]);

    useEffect(() => {
        if (!centerPos) { return; }

        axios.get(`${process.env.REACT_APP_API_URL}/get_pnu?lat=${centerPos.getLat()}&lng=${centerPos.getLng()}`)
        .then(function(addrResponse) {
            let addr = addrResponse.data.address
            if (!addr) { return; }
            if (ZOOM_LEVELS.HIGH.includes(mapZoomLevel)) {
                dispatch(setCenterAddr(addr.sido));
            } else {
                dispatch(setCenterAddr(addr.sido + " " + addr.sigungu));
            }

            if (!ZOOM_LEVELS.LOW.includes(mapZoomLevel)) {
                GetRegionMarker();
            }
            
            // 마지막 중심 좌표 로컬스토리지에 저장
            localStorage.setItem("last_view_lat", centerPos.getLat());
            localStorage.setItem("last_view_lng", centerPos.getLng());
        }).catch(function(error) {
            alert("중심 좌표의 주소를 받아오는 도중 문제가 발생했습니다.");
        });
    }, [centerPos]);

    const DisablePolygons = () => {
        for (var i = 0; i < landPolygon.length; i++) {
            landPolygon[i].setPath(null);
        }
    }

    const SelectLandByCoordinates = (lat, lng) => {
        axios.get(`${process.env.REACT_APP_API_URL}/get_pnu?lat=${lat}&lng=${lng}`)
        .then(function(addrResponse) {
            if (ZOOM_LEVELS.LOW.includes(map.getLevel())) {
                const land = {
                    type: LAND_TYPES.LAND_INFO,
                    lat: lat,
                    lng: lng,
                    addr: addrResponse.data.address,
                    pnu: addrResponse.data.pnu,
                    scale: mapZoomLevel
                };
                dispatch(setSelectLand(land));
            } else {
                if (ZOOM_LEVELS.MID.includes(map.getLevel())) {
                    const land = {
                        type: LAND_TYPES.REGION_LAND_UNLOAD,
                        addr: addrResponse.data.address,
                        pnu: addrResponse.data.pnu.substr(0,8),
                        scale: mapZoomLevel
                    };
                    dispatch(setSelectLand(land));
                } else if (ZOOM_LEVELS.HIGH.includes(map.getLevel())) {
                    const land = {
                        type: LAND_TYPES.REGION_LAND_UNLOAD,
                        addr: addrResponse.data.address,
                        pnu: addrResponse.data.pnu.substr(0,5),
                        scale: mapZoomLevel
                    };
                    dispatch(setSelectLand(land));
                } else if (ZOOM_LEVELS.TOP.includes(map.getLevel())) {
                    const land = {
                        type: LAND_TYPES.REGION_LAND_UNLOAD,
                        addr: addrResponse.data.address,
                        pnu: addrResponse.data.pnu.substr(0,2),
                        scale: mapZoomLevel
                    };
                    dispatch(setSelectLand(land));
                }
            }
        })
    }

    const SelectLandByPNU = (lat, lng, pnu, addr) => {
        const selectLand = {
            type: LAND_TYPES.LAND_INFO,
            lat: lat,
            lng: lng,
            addr: addr,
            pnu: pnu,
            scale: mapZoomLevel
        };
        dispatch(setSelectLand(selectLand));
    }

    // selectLandAddr 값이 변경될 때 실행
    useEffect(() => {
        if (!map || !selectLand) { return; }
        /*
        if (landInfo.bid_data !== null) {
            customOverlay.setMap(null);
            // 여기에다가 애니메이션 넣고 싶은데...
            //bidMarkerData[landInfo.pnu] 
        } else if (landInfo.sale_data !== null) {
            customOverlay.setMap(null);
            // 여기에다가 애니메이션 넣고 싶은데...
            //bidMarkerData[landInfo.pnu] 
        } else {
            */
        
        // 지적도 조회
        dispatch(setSideStatus("land_info"));
        if (selectLand.type === LAND_TYPES.CLUSTERER_LAND) {
            const geo = new Array();
            for (var i=0; i<selectLand.pnu.length; i++) {
                axios.get(`${process.env.REACT_APP_API_URL}/get_land_geometry?pnu=${selectLand.pnu[i]}`)
                .then(function(geometryResponse) {
                    geo.push(geometryResponse.data.geometry);
                }).catch(function(error) {
                    alert("해당 토지의 연속지적도 데이터가 존재하지 않습니다.");
                });
            }
            // 다각형을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 다각형을 표시합니다
            DisablePolygons();
            for (var i = 0; i < geo.length; i++) {
                var path = new Array();
                for (var j = 0; j < geo[i][0].length; j++) {
                    var polygon_latlng = new kakao.maps.LatLng(geo[i][0][j][1], geo[i][0][j][0]);
                    path.push(polygon_latlng);
                }
                landPolygon[i].setPath(path);
            }
        } else if (selectLand.type !== LAND_TYPES.REGION_LAND_LOAD) {
            axios.get(`${process.env.REACT_APP_API_URL}/get_land_geometry?pnu=${selectLand.pnu}`)
            .then(function(geometryResponse) {
                // 다각형을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 다각형을 표시합니다
                DisablePolygons();
                for (var i = 0; i < geometryResponse.data.geometry.length; i++) {
                    var path = new Array();
                    for (var j = 0; j < geometryResponse.data.geometry[i][0].length; j++) {
                        var polygon_latlng = new kakao.maps.LatLng(geometryResponse.data.geometry[i][0][j][1], geometryResponse.data.geometry[i][0][j][0]);
                        path.push(polygon_latlng);
                    }
                    landPolygon[i].setPath(path);
                }
            }).catch(function(error) {
                alert("해당 토지의 연속지적도 데이터가 존재하지 않습니다.");
            });
        }

        if (selectLand.type === LAND_TYPES.LAND_INFO) {
            // 오버레이에 표시할 컨텍스트 저장
            var content = `
                <div class="custom-overlay">
                <span class="title">
                ${selectLand.addr.eupmyeondong + " " + selectLand.addr.detail}
                <br>
            `;
            // 오버레이 컨텍스트 및 위치 지정
            var latlng = new kakao.maps.LatLng(selectLand.lat, selectLand.lng);
            customOverlay.setContent(content);
            customOverlay.setPosition(latlng);
            customOverlay.setMap(map);

            if (map.getLevel() > 4) {
                map.setLevel(3)
            }
            LoadLand(selectLand.pnu);
            var moveLatLng = new kakao.maps.LatLng(selectLand.lat, selectLand.lng);
            map.panTo(moveLatLng);
           
        } else if (selectLand.type === LAND_TYPES.REGION_LAND_UNLOAD) {
            axios.get(`${process.env.REACT_APP_API_URL}/get_region_describe?pnu=${selectLand.pnu}`)
            .then(function(regionResponse) {
                const land = {
                    type: LAND_TYPES.REGION_LAND_LOAD,
                    lat: regionResponse.data.data.lat,
                    lng: regionResponse.data.data.lng,
                    addr: regionResponse.data.data.region,
                    pnu: regionResponse.data.data.pnu,
                    avg_predict_land_price: regionResponse.data.data.avg_predict_land_price,
                    land: regionResponse.data.data.land,
                    price_ratio: regionResponse.data.data.price_ratio,
                    total_land_count: regionResponse.data.data.total_land_count
                };
                dispatch(setSelectLand(land));
            }).catch(function(error) {
                alert(error);
            });
        }        
        // if (mapZoomLevel > 4) {
        //     map.setLevel(3, {anchor: moveLatLng});
        // }
        
          
    }, [selectLand]);

    // 중심좌표 및 줌 레벨 변화 시 실행
    useEffect(() => {
        if (!map) { return; }
        
        let centerPos = map.getCenter();
        if (centerAddr != prevCenterAddr && mapZoomLevel < 10) {
            LoadBidList(centerPos.getLat(), centerPos.getLng());
            LoadPropertyList(centerPos.getLat(), centerPos.getLng());
            dispatch(setPrevCenterAddr(centerAddr));
        }
        /*
        if (mapZoom != prevMapZoom && (mapZoom == 2 || mapZoom == 3 || mapZoom == 5 || mapZoom == 6)) {
            axios.get(`${process.env.REACT_APP_API_URL}/get_all_geo_data?level=${mapZoom}&lat=${centerPos.getLat()}&lng=${centerPos.getLng()}`)
            .then(geoResponse => {
                setGeoList(geoResponse.data);
                console.log(geoResponse.data);
            })
            setPrevMapZoom(mapZoom);
        }
        */
    }, [map, centerAddr, prevCenterAddr, mapZoomLevel]);

    const GetRegionMarker = () => {
        let bounds = map.getBounds();
        let sw = bounds.getSouthWest();
        let ne = bounds.getNorthEast();



        axios.get(`${process.env.REACT_APP_API_URL}/get_region_marker?lat1=${sw.getLat()}&lng1=${sw.getLng()}&lat2=${ne.getLat()}&lng2=${ne.getLng()}&zoom=${mapZoomLevel}`)
        .then(function(regionResponse) {
            let _regionList = regionResponse.data.data;
            let _regionMarkers = [];
            for (let i = 0; i < _regionList.length; i++) {
                let pnu = _regionList[i]["pnu"];
                let addr = _regionList[i]["addr"];
                let region = _regionList[i]["region"];
                let price = _regionList[i]["avg_predict_land_price"];
                let ratio = _regionList[i]["price_ratio"];
                let total_land_count = _regionList[i]["total_land_count"];
                let latlng = new kakao.maps.LatLng(_regionList[i]["lat"], _regionList[i]["lng"]);
                        
                let content = document.createElement("button");
                content.setAttribute("data-pnu", pnu);
                content.setAttribute("data-addr", addr);
                content.setAttribute("data-region", region);
                content.setAttribute("data-price", price);
                content.setAttribute("data-ratio", ratio);
                content.className = "region-overlay";
                let region_block = document.createElement("div");
                region_block.className = ratio < 100 ? "region-low-block" : "region-high-block";
                content.appendChild(region_block);
                let region_title = document.createElement("span");
                region_title.className = "region-title";
                region_title.appendChild(document.createTextNode(region));
                region_block.appendChild(region_title);

                if (price !== "0") {
                    let region_price = document.createElement("span");
                    region_price.className = "region-price";
                    region_price.appendChild(document.createTextNode(PriceFormating(price.toString())));
                    content.appendChild(region_price);
                    let region_ratio = document.createElement("span");
                    region_ratio.className = ratio < 100 ? "region-low-ratio" : "region-high-ratio";
                    region_ratio.appendChild(document.createTextNode(ratio + "%"));
                    content.appendChild(region_ratio);
                } else {
                    let region_price = document.createElement("span");
                    region_price.className = "region-price";
                    region_price.appendChild(document.createTextNode(" - "));
                    content.appendChild(region_price);
                    let region_ratio = document.createElement("span");
                    region_ratio.className = "region-low-ratio";
                    region_ratio.appendChild(document.createTextNode(""));
                    content.appendChild(region_ratio);
                }
                content.onclick = function() {
                    axios.get(`${process.env.REACT_APP_API_URL}/get_land_geometry?pnu=${pnu}`)
                    .then(function(geometryResponse) {
                        const land = {
                            type: LAND_TYPES.REGION_LAND_UNLOAD,
                            addr: addr,
                            pnu: pnu,
                            scale: mapZoomLevel
                        };
                        dispatch(setSelectLand(land));
                    }).catch(function(error) {
                        alert(error);
                    });
                    //customOverlay.setMap(null);
                    //SelectLandByPNU(b_data.lat, b_data.lng, b_data.pnu, b_data.addr);
                }
    
                var _regionOverlay = new kakao.maps.CustomOverlay({
                    position: latlng,
                    content: content,
                    yAnchor: 0,
                    clickable: true
                });
                
                _regionMarkers.push(_regionOverlay);
            }

            if (Array.isArray(regionMarkers)) {
                regionMarkers.map((region) => {
                    region["marker"].setMap(null);
                });
            }
            regionCluster.clear();
            regionCluster.addMarkers(_regionMarkers);

            //setRegionMarkers(_regionMarkers);

        }).catch(function(error) {
            if (error.response) {
                alert("해당 토지의 정보가 없습니다.");
            }
        });   
    }


    useEffect(() => {
        if (!regionCluster || !map) { return; }

        kakao.maps.event.addListener(regionCluster, "clustered", function (clusters) {
            try {
                for (let i = 0; i < clusters.length; i++) {
                    const cls = clusters[i];
                    const overlay = cls.getClusterMarker().getContent();
                    const markers = cls.getMarkers();
                    const count = markers.length - 1;
                    const content = markers[0].getContent();

                    overlay.innerHTML = `
                        <span class="region-cluster-text">${content.getAttribute("data-region")} 외</span>
                        <span class="region-cluster-highlight-text">${count}</span>
                    `;
                }
            } catch (error) {
              console.error(error);
            }
        });

        kakao.maps.event.addListener(regionCluster, 'clusterclick', function(cluster) {
            const markers = cluster.getMarkers();
            const count = markers.length - 1;

            const pnus = markers.map(marker => marker.getContent().getAttribute('data-pnu'));
            const regions = markers.map(marker => marker.getContent().getAttribute('data-region'));
            const prices = markers.map(marker => marker.getContent().getAttribute('data-price'));
            const ratios = markers.map(marker => marker.getContent().getAttribute('data-ratio'));
            // 데이터 표시 로직 추가 (예: alert, console.log, 또는 UI 업데이트)
            const selectLand = {
                type: LAND_TYPES.CLUSTERER_LAND,
                addr: `${markers[0].getContent().getAttribute("data-addr")} 외 ${count}`,
                region: regions,
                pnu: pnus,
                price: prices,
                ratio: ratios
            };
            dispatch(setSelectLand(selectLand));
            //if (map.getLevel() > 5) {
            //    console.log(map.getLevel())
            //    // 현재 지도 레벨에서 1레벨 확대한 레벨
            //    var level = map.getLevel()-1;
            //    // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
            //    map.setLevel(level, {anchor: cluster.getCenter()});
            //}
            
        });
    }, [regionCluster]);




    // 토지 데이터 로드 함수
    const LoadLand = (pnu) => {
        // dispatch(setSideStatus("land_info"));
        dispatch(setLandInfoLoading(true));  // 로딩 상태 활성화
        // 토지특성정보 받아오기
        // 새로운 요청을 만들기 전에 이전 요청 취소
        if (cancelTokenSource.current) {
            cancelTokenSource.current.cancel("Previous request canceled due to a new request");
        }

        // 새로운 cancel token 생성
        cancelTokenSource.current = axios.CancelToken.source();

        axios.get(`${process.env.REACT_APP_API_URL}/get_land_info?pnu=${pnu}`, {
            cancelToken: cancelTokenSource.current.token
        }).then(function(landResponse) {
            dispatch(setLandInfoLoading(false)); // 로딩 완료됨
            let likeStatus = false;
            //// 토지의 좋아요 데이터 불러오기
            //axios.post(`${process.env.REACT_APP_API_URL}/load_land_like`, {
            //    "email": currUser.email,
            //    "lat": lat,
            //    "lng": lng,
            //}).then(function(likeResponse) {
            //    likeStatus = likeResponse.data.is_like;
            //}).catch(function(error) {
            //    alert("유저의 좋아요 정보를 받아오는 도중 문제가 발생했습니다.");
            //});
            
            // 토지 특성 정보 저장
            dispatch(setLandInfo(landResponse.data.data));

            if (landResponse.data.data.land_info.predict_land_price === null) {
                // 토지예측가 받아오기
                // 새로운 요청을 만들기 전에 이전 요청 취소
                if (cancelTokenSource.current) {
                    cancelTokenSource.current.cancel("Previous request canceled due to a new request");
                }

                // 새로운 cancel token 생성
                cancelTokenSource.current = axios.CancelToken.source();

                axios.get(`${process.env.REACT_APP_API_URL}/get_land_predict_price?pnu=${pnu}`, {
                    cancelToken: cancelTokenSource.current.token
                }).then(function(predResponse) {
                    dispatch(setLandInfo(predResponse.data.data));
                }).catch(function(error) {
                    if (error.response) {
                        alert("해당 토지의 정보가 없습니다.");
                    } else if (axios.isCancel(error)) {
                        console.log("이전 요청이 취소되었습니다:", error.message);
                    }
                });   

            }
        }).catch(function(error) {
            if (error.response) {
                alert("해당 토지의 정보가 없습니다.");
            } else if (axios.isCancel(error)) {
                console.log("이전 요청이 취소되었습니다:", error.message);
            }
        });   
    }

    const LoadBidList = (lat, lng, zoom) => {
        // 중앙 좌표를 기준으로 주변의 경매 목록 불러오기
        dispatch(setBidLoading(true));  // 로딩 상태 활성화
        
        axios.get(`${process.env.REACT_APP_API_URL}/get_bid_list?lat=${lat}&lng=${lng}&zoom=${zoom}`)
        .then(function(response) {
            let b_list = response.data.data;
            dispatch(setBidList(b_list));
            dispatch(setBidLoading(false)); // 로딩 완료됨
            let b_markers = [];
            for (let i = 0; i < b_list.length; i++) {
                // var로 변수를 선언할 경우 클로저 문제가 발생.
                // 따라서 모든 변수들을 let으로 선언하여, 클로저 문제 해결
                // 이거 해결하느라 삽질 오만번 한듯
                let b_data = b_list[i];
                let pnu = b_data["pnu"];
                let price = b_data["case_info"]["appraisal_price"];
                let area = Math.floor(b_data["area"]).toLocaleString("ko-KR");
                let latlng = new kakao.maps.LatLng(b_data.lat, b_data.lng);
                        
                let content = document.createElement("button");
                content.className = "bid-overlay";
                let bid_block = document.createElement("div");
                bid_block.className = "bid-block";
                content.appendChild(bid_block);
                let bid_title = document.createElement("span");
                bid_title.className = "bid-title";
                bid_title.appendChild(document.createTextNode("경매"));
                bid_block.appendChild(bid_title);
                let bid_price = document.createElement("span");
                bid_price.className = "bid-price";
                bid_price.appendChild(document.createTextNode(PriceFormating(price.toString())));
                content.appendChild(bid_price);
                let bid_area = document.createElement("span");
                bid_area.className = "bid-area";
                bid_area.appendChild(document.createTextNode(area + "m²"));
                content.appendChild(bid_area);
    
                content.onclick = function() {
                    customOverlay.setMap(null);
                    SelectLandByPNU(b_data.lat, b_data.lng, b_data.pnu, b_data.addr);
                }
    
                var b_overlay = new kakao.maps.CustomOverlay({
                    map: null,
                    clickable: true,
                    position: latlng,
                    content: content,
                    yAnchor: 0
                });
    
    
                b_markers.push({
                    "data": b_data,
                    "marker": b_overlay,
                });
            }
            setBidMarkers(b_markers);

        }).catch(function(error) {
            if (error.request) {
                alert("경매 목록을 불러오는 도중 문제가 발생했습니다.");
            }
        });
        
    }

    const LoadPropertyList = (lat, lng) => {
        // 중앙 좌표를 기준으로 주변의 매물 목록 불러오기
        dispatch(setSaleLoading(true)); // 로딩 상태 활성화
        axios.get(`${process.env.REACT_APP_API_URL}/get_land_property_list?lat=${lat}&lng=${lng}`)
        .then(function(response) {
            dispatch(setSaleList(response.data.data));
            dispatch(setSaleLoading(false));    // 로딩 완료됨
        }).catch(function(error) {
            if (error.request) {
            }
        });
    }


    useEffect(() => {
        if (customOverlay) {
            if (mapZoomLevel > 4) {
                customOverlay.setMap(null);
            }
        }

        if (regionCluster) {
            if (mapZoomLevel < 5) {
                regionCluster.clear();
            }
        }

        if (Array.isArray(bidMarkers)) { 
            bidMarkers.map((bid) => {
                if (showBid && mapZoomLevel < 5) { bid["marker"].setMap(map); }
                else { bid["marker"].setMap(null); }
            });
        }
    }, [customOverlay, regionCluster, bidMarkers, showBid, centerPos, mapZoomLevel]);

    

    useEffect(() => {
        if (!map) {return;}

        if (multiPolygon.length != 0) {
            for (var i = 0; i < multiPolygon.length; i++) {
                multiPolygon[i]["polygon"].setMap(null);
            }
        }
        
        var mp = new Array();
        for (var i = 0; i < geoList.data.length; i++) {
            var path = new Array();
            var priceIQR = 0;
            var percentIQR = 0;
            for (var j = 0; j < geoList.data[i]["geometry"][0][0].length; j++) {
                var latlng = new kakao.maps.LatLng(geoList.data[i]["geometry"][0][0][j][1], geoList.data[i]["geometry"][0][0][j][0]);
                path.push(latlng);
            }
            var polygon = new kakao.maps.Polygon({
                path: path,
                strokeWeight: 2,
                strokeColor: '#004c80',
                strokeOpacity: 0.8,
                fillColor: '#fff',
                fillOpacity: 0.7 
            });
            if (geoList.data[i]["price"] <= geoList.priceIQR["Q1"]) { priceIQR = 0; }
            else if (geoList.data[i]["price"] > geoList.priceIQR["Q1"] && geoList.data[i]["price"] <= geoList.priceIQR["Q2"]) { priceIQR = 1; }
            else if (geoList.data[i]["price"] > geoList.priceIQR["Q2"] && geoList.data[i]["price"] <= geoList.priceIQR["Q3"]) { priceIQR = 2; }
            else if (geoList.data[i]["price"] > geoList.priceIQR["Q3"] && geoList.data[i]["price"] <= geoList.priceIQR["Q4"]) { priceIQR = 3; }
            if (geoList.data[i]["percent"] <= 0.3) { percentIQR = 0; }
            else if (geoList.data[i]["percent"] > 0.3 && geoList.data[i]["percent"] <= 0.6) { percentIQR = 1; }
            else if (geoList.data[i]["percent"] > 0.6 && geoList.data[i]["percent"] <= 0.9) { percentIQR = 2; }
            else if (geoList.data[i]["percent"] > 0.9 && geoList.data[i]["percent"] <= 1.2) { percentIQR = 3; }
            else if (geoList.data[i]["percent"] > 1.2 && geoList.data[i]["percent"] <= 1.5) { percentIQR = 4; }
            else if (geoList.data[i]["percent"] > 1.5 && geoList.data[i]["percent"] <= 1.8) { percentIQR = 5; }
            else if (geoList.data[i]["percent"] > 1.8 && geoList.data[i]["percent"] <= 2.1) { percentIQR = 6; }
            if (geoList.data[i]["percent"] > 2.1) { percentIQR = 7; }
            mp.push({"polygon":polygon, "price":priceIQR, "percent":percentIQR});
        }
        setMultiPolygon(mp);
    }, [geoList])


    


    

    useEffect(() => {
        if (!map) { return; }

        if (visNo == 0) {
            for (var i = 0; i < multiPolygon.length; i++) {
                multiPolygon[i]["polygon"].setMap(null);
            }
        }
        if (visNo == 1) {
            var priceColor = ["#FFEBEE", "#EF9A9A", "#E53935", "#B71C1C"]
            for (var i = 0; i < multiPolygon.length; i++) {
                multiPolygon[i]["polygon"].setOptions({
                    strokeWeight: 3,
                    strokeColor: '#191919',
                    strokeOpacity: 0.8,
                    fillColor: priceColor[multiPolygon[i]["price"]],
                    fillOpacity: 0.7 
                });
                multiPolygon[i]["polygon"].setMap(map);
            }
        } else if (visNo == 2) {
            var percentColor = ["#C2CFFF", "#8B9FF5", "6F86F1", "#3856E7", "#FFEBEE", "#EF9A9A", "#E53935", "#B71C1C"]
            for (var i = 0; i < multiPolygon.length; i++) {
                multiPolygon[i]["polygon"].setOptions({
                    strokeWeight: 3,
                    strokeColor: '#191919',
                    strokeOpacity: 0.8,
                    fillColor: percentColor[multiPolygon[i]["percent"]],
                    fillOpacity: 0.7 
                });
                multiPolygon[i]["polygon"].setMap(map);
            }
        }
    }, [multiPolygon, visNo])

    const PriceFormating = (price) => {
        if (price.length < 5) { return Math.floor(parseInt(price.substr(0, price.length))).toLocaleString('ko-KR') + "천" }
        if (price.length < 9) { return Math.floor(parseInt(price.substr(0, price.length - 4))).toLocaleString('ko-KR') + "만" }
        if (price.length < 13) { return Math.floor(parseInt(price.substr(0, price.length - 8))).toLocaleString('ko-KR') + "억" }
    };

    


    // 매물 마커 생성 및 표시
    useEffect(() => {
        if (!map) { return; }

        var saleMarker = {};
        for (let i = 0; i < saleList.length; i++) {
            if (saleList[i]["pnu"] in saleMarkerData) { continue; }

            // var로 변수를 선언할 경우 클로저 문제가 발생.
            // 따라서 모든 변수들을 let으로 선언하여, 클로저 문제 해결
            // 이거 해결하느라 삽질 오만번 한듯
            let saleData = saleList[i];
            let pnu = saleData["pnu"];
            let price = String(saleData["land_price"]);
            let area = Math.floor(saleData["land_area"]).toLocaleString('ko-KR');
            let coords = new kakao.maps.LatLng(saleData.lat, saleData.lng);
                    
            let content = document.createElement("button");
            content.className = "sale-overlay";
            let saleBlock = document.createElement("div");
            saleBlock.className = "sale-block";
            content.appendChild(saleBlock);
            let saleTitle = document.createElement("span");
            saleTitle.className = "sale-title";
            saleTitle.appendChild(document.createTextNode("매물"));
            saleBlock.appendChild(saleTitle);
            let salePrice = document.createElement("span");
            salePrice.className = "sale-price";
            salePrice.appendChild(document.createTextNode(PriceFormating(price)));
            content.appendChild(salePrice);
            let saleArea = document.createElement("span");
            saleArea.className = "sale-area";
            saleArea.appendChild(document.createTextNode(area + "m²"));
            content.appendChild(saleArea);

            content.onclick = function() {
                SelectLand(saleData.lat, saleData.lng)
                customOverlay.setMap(null);
            }

            var saleOverlay = new kakao.maps.CustomOverlay({
                map: null,
                clickable: true,
                position: coords,
                content: content,
                yAnchor: 0
            });

            saleMarker[pnu] = {
                "data": saleData,
                "marker": saleOverlay,
            }
        }
        setSaleMarkerData(saleMarkerData => {
            return {...saleMarkerData, ...saleMarker}   
        })
    }, [saleList]);

    useEffect(() => {
        if (showSale) {
            for (var pnu in saleMarkerData) {
                saleMarkerData[pnu]["marker"].setMap(map);
            }
        } else {
            for (var pnu in saleMarkerData) {
                saleMarkerData[pnu]["marker"].setMap(null);
            }
        }
    }, [saleMarkerData, showSale]);

    
    // 지도 타입 변경 함수 (스카이뷰, 일반 지도)
    function ChangeMapType() {
        if (!map) { return; }

        if (isSkyView) {
            map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
            setSkyView(false);
        } else {
            map.setMapTypeId(kakao.maps.MapTypeId.SKYVIEW);
            setSkyView(true);
        }
    }

    const handlerVisNo = (no) => {
        if (no == 2) {
            setVisNo(0);
        } else {
            setVisNo(visNo + 1);
        }
    }

    if (!isMobile) {
        // 데스크톱 렌더링
        return(
            <>
                {regLandData.type === "land-reg" && <LandRegisterPage currUserData={currUser} regLandData={regLandData} setRegLandData={setRegLandData} LoadLand={LoadLand}/>}
                {landReportAddr && <LandReportModal/>}
                <TopBar>
                    <div style={{ width:"495px", display:"flex", flexDirection: "row", alignItems: "center" }}>
                        <AddrSearchBar 
                            ref={addrInput} 
                            className="addr-search" 
                            type="text" 
                            value={addrSearch} 
                            onChange={(e) => setAddrSearch(e.target.value)} 
                            placeholder="지번 검색" 
                        />
                        <SearchIcon style={{marginLeft: "-32px"}}/>
                    </div>
                </TopBar>

                <Sidebar LoadLand={LoadLand} />
                
                <Container>
                    <Map id='map'>
                        <AddressSearchBar map={map}/>
                        <MapButton number={1}>
                            <CurrentPosIcon style={{marginTop: "4px"}}/>
                        </MapButton>
                        <MapButton 
                            number={2}
                            style={isSkyView ? {backgroundColor:"#767676", color:"#FAFAFA"} : {backgroundColor:"#FAFAFA", color:"#767676"}}
                            onClick={() => ChangeMapType()}
                        >지도</MapButton>
                        <MapButton 
                            number={3}
                            style={showBid ? {backgroundColor:"#ff7d7d", color:"#FAFAFA"} : {backgroundColor:"#FAFAFA", color:"#767676"}}
                            onClick={() => setShowBid(!showBid)}
                        >경매</MapButton>
                        <MapButton 
                            number={4}
                            style={showSale ? {backgroundColor:"#0067a3", color:"#FAFAFA"} : {backgroundColor:"#FAFAFA", color:"#767676"}}
                            onClick={() => setShowSale(!showSale)}
                        >매물</MapButton>
                    </Map>
                    <SideWindow 
                        SelectLandByPNU={SelectLandByPNU}
                        setRegLandData={setRegLandData}
                    />
                </Container>
            </>
        );
    } else {
        // 모바일 렌더링
        return (
            <>
                <TopBar isMobile={true}>
                    <div style={{width:"85%", display:"flex", flexDirection: "row", alignItems: "center"}}>
                        <AddrSearchBar 
                            isMobile={true}
                            ref={addrInput} 
                            className="addr-search" 
                            type="text" 
                            value={addrSearch} 
                            onChange={(e) => setAddrSearch(e.target.value)} 
                            placeholder="지번 검색" 
                        />
                        <SearchIcon style={{marginLeft: "-32px"}}/>
                    </div>
                </TopBar>
                <Sidebar isMobile={true} LoadLand={LoadLand} />

                <Container isMobile={true}>
                    <Map id='map'>
                        <AddressSearchBar map={map}/>
                        <MapButton number={1}><CurrentPosIcon style={{marginTop: "4px"}}/></MapButton>
                        <MapButton number={2}
                            style={isSkyView ? {backgroundColor:"#767676", color:"#FAFAFA"} : {backgroundColor:"#FAFAFA", color:"#767676"}}
                            onClick={() => ChangeMapType()}
                        >지도</MapButton>
                        <MapButton number={3}
                            style={showBid ? {backgroundColor:"#ff7d7d", color:"#FAFAFA"} : {backgroundColor:"#FAFAFA", color:"#767676"}}
                            onClick={() => setShowBid(!showBid)}
                        >경매</MapButton>
                        <MapButton number={4}
                            style={showSale ? {backgroundColor:"#0067a3", color:"#FAFAFA"} : {backgroundColor:"#FAFAFA", color:"#767676"}}
                            onClick={() => setShowSale(!showSale)}
                        >매물</MapButton>
                        <MapButton number={5}
                            style={visNo == 0 ? {backgroundColor:"#FAFAFA", color:"#767676"} : visNo == 1 ? {backgroundColor:"#ff7d7d", color:"#FAFAFA"} : {backgroundColor:"#0067a3", color:"#FAFAFA"}}
                            onClick={() => handlerVisNo(visNo)}
                        >시각화</MapButton>
                    </Map>
                    
                </Container>
                <MobileSideWindowOpenButton>
                    { landInfo === null ?
                        "지역을 선택해주세요." :
                        landInfo.addr
                    }
                </MobileSideWindowOpenButton>
            </>
        );
    }
}

// * 상단바 스타일
// 상단바
const TopBar = styled.div`
    background: ${palette.whiteL};
    filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
    position: relative;

    width: calc(100vw - 10px);
    min-width: ${(props) => (props.isMobile ? "none" : "900px")};
    height: 60px;
    display:flex;
    margin: 0 auto;
    padding-right: 10px;

    flex-direction: row;
    justify-content: right;
    z-index: 10;
`
// 주소 검색창
const AddrSearchBar = styled.input`
    background: rgba(236, 236, 236, 1);
    width: ${(props) => (props.isMobile ? "calc(100% - 60px)" : "430px")};
    height: 36px;
    border: none;
    border-radius: 6px;
    margin-left: 10px;
    padding-left: 20px;
    padding-right: 40px;
    font-family: "SC Dream 4";
	font-size: 12px;
    color: rgba(127,127,127,1);
`

// * 메인 뷰 스타일
// 컨테이너 (PC화면 최소 크기 900px)
const Container = styled.div`
    display: flex;
    width: 100vw;
    min-width: ${(props) => (props.isMobile ? "none" : "900px")};
    height: ${(props) => (props.isMobile ? "calc(100vh - 140px)" : "calc(100vh - 60px)")};
`
// 지도
const Map = styled.div`
    position: relative;
    width: ${(props) => (props.isMobile ? "100%" : "calc(100% - 500px)")};
    min-width: ${(props) => (props.isMobile ? "none" : "400px")};
    height: 100%;
    z-index: 5;
`
// 지도 버튼 (현재위치, 지도, 경매, 매물)
const MapButton = styled.button`
    position: absolute;
    background: rgba(250, 250, 250, 1);
    filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.3));
    
    border: 0;
    border-radius: 6px;

    top: calc(${(props) => (props.isMobile ? "20px" : "30px")} + ${(props) => (props.number * (props.isMobile ? "45" : "60"))}px);
    right: ${(props) => (props.isMobile ? "10px" : "20px")};
    width: ${(props) => (props.isMobile ? "36px" : "42px")};
    height: ${(props) => (props.isMobile ? "36px" : "42px")};
    z-index: 10;

    text-align: center;
    font-family: "SC Dream 6";
    font-size: ${(props) => (props.isMobile ? "8px" : "12px")};
    color: #767676;

    cursor: pointer;
`

const MobileListOpenBtn = styled.button`
    position: absolute;
    background-color: ${palette.whiteL};
    filter: drop-shadow(0px -3px 6px rgba(0, 0, 0, 0.161));

    bottom: 10px;
    right: 20vw;
    border-radius: 20px;

    width: 60vw;
    height: 40px;

    border: 0;
    
    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 6";
	font-size: 15px;
    color: ${palette.blackL};
    z-index: 10;

    &:hover {
        background: ${palette.whiteM};
        cursor: pointer;
    }
`

const MobileSideWindowOpenButton = styled.button`
    background-color: ${palette.whiteL};
    filter: drop-shadow(0px -3px 6px rgba(0, 0, 0, 0.161));

    width: 100vw;
    height: 80px;

    border: 0;
    
    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 6";
	font-size: 15px;
    color: ${palette.blackL};

    &:hover {
        background: ${palette.whiteM};
        cursor: pointer;
    }
`



// 모바일 사이드바 스타일
const LoginButton = styled.button`
    background-color: #0067a3;
    margin-right: 10px;

    border: 0;
    border-radius: 6px;
    width: 135px;
    height: 50px;

    font-family: "SC Dream 6";
	font-size: 12px;
    color: #fafafa;
`

const RegisterButton = styled.button`
    background-color: #fafafa;

    border: 0;
    border-radius: 6px;
    width: 135px;
    height: 50px;

    font-family: "SC Dream 6";
	font-size: 12px;
    color: #393939;
`

export default MainPage;
