import { counterConstant } from "../redux/counter/constant.counter";

export const setLoading = (dispatch, isLoading) => dispatch(counterConstant.actions.setLoading(isLoading))

