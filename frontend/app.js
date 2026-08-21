const API = 'http://localhost:3000/api';

const listaMedia = document.getElementById('listaMedia');

const totalMedia = document.getElementById('totalMedia');
const totalGeneros = document.getElementById('totalGeneros');
const totalDirectores = document.getElementById('totalDirectores');
const totalProductoras = document.getElementById('totalProductoras');

const btnNueva = document.getElementById('btnNueva');
const btnCancelar = document.getElementById('btnCancelar');
const btnActualizar = document.getElementById('btnActualizar');

const formularioSeccion = document.getElementById('formularioSeccion');
const mediaForm = document.getElementById('mediaForm');

const tituloFormulario = document.getElementById('tituloFormulario');

const mediaId = document.getElementById('mediaId');
const serial = document.getElementById('serial');
const titulo = document.getElementById('titulo');
const sinopsis = document.getElementById('sinopsis');
const url = document.getElementById('url');
const imagen = document.getElementById('imagen');
const anioEstreno = document.getElementById('anio_estreno');

const generoSelect = document.getElementById('genero_id');
const directorSelect = document.getElementById('director_id');
const productoraSelect = document.getElementById('productora_id');
const tipoSelect = document.getElementById('tipo_id');


async function obtenerDatos(endpoint) {

    const respuesta = await fetch(`${API}/${endpoint}`);

    if (!respuesta.ok) {
        throw new Error(`Error al consultar ${endpoint}`);
    }

    return await respuesta.json();
}


async function cargarEstadisticas() {

    try {

        const media = await obtenerDatos('media');
        const generos = await obtenerDatos('generos');
        const directores = await obtenerDatos('directores');
        const productoras = await obtenerDatos('productoras');

        totalMedia.textContent = media.length;
        totalGeneros.textContent = generos.length;
        totalDirectores.textContent = directores.length;
        totalProductoras.textContent = productoras.length;

    } catch (error) {

        console.error('Error al cargar estadísticas:', error);

    }
}


async function cargarOpciones() {

    try {

        const generos = await obtenerDatos('generos');
        const directores = await obtenerDatos('directores');
        const productoras = await obtenerDatos('productoras');
        const tipos = await obtenerDatos('tipos');


        generoSelect.innerHTML = '<option value="">Seleccione un género</option>';

        generos.forEach(genero => {

            generoSelect.innerHTML += `
                <option value="${genero.id}">
                    ${genero.nombre}
                </option>
            `;

        });


        directorSelect.innerHTML = '<option value="">Seleccione un director</option>';

        directores.forEach(director => {

            directorSelect.innerHTML += `
                <option value="${director.id}">
                    ${director.nombres}
                </option>
            `;

        });


        productoraSelect.innerHTML = '<option value="">Seleccione una productora</option>';

        productoras.forEach(productora => {

            productoraSelect.innerHTML += `
                <option value="${productora.id}">
                    ${productora.nombre}
                </option>
            `;

        });


        tipoSelect.innerHTML = '<option value="">Seleccione un tipo</option>';

        tipos.forEach(tipo => {

            tipoSelect.innerHTML += `
                <option value="${tipo.id}">
                    ${tipo.nombre}
                </option>
            `;

        });

    } catch (error) {

        console.error('Error al cargar opciones:', error);

    }
}


async function cargarMedia() {

    listaMedia.innerHTML =
        '<p class="cargando">Cargando producciones...</p>';

    try {

        const media = await obtenerDatos('media');

        if (media.length === 0) {

            listaMedia.innerHTML =
                '<p class="cargando">No hay producciones registradas.</p>';

            return;
        }

        listaMedia.innerHTML = '';


        media.forEach(item => {

            const tarjeta = document.createElement('div');

            tarjeta.className = 'media-card';

            tarjeta.innerHTML = `

                <img
                    src="${item.imagen || 'https://via.placeholder.com/400x220?text=Sin+Imagen'}"
                    alt="${item.titulo}"
                    onerror="this.src='https://via.placeholder.com/400x220?text=Sin+Imagen'"
                >

                <div class="media-info">

                    <h3>${item.titulo}</h3>

                    <p>
                        <strong>Serial:</strong>
                        ${item.serial}
                    </p>

                    <p>
                        <strong>Año:</strong>
                        ${item.anio_estreno || 'No registrado'}
                    </p>

                    <p>
                        <strong>Director:</strong>
                        ${item.director || 'No registrado'}
                    </p>

                    <p>
                        <strong>Productora:</strong>
                        ${item.productora || 'No registrada'}
                    </p>

                    <p>
                        ${item.sinopsis || 'Sin sinopsis'}
                    </p>

                    <span class="etiqueta">
                        ${item.genero || 'Sin género'}
                    </span>

                    <span class="etiqueta">
                        ${item.tipo || 'Sin tipo'}
                    </span>

                    <div style="margin-top: 15px;">

                        <button onclick="editarMedia(${item.id})">
                            ✏️ Editar
                        </button>

                        <button
                            onclick="eliminarMedia(${item.id})"
                            style="background:#dc2626;"
                        >
                            🗑️ Eliminar
                        </button>

                    </div>

                </div>
            `;

            listaMedia.appendChild(tarjeta);

        });

    } catch (error) {

        console.error(error);

        listaMedia.innerHTML = `
            <p class="cargando">
                No se pudo conectar con la API.
            </p>
        `;

    }
}


