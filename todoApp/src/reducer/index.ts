const counter = (state = 0, action: {type: string}) => {
  switch (action.type) {
    case "증가":
      return state + 1;

    case "감소":
      return state - 1;

    default:
      return state;
  }
};

export default counter;
