import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import TipoDocumento from './tipos_documentos.model.js';

let getAllTiposDocumentos = async (req, res) => {
  try {
    let where = fl(req.query);
    let tipos_documentos = await TipoDocumento.findAll({
      where: where,
    });
    await resp.success({ mensaje: 'Tipos de Documentos encontrados', data: tipos_documentos }, req, res, 'Tipo Documento');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneTipoDocumento = async (req, res) => {
  try {
    let tipo_documento = await TipoDocumento.findOne({
      where: { id: req.params.id },
    });
    await resp.success({ mensaje: 'TipoDocumento encontrado', data: tipo_documento }, req, res, 'Tipo Documento');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createTipoDocumento = async (req, res) => {
  try {
    let tipo_documento = await TipoDocumento.findOne({ where: { nombre: req.body.nombre } });
    if (tipo_documento) {
      return resp.error('TipoDocumento ya existente', req, res, 'TipoDocumento');
    } else {
      let tipo_documento = await TipoDocumento.create(req.body);
      await resp.success({ mensaje: 'Tipo Documento agregado', data: tipo_documento }, req, res, 'Tipo Documento'); 
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateTipoDocumento = async (req, res) => {
  try {
    let tipo_documento = await TipoDocumento.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Tipo Documento actualizado', data: tipo_documento }, req, res, 'Tipo Documento');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteTipoDocumento = async (req, res) => {
  try {
    let tipo_documento = await TipoDocumento.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Tipo Documento eliminado', data: tipo_documento }, req, res, 'Tipo Documento');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllTiposDocumentos,
  getOneTipoDocumento,
  createTipoDocumento,
  updateTipoDocumento,
  deleteTipoDocumento
}