function abrirFormulario() {

    formularioSeccion.classList.remove('oculto');

    tituloFormulario.textContent = 'Agregar producción';

    mediaForm.reset();

    mediaId.value = '';

    formularioSeccion.scrollIntoView({
        behavior: 'smooth'
    });

}


function cerrarFormulario() {

    formularioSeccion.classList.add('oculto');

    mediaForm.reset();

    mediaId.value = '';

}


btnNueva.addEventListener('click', abrirFormulario);

btnCancelar.addEventListener('click', cerrarFormulario);

btnActualizar.addEventListener('click', async () => {

    await cargarEstadisticas();
    await cargarMedia();

});


mediaForm.addEventListener('submit', async (event) => {

    event.preventDefault();


    const datos = {

        serial: serial.value,
        titulo: titulo.value,
        sinopsis: sinopsis.value,
        url: url.value,
        imagen: imagen.value,
        anio_estreno: Number(anioEstreno.value),
        genero_id: Number(generoSelect.value),
        director_id: Number(directorSelect.value),
        productora_id: Number(productoraSelect.value),
        tipo_id: Number(tipoSelect.value)

    };


    try {

        let respuesta;

        if (mediaId.value) {

            respuesta = await fetch(
                `${API}/media/${mediaId.value}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                }
            );

        } else {

            respuesta = await fetch(
                `${API}/media`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                }
            );

        }


        const resultado = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.error ||
                'Ocurrió un error al guardar la producción.'
            );

            return;
        }


        alert(
            mediaId.value
                ? 'Producción actualizada correctamente.'
                : 'Producción creada correctamente.'
        );


        cerrarFormulario();

        await cargarEstadisticas();
        await cargarMedia();


    } catch (error) {

        console.error(error);

        alert('No se pudo conectar con el servidor.');

    }

});


async function editarMedia(id) {

    try {

        const media = await obtenerDatos(`media/${id}`);


        mediaId.value = media.id;

        serial.value = media.serial || '';
        titulo.value = media.titulo || '';
        sinopsis.value = media.sinopsis || '';
        url.value = media.url || '';
        imagen.value = media.imagen || '';
        anioEstreno.value = media.anio_estreno || '';

        generoSelect.value = media.genero_id;
        directorSelect.value = media.director_id;
        productoraSelect.value = media.productora_id;
        tipoSelect.value = media.tipo_id;


        tituloFormulario.textContent = 'Editar producción';

        formularioSeccion.classList.remove('oculto');

        formularioSeccion.scrollIntoView({
            behavior: 'smooth'
        });


    } catch (error) {

        console.error(error);

        alert('No se pudo cargar la producción.');

    }

}


async function eliminarMedia(id) {

    const confirmar = confirm(
        '¿Está seguro de que desea eliminar esta producción?'
    );


    if (!confirmar) {
        return;
    }


    try {

        const respuesta = await fetch(
            `${API}/media/${id}`,
            {
                method: 'DELETE'
            }
        );


        const resultado = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.error ||
                'No se pudo eliminar la producción.'
            );

            return;
        }


        alert('Producción eliminada correctamente.');


        await cargarEstadisticas();
        await cargarMedia();


    } catch (error) {

        console.error(error);

        alert('No se pudo conectar con el servidor.');

    }

}


async function iniciarPagina() {

    await cargarOpciones();

    await cargarEstadisticas();

    await cargarMedia();

}


iniciarPagina();