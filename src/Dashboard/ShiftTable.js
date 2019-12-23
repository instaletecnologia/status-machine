import React, { Fragment, useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

const ShiftTable = ({ indexes, showLegend, showAverageDay }) => {
  const [models, setModels] = useState([]);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    setModels(Object.keys(_.groupBy(indexes, 'frota')));
    setShifts(Object.keys(_.groupBy(indexes, 'turno')));
  }, [indexes]);

  return (
    <Fragment>
      <div className="table-responsive">
        <table className="table mb-0 table-bordered">
          <thead>
            <tr>
              <th rowSpan="3">Modelo x Turno</th>
            </tr>
            <tr>
              {models.map(model => (
                <th colSpan="2" key={Math.random()}>
                  {model}
                </th>
              ))}
            </tr>
            <tr>
              {models.map(() => (
                <Fragment key={Math.random()}>
                  <th>DF</th>
                  <th>UF</th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.map(shift => (
              <tr key={Math.random()}>
                <th scope="row">{shift}</th>
                {models.map((model) => {
                  let df;
                  let uf;

                  const index = indexes.find(
                    ({ frota, turno }) => turno === shift && frota === model,
                  );

                  if (index) {
                    df = index.df;
                    uf = index.uf;
                  }

                  return (
                    <Fragment key={Math.random()}>
                      <th>{df}</th>
                      <th>{uf}</th>
                    </Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
          {showAverageDay && (
            <tfoot>
              <tr>
                <th scope="row">Dia atual</th>
                {models.map((model) => {
                  let df;
                  let uf;

                  const index = indexes.find(
                    ({ frota, turno }) => frota === model,
                  );

                  if (index) {
                    df = index.dF_Dia_Media;
                    uf = index.uF_Dia_Media;
                  }

                  return (
                    <Fragment key={Math.random()}>
                      <th>{df}</th>
                      <th>{uf}</th>
                    </Fragment>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {showLegend && (
        <p className="text-muted font-13 mb-4">
          Utilização Física e Disponibilidade Física, por modelo de equipamento e tipo no turno.
        </p>
      )}
    </Fragment>
  );
};

ShiftTable.defaultProps = {
  indexes: [],
  showLegend: false,
  showAverageDay: false,
};

ShiftTable.propTypes = {
  indexes: PropTypes.arrayOf(PropTypes.shape({})),
  showLegend: PropTypes.bool,
  showAverageDay: PropTypes.bool,
};

export default ShiftTable;
