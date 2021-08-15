const d = document;

///----------------------------------///

const resultado = d.querySelector('#resultado');
const formulario = d.querySelector('#formulario');
const paginacionDiv = d.querySelector('#paginacion');

const registroPorPagina = 35;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
	formulario.addEventListener('submit', validarFormulario);
};

function validarFormulario(e) {
	e.preventDefault();
	const terminoBusqueda = d.querySelector('#termino').value;

	if (terminoBusqueda === '') {
		mostrarAlerta('Agrega un Termino de Busqueda');
		return;
	}

	buscarImagenes(terminoBusqueda);
}

function mostrarAlerta(mensaje) {
	const existeAlerta = d.querySelector('.bg-red-100');

	if (!existeAlerta) {
		const alerta = d.createElement('p');
		alerta.classList.add(
			'bg-red-100',
			'border-red-400',
			'text-red-700',
			'px-4',
			'py-3',
			'mt-6',
			'rounded',
			'text-center',
			'max-w-lg',
			'mx-auto',
			'mt-y6'
		);
		alerta.innerHTML = `
            <strong class="font-bold">Error!!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
		formulario.appendChild(alerta);
		setTimeout(() => {
			alerta.remove();
		}, 3000);
	}
}

function buscarImagenes() {
	const termino = d.querySelector('#termino').value;
	const key = '15022583-2891b7e1735571b5ee32f9e27';
	const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;
	fetch(url)
		.then((respuesta) => respuesta.json())
		.then((resultado) => {
			totalPaginas = calcularPaginas(resultado.totalHits);

			mostrarImagenes(resultado.hits);
		});
}

function* crearPaginador(total) {
	for (let i = 1; i <= total; i++) {
		yield i;
	}
}

function mostrarImagenes(imagenes) {
	while (resultado.firstChild) {
		resultado.removeChild(resultado.firstChild);
	}

	//Iterar sobre las imagenes
	imagenes.forEach((imagen) => {
		const { previewURL, likes, views, largeImageURL } = imagen;

		resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">    
                    <img class="w-full" src="${previewURL}">
                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light">Me Gusta <span>&#x2764;</span></span></p>
                        <p class="font-bold">${views} <span class="font-light">Veces Vista </span></p>

                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" target="_blank" rel="noopener noreferrer" href="${largeImageURL}">Ver Imagen<a>
                    </div>
                </div>
            </div>
        `;
	});

	//Limpiar el Paginador
	while (paginacionDiv.firstChild) {
		paginacionDiv.removeChild(paginacionDiv.firstChild);
	}

	imprimirPaginador();
}

function calcularPaginas(total) {
	return parseInt(Math.ceil(total / registroPorPagina));
}

function imprimirPaginador() {
	iterador = crearPaginador(totalPaginas);

	while (true) {
		const { value, done } = iterador.next();
		if (done) return;

		//genera un boton por cada elemento en el gererador
		const boton = d.createElement('a');
		boton.href = '#';
		boton.dataset.pagina = value;
		boton.textContent = value;
		boton.classList.add(
			'siguiente',
			'bg-yellow-400',
			'px-4',
			'mr-2',
			'font-bold',
			'mb-4',
			'uppercase',
			'rounded'
		);

		boton.onclick = () => {
			paginaActual = value;

			buscarImagenes();
		};

		paginacionDiv.appendChild(boton);
	}
}
