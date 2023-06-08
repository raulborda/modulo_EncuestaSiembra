import { ConfigProvider } from "antd";
import esES from "antd/lib/locale/es_ES";
import "./App.css";
import { useState } from "react";
import { GlobalContext } from "./components/context/GlobalContext";
import { ViewGeneral } from "./components/ui/ViewGeneral";

function App() {



  //* Id de usuario que se obtiene desde local storage
  const idUsu = localStorage.getItem("usuario");
  // const [usu, setUsu] = useState(idUsu);
  const [usu, setUsu] = useState(1);
  //* Id de cliente que se obtine desde local storage
  // const idC = localStorage.getItem("cliSelect");
  // const idC = 2; // .153
  // const idC = 2083; //.28
  const idC = 2049; //.28
  const [idCliente, setIdCliente] = useState(idC);

  return (
    <GlobalContext.Provider
      value={{
        usu, 
        setUsu,
        idCliente,
        setIdCliente,
      }}
    >
      {/* <ApolloProvider client={client}> */}
        <ConfigProvider
          locale={esES}
          theme={{
            token: {
              colorPrimary: "#56b43c",
            },
          }}
        >
          <ViewGeneral />
        </ConfigProvider>
      {/* </ApolloProvider> */}
    </GlobalContext.Provider>
  );
}

export default App;
