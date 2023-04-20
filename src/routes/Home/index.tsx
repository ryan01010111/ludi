import { Form } from 'react-router-dom';
import './Home.css';
import SearchBar from '../../components/forms/SearchBar';

export default function Home() {
  return (
    <>
      <h1 id="home-banner-text">Social Events for Russian-Speakers in Austin, TX</h1>

      <h3 id="home-cta-1">
        Join our Russian-speaking community in Austin.
        Find events, learn new things, make friends, and have fun!
      </h3>

      <Form id="home-search-form" action="search">
        <SearchBar width="50vw" />
      </Form>

      <div id="home-trending">
        <div />
        <div />
        <div />
      </div>
    </>
  );
}
