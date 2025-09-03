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
import NDProveedor from './nd_proveedores.model.js';
import key from '../../../middleware/key.js';
import Empresa from '../../empresas/empresas.model.js';
import Moneda from '../monedas/monedas.model.js';
import Saldo from '../saldos/saldos.model.js';
import { Op } from 'sequelize';
import moment from 'moment';

let getAllNDProveedores = async (req, res) => {
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
    let nd_proveedores = await NDProveedor.findAll({
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
    await resp.success({ mensaje: 'Notas Debitos encontradas', data: nd_proveedores }, req, res, 'Nota Debito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getNDProveedorDoc = async (req, res) => {
  try {
    let token = req.query.token;
    let data = jwt.decode(token, key);
    let empresa = await Empresa.findOne({ where: { id: data.data.empresa_id } });
    let nd_proveedor = await NDProveedor.findOne({
      where: { id: req.params.nd_proveedor_id },
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
    let file = fs.readFileSync(`./templates/nd_proveedor.html`, 'utf8');

    file = file.replace('___nd_proveedor', JSON.stringify(nd_proveedor));
    file = file.replace('___empresa', JSON.stringify(empresa));
    file = file.replace('___token', JSON.stringify(req.query.token));
    res.send(file);
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneNDProveedor = async (req, res) => {
  try {
    let nd_proveedor = await NDProveedor.findOne({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Debito encontrada', data: nd_proveedor }, req, res, 'Nota Debito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createNDProveedor = async (req, res) => {
  try {

    let documento = await Documento.findOne({ where: { id: req.body.documento_id } });
    req.body.serie = documento.serie;
    req.body.correlativo = documento.correlativo
		req.body.fecha = moment(req.body.fecha).format('YYYY-MM-DD HH:mm');
    
    let nd_proveedor = await NDProveedor.create(req.body);
    nd_proveedor.id = nd_proveedor.null;
    if (nd_proveedor) {

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
        acumulado = parseFloat(acumulado) + parseFloat(p.total);
        p.fecha = nd_proveedor.fecha;
        p.tipo = 'abono';
        p.saldo_acumulado = acumulado
        p.proveedor_id = req.body.proveedor_id;
        p.nd_proveedor_id = nd_proveedor.id;
        await Saldo.create(p);
      });

      // Incrementar correlativo de documento
      documento.correlativo = getNextCorrelativo(documento.correlativo)
      await Documento.update({
        correlativo: documento.correlativo
      }, { where: { id: documento.id } });

    }
    await resp.success({ mensaje: 'Nota Debito agregada', data: nd_proveedor }, req, res, 'Nota Debito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateNDProveedor = async (req, res) => {
  try {
    let nd_proveedor = await NDProveedor.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Debito actualizado', data: nd_proveedor }, req, res, 'Nota Debito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let anularNDProveedor = async (req, res) => {
  try {
    let nd_proveedor = await NDProveedor.update(req.body, { where: { id: req.params.id } });

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

    let saldos = await Saldo.findAll({ where: { nd_proveedor_id: req.params.id } });
    saldos.forEach(async s => {
      acumulado = parseFloat(acumulado) - parseFloat(s.total);
      await Saldo.create({
        saldo_inicial: s.saldo_final,
        tipo: 'cargo',
        total: s.total,
        saldo_final: parseFloat(s.saldo_final) - parseFloat(s.total),
        saldo_acumulado: acumulado,
        estado: 'ANULADA',
        proveedor_id: s.proveedor_id,
        compra_id: s.compra_id,
        nd_proveedor_id: s.nd_proveedor_id
      });
    })

    await resp.success({ mensaje: 'Nota Debito anulada', data: nd_proveedor }, req, res, 'Nota Debito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteNDProveedor = async (req, res) => {
  try {
    let nd_proveedor = await NDProveedor.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Nota Debito eliminada', data: nd_proveedor }, req, res, 'Nota Debito');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllNDProveedores,
  getOneNDProveedor,
  createNDProveedor,
  updateNDProveedor,
  anularNDProveedor,
  deleteNDProveedor,
  getNDProveedorDoc
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