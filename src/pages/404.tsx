const Custom404 = () => (
  <div
    style={{
      color: "#8991AD",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100vh",
      margin: "0 10vw",
      alignItems: "center",
    }}
  >
    <h1 style={{ marginBottom: "2rem" }}>404 | no ultra sound money here</h1>
    <a
      className="cursor-pointer text-slateus-200 active:brightness-90"
      href="https://ultrasound.money/"
      rel="noreferrer"
      target="_blank"
      style={{
        color: "#B5BDDB",
        marginLeft: "0.5rem",
        textDecorationLine: "underline",
      }}
    >
      ultrasound.money
    </a>
  </div>
);

export default Custom404;
