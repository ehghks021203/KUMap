const initialState = {
    centerAddr: null,
    prevCenterAddr: null,
    selectLand: null,
    landInfo: null,
    landInfoLoading: false,
    landReportAddr: null,
    landReportLoading: false,
    bidList: [],
    bidLoading: false,
    saleList: [],
    saleLoading: false,
    sideStatus: "land_info"
}

const globalValuesReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CENTER_ADDR":
            return {
                ...state,
                centerAddr: action.payload
            };
        case "SET_PREV_CENTER_ADDR":
            return {
                ...state,
                prevCenterAddr: action.payload
            };
        case "SET_SELECT_LAND":
            return {
                ...state,
                selectLand: action.payload
            };
        case "SET_LAND_INFO":
            return {
                ...state,
                landInfo: action.payload
            };
        case "SET_LAND_INFO_LOADING":
            return {
                ...state,
                landInfoLoading: action.payload
            };
        case "SET_LAND_REPORT_ADDR":
            return {
                ...state,
                landReportAddr: action.payload
            };
        case "SET_LAND_REPORT_LOADING":
            return {
                ...state,
                landReportLoading: action.payload
            };
        case "SET_BID_LIST":
            return {
                ...state,
                bidList: action.payload
            };
        case "SET_BID_LOADING":
            return {
                ...state,
                bidLoading: action.payload
            };
        case "SET_SALE_LIST":
            return {
                ...state,
                saleList: action.payload
            };
        case "SET_SALE_LOADING":
            return {
                ...state,
                saleLoading: action.payload
            };
        case "SET_SIDE_STATUS":
            return {
                ...state,
                sideStatus: action.payload
            };
        default:
            return state;
    }
};

export default globalValuesReducer;
