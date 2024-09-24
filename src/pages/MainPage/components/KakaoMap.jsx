const { kakao } = window;

// import react
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import components
import AddressSearchBar from "../../../components/shared/AddressSearchBar";
// import style components
import palette from "../../../constants/styles";
import { MapContainer, MapButton } from "../../../styles/KakaoMap.styles";
// import constants
import { ZOOM_LEVELS, LAND_TYPES } from "../../../constants/enums";
// import functions
import axios from "axios";
import { fetchLandAddressByCoordinates, fetchLandPolygonData, fetchRegionData, fetchAuctionListData, fetchRegionLandListData } from '../../../utils/api';
import { setAuctionList, setAuctionListLoading, setCenterAddress, setLandAddress, setSideStatus } from "../../../store/actions/globalValues";
// import icons
import { ReactComponent as CurrentPosIcon } from "../../../assets/images/icons/current_pos.svg";
// import css
import "./KakaoMap.css";


// 나중에 alert으로 오류 처리 해둔 부분은 모두 스낵바로 변경할 예정이야.

function KakaoMap({ addrInput }) {
    // 전역 변수 관리
    const dispatch = useDispatch();
    const landAddress = useSelector(state => state.globalValues.landAddress);
    const centerAddress = useSelector(state => state.globalValues.centerAddress);
    // 여기서 지도 및 중심좌표 변수를 선언해줘.
    const [map, setMap] = useState(null);
    const [landPolygons, setLandPolygons] = useState([]);
    const [customOverlay, setCustomOverlay] = useState(null);
    const [regionMarkers, setRegionMarkers] = useState(null);
    const [regionClusterer, setRegionClusterer] = useState(null);
    const [previousCenterAddress, setPreviousCenterAddress] = useState(null);

    // 스카이뷰 관련 변수
    const [isSkyView, setSkyView] = useState(false);

    // 매물 및 경매 관련 변수
    const [showAuctionMarkers, setShowAuctionMarkers] = useState(true);
    const [auctionMarkers, setAuctionMarkers] = useState([]);
    const [showPropertyListingMarkers, setShowPropertyListingMarkers] = useState(true);


    // 먼저, 여기에서 카카오맵을 초기화해.
    useEffect(() => {
        initializeMap();
    }, []);

    // 여기서 카카오맵 초기화가 완료되었다면, 이벤트 리스너를 등록해줘.
    useEffect(() => {
        if (!map) { return; }
        // 맵과 상호작용하는 커스텀 오버레이와 폴리곤을 등록해줘.
        customOverlay.setMap(map);
        landPolygons.forEach(polygon => polygon.setMap(map));
        // 맵의 이벤트 리스너를 등록해줘,
        kakao.maps.event.addListener(map, "click", onMapClick);
        kakao.maps.event.addListener(map, "tilesloaded", onTilesLoaded);
        kakao.maps.event.addListener(map, "zoom_changed", onZoomChanged);

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

        return () => {
            kakao.maps.event.removeListener(map, "click", onMapClick);
            kakao.maps.event.removeListener(map, "tilesloaded", onTilesLoaded);
            kakao.maps.event.removeListener(map, "zoom_changed", onZoomChanged);
        };
    }, [map]);

    // 중심 좌표가 변경되면 실행되는 코드
    useEffect(() => {
        if (!centerAddress) { return; }
        console.log(centerAddress);
        if (centerAddress.address !== previousCenterAddress) {
            setPreviousCenterAddress(centerAddress.address);
            getAuctionListData();
        }
    }, [centerAddress]);
    
    // 선택된 토지가 변경되면 실행되는 코드
    useEffect(() => {
        // 만약 landAddress가 null이면 아래 코드를 실행하지 않아.
        if (!landAddress || !map) { return; }
        console.log(landAddress);
        dispatch(setSideStatus("land-info"));
        for (var i = 0; i < landPolygons.length; i++) {
            landPolygons[i].setPath(null);
        }
        if (landAddress.type === LAND_TYPES.LAND_INFO) {
            const latlng = new kakao.maps.LatLng(landAddress.lat, landAddress.lng);
            map.panTo(latlng);
            if (map.getLevel() > 4) {
                map.setLevel(3, {anchor: latlng});
            }
        }
        else if (landAddress.type === LAND_TYPES.REGION_LAND_UNLOAD) {
            fetchRegionLandListData({ pnu: landAddress.pnu })
            .then(response => {
                const _landAddress = {
                    type: LAND_TYPES.REGION_LAND,
                    lat: response.data.data.lat,
                    lng: response.data.data.lng,
                    address: response.data.data.region,
                    pnu: response.data.data.pnu,
                    avg_predict_land_price: response.data.data.avg_predict_land_price,
                    land: response.data.data.land,
                    price_ratio: response.data.data.price_ratio,
                    total_land_count: response.data.data.total_land_count
                };
                dispatch(setLandAddress(_landAddress));
            })
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.error("Request canceled", error.message);
                } else {
                    console.log(error);
                }
            });
        }
        // landAddress 안에 있는 pnu를 가지고 지적도를 받아와.
        console.log(landAddress.pnu)
        fetchLandPolygonData({ pnu: landAddress.pnu })
        .then(response => {
            // 반복문으로 다각형 표시
            for (var i = 0; i < response.data.polygons.length; i++) {
                for (var j = 0; j < response.data.polygons[i].length; j++) {
                    var path = new Array();
                    for (var k = 0; k < response.data.polygons[i][j][0].length; k++) {
                        var polygon_latlng = new kakao.maps.LatLng(response.data.polygons[i][j][0][k][1], response.data.polygons[i][j][0][k][0]);
                        path.push(polygon_latlng);
                    }
                    landPolygons[i].setPath(path);
                }
            }
            if (landAddress.type === LAND_TYPES.LAND_INFO) {
                // 커스텀 오버레이 위에 주소 표시
                var content = `<div class="custom-overlay"><span class="title">${landAddress.address.eupmyeondong + " " + landAddress.address.detail}<br>`;
                //오버레이 컨텍스트 및 위치 지정
                var latlng = new kakao.maps.LatLng(landAddress.lat, landAddress.lng);
                customOverlay.setContent(content);
                customOverlay.setPosition(latlng);
                customOverlay.setMap(map);
            }
        })
        .catch(function(error) {
            if (axios.isCancel(error)) {
                console.error("Request canceled", error.message);
            } else {
                console.log(error);
            }
        });
    }, [landAddress]);


    // 클러스터링 객체가 변경될 때 실행되는 코드
    useEffect(() => {
        if (!regionClusterer || !map) { return; }
        // add EventListener
        kakao.maps.event.addListener(regionClusterer, "clustered", function (clusters) {
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
              console.log(error);
            }
        });

        kakao.maps.event.addListener(regionClusterer, 'clusterclick', function(cluster) {
            const markers = cluster.getMarkers();
            const count = markers.length - 1;

            const pnus = markers.map(marker => marker.getContent().getAttribute('data-pnu'));
            const regions = markers.map(marker => marker.getContent().getAttribute('data-region'));
            const prices = markers.map(marker => marker.getContent().getAttribute('data-price'));
            const ratios = markers.map(marker => marker.getContent().getAttribute('data-ratio'));
            // 데이터 표시 로직 추가 (예: alert, console.log, 또는 UI 업데이트)
            const _landAddress = {
                type: LAND_TYPES.CLUSTERER_LAND,
                address: `${markers[0].getContent().getAttribute("data-addr")} 외 ${count}`,
                region: regions,
                pnu: pnus,
                price: prices,
                ratio: ratios,
            };
            dispatch(setLandAddress(_landAddress));
        });
    }, [regionClusterer]);



    // 카카오맵 초기화
    const initializeMap = () => {
        // 사용자가 마지막으로 본 위경도를 로컬 스토리지에서 받아와. 이는 사용자 입장에서 앱 사용이 편리해질 수 있어.
        const lastViewLat = localStorage.getItem("last_view_lat");
        const lastViewLng = localStorage.getItem("last_view_lng");
        // 만약 값이 존재한다면 해당 위경도로 중심 좌표를 변경하고, 아니면 내가 임의로 지정한 좌표로 이동하게 돼.
        const initialCenter = lastViewLat && lastViewLng
            ? new kakao.maps.LatLng(lastViewLat, lastViewLng)
            : new kakao.maps.LatLng(37.536172, 126.976978);

        // 카카오맵의 기본 설정을 진행해. 줌 레벨은 3으로 할꺼야.
        const mapOptions = {
            center: initialCenter,
            level: 3,
        };
        // 새로운 카카오맵을 만들고, html은 id가 map으로 되어있는 요소와 연결해.
        const newMap = new kakao.maps.Map(document.getElementById("map"), mapOptions);

        // 토지 선택 시 지적도가 나와야 하기 때문에, 폴리곤도 초기화해줘.
        const newLandPolygons = Array.from({ length: 20 }, () => new kakao.maps.Polygon({
            strokeWeight: 2,
            strokeColor: palette.blueB,
            strokeOpacity: 0.8,
            strokeStyle: "solid",
            fillColor: palette.whiteL,
            fillOpacity: 0.7,
        }));
        // 토지를 선택하게 되면 해당 클릭 부분에 커스텀 오버레이를 띄워 해당 부분의 지명을 띄워줘야 하기 때문에 커스텀 오버레이를 초기화해줘.
        const newCustomOverlay = new kakao.maps.CustomOverlay({
            map: newMap,
            position: null,
            content: "",
            yAnchor: 0,
        });
        // 지도 레벨이 5 이상이 되면 클러스터링하여 토지가를 시각화해줄꺼야. 그걸 위해 클러스터링 객체를 만들어줘.
        const newRegionClusterer = new kakao.maps.MarkerClusterer({
            map: newMap,
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
        // 이제 이것들을 useState를 활용해 상태 변수에 담아줘.
        setMap(newMap);
        setLandPolygons(newLandPolygons);
        setCustomOverlay(newCustomOverlay);
        setRegionClusterer(newRegionClusterer);
    };

    const onMapClick = (mouseEvent) => {
        if (map.getLevel() > 4) { return; }
        customOverlay.setMap(null);
        customOverlay.setContent("");
        
        const latlng = mouseEvent.latLng;
        if (ZOOM_LEVELS.LOW.includes(map.getLevel())) {
            fetchLandAddressByCoordinates({ lat: latlng.getLat(), lng: latlng.getLng() })
            .then(response => {
                const { result, msg, err_code, ..._landAddress } = response.data;
                _landAddress.type = LAND_TYPES.LAND_INFO;
                dispatch(setLandAddress(_landAddress));
            })
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.error("Request canceled", error.message);
                } else {
                    console.log(error);
                }
            });
        }
    };

    const onTilesLoaded = () => {
        if (!map) { return; }
        const latlng = map.getCenter();
        fetchLandAddressByCoordinates({ lat: latlng.getLat(), lng: latlng.getLng() })
        .then(response => {
            if (!response.data.address) { return; }
            const _centerAddress = {};
            _centerAddress.address = response.data.address.sido + (ZOOM_LEVELS.HIGH.includes(map.getLevel()) ? "" : " " + response.data.address.sigungu);
            _centerAddress.lat = latlng.getLat();
            _centerAddress.lng = latlng.getLng();
            dispatch(setCenterAddress(_centerAddress));
            if (!ZOOM_LEVELS.LOW.includes(map.getLevel())) {
                getRegionMarkers();
            }
            // 마지막 중심 좌표 로컬 스토리지에 저장
            localStorage.setItem("last_view_lat", response.data.lat);
            localStorage.setItem("last_view_lng", response.data.lng);
        })
        .catch(error => {
            if (axios.isCancel(error)) {
                console.error("Request canceled", error.message);
            } else {
                console.log(error);
            }
        })
    };

    const onZoomChanged = () => {
        if (map.getLevel() > 4) {
            if (customOverlay) { 
                for (var i = 0; i < landPolygons.length; i++) {
                    landPolygons[i].setPath(null);
                }
                customOverlay.setMap(null); 
            }
        } else if (map.getLevel() < 5) {
            if (regionClusterer) {
                for (var i = 0; i < landPolygons.length; i++) {
                    landPolygons[i].setPath(null);
                }
                regionClusterer.clear();
            }
        }
        //dispatch(setMapZoomLevel(map.getLevel()));
    };

    // 지도 타입 변경 함수 (스카이뷰, 일반 지도)
    const ChangeMapType = () => {
        if (!map) { return; }

        if (isSkyView) {
            map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
            setSkyView(false);
        } else {
            map.setMapTypeId(kakao.maps.MapTypeId.SKYVIEW);
            setSkyView(true);
        }
    }

    const getRegionMarkers = () => {
        let bounds = map.getBounds();
        let sw = bounds.getSouthWest();
        let ne = bounds.getNorthEast();
        console.log(bounds)
        // HTTP 통신
        fetchRegionData({ lat1: sw.getLat(), lng1: sw.getLng(), lat2: ne.getLat(), lng2: ne.getLng(), zoom: map.getLevel() })
        .then(response => {
            console.log(response)
            let _regionList = response.data.data;
            let _regionMarkers = [];
            for (let i = 0; i < _regionList.length; i++) {
                let pnu = _regionList[i].pnu;
                let addr = _regionList[i].addr;
                let region = _regionList[i].region;
                let price = _regionList[i].avg_predict_land_price;
                let ratio = _regionList[i].price_ratio;
                // let total_land_count = _regionList[i].total_land_count;
                let latlng = new kakao.maps.LatLng(_regionList[i].lat, _regionList[i].lng);
                        
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
                let region_price = document.createElement("span");
                region_price.className = "region-price";
                region_price.appendChild(price !== "0" ? document.createTextNode(priceFormatting(price.toString())) : document.createTextNode(" - "));
                content.appendChild(region_price);
                let region_ratio = document.createElement("span");
                region_ratio.className = ratio < 100 ? "region-low-ratio" : "region-high-ratio";
                region_ratio.appendChild(price !== "0" ? document.createTextNode(ratio + "%") : document.createTextNode(""));
                content.appendChild(region_ratio);
                content.onclick = function() {
                    const land = {
                        type: LAND_TYPES.REGION_LAND_UNLOAD,
                        address: addr,
                        pnu: pnu
                    };
                    dispatch(setLandAddress(land));
                    //customOverlay.setMap(null);
                    //SelectLandByPNU(_auction_data.lat, _auction_data.lng, _auction_data.pnu, _auction_data.addr);
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
            regionClusterer.clear();
            regionClusterer.addMarkers(_regionMarkers);
        })
        .catch(error => {
            if (axios.isCancel(error)) {
                console.error("Request canceled", error.message);
            } else {
                console.log(error);
            }
        });
    }

    const getAuctionListData = () => {
        if (!map) { return; }
        // 중앙 좌표를 기준으로 주변의 경매 목록 불러오기
        //dispatch(setBidLoading(true));  // 로딩 상태 활성화
        dispatch(setAuctionListLoading(true));

        if (centerAddress.address !== previousCenterAddress) {
            setPreviousCenterAddress(centerAddress.address);
            fetchAuctionListData({ lat: centerAddress.lat, lng: centerAddress.lng, zoom: map.getLevel() })
            .then(response => {
                console.log(response);
                let _auction_list = response.data.data;
                dispatch(setAuctionList(_auction_list));
                // 마커 추가
                let b_markers = [];
                for (let i = 0; i < _auction_list.length; i++) {
                    // var로 변수를 선언할 경우 클로저 문제가 발생.
                    // 따라서 모든 변수들을 let으로 선언하여, 클로저 문제 해결
                    // 이거 해결하느라 삽질 오만번 한듯
                    let _auction_data = _auction_list[i];
                    let pnu = _auction_data["pnu"];
                    let price = _auction_data["case_info"]["appraisal_price"];
                    let area = Math.floor(_auction_data["area"]).toLocaleString("ko-KR");
                    let latlng = new kakao.maps.LatLng(_auction_data.lat, _auction_data.lng);
                            
                    let content = document.createElement("button");
                    content.className = "auction-overlay";
                    let auction_block = document.createElement("div");
                    auction_block.className = "auction-block";
                    content.appendChild(auction_block);
                    let auction_title = document.createElement("span");
                    auction_title.className = "auction-title";
                    auction_title.appendChild(document.createTextNode("경매"));
                    auction_block.appendChild(auction_title);
                    let auction_price = document.createElement("span");
                    auction_price.className = "auction-price";
                    auction_price.appendChild(document.createTextNode(priceFormatting(price.toString())));
                    content.appendChild(auction_price);
                    let auction_area = document.createElement("span");
                    auction_area.className = "auction-area";
                    auction_area.appendChild(document.createTextNode(area + "m²"));
                    content.appendChild(auction_area);
        
                    content.onclick = function() {
                        customOverlay.setMap(null);
                        dispatch(setLandAddress({ type: LAND_TYPES.LAND_INFO, lat: _auction_data.lat, lng: _auction_data.lng, address: _auction_data.address, pnu: _auction_data.pnu }));
                    }
        
                    var _auction_overlay = new kakao.maps.CustomOverlay({
                        map: null,
                        clickable: true,
                        position: latlng,
                        content: content,
                        yAnchor: 0
                    });
        
        
                    _auction_markers.push({
                        "data": _auction_data,
                        "marker": _auction_overlay,
                    });
                }
                setAuctionMarkers(_auction_markers);
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

    const priceFormatting = (price) => {
        if (price.length < 5) { return Math.floor(parseInt(price.substr(0, price.length))).toLocaleString('ko-KR') + "천" }
        if (price.length < 9) { return Math.floor(parseInt(price.substr(0, price.length - 4))).toLocaleString('ko-KR') + "만" }
        if (price.length < 13) { return Math.floor(parseInt(price.substr(0, price.length - 8))).toLocaleString('ko-KR') + "억" }
    };

    return (
        <MapContainer id="map">
            <AddressSearchBar map={map} />
            <MapButton number={1}>
                <CurrentPosIcon style={{ marginTop: "4px" }} />
            </MapButton>
            <MapButton
                number={2}
                style={isSkyView ? { backgroundColor: "#767676", color: "#FAFAFA" } : { backgroundColor: "#FAFAFA", color: "#767676" }}
                onClick={() => setSkyView(!isSkyView)}
            >
                지도
            </MapButton>
            <MapButton
                number={3}
                style={showAuctionMarkers ? { backgroundColor: "#ff7d7d", color: "#FAFAFA" } : { backgroundColor: "#FAFAFA", color: "#767676" }}
                onClick={() => setShowAuctionMarkers(!showAuctionMarkers)}
            >
                경매
            </MapButton>
            <MapButton
                number={4}
                style={showPropertyListingMarkers ? { backgroundColor: "#0067a3", color: "#FAFAFA" } : { backgroundColor: "#FAFAFA", color: "#767676" }}
                onClick={() => setShowPropertyListingMarkers(!showPropertyListingMarkers)}
            >
                매물
            </MapButton>
        </MapContainer>
    );
}

export default KakaoMap;