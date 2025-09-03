import fl from '../../../middleware/filtros.js';
import resp from '../../../middleware/resp.js';
import Producto from './productos.model.js';
import ProductoCategoria from '../productos_categorias/productos_categorias.model.js';
import Categoria from '../categorias/categorias.model.js';
import ProductoMedida from '../productos_medidas/productos_medidas.model.js';
import Medida from '../medidas/medidas.model.js';
import ProductoMarca from '../productos_marcas/productos_marcas.model.js';
import ProductoAtributo from '../productos_atributos/productos_atributos.model.js';
import Marca from '../marcas/marcas.model.js';
import ProductoFoto from '../productos_fotos/productos_fotos.model.js';
import TipoProducto from '../tipos_productos/tipos_productos.model.js';
import Atributo from '../atributos/atributos.model.js';
import Valor from '../valores/valores.model.js';
import { Op, where } from 'sequelize';
import Variacion from '../variaciones/variaciones.model.js';
import Equivalencia from '../equivalencias/equivalencias.model.js';
import Receta from '../recetas/recetas.model.js';
import Lote from '../lotes/lotes.model.js';
import Impresora from '../../soporte/impresoras/impresoras.model.js';

let getAllProductos = async (req, res) => {
  try {
    let where = fl(req.query, 'substring');
    let productos = await Producto.findAll({
      where: where,
      include: [
        {
          model: TipoProducto, as: 'tipo_producto'
        },
        {
          model: Variacion, as: 'variaciones'
        },
        {
          model: Medida, as: 'medida'
        },
        {
          model: Lote, as: 'lotes',
        }
      ]
    });
    await resp.success({ mensaje: 'Productos encontrados', data: productos }, req, res, 'Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllProductosByCategoria = async (req, res) => {
  try {
    let productos = await Producto.findAll({
      include: [
        {
          model: ProductoCategoria, as: 'productos_categorias',
          where: {
            categoria_id: req.query.categoria_id
          },
          include: [
            { 
              model: Categoria, as: 'categoria'
            },
          ]
        },
        {
          model: TipoProducto, as: 'tipo_producto'
        },
        {
          model: Variacion, as: 'variaciones'
        },
        {
          model: Medida, as: 'medida'
        },
        {
          model: Lote, as: 'lotes',
        },
        {
          model: Equivalencia, as: 'equivalencias',
          include: [
            {
              model: Medida, as: 'medida'
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Productos encontrados', data: productos }, req, res, 'Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllProductosByMarca = async (req, res) => {
  try {
    let productos = await Producto.findAll({
      include: [
        {
          model: ProductoMarca, as: 'productos_marcas',
          where: {
            marca_id: req.query.marca_id
          }
        },
        {
          model: TipoProducto, as: 'tipo_producto'
        },
        {
          model: Variacion, as: 'variaciones'
        },
        {
          model: Medida, as: 'medida'
        },
        {
          model: Lote, as: 'lotes',
        },
        {
          model: Equivalencia, as: 'equivalencias',
          include: [
            {
              model: Medida, as: 'medida'
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Productos encontrados', data: productos }, req, res, 'Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getAllProductosByMedida = async (req, res) => {
  try {
    let productos = await Producto.findAll({
      where: {
        medida_id: req.query.medida_id
      },
      include: [
        {
          model: TipoProducto, as: 'tipo_producto'
        },
        {
          model: Variacion, as: 'variaciones'
        },
        {
          model: Medida, as: 'medida'
        },
        {
          model: Lote, as: 'lotes',
        },
        {
          model: Equivalencia, as: 'equivalencias',
          include: [
            {
              model: Medida, as: 'medida'
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Productos encontrados', data: productos }, req, res, 'Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let searchProductoBySKU = async (req, res) => {
  try {
    let producto = await Producto.findOne({
      where: { sku: req.body.sku },
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: TipoProducto, as: 'tipo_producto'
        },
        {
          model: Variacion, as: 'variaciones'
        },
        {
          model: Lote, as: 'lotes',
        },
        {
          model: Equivalencia, as: 'equivalencias',
          include: [
            {
              model: Medida, as: 'medida'
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Producto encontrado', data: producto }, req, res, 'Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let searchProductoByNombre = async (req, res) => {
  try {
    let searchQuery = req.body.nombre.split(' ');
    let orArray = [];
    searchQuery.forEach(word => {
      orArray.push(
        {
          [Op.or]: [
            { sku: { [Op.like]: '%' + word + '%' } },
            { nombre: { [Op.like]: '%' + word + '%' } },
            { descripcion: { [Op.like]: '%' + word + '%' } }
          ]
        }
      );
    });

    let where = {
      categoria_id: req.body.categoria_id
    };
    if (req.body.categoria_id == 'null') {
      delete where.categoria_id;
    }

    let producto = await Producto.findAll({
      where: {
        [Op.and]: orArray
      },
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: TipoProducto, as: 'tipo_producto'
        },
        {
          model: Variacion, as: 'variaciones'
        },
        {
          model: ProductoCategoria, as: 'productos_categorias',
          where: where,
          required: false
        },
        {
          model: Equivalencia, as: 'equivalencias',
          include: [
            {
              model: Medida, as: 'medida'
            }
          ]
        },
        {
          model: Lote, as: 'lotes',
        }
      ]
    });
    await resp.success({ mensaje: 'Producto encontrado', data: producto }, req, res, 'Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let searchProductoByLote = async (req, res) => {
  try {
    let where = {
      categoria_id: req.body.categoria_id
    };
    if (req.body.categoria_id == 'null') {
      delete where.categoria_id;
    }

    let producto = await Producto.findAll({
      include: [
        {
          model: Medida, as: 'medida'
        },
        {
          model: TipoProducto, as: 'tipo_producto'
        },
        {
          model: Variacion, as: 'variaciones'
        },
        {
          model: ProductoCategoria, as: 'productos_categorias'
        },
        {
          model: Equivalencia, as: 'equivalencias',
          include: [
            {
              model: Medida, as: 'medida'
            }
          ]
        },
        {
          model: Lote, as: 'lotes',
          where: {
            nombre: req.body.nombre
          }
        }
      ]
    });
    await resp.success({ mensaje: 'Producto encontrado', data: producto }, req, res, 'Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let getOneProducto = async (req, res) => {
  try {
    let producto = await Producto.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: TipoProducto, as: 'tipo_producto'
        },
        {
          model: Medida, as: 'medida'
        },
        {
          model: Lote, as: 'lotes',
        },
        {
          model: ProductoCategoria, as: 'productos_categorias',
          include: [
            { model: Categoria, as: 'categoria' }
          ]
        },
        {
          model: ProductoMedida, as: 'productos_medidas',
          include: [
            { model: Medida, as: 'medida' }
          ]
        },
        {
          model: ProductoMarca, as: 'productos_marcas',
          include: [
            { model: Marca, as: 'marca' }
          ]
        },
        {
          model: ProductoAtributo, as: 'productos_atributos',
          include: [
            {
              model: Atributo, as: 'atributo',
              include: [
                { model: Valor, as: 'valores' }
              ]
            },
          ]
        },
        {
          model: ProductoFoto, as: 'productos_fotos'
        },
        {
          model: Equivalencia, as: 'equivalencias',
          include: [
            {
              model: Medida, as: 'medida'
            }
          ]
        }
      ]
    });
    await resp.success({ mensaje: 'Producto encontrado', data: producto }, req, res, 'Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let createProducto = async (req, res) => {
  try {
    req.body.nombre = req.body.nombre.trim();
    req.body.sku = req.body.sku.trim();
    let producto = await Producto.findOne({ where: { sku: req.body.sku } });
    if (producto) {
      await resp.error('El SKU ya existe', req, res);
    } else {
      let producto = await Producto.create(req.body);
      producto.id = producto.null;

      let productos_categorias = JSON.parse(JSON.stringify(req.body.productos_categorias || []));
      let productos_marcas = JSON.parse(JSON.stringify(req.body.productos_marcas || []));
      let productos_medidas = JSON.parse(JSON.stringify(req.body.productos_medidas || []));
      let productos_fotos = JSON.parse(JSON.stringify(req.body.productos_fotos || []));

      for (let p = 0; p < productos_categorias.length; p++) {
        await ProductoCategoria.create({
          categoria_id: productos_categorias[p].id,
          producto_id: producto.id
        });
      }

      for (let p = 0; p < productos_marcas.length; p++) {
        await ProductoMarca.create({
          marca_id: productos_marcas[p].id,
          producto_id: producto.id
        });
      }

      for (let p = 0; p < productos_medidas.length; p++) {
        await ProductoMedida.create({
          medida_id: productos_medidas[p].id,
          producto_id: producto.id
        });
      }

      for (let p = 0; p < productos_fotos.length; p++) {
        await ProductoFoto.create({
          foto: productos_fotos[p].foto,
          producto_id: producto.id
        });
      }

      await resp.success({ mensaje: 'Producto agregado', data: producto }, req, res, 'Producto');
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateProducto = async (req, res) => {
  try {
    req.body.nombre = req.body.nombre.trim();
    req.body.sku = req.body.sku.trim();
    let producto = await Producto.update(req.body, {
      where: { id: req.params.id }
    });
    if (producto) {

      let categorias = JSON.parse(JSON.stringify(await ProductoCategoria.findAll({ where: { producto_id: req.params.id } })))
      let marcas = JSON.parse(JSON.stringify(await ProductoMarca.findAll({ where: { producto_id: req.params.id } })));
      let medidas = JSON.parse(JSON.stringify(await ProductoMedida.findAll({ where: { producto_id: req.params.id } })));

      let productos_categorias = JSON.parse(JSON.stringify(req.body.productos_categorias));
      let productos_marcas = JSON.parse(JSON.stringify(req.body.productos_marcas));
      let productos_medidas = JSON.parse(JSON.stringify(req.body.productos_medidas));

      for (let pc = 0; pc < productos_categorias.length; pc++) {
        for (let c = 0; c < categorias.length; c++) {
          if (categorias[c].categoria_id == productos_categorias[pc].id) {
            categorias.splice(c, 1);
            productos_categorias.splice(pc, 1);
            c++;
          }
        }
      }

      for (let pm = 0; pm < productos_marcas.length; pm++) {
        for (let m = 0; m < marcas.length; m++) {
          if (marcas[m].marca_id == productos_marcas[pm].id) {
            marcas.splice(m, 1);
            productos_marcas.splice(pm, 1);
            m++;
          }
        }
      }

      for (let pm = 0; pm < productos_medidas.length; pm++) {
        for (let m = 0; m < medidas.length; m++) {
          if (medidas[m].medida_id == productos_medidas[pm].id) {
            medidas.splice(m, 1);
            productos_medidas.splice(pm, 1);
            m++;
          }
        }
      }

      for (let c = 0; c < categorias.length; c++) {
        await ProductoCategoria.destroy({ where: { id: categorias[c].id } });
      }

      for (let m = 0; m < marcas.length; m++) {
        await ProductoMarca.destroy({ where: { id: marcas[m].id } });
      }

      for (let m = 0; m < medidas.length; m++) {
        await ProductoMedida.destroy({ where: { id: medidas[m].id } });
      }

      for (let p = 0; p < productos_categorias.length; p++) {
        await ProductoCategoria.upsert({
          categoria_id: productos_categorias[p].id,
          producto_id: req.params.id
        });
      }

      for (let p = 0; p < productos_marcas.length; p++) {
        await ProductoMarca.upsert({
          marca_id: productos_marcas[p].id,
          producto_id: req.params.id
        });
      }

      for (let p = 0; p < productos_medidas.length; p++) {
        await ProductoMedida.upsert({
          medida_id: productos_medidas[p].id,
          producto_id: req.params.id
        });
      }

      await updateCostoProducto(req.params.id);

    }

    await resp.success({ mensaje: 'Producto actualizado', data: producto }, req, res, 'Producto');

  } catch (err) {
    await resp.error(err, req, res);
  }
}

let deleteProducto = async (req, res) => {
  try {
    let producto = await Producto.destroy({ where: { id: req.params.id } });
    await resp.success({ mensaje: 'Producto eliminado', data: producto }, req, res, 'Producto');
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let updateCostoProducto = async (producto_id, vuelta = 1) => {
  try {
    // Actualizar combos porciones
    let prod = await Producto.findOne({ where: { id: producto_id } });
    prod = JSON.parse(JSON.stringify(prod));

    let recetas = await Receta.findAll({
      where: { producto_receta_id: prod.id },
      include: [
        {
          model: Producto, as: 'producto'
        }
      ]
    });
    recetas = JSON.parse(JSON.stringify(recetas));

    for (let r = 0; r < recetas.length; r++) {
      let rec = recetas[r];

      let cant = prod.porciones ? (1 / prod.porciones) : rec.cantidad;
      let costo = (prod.costo * cant).toFixed(2);
      await Receta.update({ cantidad: cant, costo: costo }, { where: { id: rec.id } });

      let resta_costo = parseFloat(rec.costo);
      let suma_costo = parseFloat(costo);

      let prod_receta = await Producto.findOne({ where: { id: rec.producto_id } });
      let total_costo = (parseFloat(prod_receta.costo) - resta_costo + suma_costo).toFixed(2);
      let prod_edit = await Producto.update({ costo: total_costo }, { where: { id: rec.producto_id } });
      await updateCostoProducto(rec.producto_id, vuelta + 1);
    }

  } catch (err) {
    console.log(err);
  }
}

export default {
  getAllProductos,
  getOneProducto,
  createProducto,
  updateProducto,
  deleteProducto,
  getAllProductosByCategoria,
  getAllProductosByMarca,
  getAllProductosByMedida,
  searchProductoBySKU,
  searchProductoByNombre,
  searchProductoByLote,
  updateCostoProducto
}