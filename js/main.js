document.addEventListener("DOMContentLoaded", loadinicio);

let inicio = document.querySelectorAll('.inicio');
inicio.forEach(e => e.addEventListener("click", loadinicio));
let pedidos = document.querySelectorAll('.pedidos');
pedidos.forEach(e => e.addEventListener("click", loadpedidos));
let productos = document.querySelectorAll('.productos');
productos.forEach(e => e.addEventListener("click", loadproductos));
let faq = document.querySelectorAll('.faq');
faq.forEach(e => e.addEventListener("click", loadfaq));

function loadinicio(event) {
  event.preventDefault();
  let container = document.querySelector('#contenido');
  container.innerHTML = "<h1>Loading...</h1>";
  fetch("http://localhost/proyectos/trabajo/inic.html").then(
    function (response) {
      response.text().then(t => container.innerHTML = t).then(function () {
        let pedidos_1 = document.querySelectorAll('.pedidos');
        pedidos_1.forEach(e => e.addEventListener("click", loadpedidos));
        let productos_1 = document.querySelectorAll('.productos');
        productos_1.forEach(e => e.addEventListener("click", loadproductos));
      });
    }).catch(function (response) {
      container.innerHTML = "ERROR";
    });
}
function loadpedidos(event) {
  event.preventDefault();
  let container = document.querySelector('#contenido');
  container.innerHTML = "<h1>Loading...</h1>";
  fetch("http://localhost/proyectos/trabajo/pedidos.html").then(
    function (response) {
      response.text().then(t => container.innerHTML = t).then(function () {
        //CARGA DE EVENTOS
        let actu = document.querySelector("#actucaptcha");
        actu.addEventListener("click", generateCaptcha);
        let rpedido = document.querySelector("#realizpedido");
        rpedido.addEventListener("click", check);
        let tres = document.querySelector("#tres");
        tres.addEventListener("click", agregar3);
        let borrar = document.querySelector("#borrartabla");
        borrar.addEventListener("click", delete2);
        let editar = document.querySelector("#editar");
        editar.addEventListener("click", editar2);
        let filtrar = document.querySelector("#filtrar");
        filtrar.addEventListener("click", loadfiltro);
        let cancelfiltro = document.querySelector("#cancelarfiltro");
        cancelfiltro.addEventListener("click", cancelarfiltro);
      }).then(function () {
        generateCaptcha();
        load();
      });
    }).catch(function (response) {
      container.innerHTML = "ERROR";
    });
}
function loadproductos(event) {
  event.preventDefault();
  let container = document.querySelector('#contenido');
  container.innerHTML = "<h1>Loading...</h1>";
  fetch("http://localhost/proyectos/trabajo/productos.html").then(
    function (response) {
      response.text().then(t => container.innerHTML = t);
    }).catch(function (response) {
      container.innerHTML = "ERROR";
    });
}
function loadfaq(event) {
  event.preventDefault();
  let container = document.querySelector('#contenido');
  container.innerHTML = "<h1>Loading...</h1>";
  fetch("http://localhost/proyectos/trabajo/faq.html").then(
    function (response) {
      response.text().then(t => container.innerHTML = t);
    }).catch(function (response) {
      container.innerHTML = "ERROR";
    });
}

//FUNCIONES CAPTCHA
function generateCaptcha() {
  let a = Math.floor((Math.random() * 10));
  let b = Math.floor((Math.random() * 10));
  let c = Math.floor((Math.random() * 10));
  let d = Math.floor((Math.random() * 10));

  captcha = a.toString() + b.toString() + c.toString() + d.toString();

  document.getElementById("captcha").value = captcha;
}
function check() {
  let input = document.getElementById("inputText").value;

  if (input == captcha) {
    add();
    alert("Enviado");
  }
  else {
    alert("Verifique captcha");
  }
}

//FIN FUNCIONES CAPTCHA

function agregar3() {
  for (let i = 0; i < 3; i++) {
    add();
  }
}

//API REST

function load() {
  let container = document.querySelector("#pedidos_tabla")
  container.innerHTML = "Cargando...";
  fetch('https://web-unicen.herokuapp.com/api/groups/21/pedidostabla').then(r => r.json())
    .then(json => show(container, json));
};

function add() {
  let pedido = {
    "Nombre": document.querySelector("#inputName").value,
    "Apellido": document.querySelector("#inputLastname").value,
    "Direccion": document.querySelector("#inputAddress").value,
    "Pedido": document.querySelector("#inputPedido").value
  }
  let data = {
    "thing": pedido
  }
  fetch('https://web-unicen.herokuapp.com/api/groups/21/pedidostabla', {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(data)
  })

    .then(r => load())
    .catch(function (e) {
      console.log(e)
    })
};

