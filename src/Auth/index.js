import React, { Fragment, useState } from 'react';
import crypto from 'crypto-js';
import PropTypes from 'prop-types';

import api, { paramsUrl } from '../services/api';
import Version from '../_components/Version';

const Auth = ({ onSuccess }) => {
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [modalOpened, setModalOpened] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    const { data, ok } = await api.get(
      `?${paramsUrl}[dbo].[spQDataStatusMachineUsuarioValidate]&par=[{'name':'@Login','value':'${login}'}, {'name':'@Senha','value':'${crypto
        .MD5(password)
        .toString()}'}]`,
    );

    setLoading(false);

    if (!ok || !data[0] || !data[0].column1) {
      setError('Falha na autenticação');
      return;
    }

    localStorage.setItem('StatusMachine@authenticated', true);

    onSuccess(true);
  };

  return (
    <Fragment>
      <div className="row">
        <div className="col-lg-3 pr-0">
          <div className="card mb-0 shadow-none">
            <div className="card-body">
              <h3 className="text-center m-0">
                <a href="index.html" className="logo logo-admin">
                  <img
                    src="assets/images/logo.png"
                    alt="logo"
                    className="my-3"
                    style={{ maxWidth: '100%' }}
                  />
                </a>
              </h3>
              <div className="px-3">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form className="form-horizontal my-4" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                          <i className="fa fa-user-o" />
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        onChange={({ target: { value } }) => setLogin(value)}
                        // value={login}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon2">
                          <i className="fa fa-key" />
                        </span>
                      </div>
                      <input
                        type="password"
                        className="form-control"
                        id="userpassword"
                        onChange={({ target: { value } }) => setPassword(value)}
                        // value={password}
                      />
                    </div>
                  </div>
                  <div className="form-group mb-0 row">
                    <div className="col-12 mt-2">
                      <button
                        disabled={loading}
                        className="btn btn-primary btn-block waves-effect waves-light"
                        type="submit"
                      >
                        {loading ? 'Autenticando...' : 'Continuar'}
                        {' '}
                        <i className="fa fa-sign-in ml-1" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <h3 className="text-center m-0">
                <a href="index.html" className="logo logo-admin">
                  <img
                    src="assets/images/logo-instale.png"
                    alt="logo"
                    className="my-3"
                    style={{ maxWidth: '100%' }}
                  />
                </a>
              </h3>
              <Version />
            </div>
          </div>
        </div>
        <div className="col-lg-9 p-0 h-100vh d-flex justify-content-center">
          <div className="accountbg d-flex align-items-center">
            <div className="account-title text-center text-white">
              <h4 className="mt-3">
                Bem-vindo ao
                {' '}
                <span className="text-warning">MACHINE STATUS</span>
                {' '}
              </h4>
              <h1 className="">Faça seu login!</h1>
              <p className="font-14 mt-3">Vamos lá!</p>
              <div className="border w-25 mx-auto border-warning" />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Auth.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default Auth;
