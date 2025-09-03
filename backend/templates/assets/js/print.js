let data = [];
let op = null;
let emp = null;

async function renderElements(detalles, operacion, empresa) {
  data = detalles;
  op = operacion;
  emp = empresa;
  window.detalles = data;
}

function createElementHeader(index) {
  const page = document.createElement("div");
  page.className = "page";
  const header = document.createElement("header");
  header.id = "header-" + index;
  header.innerHTML = `
    <div class="row">
      <div class="col-3">
        <img id="logo" src="${emp.logo}" style="width: 100px">
      </div>
      <div class="col-6" style="text-align: center; font-size: 12px;">
        <h5 class="mb-1" style="text-transform: uppercase;">${emp.nombre}</h5>
        <p class="lh-base mb-0">NIT: ${emp.nit}</p>
        <p class="lh-base mb-0">PBX: ${emp.telefono}</p>
        <p class="lh-base mb-0">${emp.direccion}</p>
        <p class="lh-base mb-0">FACTURA ${op.cambiaria ? 'CAMBIARIA' : ''} ELECTRÓNICA</p>
      </div>
      <div class="col-3" style="text-align: right; margin-top: 20px">
        <strong>Fecha:</strong>
        ${formatoFecha(op.fecha)} <br>
        <strong>No. Venta:</strong>
        #${op.id} <br>
        <strong>Estado:</strong>
        ${op.estado} <br>
      </div>
      <div class="col-12">
        <hr>
      </div>
      <div class="col-3">
        <p class="mb-1"><strong>Serie:</strong> ${op.serie}-${op.correlativo}</p>
        <p class="mb-1"><strong>Sucursal:</strong> ${op.sucursal.nombre}</p>
        <p class="mb-1"><strong>Bodega:</strong> ${op.bodega.nombre}</p>
      </div>
      <div class="col-6" style="text-align: center;">
        <strong>Datos del Cliente: </strong>
        <address>
          ${op.cliente.nombre}<br>
          ${op.cliente.nit} <br>
        </address>
      </div>
      <div class="col-3" style="text-align: right;">
        <p class="mb-1"><strong>Tipo Pago:</strong> ${op.tipo_pago}</p>
        <p class="mb-1"><strong>Sucursal:</strong> ${op.sucursal.nombre}</p>
        <p class="mb-1"><strong>Bodega:</strong> ${op.bodega.nombre}</p>
      </div>
    </div>`;
  page.appendChild(header);
  document.body.appendChild(page);
}

function createElementTables(index) {
  const elementos = document.querySelectorAll(".page");
  const ultimoElemento = elementos[elementos.length - 1];

  const table = document.createElement("table");
  table.className = "table";
  table.id = "table-" + index;
  const thead = document.createElement("thead");
  thead.id = "thead-" + index;
  const tr = document.createElement("tr");
  tr.style.background = "#000";
  tr.innerHTML = `
    <td style="color: #fff; background: #000; width: 70%;"><strong>Descripcion</strong></td>
    <td style="color: #fff; background: #000; width: 8%;" class="text-center"><strong>Cantidad</strong></td>
    <td style="color: #fff; background: #000; width: 8%;" class="text-end"><strong>Precio U.</strong></td>
    ${op.descuento ? `
      <td style="color: #fff; background: #000; width: 8%;" class="text-end"><strong>Precio</strong></td>
      <td style="color: #fff; background: #000; width: 8%;" class="text-end"><strong>Descuento</strong></td>` :
      ''}
    <td style="color: #fff; background: #000; width: 8%;" class="text-end"><strong>Total</strong></td>
    `;
  thead.appendChild(tr);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  tbody.id = "tb-" + index;
  table.appendChild(tbody);
  ultimoElemento.appendChild(table);
}

