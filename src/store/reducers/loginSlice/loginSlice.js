import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeApiRequest, {
  axiosInstances,
} from "../../../networkServices/axiosInstance";
import { notify } from "../../../utils/utils";
import { setLoading } from "../loadingSlice/loadingSlice";
import { useCryptoLocalStorage } from "../../../utils/hooks/useCryptoLocalStorage";
import { setWindowClass } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../networkServices/apiEndpoints";

const initialState = {
  user: {},
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const signInAction = createAsyncThunk(
  "signIn",
  async (data, { dispatch }) => {
    const options = {
      method: "POST",
      data,
    };
    try {
      dispatch(setLoading(true));
      const res = await axiosInstances(apiUrls?.login, options);
      dispatch(setLoading(false));
      return res?.data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.success = false;
      state.message = "";
      state.error = "";
      // clear localStorage if needed
      useCryptoLocalStorage("user_Data", "remove");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(signInAction.fulfilled, (state, { payload }) => {
        console.log("fulfilled payload:", payload);

        state.user = payload?.data?.userDetails || null;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.Message;

        notify(state.message, "success");

        if (payload?.success) {
          useCryptoLocalStorage(
            "user_Data",
            "set",
            null,
            payload?.data?.userDetails
          );
          useCryptoLocalStorage(
            "user_Data",
            "set",
            "token",
            payload?.data?.token
          );
        }
      })
      .addCase(signInAction.rejected, (state, action) => {
        console.log("rejected action:", action);

        const errMsg =
          action.payload?.message ||
          action.error?.message ||
          "Something went wrong";

        state.loading = false;
        state.error = errMsg;
        state.success = false;
        state.message = errMsg;

        notify(errMsg, "error");
      });
  },
});

export default authSlice.reducer;
