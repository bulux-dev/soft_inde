import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Atributo from '../atributos/atributos.model.js';
import Medida from '../medidas/medidas.model.js';
import Producto from '../productos/productos.model.js';
import ProductoAtributo from '../productos_atributos/productos_atributos.model.js';
import Termino from '../terminos/terminos.model.js';
import TipoProducto from '../tipos_productos/tipos_productos.model.js';
import Valor from '../valores/valores.model.js';
import VariacionDetalle from '../variaciones_detalles/variaciones_detalles.model.js';
import Variacion from './variaciones.model.js';
import Lote from '../lotes/lotes.model.js';

let getAllVariaciones = async (req, res) => {
  try {
    let variaciones = await Variacion.findAll({
      where: {
        producto_id: req.query.producto_id
      },
      include: [
        {
          model: Producto, as: 'producto',
          include: [
            {
              model: TipoProducto, as: 'tipo_producto'
            },
            {
              model: Medida, as: 'medida'
            },
            {
              model: Lote, as: 'lotes',
            }
          ]
        },
        {
          model: VariacionDetalle, as: 'variaciones_detalles',
          include: [
            {
              model: Atributo, as: 'atributo'
            },
            {
              model: Termino, as: 'termino',
              include: [
                { model: Valor, as: 'valor' }
              ]
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Variaciones encontradas', data: variaciones }, req, res, 'Variacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneVariacion = async (req, res) => {
  try {
    let variacion = await Variacion.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: VariacionDetalle, as: 'variaciones_detalles',
          include: [
            {
              model: Atributo, as: 'atributo'
            },
            {
              model: Termino, as: 'termino',
              include: [
                { model: Valor, as: 'valor' }
              ]
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Variacion encontrada', data: variacion }, req, res, 'Variacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createVariacion = async (req, res) => {
  try {
    let variacion = await Variacion.create(req.body);
    variacion.id = variacion.null;
    if (variacion) {

      let variaciones_detalles = req.body.variaciones_detalles;

      for (let i = 0; i < variaciones_detalles.length; i++) {
        let d = variaciones_detalles[i];

        d.variacion_id = variacion.id
        await VariacionDetalle.create(d)
      }
    }
    await resp.success({ mensaje: 'Variacion agregada', data: variacion }, req, res, 'Variacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createVariacionCombinaciones = async (req, res) => {
  try {
    let productos_atributos = await ProductoAtributo.findAll({
      where: { producto_id: req.body.producto_id },
      include: [
        {
          model: Termino, as: 'terminos',
        },
        {
          model: Atributo, as: 'atributo'
        }
      ]
    });

    productos_atributos = JSON.parse(JSON.stringify(productos_atributos));
    let comb = combinaciones(productos_atributos);

    for (let c = 0; c < comb.length; c++) {

      let variacion = await Variacion.create({ producto_id: req.body.producto_id });
      variacion.id = variacion.null;

      let variaciones_detalles = comb[c];
      for (let d = 0; d < variaciones_detalles.length; d++) {
        variaciones_detalles[d].variacion_id = variacion.id
        variaciones_detalles[d].atributo_id = variaciones_detalles[d].atributo_id
        variaciones_detalles[d].termino_id = variaciones_detalles[d].termino_id
        await VariacionDetalle.create(variaciones_detalles[d])
      }
    }

    resp.success({ mensaje: 'Combinaciones generadas', data: comb }, req, res, 'Variacion');

  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateVariacion = async (req, res) => {
  try {
    Object.keys(req.body).forEach(key => {
      !req.body[key] ? req.body[key] = null : null;
    });
    let variacion = await Variacion.update(req.body, { where: { id: req.params.id } });
    await resp.success({ mensaje: 'Variacion actualizada', data: variacion }, req, res, 'Variacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteVariacion = async (req, res) => {
  try {
    let variacion = await Variacion.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Variacion eliminada', data: variacion }, req, res, 'Variacion');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  getAllVariaciones,
  getOneVariacion,
  createVariacion,
  createVariacionCombinaciones,
  updateVariacion,
  deleteVariacion
}

function combinaciones(data) {
  let combinaciones = [];
  function cartesianProduct(arr) {
    return arr.reduce((a, b) => {
      return a.flatMap(d => {
        return b.map(e => {
          return [...d, e];
        });
      });
    }, [[]]);
  }

  let terminosArrays = data.map(productoAtributo => productoAtributo.terminos.map(termino => {
    return { termino_id: termino.id, atributo_id: productoAtributo.atributo_id };
  }));
  let allCombinations = cartesianProduct(terminosArrays);

  combinaciones = allCombinations.map(combination => {
    return combination.map(({ termino_id, atributo_id }) => {
      return { termino_id, atributo_id };
    });
  });

  return combinaciones;
}