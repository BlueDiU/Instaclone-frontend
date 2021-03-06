/* hooks */
import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';

/* Components */
import { Grid, Image } from 'semantic-ui-react';
import ModalBasic from '../../Modal/ModalBasic';
import UserNotFound from '../../UserNotFound';
import AvatarForm from '../AvatarForm';
import HeaderProfile from './HeaderProfile';
import SettingForm from '../SettingForm/SettingForm';
import Followers from './Followers';

/* GraphQL */
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../../gql/user';

import ImageNotFound from '../../../assets/avatar.png';
import './Profile.scss';

function Profile({ username, totalPublications }) {
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [clidrenModal, setClidrenModal] = useState(null);
  const { auth } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: {
      username,
    },
  });

  useEffect(() => {
    document.title = ` ${data?.getUser?.name} (@${data?.getUser?.username}) - Instaclone fotos`;
  }, [data]);

  if (loading) return null;

  if (error) return <UserNotFound />;

  /* Query name */
  const { getUser } = data;

  const handleModal = (type) => {
    switch (type) {
      case 'avatar':
        setTitleModal('Cambiar foto del perfil');
        setClidrenModal(
          <AvatarForm setShowModal={setShowModal} auth={auth} />
        );
        setShowModal(true);
        break;

      case 'settings':
        setTitleModal('');
        setClidrenModal(
          <SettingForm
            setShowModal={setShowModal}
            setTitleModal={setTitleModal}
            setClidrenModal={setClidrenModal}
            getUser={getUser}
            refetch={refetch}
          />
        );
        setShowModal(true);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Grid className="profile">
        <Grid.Column
          computer={5}
          mobile={16}
          className="profile__left"
        >
          <Image
            src={getUser.avatar ? getUser.avatar : ImageNotFound}
            avatar
            onClick={() =>
              username === auth.username && handleModal('avatar')
            }
          />
        </Grid.Column>
        <Grid.Column
          computer={11}
          mobile={16}
          className="profile__right"
        >
          <HeaderProfile
            username={username}
            auth={auth}
            handleModal={handleModal}
          />

          <Followers
            username={username}
            totalPublications={totalPublications}
          />

          <div className="other">
            <p className="name">{getUser.name}</p>
            {getUser.webSite && (
              <a
                href={getUser.webSite}
                className="webSite"
                target="_blank"
                rel="noreferrer"
              >
                {getUser.webSite}
              </a>
            )}
            {getUser.description && (
              <p className="description">
                {getUser.description}
              </p>
            )}
          </div>
        </Grid.Column>
      </Grid>

      <ModalBasic
        show={showModal}
        setShow={setShowModal}
        title={titleModal}
      >
        {clidrenModal}
      </ModalBasic>
    </>
  );
}

export default Profile;
