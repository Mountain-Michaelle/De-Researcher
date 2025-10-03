import {connectWallet, checkWalletConnection, disconnectWallet} from '../../redux/wallet/walletActions';
import {createSlice} from "@reduxjs/toolkit";

const  initialState = {
        loading:false,
        signer: null,
        status:'idle',
        shortAddress: null,
        isConnected: false,
        loading:false,
        error: null

    }
const walletSlice = createSlice({
    name: "wallet",
    initialState,

     reducers: {
    resetState(state) {
        state.error = null;
        state.loading = null;
        state.status = 'idle';
    },
  },
    
    extraReducers: (builder) => {
        builder
        .addCase(connectWallet.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(connectWallet.fulfilled, (state, action) => {
            state.loading = false;
            state.address = action.payload.address;
            state.shortAddress = action.payload.shortAddress;
            state.isConnected = action.payload.isConnected;
            state.error = null;
        })
        .addCase(connectWallet.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
            state.error = action.payload;
            state.isConnected = action.payload?.isConnected;
        })

        // Wallet connection check
        .addCase(checkWalletConnection.fulfilled, (state, action) => {
            if(action.payload){
                state.status = "succeeded";
                state.address = action.payload.address;
                state.shortAddress = action.payload.shortAddress;
                state.isConnected = action.payload.isConnected;
            }else{
                 state.status = "failed";
                state.address = null;
                state.shortAddress = null;
                state.isConnected = false;
            }
        })

        // Disconnect Wallet
        .addCase(disconnectWallet.fulfilled, () => initialState)
    }
});

export const {resetState} = walletSlice.actions
export default walletSlice.reducer;