/*global kakao*/
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

function Main() {
    // 지도를 담을 변수 생성
    const [map, setMap] = useState(null);
    // 커스텀 오버레이 및 폴리곤
    const [customOverlay, setCustomOverlay] = useState(null);
    const [polygon, setPolygon] = useState(null);

    // 카카오맵 초기화
    const initMap = () => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.536172, 126.976978),
            level: 3,
        };
        const map = new kakao.maps.Map(container, options);
        setMap(map);

        // 커스텀 오버레이 생성
        const customOverlay = new kakao.maps.CustomOverlay({ 
            // 지도 중심좌표에 마커를 생성
            map: map,
            position: null,
            content: "",
            yAnchor: 0
        }); 
        setCustomOverlay(customOverlay);

        // 지도 위에 표시할 폴리곤 생성
        const polygon = new kakao.maps.Polygon({
            strokeWeight: 2,        // 선의 두께
            strokeColor: '#004c80', // 선의 색깔
            strokeOpacity: 0.8,     // 선의 불투명도. 1에서 0 사이의 값이며 0에 가까울수록 투명함
            strokeStyle: 'solid',   // 선의 스타일
            fillColor: '#fff',      // 채우기 색깔
            fillOpacity: 0.7,       // 채우기 불투명도
        });
        setPolygon(polygon);
    };

    // 페이지 렌더링이 끝난 후 실행 (1회 실행)
    useEffect(() => {
        initMap();
    }, []);

    // map 객체가 바뀔 때 마다 실행
	useEffect(() => {
        if (!map) { return; }
    	// 카카오맵에 클릭 시 실행되는 리스너 추가
        kakao.maps.event.addListener(map, "click", (mouseEvent) => {
            customOverlay.setMap(null);		// 맵에 존재하는 커스텀 오버레이 비활성화
            polygon.setMap(null);
            customOverlay.setContent("");	
    
            // 클릭한 위도, 경도 정보를 가져옵니다
            var latlng = mouseEvent.latLng;

            axios.get(`${process.env.REACT_APP_API_URL}/get_pnu?lat=${latlng.getLat()}&lng=${latlng.getLng()}`)
            .then(function(response) {
                // 오버레이에 표시할 컨텍스트 저장
                var content = `
                    <div class="custom-overlay">
                    <span class="title">
                    ${response.data.addressName}
                    <br>
                `;
                customOverlay.setContent(content);
                customOverlay.setPosition(latlng);

                customOverlay.setMap(map);
            }).catch(function(error) {
                alert("토지의 지번 주소를 불러오는 중 문제가 발생했습니다.");
            });

            // 지적도 조회
            axios.get(`${process.env.REACT_APP_API_URL}/get_land_geometry?lat=${latlng.getLat()}&lng=${latlng.getLng()}`)
            .then(function(geometryResponse) {
                // 다각형을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 다각형을 표시합니다
                var path = new Array();
                for (var i = 0; i < geometryResponse.data.geometry[0][0].length; i++) {
                    var polygon_latlng = new kakao.maps.LatLng(geometryResponse.data.geometry[0][0][i][1], geometryResponse.data.geometry[0][0][i][0]);
                    path.push(polygon_latlng);
                }
                polygon.setPath(path);
                polygon.setMap(map);
            }).catch(function(error) {
                alert("해당 토지의 연속지적도 데이터가 존재하지 않습니다.");
            });
        });
    }, [map]);

    return (
        <>
            <Map id="map" />
        </>
    );
}

// 지도
const Map = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    z-index: 5;
`

export default Main;