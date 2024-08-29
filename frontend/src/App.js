import logo from './logo.svg';
import './App.css';

function App() {
  const conectedBackend = () => {

    fetch(`http://localhost:5000/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })

      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          const dataUser = res.user;
          alert(`Bienvenido: ${dataUser.nombres} ${dataUser.apellidos}`)
          setCookie('user', dataUser);
          if (res.type === 1) {
            navigate('/inicio');
          } else if (res.type === 0) {
            navigate('/administrador/visualizar_usuarios');
          }
        } else {
          alert(`Numero de carnet y/o contraseña incorrectos.`)
        }
        setCodigo("")
        setContrasenia("")
      })
      .catch((error) => console.error(error));
  };


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          conectedBackend()
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
