import './Post.scss';
import PropTypes from 'prop-types';
import Paginator from '../paginator/Paginator';

function Post(props) {
  return (
      <tr>
      <th scope="row">{props.post.id}</th>
      <td>{props.post.title}</td>
      <td>{props.post.body}</td>
    </tr> 
  )
}

Paginator.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired
  })
}

export default Post;