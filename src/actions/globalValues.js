export const setCenterAddr = (addr) => ({
    type: "SET_CENTER_ADDR",
    payload: addr
})

export const setPrevCenterAddr = (addr) => ({
    type: "SET_PREV_CENTER_ADDR",
    payload: addr
})

export const setSelectLand = (land) => ({
    type: "SET_SELECT_LAND",
    payload: land
});

export const setLandInfo = (land) => ({
    type: "SET_LAND_INFO",
    payload: land
});

export const setLandInfoLoading = (isLoading) => ({
    type: "SET_LAND_INFO_LOADING",
    payload: isLoading
});

export const setBidList = (bids) => ({
    type: "SET_BID_LIST",
    payload: bids
});

export const setBidLoading = (isLoading) => ({
    type: "SET_BID_LOADING",
    payload: isLoading
});

export const setSaleList = (sales) => ({
    type: "SET_SALE_LIST",
    payload: sales
});

export const setSaleLoading = (isLoading) => ({
    type: "SET_SALE_LOADING",
    payload: isLoading
});

export const setSideStatus = (status) => ({
    type: "SET_SIDE_STATUS",
    payload: status
});