function createElementTBodys(d) {
  const tbody = document.getElementById(tbodysid);
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${d.descripcion}</td>
    <td class="text-center">${d.cantidad}</td>
    <td class="text-end">${d.precio_unitario}</td>
    ${op.descuento ? `
      <td class="text-end">${d.precio}</td>
      <td class="text-end">${d.descuento}</td>` :
      ''}
    <td class="text-end">${d.total}</td>
    `;
  tbody.appendChild(tr);
}

function createAbonos(pages) {
  pages.forEach((page, index) => {
    if ((index) ==  pages.length - 1) {
      const footer = document.createElement("footer");
      footer.innerHTML = `
      <div class="table-responsive" style="margin: 0 200px;">
        <h6 class="text-center">Complemento Factura Cambiaria</h6>
        <table class="table border border-top-0 mb-0">
          <thead>
            <tr>
              <td style="background: #000; color: #fff;"><b>No. Abono</b></td>
              <td style="background: #000; color: #fff;"><b>Fecha Abono</b></td>
              <td style="background: #000; color: #fff;" class="col-2 text-end"><strong>Monto</strong></td>
            </tr>
          </thead>
          <tbody id="abonos">
            <tr>
              <td>1</td>
              <td>${formatoFecha(op.abonos[0].fecha, 'DD/MM/YYYY')}</td>
              <td class="col-2 text-end">${moneda(op.abonos[0].monto, 'Q. ')}</td>
            </tr>
          </tbody>
        </table>
      </div>`;

      page.appendChild(footer);
    }
  });
}

function sumarFilas(pages) {
  pages.forEach((page) => {
    let totalTotal = 0;
    let totalPrecioU = 0;
    let totalCantidad = 0;

    const tbodies = page.getElementsByTagName("tbody");
    Array.from(tbodies).forEach((tbody) => {
      const filas = tbody.getElementsByTagName("tr");
      for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName("td");
        const valorCelda1 = parseFloat(
          celdas[celdas.length - 1].textContent.trim()
        );
        const valorCelda2 = parseFloat(
          celdas[celdas.length - 2].textContent.trim()
        );
        const valorCelda3 = parseFloat(
          celdas[celdas.length - 3].textContent.trim()
        );

        if (!isNaN(valorCelda1)) {
          totalTotal += valorCelda1;
          celdas[celdas.length - 1].innerHTML = moneda(valorCelda1, 'Q. ');
        }

        if (!isNaN(valorCelda2)) {
          totalPrecioU += valorCelda2;
          celdas[celdas.length - 2].innerHTML = moneda(valorCelda2, 'Q. ');
        }

        if (!isNaN(valorCelda3)) {
          totalCantidad += valorCelda3;
          celdas[celdas.length - 3].innerHTML = valorCelda3;
        }

      }

      const subtotal = document.createElement("tr");
      subtotal.style.borderTop = "solid 1px #dee2e6";
      subtotal.innerHTML = `
        <td><b>SUBTOTAL POR PAGINA</b></td>
        <td class="text-center"><b>${totalCantidad}</b></td>
        <td class="text-end"><b>${moneda(totalPrecioU, 'Q. ')}</b></td>
        <td class="text-end"><b>${moneda(totalTotal, 'Q. ')}</b></td>
      `;
      tbody.appendChild(subtotal);

    });

  });
}

function pagination(pages) {
  pages.forEach((page, index) => {
    const footer2 = document.createElement("footer");
    if ((index + 1) === pages.length) {
      footer2.style.position = "absolute";
      footer2.style.marginTop = `${pages.length - 1}${op.cambiaria ? '72' : '77'}vh`;
    }
    footer2.innerHTML = `
    <div class="row">
      ${op.cambiaria ? `
      <div class="col-12">
        <div class="table-responsive" style="margin: 0 200px;">
          <h6 class="text-center">Complemento Factura Cambiaria</h6>
          <table class="table border border-top-0 mb-0">
            <thead>
              <tr>
                <td style="background: #000; color: #fff;"><b>No. Abono</b></td>
                <td style="background: #000; color: #fff;"><b>Fecha Abono</b></td>
                <td style="background: #000; color: #fff;" class="col-2 text-end"><strong>Monto</strong></td>
              </tr>
            </thead>
            <tbody id="abonos">
              <tr>
                <td>1</td>
                <td>${formatoFecha(op.abonos[0].fecha, 'DD/MM/YYYY')}</td>
                <td class="col-2 text-end">${moneda(op.abonos[0].monto, 'Q. ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
        ` : ``}
      <div class="col-12">
        <div class="table-responsive">
          <table class="table border border-top-0 mb-0">
            <tbody>
              <tr class="bg-light">
                <th style="width: 70%;"></th>
                <th style="width: 8%;" class="text-center"></th>
                <th style="width: 8%;" class="text-end">IMPUESTO</th>
                ${op.descuento ? `
                  <th style="width: 8%;" class="text-end"></th>
                  <th style="width: 8%;" class="text-end"></th>` :
                  ''}
                <th style="width: 8%;" class="text-end">${moneda(op.impuesto, 'Q. ')}</th>
              </tr>
              <tr class="bg-light">
                <th style="width: 70%;"></th>
                <th style="width: 8%;" class="text-center"></th>
                <th style="width: 8%;" class="text-end">TOTAL</th>
                ${op.descuento ? `
                  <th style="width: 8%;" class="text-end"></th>
                  <th style="width: 8%;" class="text-end"></th>` :
                  ''}
                <th style="width: 8%;" class="text-end">${moneda(op.total, 'Q. ')}</th>
              </tr>
              <tr class="bg-light">
                <td colspan="${op.descuento ? 6 : 4}"><b>TOTAL EN LETRAS:</b> ${letrasMoneda(op.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-6 text-start">
        <br>
        <p>
          SERIE FEL: ${op.fel_serie} <br>
          NUMERO FEL: ${op.fel_numero} <br>
          AUTORIZACION FEL: ${op.fel_autorizacion} <br>
          SUJETO A PAGOS TRIMESTRALES ISR <br>
          CERTIFICADOR: DIGIFACT SERVICIOS, S. A. (77454820)
        </p>
      </div>
      <div class="col-6 text-end">
        <br>
        <img src="${`https://felgtaws.digifact.com.gt/QRService/api/QR?data=https://felpub.c.sat.gob.gt/verificador-web/publico/vistas/verificacionDte.jsf?DATA=tipo=autorizacion|numero=${op.fel_autorizacion}|emisor=${emp.nit}|receptor=${op.cliente.nit}|monto=${op.total}&size=100x100`}" style="width: 100px;">
      </div>
      <div class="col-12 text-center">
        Página <span class="page-number">${index + 1} de ${pages.length}</span>
      </div>
    </div>`;
    page.appendChild(footer2);
  });
}

function moneda(valor, simbolo) {
  valor = parseFloat(valor)
  let text = valor.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  text = text.replace('$', simbolo)
  return text;
}

function formatoFecha(date, format = 'DD/MM/YYYY') {
  return moment(date).format(format)
}

function letrasMoneda(number) {
  number = numeroALetrasMoneda(number);
  number = number.replaceAll('UNO QUETZALES', 'UN QUETZALES');
  number = number.replaceAll('UNO MIL', 'UN MIL');
  number = number.replaceAll('UNO CENTAVOS', 'UN CENTAVOS');
  return number;
}

window.onload = async function () {
  $("#tb").hide();

  let lineas = 22;
  data.sort((a, b) => a.descripcion - b.descripcion);
  for (let i = 0; i < data.length; i++) {

    if (data[i].descripcion.length > 100) {
      lineas--;
      // data[i].descripcion = `${data[i].descripcion}<br><br>`
    }
    if (data[i].descripcion.length > 200) {
      lineas--;
    }
    if (data[i].descripcion.length > 300) {
      lineas--;
    }

    if (i % lineas <= 0) {
      createElementHeader(i);
      createElementTables(i);
      window.tbodysid = "tb-" + i;
      if (i > 0) {
        lineas += 22;
      }
    }

    createElementTBodys(data[i]);

  }
  let pages = document.querySelectorAll(".page");
  sumarFilas(pages);
  pagination(pages);
}

window.onafterprint = async () => window.close();

setTimeout(() => {
  window.print();
}, 1000);