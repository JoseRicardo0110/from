import NavbarPrueba from "../../components/navbar/navbarprueba";
import Lateral3 from "../../components/navbar/lateral3";
import Footer1 from "../../components/footer/footer";
import { useEffect, useState } from "react";
import axios from "axios";

const url = "https://soli-iub-fastapi.onrender.com";

export default function Ver_roles() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modules, setModules] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");

  const getRoles = async () => {
    try {
      const response = await axios.get(`${url}/get_Roles`);
      const roles = response.data.resultado;
      setUsers(roles);
    } catch (error) {
      console.error(error);
    }
  };

  const getModules = async (roleId) => {
    try {
      const response = await axios.get(`${url}/get_modulos/${roleId}`);
      const modules = response.data;
      setModules(modules);
      setSelectedRole(roleId);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllModules = async () => {
    try {
      const response = await axios.get(`${url}/get_all_modulos`);
      const modules = response.data;
      setAllModules(modules);
    } catch (error) {
      console.error(error);
    }
  };

  const addModuleToRole = async () => {
    if (!selectedModule) return;
    try {
      await axios.post(`${url}/add_modulo_a_rol`, { idrol: selectedRole, idmodulo: selectedModule });
      setSelectedModule(""); // Reset the selected module
      getModules(selectedRole); // Refresh the list of modules for the selected role
    } catch (error) {
      console.error(error);
    }
  };

  const removeModuleFromRole = async (moduleId) => {
    console.log("Removing module with ID:", moduleId); // Debugging line
    try {
      await axios({
        method: 'delete',
        url: `${url}/remove_modulo_de_rol`,
        data: {
          idrol: selectedRole,
          idmodulo: moduleId
        }
      });
      getModules(selectedRole); // Refresh the list of modules for the selected role
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRoles();
    getAllModules();
  }, []);

  const clearModules = () => {
    setModules([]);
    setSelectedRole(null);
  };

  const handleRemoveModule = (moduleId) => {
    removeModuleFromRole(moduleId);
  };

  return (
    <>
      <NavbarPrueba />
      <div className="todo fondoZ2">
        <div className="p-0 lr">
          <Lateral3 />
        </div>
        <div className="ld">
          <div className="row">
            {users.map((user) => (
              <div key={user.IdRol} className="col-4">
                <div className="card carta1 ms-4 mb-2">
                  <div className="card-body">
                    <h4 className="card-title">{user.NombreRol}</h4>
                    <p className="card-text">{user.DescripcionRol}</p>
                  </div>
                  <div className="card-body">
                    <button
                      type="button"
                      onClick={() => getModules(user.IdRol)}
                      className="btn btn-success m-2"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Ver modulos permitidos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          onHide={clearModules}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Modulos de {users.find(user => user.IdRol === selectedRole)?.NombreRol}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <ul id="lista-modulos">
                  {modules.map((modulo) => (
                    <li key={modulo.id}>
                      {modulo.modulos}{" "}
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleRemoveModule(modulo.modulo)}
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
                <hr />
                <h5>Agregar modulo</h5>
                <div className="d-flex">
                  <select 
                    className="form-select me-2"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                  >
                    <option value="">Seleccione un modulo</option>
                    {allModules.map((modulo) => (
                      <option key={modulo.id} value={modulo.id}>
                        {modulo.modulo}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-primary" onClick={addModuleToRole}>
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </>
  );
}
