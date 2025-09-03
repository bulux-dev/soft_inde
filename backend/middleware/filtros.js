import { Op, Sequelize } from 'sequelize';

let fl = function clearFiltros(params, tipo = 'substring') {
  for (var property in params) {
    if (params[property] == 'undefined' || params[property] == 'null' || !params[property]) {
      delete params[property];
    } else if (params[property] == 'true') {
      params[property] = true;
    } else if (params[property] == 'false') {
      params[property] = false;
    } else {
      if (tipo == 'substring') {
        params[property] = {
          [Op.substring]: params[property]
        }
      }
      if (tipo == 'eq') {
        params[property] = {
          [Op.eq]: params[property]
        }
      }
    }
  }
  return params;
}

export default fl;