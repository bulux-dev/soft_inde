import moment from 'moment';
import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Partida from '../partidas/partidas.model.js';
import PartidaDetalle from '../partidas_detalles/partidas_detalles.model.js';
import { Op } from 'sequelize';
import CuentaContable from '../cuentas_contables/cuentas_contables.model.js';
import CentroCosto from '../centros_costos/centros_costos.model.js';
import Rubro from '../rubros/rubros.model.js';

let getAllPartidas = async (req, res) => {
  try {
    let where = fl(req.query);
    let partidas = await Partida.findAll({
      where: where
    });
    await resp.success({ mensaje: 'Partidas encontradas', data: partidas }, req, res, 'Partida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOnePartida = async (req, res) => {
  try {
    let partida = await Partida.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: PartidaDetalle, as: 'partidas_detalles',
          include: [
            {
              model: CuentaContable, as: 'cuenta_contable'
            },
            {
              model: CentroCosto, as: 'centro_costo'
            },
            {
              model: Rubro, as: 'rubro'
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Partida encontrada', data: partida }, req, res, 'Partida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createPartida = async (req, res) => {
  try {
    let fecha_inicio = moment(req.body.fecha).startOf('month').format('YYYY-MM-DD HH:mm');
    let fecha_fin = moment(req.body.fecha).endOf('month').format('YYYY-MM-DD HH:mm');

    let ultima_partida = await Partida.findOne({
      where: {
        fecha: {
          [Op.between]: [fecha_inicio, fecha_fin]
        }
      },
      order: [['numero', 'DESC']]
    });

    req.body.numero = ultima_partida ? parseInt(ultima_partida.numero) + 1 : 1;
    let partida = await Partida.create(req.body);

    let partidas_detalles = req.body.partidas_detalles;
    for (let d = 0; d < partidas_detalles.length; d++) {
      partidas_detalles[d].partida_id = partida.id;
      await PartidaDetalle.create(partidas_detalles[d]);
    }

    await resp.success({ mensaje: 'Partida agregada', data: partida }, req, res, 'Partida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updatePartida = async (req, res) => {
  try {
    let partida = await Partida.update(req.body, { where: { id: req.params.id } });

    let partidas_detalles = req.body.partidas_detalles;

    await PartidaDetalle.destroy({ where: { partida_id: req.params.id } });
    for (let d = 0; d < partidas_detalles.length; d++) {
      partidas_detalles[d].partida_id = req.params.id;
      await PartidaDetalle.create(partidas_detalles[d]);
    }

    await resp.success({ mensaje: 'Partida actualizada', data: partida }, req, res, 'Partida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deletePartida = async (req, res) => {
  try {
    let partida = await Partida.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Partida eliminada', data: partida }, req, res, 'Partida');
  } catch (err) {
    await resp.error(err, req, res);
  }
}


export default {
  getAllPartidas,
  getOnePartida,
  createPartida,
  updatePartida,
  deletePartida
}