/* hooks */
import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

/* Components */
import { Button } from 'semantic-ui-react';

/* GraphQL */
import { useMutation } from '@apollo/client';
import {
  UPDATE_AVATAR,
  GET_USER,
  DELETE_AVATAR,
} from '../../../gql/user';

import './AvatarForm.scss';

function AvatarForm({ setShowModal, auth }) {
  const [updateAvatar] = useMutation(UPDATE_AVATAR, {
    update(cache, { data: { updateAvatar } }) {
      /* 
      Read the query that has been previously consumed in Profile component saved in Cache
      */
      const { getUser } = cache.readQuery({
        query: GET_USER,
        variables: {
          username: auth.username,
        },
      });

      /* 
      Then, update the specific property that has been update by updateAvatar query, and taked the previous state and updated the prop 
      */
      cache.writeQuery({
        query: GET_USER,
        variables: {
          username: auth.username,
        },
        data: {
          getUser: {
            ...getUser,
            avatar: updateAvatar.urlAvatar,
          },
        },
      });
    },
  });

  const [loading, setLoading] = useState(false);

  const [deleteAvatar] = useMutation(DELETE_AVATAR, {
    update(cache) {
      const { getUser } = cache.readQuery({
        query: GET_USER,
        variables: { username: auth.username },
      });

      cache.writeQuery({
        query: GET_USER,
        variables: { username: auth.username },
        data: {
          getUser: { ...getUser, avatar: '' },
        },
      });
    },
  });

  const onDrop = useCallback(
    async (aceptedFile) => {
      const file = aceptedFile[0];

      try {
        setLoading(true);
        const res = await updateAvatar({ variables: { file } });

        const { data } = res;

        if (!data.updateAvatar.status) {
          toast.warning('Error al actualizar el avatar');
          setLoading(false);
        } else {
          setLoading(false);
          setShowModal(false);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [updateAvatar, setLoading, setShowModal]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/png, image/jpeg, image/jpg',
    noKeyboard: true,
    multiple: true,
    onDrop,
  });

  const onDeleteAvatar = async () => {
    try {
      const result = await deleteAvatar();
      const { data } = result;

      if (!data.deleteAvatar) {
        toast.warning('Error al eliminar el avatar');
      } else {
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="avatar-form">
      <Button loading={loading} {...getRootProps()}>
        Cargar una foto
      </Button>
      <Button onClick={() => onDeleteAvatar()}>
        Eliminar foto actual
      </Button>
      <Button onClick={() => setShowModal(false)}>
        Cancelar
      </Button>
      <input {...getInputProps()} />
    </div>
  );
}

export default AvatarForm;
