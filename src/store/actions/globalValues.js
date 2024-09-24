export const SET_SIDE_STATUS = "SET_SIDE_STATUS";
export const SET_CENTER_ADDRESS = "SET_CENTER_ADDRESS";
export const SET_LAND_ADDRESS = "SET_LAND_ADDRESS";
export const SET_LAND_DATA = "SET_LAND_DATA";
export const SET_LAND_DATA_LOADING = "SET_LAND_DATA_LOADING";
export const SET_AUCTION_LIST = "SET_AUCTION_LIST";
export const SET_AUCTION_LIST_LOADING = "SET_AUCTION_LIST_LOADING";
export const SET_PROPERTY_LISTINGS = "SET_PROPERTY_LISTINGS";
export const SET_PROPERTY_LISTINGS_LOADING = "SET_PROPERTY_LISTINGS_LOADING";

// action constructors
export const setSideStatus = (sideStatus) => ({
    type: SET_SIDE_STATUS,
    payload: sideStatus
});
export const setCenterAddress = (centerAddress) => ({
    type: SET_CENTER_ADDRESS,
    payload: centerAddress
});
export const setLandAddress = (landAddress) => ({
    type: SET_LAND_ADDRESS,
    payload: landAddress
});
export const setLandData = (landData) => ({
    type: SET_LAND_DATA,
    payload: landData
});
export const setLandDataLoading = (isLandDataLoading) => ({
    type: SET_LAND_DATA_LOADING,
    payload: isLandDataLoading
});
export const setAuctionList = (auctionList) => ({
    type: SET_AUCTION_LIST,
    payload: auctionList
});
export const setAuctionListLoading = (isAuctionListLoading) => ({
    type: SET_AUCTION_LIST_LOADING,
    payload: isAuctionListLoading
});
export const setPropertyListings = (propertyListings) => ({
    type: SET_PROPERTY_LISTINGS,
    payload: propertyListings
});
export const setPropertyListingsLoading = (isPropertyListingsLoading) => ({
    type: SET_PROPERTY_LISTINGS_LOADING,
    payload: isPropertyListingsLoading
});





export const setPrevCenterAddr = (addr) => ({
    type: "SET_PREV_CENTER_ADDR",
    payload: addr
})

export const setSelectLand = (land) => ({
    type: "SET_SELECT_LAND",
    payload: land
});

export const setLandInfoLoading = (isLoading) => ({
    type: "SET_LAND_INFO_LOADING",
    payload: isLoading
});

export const setLandReportAddr = (land) => ({
    type: "SET_LAND_REPORT_ADDR",
    payload: land
});

export const setLandReportLoading = (isLoading) => ({
    type: "SET_LAND_REPORT_LOADING",
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