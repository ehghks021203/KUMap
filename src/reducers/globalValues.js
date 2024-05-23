/*

import { createSlice } from '@reduxjs/toolkit';

const globalValuesSlice = createSlice({
  name: 'globalValues',
  initialState: {
    centerAddr: "",
    prevCenterAddr: "",
    landInfo: null,
    bidList: [],
    bidLoading: false,
    saleList: [],
    saleLoading: false,
    sideStatus: "land_info"
  },
  reducers: {
    setCenterAddr: (state, action) => {
        console.log(action.payload);
        state.centerAddr = action.payload;
    },
    setPrevCenterAddr: (state, action) => {
        state.centerAddr = action.payload;
    },
    setLandInfo: (state, action) => {
        state.centerAddr = action.payload;
    },
    setBidList: (state, action) => {
        state.centerAddr = action.payload;
    },
    setBidLoading: (state, action) => {
        state.centerAddr = action.payload;
    },
    setSaleList: (state, action) => {
        state.centerAddr = action.payload;
    },
    setSaleLoading: (state, action) => {
        state.centerAddr = action.payload;
    },
    setSideStatus: (state, action) => {
        state.centerAddr = action.payload;
    }
  }
});

export const { 
    setCenterAddr, 
    setPrevCenterAddr, 
    setLandInfo,
    setBidList,
    setBidLoading,
    setSaleList,
    setSaleLoading,
    setSideStatus
} = globalValuesSlice.actions;
export default globalValuesSlice.reducer;

*/

const initialState = {
    centerAddr: "",
    prevCenterAddr: "",
    selectLand: null,
    landInfo: null,
    landInfoLoading: false,
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
