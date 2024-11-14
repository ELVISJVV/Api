from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)

# Configuración de la conexión a PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:admin@localhost/api1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Crear una instancia de SQLAlchemy
db = SQLAlchemy(app)

# Modelo de Usuario
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    rol = db.Column(db.String(20), nullable=False)

# Crear las tablas
with app.app_context():
    db.create_all()

# Rutas de la API
@app.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([{"id": u.id, "nombre": u.nombre, "email": u.email, "rol": u.rol} for u in usuarios]), 200

@app.route('/usuarios/<int:id>', methods=['GET'])
def obtener_usuario(id):
    usuario = Usuario.query.get(id)
    if usuario:
        return jsonify({"id": usuario.id, "nombre": usuario.nombre, "email": usuario.email, "rol": usuario.rol}), 200
    return jsonify({"error": "Usuario no encontrado"}), 404

@app.route('/usuarios', methods=['POST'])
def crear_usuario():
    data = request.get_json()
    nuevo_usuario = Usuario(
        nombre=data.get("nombre"),
        email=data.get("email"),
        rol=data.get("rol")
    )
    try:
        db.session.add(nuevo_usuario)
        db.session.commit()
        return jsonify({"id": nuevo_usuario.id, "nombre": nuevo_usuario.nombre, "email": nuevo_usuario.email, "rol": nuevo_usuario.rol}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    data = request.get_json()
    usuario = Usuario.query.get(id)
    if usuario:
        usuario.nombre = data.get("nombre", usuario.nombre)
        usuario.email = data.get("email", usuario.email)
        usuario.rol = data.get("rol", usuario.rol)
        try:
            db.session.commit()
            return jsonify({"id": usuario.id, "nombre": usuario.nombre, "email": usuario.email, "rol": usuario.rol}), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400
    return jsonify({"error": "Usuario no encontrado"}), 404

@app.route('/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    usuario = Usuario.query.get(id)
    if usuario:
        try:
            db.session.delete(usuario)
            db.session.commit()
            return jsonify({"mensaje": "Usuario eliminado"}), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400
    return jsonify({"error": "Usuario no encontrado"}), 404

if __name__ == '__main__':
    app.run(debug=True)
