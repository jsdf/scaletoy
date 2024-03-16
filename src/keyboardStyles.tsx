export default {
  container: {
    textAlign: "center",
  },
  keyboard: {
    display: "inline-block",
    position: "relative",
    height: 70,
    marginTop: 16,
    marginBottom: 20,
    cursor: "pointer",
  },
  whiteKey: {
    position: "absolute",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    width: 20,
    height: 70,
    background: "white",
    border: "solid 1px black",
    zIndex: 0,
  },
  noteLabel: {
    width: 20,
    marginTop: 70,
  },
  highlighted: {
    background: "orange",
  },
  blackKey: {
    position: "absolute",
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    width: 9,
    height: 50,
    background: "#000",
    border: "solid 1px black",

    zIndex: 1,
  },
  pressed: {
    background: "#7f4af9",
  },
} as {
  [key: string]: React.CSSProperties;
};
