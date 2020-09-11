// Referencio al <div> contenedor y al botón del .html .
const deck = document.getElementById("card-deck");
const boton = document.getElementById("boton");
const loader = document.getElementById("loader");
// Añado un escuchador de eventos en el botón.
// Al hacer clic en él, se va a ejecutar la funcion mostrar() .
boton.addEventListener('click',mostrar);

// Declaro la variable personajes donde se guardará el array del fetch.
let personajes=[];

// Declaro una función asíncrona para cargar los datos del fetch 
// y llamar a la función que los dibuja en el DOM.
async function getData(){
  // JS espera que se resuelva la Promesa del fetch, y luego guarda el resultado en res .
  const res = await fetch("https://hp-api.herokuapp.com/api/characters");
  // JS espera que se resuelva la Promesa de la funcion json(), y luego guarda el resultado en personajes .
  personajes = await res.json();
  // Luego de guardar los datos en personajes, llamo a la funcion llenar() .
  llenar()
}

// Declaro una función para atrapar los errores del fetch.
// Se le pasa una función como argumento
function catchErrors(fn) {
  //Devolvemos una nueva función.
  // Los ...args me permiten pasar argumentos desde la llamada de funcionComprobada(args)
  return function(...args){
    //Devolvemos una función que corre fn() y le agregamos el catch
    return fn(...args).catch((error) => {
      alert(`UPS... se produjo un error \n${error}`)
    })
  }
}

// Declaramos una nueva función donde pasamos como argumento nuestra funcion asíncrona.
// En este caso, cuando la computadora la ejecute, "funcionComprobada" va a tener esta estructura:
/* 
function funcionComprobada(...args){
   return getData(...args).catch((error) => {
     alert(`UPS... se produjo un error \n${error}`)
   })
 }
*/
const funcionComprobada = catchErrors(getData);

function mostrar(){
  // Oculto el botón.
  boton.style.display = "none";

  // Defino las dimensiones que tendrá el mazo (deck).
  // Inicialmente, en el CSS están definidas en 0px.
  // Como tienen transiciones, la aparición en el navegador será "armoniosa".
  deck.style.padding = "40px";
  deck.style.width = "90%";
  deck.style.height = "67vh";

  // Añado un eventListener para cuando termina la transición del alto.
  // Luego de este evento, llamo a la función que engloba tanto al fetch como al catch.
  deck.addEventListener("transitionend", e=>{
    e.target===deck && e.propertyName=="height" ? (loader.style.display="block", funcionComprobada() ): null ;
  });
}


function llenar() {
  // Vacío el contenido del .deck .
  // Esto me va a permitir en un futuro poder aplicar filtros y mostrar
  // sólo los personajes deseados de, por ejemplo, una determinada casa.
  deck.innerHTML='';
  deck.classList.remove("loading")

  // Por cada personaje...
  personajes.forEach(personaje => {
    // ... genero una card.
    const card = document.createElement("div");

    // Genero los elementos HTML que van a ir en esta card.
    const avatar = document.createElement("div");
    const pic = document.createElement("img");
    const name = document.createElement("h3");
    const details = document.createElement("ul");

    // Agrego la clase correspondiente de acuerdo a la casa del personaje.
    card.classList.add("card", `${personaje.house || "houseless"}`);

    // Le doy estilos a la imagen de perfil, y declaro el src correspondiente al personaje.
    avatar.classList.add("avatar");
    pic.setAttribute("src", personaje.image);

    // Lleno la información de la card con los datos del personaje.
    name.innerText = personaje.name;
    details.innerHTML = ` <li><b>House:</b> ${personaje.house || "None"}</li>
                          <li><b>Patronus:</b> ${personaje.patronus || "-"}</li>
                          <li><b>Actor:</b> ${personaje.actor}</li>`;

    // Voy construyendo el componente card.
    avatar.appendChild(pic);
    card.appendChild(avatar);
    card.appendChild(name);
    card.appendChild(details);

    //Una vez terminada la construcción, añado este card al mazo (deck).
    deck.appendChild(card);
  }

  )
/* ET VOILÀ, mostramos a todos los personajes que nos entregó la API, cada uno con
  sus estilos dependiendo de la información que tiene el objeto iterado.*/

}
