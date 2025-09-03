import fl from '../../../middleware/filtros.js';
import fs from 'fs';
import resp from '../../../middleware/resp.js';
import jwt from 'jsonwebtoken';
import Proveedor from '../../personal/proveedores/proveedores.model.js';
import Usuario from '../../seguridad/usuarios/usuarios.model.js';
import Bodega from '../../ubicaciones/bodegas/bodegas.model.js';
import Sucursal from '../../ubicaciones/sucursales/sucursales.model.js';
import Documento from '../documentos/documentos.model.js';
import TipoDocumento from '../tipos_documentos/tipos_documentos.model.js';
import NCProveedor from './nc_proveedores.model.js';
import key from '../../../middleware/key.js';
import Empresa from '../../empresas/empresas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Saldo from '../saldos/saldos.model.js';
import { Op } from 'sequelize';
import moment from 'moment';

let getAllNCProveedores = async (req, res) => {
  try {
    let token = req.headers.authorization;
    let data = jwt.decode(token, key);
    if (data.data.rol_id !== 1) {
      if (!req.query.usuario_id) {
        req.query.usuario_id = data.data.usuario_id;
      }
    }

    let where = fl(req.query, 'eq');
    if (req.params.fecha_inicio != 'null' && req.params.fecha_fin != 'null') {
      where.fecha = {
        [Op.between]: [
          moment(req.params.fecha_inicio).format('YYYY-MM-DD HH:mm'),
          moment(req.params.fecha_fin).format('YYYY-MM-DD HH:mm')
        ]
      }
    }
    let nc_proveedores = await NCProveedor.findAll({
      where: where,
      include: [
        {
          model: Documento, as: 'documento',
          include: [
            {
              model: TipoDocumento, as: 'tipo_documento',
            },
            {
              model: Usuario, as: 'usuario',
              attributes: ['id', 'nombre', 'apellido']
            },
          ]
        },
        {
          model: Proveedor, as: 'proveedor',
        },
        {
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: Moneda, as: 'moneda',
        },
        {
          model: Usuario, as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
        }
      ]
    });
    await resp.success({ mensaje: 'Notas Creditos encontradas', data: nc_proveedores }, req, res, 'NCProveedor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getNCProveedorDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let nc_proveedor = await NCProveedor.findOne({
      where: { id: req.params.nc_proveedor_id },
      include: [
        {
          model: Proveedor, as: 'proveedor',
        },
        {
          model: Sucursal, as: 'sucursal',
        },
        {
          model: Bodega, as: 'bodega',
        },
        {
          model: Moneda, as: 'moneda',
        },
        {
          model: Saldo, as: 'saldos',
          limit: 1,
          order: [['id', 'DESC']],
        }
      ]
    });
    let file = fs.readFileSync(`./templates/nc_proveedor.html`, 'utf8');

    file = file.replace('___nc_proveedor', JSON.stringify(nc_proveedor));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneNCProveedor = async (req, res) => {
  try {
    let nc_proveedor = await NCProveedor.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Credito encontrada', data: nc_proveedor }, req, res, 'NCProveedor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createNCProveedor = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
    req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');

    let nc_proveedor = await NCProveedor.create(req.body);
    nc_proveedor.id = nc_proveedor.null;
    if (nc_proveedor) {

      let saldos = req.body.saldos;

      // Saldos 
      let acumulado = 0;
      let acum = await Saldo.findOne({
        where: { proveedor_id: req.body.proveedor_id },
        limit: 1,
        order: [['id', 'DESC']]
      });
      if (acum && acum.saldo_acumulado) {
        acumulado = parseFloat(acum.saldo_acumulado);
      }
      saldos.forEach(async p => {
        acumulado = parseFloat(acumulado) - parseFloat(p.total);
        p.fecha = nc_proveedor.fecha;
        p.tipo = 'abono';
        p.saldo_acumulado = acumulado
        p.proveedor_id = req.body.proveedor_id;
        p.nc_proveedor_id = nc_proveedor.id;
        await Saldo.create(p);
      });

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

    }
    await resp.success({ mensaje: 'Nota Credito agregada', data: nc_proveedor }, req, res, 'NCProveedor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateNCProveedor = async (req, res) => {
  try {
    let nc_proveedor = await NCProveedor.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Credito actualizada', data: nc_proveedor }, req, res, 'NCProveedor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularNCProveedor = async (req, res) => {
  try {
    let nc_proveedor = await NCProveedor.update(req.body, { where: { id: req.params.id } });

    // Saldos
    let acumulado = 0;
    let acum = await Saldo.findOne({
      where: { proveedor_id: req.body.proveedor_id },
      limit: 1,
      order: [['id', 'DESC']]
    });
    if (acum && acum.saldo_acumulado) {
      acumulado = parseFloat(acum.saldo_acumulado);
    }

    let saldos = await Saldo.findAll({ where: { nc_proveedor_id: req.params.id } });
    saldos.forEach(async s => {
      acumulado = parseFloat(acumulado) + parseFloat(s.total);
      await Saldo.create({
        saldo_inicial: s.saldo_final,
        tipo: 'cargo',
        total: s.total,
        saldo_final: parseFloat(s.saldo_final) + parseFloat(s.total),
        saldo_acumulado: acumulado,
        estado: 'ANULADA',
        proveedor_id: s.proveedor_id,
        compra_id: s.compra_id,
        nc_proveedor_id: s.nc_proveedor_id
      });
    })

    await resp.success({ mensaje: 'Nota Credito anulada', data: nc_proveedor }, req, res, '');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteNCProveedor = async (req, res) => {
  try {
    let nc_proveedor = await NCProveedor.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Credito eliminada', data: nc_proveedor }, req, res, 'NCProveedor');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllNCProveedores,
  getOneNCProveedor,
  createNCProveedor,
  updateNCProveedor,
  anularNCProveedor,
  deleteNCProveedor,
  getNCProveedorDoc
}

function getNextCorrelativo(correlativo) {
  let res = '';
  let oldC = correlativo;
  let newC = parseInt(correlativo) + 1;
  for (let i = 0; i < (oldC.length - newC.toString().length); i++) {
    res += '0';
  }
  res += newC.toString();
  return res;
}