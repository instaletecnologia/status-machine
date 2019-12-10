import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import ModalConfig from '../_components/ModalConfig';

const Header = ({ equipamentTypes, handleChangeType, sectors, handleChangeSector, lastUpdate }) => {
  const [modalOpened, setModalOpened] = useState(false);

  const [type, setType] = useState(
    localStorage.getItem('StatusMachine@filterEquipamentType') || '',
  );

  const [sector, setSector] = useState(
    localStorage.getItem('StatusMachine@filterEquipamentType') || '',
  );

  const handleModalOpened = () => setModalOpened(!modalOpened);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const changeType = ({ target: { value } }) => {
    localStorage.setItem('StatusMachine@filterEquipamentType', value);
    setType(value);
    handleChangeType(value);
  };

  const changeSector = ({ target: { value } }) => {
    localStorage.setItem('StatusMachine@filterSector', value);
    setSector(value);
    handleChangeSector(value);
  };

  return (
    <Fragment>
      <div className="topbar">
        <div className="topbar-left">
          <a href="/" className="logo">
            <span>
              <img
                src="assets/images/logo-invertido.png"
                alt="Status Machine"
                className="logo-lg"
              />
            </span>
          </a>
        </div>
        <nav className="navbar-custom">
          <span className="text-muted mt-4 d-none d-sm-inline-block">
            Última atualização:
            {' '}
            {lastUpdate}
          </span>
          <ul className="list-unstyled topbar-nav float-right mb-0">
            <li>
              <select className="custom-select mt-3" onChange={changeType} value={type} title="Selecione um tipo de equipamento para apresentar uma visão filtrada dos equipamentos">
                <option value="">Todos os tipos de equipamentos</option>
                {equipamentTypes.map(({ equipamentoTipoID, equipamentoTipoDescricao }) => (
                  <option key={equipamentoTipoID} value={equipamentoTipoID}>
                    {equipamentoTipoDescricao}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <select className="custom-select mt-3" onChange={changeSector} value={sector} title="Selecione um setor para filtrar e apresentar os Índices por modelo">
                <option value="">Selecione um setor</option>
                {sectors.map(({ equipamentoSetorID, equipamentoSetorSigla }) => (
                  <option key={equipamentoSetorID} value={equipamentoSetorID}>
                    {equipamentoSetorSigla}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <button
                className="nav-link waves-effect waves-light"
                onClick={() => window.location.reload()}
                title="Recarregar Página"
                type="button"
                style={{ background: 'none', border: 'none' }}
              >
                <i className="mdi mdi-refresh nav-icon" />
              </button>
            </li>
            <li>
              <button
                className="nav-link waves-effect waves-light"
                onClick={handleModalOpened}
                title="Configurações"
                type="button"
                style={{ background: 'none', border: 'none' }}
              >
                <i className="mdi mdi-settings nav-icon" />
              </button>
            </li>
            <li>
              <button
                className="nav-link waves-effect waves-light"
                onClick={logout}
                title="Sair"
                type="button"
                style={{ background: 'none', border: 'none' }}
              >
                <i className="mdi mdi-logout nav-icon" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <ModalConfig isOpen={modalOpened} toogle={handleModalOpened} />
    </Fragment>
  );
};

Header.propTypes = {
  equipamentTypes: PropTypes.arrayOf(
    PropTypes.shape({
      equipamentoTipoID: PropTypes.string.isRequired,
      equipamentoTipoDescricao: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleChangeType: PropTypes.func.isRequired,
};

export default Header;
