// store/reducers/globalValues.js
import {
    SET_SIDE_STATUS,
    SET_CENTER_ADDRESS,
    SET_LAND_ADDRESS,
    SET_LAND_DATA,
    SET_LAND_DATA_LOADING,
    SET_AUCTION_LIST,
    SET_AUCTION_LIST_LOADING,
    SET_LAND_PROPERTY_LIST,
    SET_LAND_PROPERTY_LIST_LOADING
} from '../actions/globalValues';

const initialState = {
    sideStatus: "land-info",
    centerAddress: null,
    landAddress: null,
    landData: null,
    isLandDataLoading: false,
    auctionList: [],
    isAuctionListLoading: false,
    landPropertyList: [],
    islandPropertyListLoading: false
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
            case SET_LAND_PROPERTY_LIST:
                return {
                    ...state,
                    landPropertyList: action.payload
                };
            case SET_LAND_PROPERTY_LIST_LOADING:
                return {
                    ...state,
                    isLandPropertyListLoading: action.payload
                }
        default:
            return state;
    }
}

export default globalValuesReducer;
