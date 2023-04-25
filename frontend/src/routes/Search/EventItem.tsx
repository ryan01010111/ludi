import Button from '../../components/Button';
import './EventItem.css';

export default function EventItem() {
  const buttonMargin = '20px 24px 0 24px';

  return (
    <div className="event-item">
      <div className="event-item-left">
        <img
          className="event-img"
          src={`https://picsum.photos/id/${Math.round(Math.random() * 100)}/600/400`}
          alt="event"
        />
        <span className="event-title">Some Event Title</span>
      </div>

      <div className="event-item-right">
        <p className="event-description">
          This is a test description.
          Text will go here, and there will be info about the given event.
          There might be more text than this. Or there might be less.
        </p>
        <div className="event-actions">
          <Button type="button" width={160} margin={buttonMargin}>Join</Button>
          <Button type="button" width={160} margin={buttonMargin}>Details</Button>
        </div>
      </div>
    </div>
  );
}
