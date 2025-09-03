import translate from "translate";
import Error from "../src/soporte/errores/errores.model.js";
import moment from "moment";
import Bitacora from "../src/seguridad/bitacora.model.js";
import jwt from 'jsonwebtoken';
import key from '../middleware/key.js';

let success = async (data, req, res, tipo) => {
  let fecha = moment().format('YYYY-MM-DD HH:mm:ss');
  let url = req.protocol + '://' + req.get('host') + req.originalUrl;
  let dispositivo = req.headers['user-agent'];
  let body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
  let params = typeof req.params === 'object' ? JSON.stringify(req.params) : req.params;
  let mensaje = data.mensaje;
  let token = req.headers.authorization;
  let usuario_id = null;
  if (!token) {
    token = req.query.token
  }
  if (token) {
    var decoded = jwt.verify(token, key);
    usuario_id = decoded.data.usuario_id;
  }

  let resp = {
    code: 1,
    mensaje: mensaje
  }
  if (tipo == 'Login') {
    resp.token = data.data.token;
    resp.usuario_id = data.data.usuario_id;
    resp.rol_id = data.data.rol_id;
    resp.empresa_id = data.data.empresa_id;
    usuario_id = data.data.usuario_id;
  } else {
    resp.data = data.data;
  }
  try {
    if (req.method != 'GET') {
      await Bitacora.create({ fecha, tipo, url, params, body, mensaje, dispositivo, usuario_id });
    }
    res.status(200).json(resp);
  } catch (err) {
    await error(err, req, res);
  }
}

let error = async (err, req, res) => {
  let fecha = moment().format('YYYY-MM-DD HH:mm:ss');
  let url = req.protocol + '://' + req.get('host') + req.originalUrl;
  let dispositivo = req.headers['user-agent'];
  let body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
  let params = typeof req.params === 'object' ? JSON.stringify(req.params) : req.params;
  let e = JSON.parse(JSON.stringify(err));
  let mensaje = '';
  let tipo = 'Error';
  
  if (e.name == 'SequelizeValidationError') {
    tipo = e.name
    mensaje = e.errors[0].message;
  } else if (e.name == 'SequelizeDatabaseError') {
    tipo = e.name
    mensaje = e.original.sqlMessage;
  } else if (e.name == 'SequelizeConnectionRefusedError') {
    tipo = e.name
    mensaje = e.original.sqlMessage;
  } else if (e.name == 'SequelizeConnectionTimedOutError') {
    tipo = e.name
    mensaje = e.original.sqlMessage;
  } else if (e.name == 'SequelizeForeignKeyConstraintError') {
    tipo = e.name
    mensaje = e.original.sqlMessage;
  } else if (e.name == 'SequelizeUniqueConstraintError') {
    tipo = e.name
    mensaje = e.original.sqlMessage;
  } else if (e.Codigo > 1) {
    mensaje = e.ResponseDATA1 || e.Mensaje;
  } else {
    mensaje = err.toString();
  }  

  let error = await Error.create({ fecha, tipo, url, params, body, mensaje, dispositivo });
  res.status(200).json({ code: 0, mensaje: mensaje, error_id: error.id });  
}

export default {
  success,
  error
};

function trad(text) {
  return translate(text, { to: 'es', from: 'en', autoCorrect: false, ignoreExceptions: true });
}