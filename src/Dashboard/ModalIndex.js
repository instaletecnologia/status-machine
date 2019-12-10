import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

import ShiftTable from './ShiftTable';

const Modal = ({ indexes, isOpen, toogle }) => {
  useEffect(() => {
    const {
      body: { classList },
    } = document;

    if (isOpen) classList.add('modal-open');
    if (!isOpen) classList.remove('modal-open');
  }, [isOpen]);

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
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title align-self-center mt-0">Índices do Tipo de Equipamento</h5>
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
            <div className="modal-body">
              <ShiftTable indexes={indexes} showLegend showAverageDay />
            </div>
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
