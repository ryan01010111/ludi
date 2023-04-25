import { Form, LoaderFunction, useLoaderData } from 'react-router-dom';
import { LoaderData } from '../../types';
import TextInput from '../../components/forms/TextInput';
import './Search.css';
import EventItem from './EventItem';

export default function Search() {
  const { q } = useLoaderData() as LoaderData<typeof loader>;

  return (
    <div id="search-page">
      <Form id="search-form" action="/search">
        <TextInput
          type="search"
          name="q"
          width="50vw"
          placeholder="Search for events"
          defaultValue={q}
        />
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
