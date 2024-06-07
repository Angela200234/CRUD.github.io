import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, onSnapshot, query, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYQPvIUHl-cFbB4YR3exzu5dX5jQXcs5E",
  authDomain: "formulario-ec939.firebaseapp.com",
  projectId: "formulario-ec939",
  storageBucket: "formulario-ec939.appspot.com",
  messagingSenderId: "332090460288",
  appId: "1:332090460288:web:b5bec89287061b7e8c7e65",
  measurementId: "G-EML4N57CBK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {

  let bti = document.getElementById("inser");
  let btc = document.getElementById("consu");
  let bte = document.getElementById("Edit");
  const btClear = document.getElementById("limpiar");
  const tablaUsuarios = document.querySelector("#tbUsuarios");

  bti.addEventListener('click', async (e) => {
    let nom = document.getElementById("nombre").value;
    let ap = document.getElementById("ap").value;
    let tel = document.getElementById("cel").value;
    let materia = document.getElementById("materia").value;
    let grupo = document.getElementById("grupo").value;

    // Generar un ID aleatorio de 6 dígitos
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
  
    // Generar la matrícula aleatoria
    const randomMatricula = `MAT-${randomId}`;
  
    // Generar el correo automáticamente utilizando el ID generado
    const autoCorreo = `${randomId}@uagro.com`;
  
    try {
      await setDoc(doc(db, "usuarios", randomId), {
        nombre: nom,
        ap: ap,
        correo: autoCorreo,
        tel: tel,
        matricula: randomMatricula,
        materia: materia,
        grupo: grupo,
      });
      console.log("Document written with ID: ", randomId);
      // Actualizar la tabla de usuarios después de insertar un nuevo documento
      ShowUsers();
      document.getElementById("matricula").value = randomMatricula; // Mostrar matrícula en el formulario
      document.getElementById("correo").value = autoCorreo; // Mostrar correo en el formulario
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });

  btc.addEventListener('click', async (e) => {
    ShowUsers();
    viewUsuarios2();
  });

  btClear.addEventListener('click', (e) => {
    document.getElementById("userId").value = '';
    document.getElementById("nombre").value = '';
    document.getElementById("ap").value = '';
    document.getElementById("correo").value = '';
    document.getElementById("cel").value = '';
    document.getElementById("matricula").value = ''; 
    document.getElementById("materia").value = '';
    document.getElementById("grupo").value = ''; 
  });

  async function ShowUsers() {
    tablaUsuarios.innerHTML = "";
    const Allusers = await ViewUsuarios();

    Allusers.forEach((doc) => {
      const datos = doc.data();
      tablaUsuarios.innerHTML += `<tr>
        <td>${datos.nombre}</td>
        <td>${datos.ap}</td>
        <td>${datos.correo}</td>
        <td>${datos.tel}</td>
        <td>${datos.matricula}</td>
        <td>${datos.materia}</td>
        <td>${datos.grupo}</td>
        <td>
          <button class="btn-primary btn m-1 editar_" data-id="${doc.id}">
            <i class="bi bi-pencil-square"></i> Editar 
            <span class="spinner-border spinner-border-sm" id="Edit-${doc.id}" style="display: none;"></span>
          </button> 
          <button class="btn-danger btn eliminar_" data-id="${doc.id}|${datos.nombre}">
            <i class="bi bi-trash"></i> Eliminar 
            <span class="spinner-border spinner-border-sm" id="elim-${doc.id}" style="display: none;"></span>
          </button>
        </td>
      </tr>`;
    });
  }

  async function ViewUsuarios() {
    const usersCol = collection(db, 'usuarios');
    const userSnapshot = await getDocs(usersCol);
    return userSnapshot.docs;
  }

  async function viewUsuarios2() {
    const q = query(collection(db, "usuarios"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const divusuarios = document.querySelector("#tbUsuarios");
      divusuarios.innerHTML = "";
      querySnapshot.forEach((doc) => {
        const datos = doc.data();
        divusuarios.innerHTML += `<tr>
          <td>${datos.nombre}</td>
          <td>${datos.ap}</td>
          <td>${datos.correo}</td>
          <td>${datos.tel}</td>
          <td>${datos.matricula}</td>
          <td>${datos.materia}</td>
          <td>${datos.grupo}</td>
          <td>
            <button class="btn-primary btn m-1 editar_" data-id="${doc.id}">
              <i class="bi bi-pencil-square"></i> Editar 
              <span class="spinner-border spinner-border-sm" id="Edit-${doc.id}" style="display: none;"></span>
            </button> 
            <button class="btn-danger btn eliminar_" data-id="${doc.id}|${datos.nombre}">
              <i class="bi bi-trash"></i> Eliminar 
              <span class="spinner-border spinner-border-sm" id="elim-${doc.id}" style="display: none;"></span>
            </button>
          </td>
        </tr>`;
      });
    });
  }

  // Event listeners for edit and delete buttons
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('editar_')) {
      const id = e.target.getAttribute('data-id');
      const docRef = doc(db, "usuarios", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const datos = docSnap.data();
        document.getElementById("userId").value = id;
        document.getElementById("nombre").value = datos.nombre;
        document.getElementById("ap").value = datos.ap;
        document.getElementById("correo").value = datos.correo;
        document.getElementById("cel").value = datos.tel;
        document.getElementById("matricula").value = datos.matricula;
        document.getElementById("materia").value = datos.materia;
        document.getElementById("grupo").value = datos.grupo;
      } else {
        console.log("No such document!");
      }
    }

    if (e.target.classList.contains('eliminar_')) {
      const [id, nombre] = e.target.getAttribute('data-id').split('|');
      if (confirm(`¿Está seguro de eliminar el usuario ${nombre}?`)) {
        await deleteDoc(doc(db, "usuarios", id));
        ShowUsers();
      }
    }
  });

  bte.addEventListener('click', async (e) => {
    const id = document.getElementById("userId").value;
    const nom = document.getElementById("nombre").value;
    const ap = document.getElementById("ap").value;
    const tel = document.getElementById("cel").value;
    const materia = document.getElementById("materia").value;
    const grupo = document.getElementById("grupo").value;
  
    if (id) {
      try {
        const userRef = doc(db, "usuarios", id);
        await updateDoc(userRef, {
          nombre: nom,
          ap: ap,
          tel: tel,
          materia: materia,
          grupo: grupo
        });
        console.log("Document updated with ID: ", id);
        ShowUsers();
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  });
});