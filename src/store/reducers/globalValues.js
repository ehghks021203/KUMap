// store/reducers/globalValues.js
import {
    SET_SIDE_STATUS,
    SET_CENTER_ADDRESS,
    SET_LAND_ADDRESS,
    SET_LAND_DATA,
    SET_LAND_DATA_LOADING,
    SET_AUCTION_LIST,
    SET_AUCTION_LIST_LOADING,
    SET_PROPERTY_LISTINGS,
    SET_PROPERTY_LISTINGS_LOADING
} from '../actions/globalValues';

const initialState = {
    sideStatus: "land-info",
    centerAddress: null,
    landAddress: null,
    landData: null,
    isLandDataLoading: false,
    auctionList: [],
    isAuctionListLoading: false,
    propertyListings: [],
    isPropertyListingsLoading: false
    // 다른 상태들...
};

function globalValuesReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SIDE_STATUS:
            return {
                ...state,
                sideStatus: action.payload
            };
        case SET_CENTER_ADDRESS:
            return {
                ...state,
                centerAddress: action.payload
            };
        case SET_LAND_ADDRESS:
            return {
                ...state,
                landAddress: action.payload
            };
        case SET_LAND_DATA:
            return {
                ...state,
                landData: action.payload
            };
        case SET_LAND_DATA_LOADING:
            return {
                ...state,
                isLandDataLoading: action.payload
            };
        case SET_AUCTION_LIST:
            return {
                ...state,
                auctionList: action.payload
            };
        case SET_AUCTION_LIST_LOADING:
            return {
                ...state,
                isAuctionListLoading: action.payload
            }
            case SET_PROPERTY_LISTINGS:
                return {
                    ...state,
                    propertyListings: action.payload
                };
            case SET_PROPERTY_LISTINGS_LOADING:
                return {
                    ...state,
                    isPropertyListingsLoading: action.payload
                }
        default:
            return state;
    }
}

export default globalValuesReducer;

/*const globalValuesReducer = (state = initialState, action) => {
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
        case "SET_LAND_DATA":
            return {
                ...state,
                landData: action.payload
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
};*/