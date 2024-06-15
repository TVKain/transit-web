import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserState {
    username: string | null;
}

const initialState: UserState = {
    username: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<{ username: string }>) => {
            state.username = action.payload.username;
        },
        resetUser: (state) => {
            state.username = null;
        }
    }
});

export const { updateUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
