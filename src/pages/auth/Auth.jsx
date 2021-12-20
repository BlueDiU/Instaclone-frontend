import { useState } from 'react';
import { Container, Image } from 'semantic-ui-react';
import instaclone from '../../assets/instaclone.png';
import RegisterForm from '../../components/auth/RegisterForm';
import './Auth.scss';

const Auth = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Container fluid className="auth">
      <Image src={instaclone} />

      <section className="container-form">
        {showLogin ? (
          <p>Form Login</p>
        ) : (
          <RegisterForm setShowLogin={setShowLogin} />
        )}
      </section>

      <div className="change-form">
        <p>
          {showLogin ? (
            <>
              ¿No tiene cuenta?
              <span onClick={() => setShowLogin(!showLogin)}>
                Regístrate
              </span>
            </>
          ) : (
            <>
              Entra con tu cuenta
              <span onClick={() => setShowLogin(!showLogin)}>
                Iniciar sección
              </span>
            </>
          )}
        </p>
      </div>
    </Container>
  );
};

export default Auth;
