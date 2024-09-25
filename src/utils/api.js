import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 취소 토큰 관리
let landAddressCancelToken = null;
let regionDataCancelToken = null;
let regionLandListDataCancelToken = null;
let landDataCancelToken = null;
let landReportDataCancelToken = null;
let auctionListDataCancelToken = null;
let landPropertyListDataCancelToken = null;
let landLikeCancelToken = null;
let userLandLikeListDataCancelToken = null;
let registerLandPropertyCancleToken = null;
let userPropertyListingsDataCancelToken = null;


// API 요청 함수 정의
// 유저 검증 api
export const fetchUserVerification = () => {
    return api.get("/protected", {
        headers: { Authorization: "Bearer " + localStorage.getItem("access_token") }
    })
}
// 선택된 토지의 주소 정보 받아오기
export const fetchLandAddressByCoordinates = (params) => {
    console.log(params)
    if (landAddressCancelToken) {
        // 이전 요청 취소
        landAddressCancelToken.cancel("New request made, cancelling previous request.");
    }
    landAddressCancelToken = axios.CancelToken.source();

    return api.get("/get_pnu", { 
        params, 
        cancelToken: landAddressCancelToken.token 
    });
}
// 선택된 토지의 지적도 받아오기
export const fetchLandPolygonData = (params) => {
    // if (landPolygonCancelToken) {
    //     landPolygonCancelToken.cancel("New request made, canceling previous request.");
    // }
    // landPolygonCancelToken = axios.CancelToken.source();

    return api.get("/get_land_polygons", {
        params,
        paramsSerializer: {
            indexes: null, // no brackets at all
        },
        // cancelToken: landPolygonCancelToken.token
    });
}
// 지역 마커 받아오기
export const fetchRegionData = (params) => {
    if (regionDataCancelToken) {
        regionDataCancelToken.cancel("New request made, canceling previous request.");
    }
    regionDataCancelToken = axios.CancelToken.source();

    return api.get("/get_region_markers", {
        params,
        cancelToken: regionDataCancelToken.token
    });
}
// 특정 지역의 토지 정보 목록 받아오기
export const fetchRegionLandListData = (params) => {
    if (regionLandListDataCancelToken) {
        regionLandListDataCancelToken.cancel("New request made, canceling previous request.");
    }
    regionLandListDataCancelToken = axios.CancelToken.source();

    return api.get("/get_region_land_describes", {
        params,
        cancelToken: regionLandListDataCancelToken.token
    });
}
// 토지 특성 정보 받아오기
export const fetchLandData = (params) => {
    if (landDataCancelToken) {
        landDataCancelToken.cancel("New request made, canceling previous request.");
    }
    landDataCancelToken = axios.CancelToken.source();

    return api.get("/get_land_info", {
        params,
        cancelToken: landDataCancelToken.token
    });
}
// 토지 예측가 정보 받아오기
export const fetchLandPredictPriceData = (params) => {
    if (landDataCancelToken) {
        landDataCancelToken.cancel("New request made, canceling previous request.");
    }
    landDataCancelToken = axios.CancelToken.source();

    return api.get("/get_land_predict_price", {
        params,
        cancelToken: landDataCancelToken.token
    });
}
// 토지 분석서 받아오기
export const fetchLandReportData = (data) => {
    if (landReportDataCancelToken) {
        landReportDataCancelToken.cancel("New request made, canceling previous request.");
    }
    landReportDataCancelToken = axios.CancelToken.source();

    return api.post('/get_land_report', data, {
        cancelToken: landReportDataCancelToken.token
    });
}
// 토지 경매 목록 받아오기
export const fetchAuctionListData = (params) => {
    if (auctionListDataCancelToken) {
        auctionListDataCancelToken.cancel("New request made, canceling previous request.");
    }
    auctionListDataCancelToken = axios.CancelToken.source();

    return api.get("/get_auction_list", {
        params, 
        cancelToken: auctionListDataCancelToken.token
    });
}
// 토지 매물 목록 받아오기
export const fetchLandPropertyListData = (params) => {
    if (landPropertyListDataCancelToken) {
        landPropertyListDataCancelToken.cancel("New request made, canceling previous request.");
    }
    landPropertyListDataCancelToken = axios.CancelToken.source();

    return api.get("/get_land_property_list", {
        params, 
        cancelToken: landPropertyListDataCancelToken.token
    });
}
// 토지 좋아요
export const fetchLandLike = (data) => {
    if (landLikeCancelToken) {
        landLikeCancelToken.cancel("New request made, canceling previous request.");
    }
    landLikeCancelToken = axios.CancelToken.source();

    return api.post("/land_like", data, {
        cancelToken: landLikeCancelToken.token
    });
}
// 사용자가 좋아요 한 토지 목록 받아오기
export const fetchUserLandLikeListData = (data) => {
    if (userLandLikeListDataCancelToken) {
        userLandLikeListDataCancelToken.cancel("New request made, canceling previous request.");
    }
    userLandLikeListDataCancelToken = axios.CancelToken.source();

    return api.post("/user_land_like_list", data, {
        cancelToken: userLandLikeListDataCancelToken.token
    });
}
// 매물 등록
export const fetchRegisterLandProperty = (data) => {
    if (registerLandPropertyCancleToken) {
        registerLandPropertyCancleToken.cancel("New request made, canceling previous request.");z
    }
    registerLandPropertyCancleToken = axios.CancelToken.source();

    return api.post("/register_land_property", data, {
        headers: { Authorization: "Bearer " + localStorage.getItem("access_token"), "Content-Type": "application/json" },
        cancelToken: registerLandPropertyCancleToken.token
    });
}
// 사용자가 올린 매물 목록 받아오기
export const fetchUserPropertyListingsData = (data) => {
    if (userPropertyListingsDataCancelToken) {
        userPropertyListingsDataCancelToken.cancel("New request made, canceling previous request.");
    }
    userPropertyListingsDataCancelToken = axios.CancelToken.source();

    return api.get("/user_land_for_sale_list", data, {
        cancelToken: userPropertyListingsDataCancelToken.token
    });
}
