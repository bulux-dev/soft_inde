import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import CajaChica from './cajas_chicas.model.js';
import Cheque from '../../finanzas/cheques/cheques.model.js';
import NotaDebito from '../../finanzas/notas_debitos/notas_debitos.model.js';
import Compra from '../../facturacion/compras/compras.model.js';
import Documento from '../../facturacion/documentos/documentos.model.js';
import TipoDocumento from '../../facturacion/tipos_documentos/tipos_documentos.model.js';

let getAllCajasChicas = async (req, res) => {
  try {
    let where = fl(req.query);
    let caja_chica = await CajaChica.findAll({
      where: where
    });

    await resp.success({ mensaje: 'Cajas Chicas encontradas', data: caja_chica }, req, res, 'Caja Chica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneCajaChica = async (req, res) => {
  try {
    let caja_chica = await CajaChica.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Cheque, as: 'cheques', where: { estado: 'VIGENTE' }, required: false,
          include: [
            { model: Documento, as: 'documento', include: [{ model: TipoDocumento, as: 'tipo_documento' }] },
          ]
        },
        {
          model: NotaDebito, as: 'notas_debitos', where: { estado: 'VIGENTE' }, required: false,
          include: [
            { model: Documento, as: 'documento', include: [{ model: TipoDocumento, as: 'tipo_documento' }] },
          ]
        },
        {
          model: Compra, as: 'compras', where: { estado: 'VIGENTE' }, required: false,
          include: [
            { model: Documento, as: 'documento', include: [{ model: TipoDocumento, as: 'tipo_documento' }] },
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Cajas Chicas encontrada', data: caja_chica }, req, res, 'Caja Chica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createCajaChica = async (req, res) => {
  try {
    let caja_chica = await CajaChica.create(req.body);
    await resp.success({ mensaje: 'Caja Chica agregada', data: caja_chica }, req, res, 'Caja Chica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCajaChica = async (req, res) => {
  try {
    let caja_chica = await CajaChica.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Caja Chica actualizada', data: caja_chica }, req, res, 'Caja Chica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteCajaChica = async (req, res) => {
  try {
    let caja_chica = await CajaChica.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Caja Chica eliminada', data: caja_chica }, req, res, 'Caja Chica');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllCajasChicas,
  getOneCajaChica,
  createCajaChica,
  updateCajaChica,
  deleteCajaChica
}