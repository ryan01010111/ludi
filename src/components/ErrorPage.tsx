import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as Error | Response;
  const errorText = error instanceof Error
    ? error.message
    : error.statusText;

  console.error(error);

  return (
    <>
      <h1>ERROR (TODO)</h1>
      <code>{errorText}</code>
    </>
  );
}
