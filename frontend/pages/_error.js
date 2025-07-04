// Custom error page to prevent Html import issues
export default function Error({ statusCode }) {
  return null; // Return nothing to avoid rendering issues
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
