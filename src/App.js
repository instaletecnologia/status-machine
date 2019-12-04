import React, { useState } from 'react';

import Auth from './Auth';
import Dashboard from './Dashboard';

const App = () => {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem('StatusMachine@authenticated'),
  );

  return authenticated ? (
    <Dashboard />
  ) : (
    <Auth onSuccess={isAuthenticated => setAuthenticated(isAuthenticated)} />
  );
};
// const App = () => <Dashboard />;

export default App;

/**
 * @todo
 * Adicionar styled-component e centralizar as cores principais no .env
 * adicionar borda nas laterias de cada coluna da tabela
 * rever a disposição das informações de horimetro/combustivel
 * revisar PDF
 */
