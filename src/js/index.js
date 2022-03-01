'use strict';

const d = document;
const $table = d.querySelector(".crud-table");
const $form = d.getElementById("crudForm");
const $template = d.getElementById("crud-template").content; // me interesa la estructura del template, por eso content
const fragment = d.createDocumentFragment(); // fragment para insertar todo de un tiro al html
const $tbody = document.querySelector("tbody");
console.log($tbody);
console.log(axios);
// otros necesarios
const $buttonDatos = d.getElementById("traerDatos");
const $title = document.querySelector(".crud-title");

let url = "http://localhost:8888/DBZ-universo6";
//url de la que se va a realizar el consumo

const getDataAxios = async () => {
  try {
    let response = await axios.get(url);
    console.log(response);
    let datos = response.data.forEach((el) => {
      $template.querySelector(".name").textContent = el.nombre;
      $template.querySelector(".powerLevel").textContent = el.nivelPoder;
      $template.querySelector(".edit").dataset.id = el.id;
      $template.querySelector(".edit").dataset.nombre = el.nombre;
      $template.querySelector(".edit").dataset.nivelPoder = el.nivelPoder;
      $template.querySelector(".delete").dataset.id = el.id;
      let $clone = d.importNode($template, true);
      fragment.appendChild($clone);
    });
    $tbody.appendChild(fragment);
  } catch (err) {
    console.log(err.response.status);
    $table.insertAdjacentHTML(
      "afterend",
      `<p><b>ha ocurrido un error de tipo ${err.response.status}</b></p>`
    );
  } finally {
    console.log("yo me ejecuto de manera independiente");
  }
};

d.addEventListener("DOMContentLoaded", getDataAxios);

d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();
    if (!e.target.id.value) {
      // post ( create )
      try {
        let peticion = await axios({
          method: "POST",
          url: url,
          data: {
            nombre: e.target.nombre.value,
            nivelPoder: e.target.nivelPoder.value,
          },
        });
        console.log(peticion);
      } catch (err) {
        console.log(err);
      }
    } else {
      // peitiicon put
      try {
        let peticion = await axios.put({
          url: `${url}/${e.target.id.value}`,
          data: {
            nombre: e.target.nombre.value,
            nivelPoder: e.target.nivelPoder.value,
          },
        });
        console.log(peticion);
      } catch (err) {
        console.log(err);
      }
    }
  }
});
// manejo del click para el edit
d.addEventListener("click", (e) => {
  if (e.target.matches(".edit")) {
    $title.textContent = "editar personaje";
    $form.nombre.value = e.target.dataset.nombre;
    $form.nivelPoder.value = e.target.dataset.nivelPoder;
    $form.id.value = e.target.dataset.id;
    $buttonDatos.style.display = "block";
    $buttonDatos.style.backgroundColor = "red";
    $buttonDatos.style.width = "200px";
    $form.sub.value = "enviar cambios";
  }
});
// manejo del metodo delete
d.addEventListener("click", (e) => {
  if (e.target.matches(".delete")) {
    try {
      let isDelete = confirm("Are you sure you want to delete");
      if (isDelete) {
        axios.delete(`${url}/${e.target.dataset.id}`);
      }
    } catch (err) {
      console.log(err.response.status);
    }
  }
});
// tratando de solucionar el lio del post
//jum
d.addEventListener("click", (e) => {
  if (e.target.matches("#traerDatos")) {
    $title.textContent = "Push character dbz";
    $form.sub.value = "Send new character";
    $buttonDatos.style.backgroundColor = "#eeeeee";
    $buttonDatos.style.width = "30%";
    $buttonDatos.style.display = "none";
    $form.id.value = null;
    $form.reset();
  }
});
