import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import TipoDocumento from '../tipos_documentos/tipos_documentos.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Documento from './documentos.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';

let getAllDocumentos = async (req, res) => {
  try {
    let where = fl(req.query, 'eq');
    let documentos = await Documento.findAll({
      where: where,
      include: [
        {
          model: TipoDocumento, as: 'tipo_documento',
        },
        {
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: Usuario, as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });
    await resp.success({ mensaje: 'Documentos encontrados', data: documentos }, req, res, 'Documento');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneDocumento = async (req, res) => {
  try {
    let documento = await Documento.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: TipoDocumento, as: 'tipo_documento',
        },
        {
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: Usuario, as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });
    await resp.success({ mensaje: 'Documento encontrado', data: documento }, req, res, 'Documento');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createDocumento = async (req, res) => {
  try {
    let documento = await Documento.create(req.body);
    await resp.success({ mensaje: 'Documento agregado', data: documento }, req, res, 'Documento');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateDocumento = async (req, res) => {
  try {
    let documento = await Documento.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Documento actualizado', data: documento }, req, res, 'Documento');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteDocumento = async (req, res) => {
  try {
    let documento = await Documento.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Documento eliminado', data: documento }, req, res, 'Documento');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllDocumentos,
  getOneDocumento,
  createDocumento,
  updateDocumento,
  deleteDocumento
}