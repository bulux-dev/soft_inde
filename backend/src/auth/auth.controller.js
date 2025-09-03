import jwt from 'jsonwebtoken';
import hash from 'password-hash';
import key from '../../middleware/key.js';
import fs from 'fs';
import Usuario from '../seguridad/usuarios/usuarios.model.js';
import SoporteMailer from '../../nodemailer/soporte.js';
import resp from '../../middleware/resp.js';
import Empresa from '../empresas/empresas.model.js';

let login = async (req, res) => {
  try {
    let usuario = await Usuario.findOne({ where: { usuario: req.body.usuario } });
    if (usuario) {
      if (hash.verify(req.body.clave, usuario.clave)) {
        if (usuario.acceso == true) {
          let empresa = await Empresa.findOne({ where: { slug: process.env.DATABASE } });

          let token = jwt.sign({
            data: {
              id: usuario.id,
              nombre: usuario.nombre,
              usuario_id: usuario.id,
              rol_id: usuario.rol_id,
              empresa_id: empresa.id,
              empresa_slug: empresa.slug,
              empresa_color: empresa.color
            }
          }, key, { expiresIn: '24h' });
          await resp.success({ mensaje: 'Logueo Exitoso', data: { token: token, usuario_id: usuario.id, rol_id: usuario.rol_id, empresa_id: empresa.id } }, req, res, 'Login');
        } else {
          await resp.error('Usuario Bloqueado', req, res);
        }
      } else {
        await resp.error('Clave Inválida', req, res);
      }
    } else {
      await resp.error('Usuario Inválido', req, res);
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let registro = async (req, res) => {
  try {
    if (req.body.clave == req.body.clave2) {
      req.body.clave = hash.generate(req.body.clave);
      let usuario = await Usuario.findOne({ where: { usuario: req.body.usuario } });
      if (usuario) {
        await resp.error('Usuario ya Existente', req, res);
      } else {
        let usuario = await Usuario.create(req.body);
        res.status(200).json({ code: 1, data: usuario });
      }
    } else {
      res.status(200).json({ code: 0, mensaje: 'Las contraseñas no coinciden' });
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

let recuperar = async (req, res) => {
  try {
    let empresa = await Empresa.findOne({ where: { slug: process.env.DATABASE } });
    let usuario = await Usuario.findOne({ where: { correo: req.body.correo } });
    if (usuario) {
      
      let file = fs.readFileSync('./templates/email/recuperar.html', 'utf8');
      file = file.replaceAll('{{empresa.nombre}}', empresa.nombre);
      file = file.replaceAll('{{empresa.direccion}}', empresa.direccion);
      file = file.replaceAll('{{empresa.color}}', empresa.color);
      file = file.replaceAll('{{empresa.logo}}', empresa.logo);

      let message = {
        from: `"${empresa.nombre}" <soporte@${process.env.DOMAIN}>`,
        to: req.body.correo,
        subject: `Recuperar tu clave de ${empresa.nombre}`,
        html: file
      };
      console.log(message);
      
      SoporteMailer.sendMail(message, async (error, info) => {
        if (error) {
          return await resp.error(error, req, res);
        }
        res.status(200).json({ code: 1, mensaje: 'Código de seguridad enviado', info });
      });
      
    } else {
      res.status(200).json({ code: 0, mensaje: 'Correo no encontrado' });
    }
  } catch (err) {
    await resp.error(err, req, res);
  }
}

export default {
  login,
  registro,
  recuperar
}