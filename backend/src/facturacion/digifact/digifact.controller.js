import moment from 'moment';
import resp from '../../../middleware/resp.js';
import axios from 'axios';
import Empresa from '../../empresas/empresas.model.js';

let url_test = `https://felgttestaws.digifact.com.gt/gt.com.fel.api.v3/api`;
let url_prod = `https://felgtaws.digifact.com.gt/gt.com.fel.api.v3/api`;

let getToken = async (req, res) => {
  try {
    let empresa = await Empresa.findOne({ where: { slug: process.env.DATABASE } });
    let url = empresa.usuario_fact == 'Kairossoft_test' ? url_test : url_prod;
    let path = `${url}/login/get_token`;

    let response = await axios.post(path, {
      Username: `GT.${empresa.nit_fact}.${empresa.usuario_fact}`,
      Password: empresa.clave_fact
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.Token) {
      await Empresa.update({ token_fact: response.data.Token }, { where: { slug: process.env.DATABASE } });
    }
    await resp.success({ mensaje: 'Registro encontrado', data: response.data }, req, res, 'Digifact');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getInfoNit = async (req, res) => {
  try {
    let empresa = await Empresa.findOne({ where: { slug: process.env.DATABASE } });

    let url = empresa.usuario_fact == 'Kairossoft_test' ? url_test : url_prod;
    let path = `${url}/sharedInfo?NIT=${empresa.nit_fact}&DATA1=SHARED_GETINFONITcom&DATA2=NIT|${req.params.nit}&USERNAME=${empresa.usuario_fact}`;

    let response = await axios.get(path, {
      headers: {
        'Authorization': empresa.token_fact
      },
    });
    await resp.success({ mensaje: 'Registro encontrado', data: response.data }, req, res, 'Digifact');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getInfoDte = async (req, res) => {
  try {
    let empresa = await Empresa.findOne({ where: { slug: process.env.DATABASE } });

    let url = empresa.usuario_fact == 'Kairossoft_test' ? url_test : url_prod;
    let path = `${url}/sharedInfo?NIT=${empresa.nit_fact}&DATA1=SHARED_GETREPORTDAILYFELALL&DATA2=FECHA|${req.params.fecha}|ESTABLECIMIENTO|01|AUTHNUMBER||TIPO|&USERNAME=${empresa.usuario_fact}`;

    let response = await axios.get(path, {
      headers: {
        'Authorization': empresa.token_fact
      },
    });
    await resp.success({ mensaje: 'Registro encontrado', data: response.data }, req, res, 'Digifact');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let certificacionFel = async (req, res) => {
  try {

    let empresa = await Empresa.findOne({ where: { slug: process.env.DATABASE } });

    let url = empresa.usuario_fact == 'Kairossoft_test' ? url_test : url_prod;
    let path = `${url}/FelRequest?NIT=${empresa.nit_fact}&TIPO=CERTIFICATE_DTE_XML_TOSIGN&FORMAT=XML`;
        
    let response = await axios.post(path, certifiacionXML(req.body, empresa), {
      headers: {
        'Authorization': empresa.token_fact
      }
    });
    req.params = certifiacionXML(req.body, empresa);
    await resp.success({ mensaje: 'Registro encontrado', data: response.data }, req, res, 'Digifact');
  } catch (err) {
    console.log(err);
    
    await resp.error(err.response.data, req, res);
  }
}

let anulacionFel = async (req, res) => {
  try {

    let empresa = await Empresa.findOne({ where: { slug: process.env.DATABASE } });

    let url = empresa.usuario_fact == 'Kairossoft_test' ? url_test : url_prod;
    let path = `${url}/FelRequest?NIT=${empresa.nit_fact}&TIPO=ANULAR_FEL_TOSIGN&FORMAT=XML`;

    let response = await axios.post(path, anulacionXML(req.body, empresa), {
      headers: {
        'Authorization': empresa.token_fact
      }
    });
    req.params = anulacionXML(req.body, empresa);
    await resp.success({ mensaje: 'Registro encontrado', data: response.data }, req, res, 'Digifact');
  } catch (err) {
    await resp.error(err.response.data, req, res);
  }
}

export default {
  getToken,
  getInfoNit,
  getInfoDte,
  certificacionFel,
  anulacionFel
}

function certifiacionXML(venta, empresa) {
  let tipo_factura = 'FACT';

  let complementos = '';
  let abonos = '';
  let ventas_detalles = '';
  for (let i = 0; i < venta.ventas_detalles.length; i++) {
    let d = venta.ventas_detalles[i];

    d.descripcion = d.descripcion.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

    let tipo = 'B';
    if (d.producto.tipo_producto_id == 2) {
      tipo = 'S';
    }
    ventas_detalles += `<dte:Item BienOServicio="${tipo}" NumeroLinea="${i + 1}">
        <dte:Cantidad>${d.cantidad}</dte:Cantidad>
        <dte:UnidadMedida>UNI</dte:UnidadMedida>
        <dte:Descripcion>${d.descripcion}</dte:Descripcion>
        <dte:PrecioUnitario>${decimal(d.precio_unitario)}</dte:PrecioUnitario>
        <dte:Precio>${decimal(d.precio)}</dte:Precio>
        <dte:Descuento>${decimal(d.descuento)}</dte:Descuento>
        <dte:Impuestos>
            <dte:Impuesto>
                <dte:NombreCorto>IVA</dte:NombreCorto>
                <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                <dte:MontoGravable>${decimal(d.subtotal)}</dte:MontoGravable>
                <dte:MontoImpuesto>${decimal(d.impuesto)}</dte:MontoImpuesto>
            </dte:Impuesto>
        </dte:Impuestos>
        <dte:Total>${decimal(d.total)}</dte:Total>
    </dte:Item>`;
  }

  if (venta.documento.cambiaria) {
    tipo_factura = 'FCAM';

    for (let a = 0; a < venta.abonos.length; a++) {
      abonos += `<cfc:Abono>
          <cfc:NumeroAbono>${a + 1}</cfc:NumeroAbono>
          <cfc:FechaVencimiento>${venta.abonos[a].fecha}</cfc:FechaVencimiento>
          <cfc:MontoAbono>${venta.abonos[a].monto}</cfc:MontoAbono>
      </cfc:Abono>`
    }

    complementos = `<dte:Complementos>
      <dte:Complemento xmlns:cfc="http://www.sat.gob.gt/dte/fel/CompCambiaria/0.1.0" URIComplemento="dtecamb" NombreComplemento="FCAMB" IDComplemento="ID">
        <cfc:AbonosFacturaCambiaria Version="1">
          ${abonos}
        </cfc:AbonosFacturaCambiaria>
      </dte:Complemento>
  </dte:Complementos>`;
  }

  venta.cliente.nombre = venta.cliente.nombre.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

  let doc = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <dte:GTDocumento xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0" Version="0.1">
      <dte:SAT ClaseDocumento="dte">
          <dte:DTE ID="DatosCertificados">
              <dte:DatosEmision ID="DatosEmision">
                  <dte:DatosGenerales CodigoMoneda="GTQ" FechaHoraEmision="${moment(venta.fecha).format('YYYY-MM-DDTHH:mm:ss')}" Tipo="${tipo_factura}" />
                  <dte:Emisor NITEmisor="${empresa.nit}" NombreEmisor="${empresa.razon_social}" CodigoEstablecimiento="1" NombreComercial="${empresa.nombre}" AfiliacionIVA="GEN">
                      <dte:DireccionEmisor>
                          <dte:Direccion>${empresa.direccion}</dte:Direccion>
                          <dte:CodigoPostal>0</dte:CodigoPostal>
                          <dte:Municipio>GUATEMALA</dte:Municipio>
                          <dte:Departamento>GUATEMALA</dte:Departamento>
                          <dte:Pais>GT</dte:Pais>
                      </dte:DireccionEmisor>
                  </dte:Emisor>
                  <dte:Receptor CorreoReceptor="" IDReceptor="${venta.cliente.nit}" NombreReceptor="${venta.cliente.nombre}">
                      <dte:DireccionReceptor>
                          <dte:Direccion>${venta.cliente.direccion}</dte:Direccion>
                          <dte:CodigoPostal>0</dte:CodigoPostal>
                          <dte:Municipio />
                          <dte:Departamento />
                          <dte:Pais>GT</dte:Pais>
                      </dte:DireccionReceptor>
                  </dte:Receptor>
                  <dte:Frases>
                      <dte:Frase TipoFrase="1" CodigoEscenario="1"/>
                  </dte:Frases>
                  <dte:Items>
                      ${ventas_detalles}
                  </dte:Items>
                  <dte:Totales>
                      <dte:TotalImpuestos>
                          <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="${decimal(venta.impuesto)}" />
                      </dte:TotalImpuestos>
                      <dte:GranTotal>${decimal(venta.total)}</dte:GranTotal>
                  </dte:Totales>
                  ${complementos}
              </dte:DatosEmision>
          </dte:DTE>
          <dte:Adenda>
            <dtecomm:Informacion_COMERCIAL xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xmlns:dtecomm="https://www.digifact.com.gt/dtecomm" xsi:schemaLocation="https://www.digifact.com.gt/dtecomm">
                <dtecomm:InformacionAdicional Version="7.1234654163">
                    <dtecomm:REFERENCIA_INTERNA>${venta.cliente.nit}-${moment(venta.fecha).unix()}</dtecomm:REFERENCIA_INTERNA>
                    <dtecomm:FECHA_REFERENCIA>${moment(venta.fecha).format('YYYY-MM-DDTHH:mm:ss')}</dtecomm:FECHA_REFERENCIA>
                    <dtecomm:VALIDAR_REFERENCIA_INTERNA>VALIDAR</dtecomm:VALIDAR_REFERENCIA_INTERNA>
                </dtecomm:InformacionAdicional>
            </dtecomm:Informacion_COMERCIAL>
          </dte:Adenda>
      </dte:SAT>
  </dte:GTDocumento>`

  return doc;
}

function anulacionXML(venta, empresa) {
  let doc = `<?xml version="1.0" encoding="UTF-8"?>
  <dte:GTAnulacionDocumento xmlns:dte="http://www.sat.gob.gt/dte/fel/0.1.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="0.1">
    <dte:SAT>
      <dte:AnulacionDTE ID="DatosCertificados">
        <dte:DatosGenerales ID="DatosAnulacion" NumeroDocumentoAAnular="${venta.fel_autorizacion}"
          NITEmisor="${empresa.nit}" IDReceptor="${venta.cliente.nit}" FechaEmisionDocumentoAnular="${moment(venta.fecha).format('YYYY-MM-DDTHH:mm:ss')}"
          FechaHoraAnulacion="${moment(venta.fecha_anulacion).format('YYYY-MM-DDTHH:mm:ss')}" MotivoAnulacion="${venta.motivo_anulacion}" />
      </dte:AnulacionDTE>
    </dte:SAT>
  </dte:GTAnulacionDocumento>`

  return doc;
}

function decimal(number) {
  return parseFloat(number).toFixed(6)
}