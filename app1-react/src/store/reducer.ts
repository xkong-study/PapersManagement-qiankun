interface AppState {
  selectedKeys: string;
  // 其他状态字段...
}

const initialState: AppState = {
  selectedKeys: '',
  // 初始化其他状态字段...
};

export const SET_SELECTED_KEYS = 'SET_SELECTED_KEYS';

const rootReducer = (state = initialState, action: any): AppState => {
  switch (action.type) {
    case SET_SELECTED_KEYS:
      return {
        ...state,
        selectedKeys: action.payload,
      };
    // 处理其他 action...
    default:
      return state;
  }
};

export default rootReducer;
