import React, { Fragment, useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';

import { isNull } from 'util';
import api, { paramsUrl } from '../services/api';
import { formatSeconds, isInt } from '../services/helpers';
import Version from '../_components/Version';

import Header from './Header';
import ModalIndex from './ModalIndex';
import ShiftTable from './ShiftTable';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(moment().format('DD/MM/YYYY HH:mm:ss'));

  const [modalIndexOpened, setModalIndexOpened] = useState(false);
  const [indexesSelected, setIndexesSelected] = useState([]);

  const [filterEquipamentType, setFilterEquipamentType] = useState(
    localStorage.getItem('StatusMachine@filterEquipamentType'),
  );

  const [filterSector, setFilteSector] = useState(
    localStorage.getItem('StatusMachine@filterSector'),
  );

  const [originalData, setOriginalData] = useState([]);
  const [equipamentGroup, setEquipamentGroup] = useState({});
  const [equipamentTypes, setEquipamentTypes] = useState([]);

  const [sectors, setSectors] = useState([]);
  const [sectorGroup, setSectorGroup] = useState({});

  const [indexes, setIndexes] = useState([]);

  const [indexesGroup, setIndexesGroup] = useState([]);

  const [popoverId, setPopoverId] = useState();

  const fetchIndexes = async () => {
    const SetorID = localStorage.getItem('StatusMachine@filterSector');
    const userID = localStorage.getItem('StatusMachine@authenticated');

    if (!isNull(SetorID)) {
      const { data } = await api.get(`?${paramsUrl}[dbo].[spQDataStatusMachineIndicesOperacionais]&par=[{'name':'@Tipo','value':'T'} , {'name':'@SetorID','value':'${SetorID}'} , {'name':'@UsuarioID', 'value':'${userID}'}]`);

      if (data && !isNull(SetorID)) {
        setIndexes(data);
        setIndexesGroup(data);
      } else {
        setSectors([]);
        setSectorGroup([]);
        setIndexes([]);
        setIndexesGroup([]);
      }
    } else {
      setSectors([]);
      setSectorGroup([]);
      setIndexes([]);
      setIndexesGroup([]);
    }
  };

  const fetchEquipament = async (_loading = true) => {
    setLoading(_loading);

    const userID = localStorage.getItem('StatusMachine@authenticated');

    const { data } = await api.get(`?${paramsUrl}[dbo].[spQDataStatusMachineEquipamentos]&par=[ {'name':'@UsuarioID','value':'${userID}'}]`);

    if (data) {
      setOriginalData(data);
    } else {
      setOriginalData([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    let reloadTime = localStorage.getItem('StatusMachine@reloadTime');

    if (!reloadTime) {
      reloadTime = 30;
      localStorage.setItem('StatusMachine@reloadTime', reloadTime);
    }

    setInterval(() => {
      setLastUpdate(moment().format('DD/MM/YYYY HH:mm:ss'));
      fetchEquipament(false);
      fetchIndexes();
    }, reloadTime * 1000);
    fetchEquipament();
    fetchIndexes();
  }, []);

  useEffect(() => {
    setSectorGroup(_.groupBy(originalData, 'equipamentoSetorID'));
  }, [originalData]);

  useEffect(() => {
    setEquipamentGroup(_.groupBy(originalData, 'equipamentoTipoID'));
  }, [originalData]);

  useEffect(() => {
    const types = [];
    _.forIn(equipamentGroup, (item, equipamentoTipoID) => types.push({
      equipamentoTipoID,
      equipamentoTipoDescricao: item[0].equipamentoTipoDescricao,
    }));
    setEquipamentTypes(_.orderBy(types, ['equipamentoTipoDescricao'], ['asc']));
  }, [equipamentGroup]);

  useEffect(() => {
    const types = [];

    _.forIn(sectorGroup, (item, equipamentoSetorID) => types.push({
      equipamentoSetorID,
      equipamentoSetorSigla: item[0].equipamentoSetorSigla,
    }));

    setSectors(_.orderBy(types, ['equipamentoSetorSigla'], ['asc']));
  }, [sectorGroup]);

  return (
    <Fragment>
      <Header
        equipamentTypes={equipamentTypes}
        handleChangeType={(equipamentType) => {
          setFilterEquipamentType(equipamentType);
          window.scrollTo(0, 0);
        }}
        sectors={sectors}
        handleChangeSector={(sector) => {
          setFilteSector(sector);
          window.scrollTo(0, 0);
        }}

        lastUpdate={lastUpdate}
      />
      <div className="page-wrapper">
        <div className="page-content p-0">
          {loading && (
            <div className="alert alert-info" role="alert" style={{ margin: '70px' }}>Carregando informações... </div>
          )}
          {!loading && (
            <Fragment>
              <div className="container-fluid">
                <div className="row mb-3">
                  <div className="col-12">
                    <select
                      className="custom-select mt-3"
                      onChange={({ target: { value } }) => {
                        if (!value) return;

                        setModalIndexOpened(!modalIndexOpened);
                        setIndexesSelected(
                          indexesGroup.filter(
                            index => index.equipamentoTipoID.toString() === value,
                          ),
                        );
                      }}
                      value={indexesSelected ? indexesSelected.equipamentoTipoID : ''}
                      title="Selecione um tipo de equipamento para apresentar os índeces filtrados"
                    >
                      <option value="">Índices</option>
                      {equipamentTypes.map(({ equipamentoTipoID, equipamentoTipoDescricao }) => (
                        <option key={equipamentoTipoID} value={equipamentoTipoID}>{equipamentoTipoDescricao}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="equipament-group">
                  {originalData
                    ? (
                      <div className="row m-0">
                        {originalData.filter((equipamentType) => {
                          if (!filterEquipamentType) return true;
                          return parseInt(equipamentType.equipamentoTipoID) === parseInt(filterEquipamentType);
                        }).filter((sectors) => {
                          if (!filterSector) return true;
                          return parseInt(sectors.equipamentoSetorID) === parseInt(filterSector);
                        }).map(
                          ({
                            combustivelTelemetria,
                            combustivelCalculo,
                            conexao,
                            conexaoTempoSegundos,
                            categoriaTempoCod,
                            destino,
                            df,
                            equipamentoID,
                            equipamentoImg,
                            horimetroTelemetria,
                            horimetroManual,
                            ocorrenciaDescricao,
                            ocorrenciaTempoPermaneciaSegundos,
                            origem,
                            tagPrefixo,
                            tagNumero,
                            uf,
                            infoHorimetroTelemetria,
                            infoHorimetroManual,
                            infoCombustivelTelemetria,
                            infoCombustivelCalculo,
                            comentarioAtividade,
                            comentarioOcorrencia,
                            comentarioOM,
                            datahoraInicio,
                          }) => (
                            <div
        className="card card-dashboard position-relative"
        key={equipamentoID}
        onMouseEnter={() => setPopoverId(equipamentoID)}
        onMouseLeave={() => setPopoverId(null)}
        onTouchStart={() => setPopoverId(popoverId ? null : equipamentoID)}
      >
        {popoverId === equipamentoID && (
                          <div
                            className="popover fade show bs-popover-bottom"
                            style={{
                              width: '270px', height: '300px', position: 'absolute', top: '150px',
                            }}
                          >
                            <div className="arrow" style={{ left: '200px' }} />
                            <div className="popover-body font-13">
                              <b>Ocorrência:</b>
                              <br />
                              {ocorrenciaDescricao}
                              <br />
                              <b>Desde:</b>
                              <br />
                              {datahoraInicio ? `${moment(datahoraInicio).format('DD/MM/YYYY H:mm:ss')} (${formatSeconds(ocorrenciaTempoPermaneciaSegundos)})` : null}
                              <br />
                              <b>Origem:</b>
                              <br />
                              {origem}
                              <br />
                              <b>Destino:</b>
                              <br />
                              {destino}
                              <br />
                              <b>Comentário na atividade:</b>
                              <br />
                              {comentarioAtividade}
                              <br />
                              <b>Comentário na ocorrência:</b>
                              <br />
                              {comentarioOcorrencia}
                              <br />
                              <b>Comentário na orderm de manutenção:</b>
                              <br />
                              {comentarioOM}
                              <br />
                            </div>
                          </div>
                          )}
        <div className="card-header">
                            <div className="row">
                              <div className="col-7 p-0">
                                <h4
                                  className="m-0 font-16"
                                  title="TAG  Cadastrada para o Equipamento"
                                >
                                  {`${tagPrefixo}-${tagNumero}`}
                                </h4>
                              </div>
                              <div className="col-5 d-flex justify-content-center align-items-center p-0">
                                <div
                                  className="icon-info justify-content-center align-items-center"
                                  title={
                                      conexao
                                        ? 'Equipamento conectado e sincronizando informações'
                                        : 'Tempo em que o equipamento esteve sem conexão ou fora da área de cobertura'
                                    }
                                >
                                  <i
                                    className={`mdi mdi-wifi text-${
                                      conexao ? 'success' : 'danger'
                                    } font-16`}
                                  />
                                  {!conexao && (
                                  <span className="font-10 pt-2 text-danger">
                                    {formatSeconds(conexaoTempoSegundos)}
                                  </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
        <div className="card-body d-flex justify-content-center align-items-center">
                            {equipamentoImg && (
                            <img
                              alt="Imagem do Cadastro do Equipamento"
                              title="Imagem do Cadastro do Equipamento"
                              style={{ maxWidth: '150px', maxHeight: '50px' }}
                              src={`data:image/jpeg;base64, ${equipamentoImg}`}
                            />
                            )}
                          </div>
        <div className="card-footer">
                            <div className="row">
                              <div className="col-12 d-flex justify-content-between">
                                <span
                                  className="badge badge-info badge-pill"
                                  title="Disponibilidade Física do Equipamento no dia"
                                >
                                  {`DF ${isInt(df) ? df : parseFloat(df).toFixed(2)}%`}
                                </span>
                                <span
                                  className="badge badge-info badge-pill"
                                  title="Utilização Física do Equipamento no dia"
                                >
                                  {`UF ${isInt(uf) ? uf : parseFloat(uf).toFixed(2)}%`}
                                </span>
                                {categoriaTempoCod.substr(0, 2) === 'HM' && (
                                <span
                                  className="badge badge-danger badge-pill"
                                  title="Tempo em Manutenção"
                                >
                                  {formatSeconds(ocorrenciaTempoPermaneciaSegundos)}
                                </span>
                                )}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 d-flex  justify-content-between">
                                <div className=" d-flex justify-content-center align-items-center" title={infoHorimetroTelemetria}>
                                  <span className="font-14 text-info">
                                    {horimetroTelemetria}
                                  </span>
                                </div>
                                <div className=" d-flex justify-content-center align-items-center" title={infoHorimetroManual}>
                                  <span className="font-14 text-warning">
                                    {horimetroManual}
                                  </span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                  <div className="icon-info" title={infoCombustivelTelemetria}>
                                    <i>
                                      <img
                                        alt=""
                                        height="13"
                                        src={`assets/images/bomb-${
                                          combustivelTelemetria > 15 ? 'info' : 'danger'
                                        }.png`}
                                      />
                                    </i>
                                    <span
                                      className={`font-12 text-${
                                        combustivelTelemetria > 15 ? 'info' : 'danger'
                                      }`}
                                    >
                                      {`${isInt(combustivelTelemetria) ? combustivelTelemetria : parseFloat(combustivelTelemetria).toFixed(2)}%`}
                                    </span>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                  <div className="icon-info" title={infoCombustivelCalculo}>
                                    <i>
                                      <img
                                        alt=""
                                        height="13"
                                        src={`assets/images/bomb-${
                                          combustivelCalculo > 15 ? 'warning' : 'danger'
                                        }.png`}
                                      />
                                    </i>
                                    <span
                                      className={`font-12 text-${
                                        combustivelCalculo > 15 ? 'warning' : 'danger'
                                      }`}
                                    >
                                      {`${isInt(combustivelCalculo) ? combustivelCalculo : parseFloat(combustivelCalculo).toFixed(2)}%`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
      </div>
                          ),
                        )}
                      </div>
                    )
                    : '' }
                </div>
              </div>
              <div className="mt-5">
                <ShiftTable indexes={indexes} />
              </div>
            </Fragment>
          )}
        </div>
      </div>
      <footer className="footer">
        <Version />
      </footer>
      <ModalIndex
        isOpen={modalIndexOpened}
        toogle={() => {
          setModalIndexOpened(!modalIndexOpened);
          setIndexesSelected('');
        }}
        indexes={indexesSelected}
      />
    </Fragment>
  );
};

export default Dashboard;
