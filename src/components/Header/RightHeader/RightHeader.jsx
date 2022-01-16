import './RightHeader.scss';
import { Icon, Image } from 'semantic-ui-react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../../gql/user';
import { Link } from 'react-router-dom';
import ImageNotFound from '../../../assets/avatar.png';

function RightHeader() {
  /* Image path */
  let avatarImg = 'http://localhost:4000/upload/avatar/';
  const { auth } = useAuth();
  const { data, loading, error } = useQuery(GET_USER, {
    variables: {
      username: auth.username,
    },
  });

  if (loading || error) return null;

  const { getUser } = data;

  return (
    <>
      <div className="right-header">
        <Link to="/">
          <Icon name="home" />
        </Link>
        <Icon name="plus" />
        <Link to={`/${auth.username}`}>
          <Image
            src={
              getUser.avatar
                ? `${avatarImg}${getUser.avatar}`
                : ImageNotFound
            }
            avatar
          />
        </Link>
      </div>
    </>
  );
}

export default RightHeader;
