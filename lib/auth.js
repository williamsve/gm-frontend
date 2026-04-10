import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getDb } from './db'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '24h'

/**
 * Genera un token JWT para un usuario
 */
export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Verifica y decodifica un token JWT
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

/**
 * Hashea una contraseña con bcrypt
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compara una contraseña con su hash
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

/**
 * Obtiene el usuario desde el token en las cookies o header
 */
export async function getUserFromRequest(req) {
  // Intentar obtener token de cookies primero
  let token = req.cookies?.auth_token
  
  // Si no hay token en cookies, intentar en el header Authorization
  if (!token) {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }
  
  if (!token) {
    return null
  }
  
  const decoded = verifyToken(token)
  if (!decoded) {
    return null
  }
  
  // Obtener usuario de la base de datos
  const db = await getDb()
  const user = db.data?.users?.find(u => u.id === decoded.id)
  
  if (!user) {
    return null
  }
  
  // No retornar la contraseña
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(req) {
  const user = await getUserFromRequest(req)
  return user !== null
}

/**
 * Middleware de autenticación para APIs
 * Retorna el usuario si está autenticado, null si no
 */
export async function requireAuth(req, res) {
  const user = await getUserFromRequest(req)
  
  if (!user) {
    res.status(401).json({ error: 'No autorizado. Por favor, inicia sesión.' })
    return null
  }
  
  return user
}

/**
 * Crea un usuario administrador por defecto si no existe
 */
export async function ensureDefaultAdmin() {
  const db = await getDb()
  
  if (!db.data.users || db.data.users.length === 0) {
    const hashedPassword = await hashPassword('admin123')
    
    db.data.users = [{
      id: 1,
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    }]
    
    await db.write()
    console.log('Usuario administrador por defecto creado')
  }
}
