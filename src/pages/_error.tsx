import type { FC } from "react";

// This component intentionally imports as little as possible. Wouldn't want
// errors popping up in our error handling. Try to catch errors with error
// boundaries, long before this happens!
const ErrorPage: FC<{ error?: Error; statusCode?: number }> = ({
  error,
  statusCode,
}) => {
  console.error(error);

  return (
    <div
      style={{
        color: "#8991AD",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
        margin: "0 10vw",
      }}
    >
      <p
        style={{
          alignSelf: "center",
          marginBottom: "2rem",
        }}
      >
        A top-level exception has occured 😱
      </p>
      <p style={{ marginBottom: "2rem" }}>
        We&apos;re sorry, this should never happen! If you&apos;ve seen this
        before, or reloading doesn&apos;t fix it, you can help debug it by
        sending a screenshot to
        <a
          className="cursor-pointer text-slateus-200 active:brightness-90"
          href="https://twitter.com/ultrasoundmoney/"
          rel="noreferrer"
          target="_blank"
          style={{
            color: "#B5BDDB",
            marginLeft: "0.5rem",
            textDecorationLine: "underline",
          }}
        >
          @ultrasoundmoney
        </a>
        .
      </p>
      <p>error name: {error?.name ?? "undefined"}</p>
      <p>error message: {error?.message ?? "undefined"}</p>
      <p>status code: {statusCode ?? "undefined"}</p>
      <p>stack trace (partial is fine):</p>
      <p
        style={{
          fontSize: "9px",
          whiteSpace: "pre",
          overflow: "scroll",
          maxWidth: "100%",
        }}
      >
        {error?.stack}
      </p>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error
ErrorPage.getInitialProps = ({ res, err }: { res: unknown; err: unknown }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const statusCode = res
    ? (res as { statusCode?: number }).statusCode
    : err
    ? (err as { statusCode?: number }).statusCode
    : 404;
  console.error(err);
  return { statusCode };
};

export default ErrorPage;
