// redux/slices/regionSlice.js
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Region, VPC } from '../../types/Region';

interface RegionState {
    regions: Region[];
    selectedRegion: Region | null;
    selectedVPC: VPC | null;
}

const initialState: RegionState = {
    regions: [],
    selectedRegion: null,
    selectedVPC: null
};

export const regionSlice = createSlice({
    name: 'region',
    initialState,
    reducers: {
        setRegions: (state, action: PayloadAction<Region[]>) => {
            state.regions = action.payload;
            state.selectedRegion = state.regions[0]; // Set the first region as selected by default
            state.selectedVPC = state.regions[0].vpcs[0];
        },
        setSelectedRegion: (
            state,
            action: PayloadAction<{ regionId: string }>
        ) => {
            state.selectedRegion = state.regions.find(
                (region) => region.id === action.payload.regionId
            )!;

            state.selectedVPC = state.selectedRegion!.vpcs[0];
        },
        setSelectedVPC: (state, action: PayloadAction<{ vpcName: string }>) => {
            state.selectedVPC = state.selectedRegion!.vpcs.find(
                (vpc) => vpc.name === action.payload.vpcName
            )!;
        }
    }
});

export const { setRegions, setSelectedRegion, setSelectedVPC } =
    regionSlice.actions;
export type { RegionState };
export default regionSlice.reducer;
