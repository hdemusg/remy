import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import '../styles/card.css';

function OptionCard(author, id, published_date, score, title, url) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          Author: {author}
        </Card.Text>
        <Card.Text>
          ID: {id}
        </Card.Text>
        <Card.Text>
          Published Date: {published_date}
        </Card.Text>
        <Card.Text>
          Score: {score}
        </Card.Text>
        <Button variant="primary">{url}</Button>
      </Card.Body>
    </Card>
  )
}

export default OptionCard;