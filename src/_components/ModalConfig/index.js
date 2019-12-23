import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, toogle }) => {
  const [reloadTime, setReloadTime] = useState(
    localStorage.getItem('StatusMachine@reloadTime') || 30,
  );

  useEffect(() => {
    const {
      body: { classList },
    } = document;

    if (isOpen) classList.add('modal-open');
    if (!isOpen) classList.remove('modal-open');
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reloadTime || parseInt(reloadTime) === 0) {
      alert('O intervalo precisa ser maior que zero!');
      return;
    }

    if (!reloadTime || parseInt(reloadTime) < 30) {
      alert('O intervalo precisa ser maior que 30!');
      return;
    }

    localStorage.setItem('StatusMachine@reloadTime', reloadTime);
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <Fragment>
      <div className="modal-backdrop fade show" />
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: 'block', paddingRight: '15px' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title align-self-center mt-0">Configurações</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-hidden="true"
                onClick={toogle}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <label htmlFor="reloadTime" className="col-form-label">
                  Intervalo de atualização da página
                </label>
                <div className="input-group mb-3">
                  <input
                    className="form-control"
                    id="reloadTime"
                    min="1"
                    name="reloadTime"
                    onChange={({ target: { value } }) => setReloadTime(value ? parseInt(value) : '')}
                    type="number"
                    value={reloadTime}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">segundo(s)</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success waves-effect waves-light">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toogle: PropTypes.func.isRequired,
};

export default Modal;
