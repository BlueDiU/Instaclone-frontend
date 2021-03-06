/* hooks */
import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';

/* GraphQL */
import { GET_USER } from '../../../gql/user';
import { useQuery } from '@apollo/client';

/* Components */
import { Link } from 'react-router-dom';
import { Icon, Image } from 'semantic-ui-react';
import ModalUpload from '../../Modal/ModalUpload';

import ImageNotFound from '../../../assets/avatar.png';
import './RightHeader.scss';

function RightHeader() {
  const { auth } = useAuth();
  const { data, loading, error } = useQuery(GET_USER, {
    variables: {
      username: auth.username,
    },
  });
  const [showModal, setShowModal] = useState(false);

  if (loading || error) return null;

  const { getUser } = data;

  return (
    <>
      <div className="right-header">
        <Link to="/">
          <Icon name="home" />
        </Link>
        <Icon name="plus" onClick={() => setShowModal(true)} />
        <Link to={`/${auth.username}`}>
          <Image
            src={getUser.avatar ? getUser.avatar : ImageNotFound}
            avatar
          />
        </Link>
      </div>
      <ModalUpload show={showModal} setShow={setShowModal} />
    </>
  );
}

export default RightHeader;
