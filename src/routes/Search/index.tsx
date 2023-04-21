import { Form, LoaderFunction, useLoaderData } from 'react-router-dom';
import { LoaderData } from '../../types';
import SearchBar from '../../components/forms/SearchBar';
import './Search.css';
import EventItem from './EventItem';

export default function Search() {
  const { q } = useLoaderData() as LoaderData<typeof loader>;

  return (
    <div id="search-page">
      <Form id="search-form" action="/search">
        <SearchBar width="50vw" defaultValue={q} />
      </Form>

      <div id="search-results">
        {[...(Array(4).keys())].map(idx => <EventItem key={idx} />)}
      </div>
    </div>
  );
}

export const loader = (({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  return { q };
}) satisfies LoaderFunction;
