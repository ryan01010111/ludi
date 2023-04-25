import { ActionFunction, LoaderFunction } from 'react-router-dom';

export type LoaderData<TLoaderFn extends LoaderFunction> =
  Awaited<ReturnType<TLoaderFn>> extends Response | infer D
    ? D
    : never;

export type ActionData<
  TWrapperFunc extends (args: any) => ActionFunction,
> = Awaited<ReturnType<ReturnType<TWrapperFunc>> | undefined>;