function show(container, json) {
  let html = "<table>"
  for (let i = 0; i < json.pedidostabla.length; i++) {
    html += "<tr>"
    let nombre = json.pedidostabla[i].thing.Nombre;
    let apellido = json.pedidostabla[i].thing.Apellido;
    let direccion = json.pedidostabla[i].thing.Direccion;
    let pedido = json.pedidostabla[i].thing.Pedido;
    let datajson = json.pedidostabla[i]._id;

    html += "<td>" + "<input class=checkarray type = checkbox id =" + datajson + ">" + "</td>"
    html += "<td>" + nombre + "</td>"
    html += "<td>" + apellido + "</td>"
    html += "<td>" + direccion + "</td>"
    html += "<td>" + pedido + "</td>"
    html += "</tr>"
  }

  container.innerHTML = html;
};
function delete2(json) {
  let array = document.getElementsByClassName('checkarray');
  for (let i = 0; i < array.length; i++) {
    if (array[i].checked == true) {
      let hash = array[i].id;
      let url = "https://web-unicen.herokuapp.com/api/groups/21/pedidostabla/" + hash;

      fetch(url, {
        "method": "DELETE",
        "headers": {
          "Content-Type": "application/json"
        }
      }).then(r => load())
        .then(r => console.log(r))
    }
  }
}

let baseURL = 'https://web-unicen.herokuapp.com/api/groups/';
let groupID = '21';
let collectionID = 'pedidostabla';

let contenedor = document.querySelector("#pedidos_tabla");

function editar2() {
  let array = document.querySelectorAll(".checkarray");
  let contador = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i].checked == true) {
      contador++;
    }
  }
  console.log(contador);
  if (contador == 1) {
    for (let i = 0; i < array.length; i++) {
      console.log(array[i].checked);
      if (array[i].checked == true) {
        let id = array[i].id;
        console.log(id);
        let nombre = document.querySelector("#inputName").value;
        let apellido = document.querySelector("#inputLastname").value;
        let direccion = document.querySelector("#inputAddress").value;
        let pedido = document.querySelector("#inputPedido").value;
        if (nombre.length === 0 || id.length === 0) {
          contenedor.innerHTML = "Ingrese un ID y nombre";
          return;
        }
        let pedido2 = {
          "thing": {
            "Nombre": nombre,
            "Apellido": apellido,
            "Direccion": direccion,
            "Pedido": pedido
          }
        };
        fetch(baseURL + groupID + "/" + collectionID + "/" + id, {
          "method": "PUT",
          "mode": 'cors',
          "headers": {
            "Content-Type": "application/json"
          },
          "body": JSON.stringify(pedido2)
        }).then(function (r) {
          if (!r.ok) {
            console.log("Error")
          }
          return r.json()
        })
          .then(load())
          .catch(function (e) {
            console.log(e)
          })
      }
    }
  }
  load()
}

function loadfiltro() {
  let container = document.querySelector("#pedidos_tabla")
  container.innerHTML = "Cargando...";
  fetch('https://web-unicen.herokuapp.com/api/groups/21/pedidostabla').then(r => r.json())
    .then(json => filtro(container, json));

}

function filtro(container, json) {

  let pedido = document.querySelector("#inputPedidoF").value;
  console.log(pedido);
  let html = "<table>"
  for (let i = 0; i < json.pedidostabla.length; i++) {
    console.log(json.pedidostabla[i].thing.Pedido);
    if (json.pedidostabla[i].thing.Pedido == pedido) {
      html += "<tr>"
      let nombre = json.pedidostabla[i].thing.Nombre;
      let apellido = json.pedidostabla[i].thing.Apellido;
      let direccion = json.pedidostabla[i].thing.Direccion;
      let pedido = json.pedidostabla[i].thing.Pedido;
      let datajson = json.pedidostabla[i]._id;

      html += "<td>" + "<input class=checkarray type = checkbox id =" + datajson + ">" + "</td>"
      html += "<td>" + nombre + "</td>"
      html += "<td>" + apellido + "</td>"
      html += "<td>" + direccion + "</td>"
      html += "<td>" + pedido + "</td>"
      html += "</tr>"
    }

    container.innerHTML = html;
  }
}

function cancelarfiltro() {
  load();
}