import { Form, LoaderFunction, useLoaderData } from 'react-router-dom';
import { LoaderData } from '../../types';
import SearchBar from '../../components/forms/SearchBar';
import './Search.css';

export default function Search() {
  const { q } = useLoaderData() as LoaderData<typeof loader>;

  return (
    <div id="search-page">
      <Form id="search-form" action="/search">
        <SearchBar width="50vw" defaultValue={q} />
      </Form>

      <div id="search-results">
        <div className="event-item">
          <div className="event-item-left">
            <div className="event-img">img</div>
            <div className="event-title">Some Event Title</div>
          </div>
          <div className="event-item-right">
            <div className="event-description">
              This is a test description.
              Text will go here, and there will be info about the given event.
              There might be more text than this. Or there might be less.
            </div>
            <div className="event-actions">
              <button type="button">Join</button>
              <button type="button">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const loader = (({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  return { q };
}) satisfies LoaderFunction;
