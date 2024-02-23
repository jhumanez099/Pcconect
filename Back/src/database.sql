create database pcconect;

-- \c pcconect para ingresar a la base de datos creada --
-- \d 'nombre de la tabla' para buscar una tabla --
-- \dt para mostar todas las tablas --
    
create table tipo_clientes(
    id_tipo_cliente serial primary key,
    clase_cliente varchar(255)
);

create table clientes(
    id_cliente serial primary key,
    id_tipo_cliente integer not null,
    nombre_empresa varchar(255),
    nombre_representante_empresa varchar(255),
    telefono varchar,
    correo varchar,
    ubicaciones varchar,
    foreign key ("id_tipo_cliente") references tipo_clientes ("id_tipo_cliente")
);

create table productos(
    id_producto serial primary key,
    nombre_producto varchar(255),
    valor_actual decimal,
    caracteristicas_producto varchar
);

create table usuarios(
    id_usuario serial primary key,
    nombres_usuario varchar(255),
    apellidos_usuario varchar(255),
    correo_usuario varchar,
    telefono varchar
);

create table pedidos(
    id_pedido serial primary key,
    id_producto integer not null,
    id_cliente integer not null,
    id_usuario integer not null,
    fecha_pedido date,
    hora_pedido time,
    cantidad_pedido numeric,
    foreign key ("id_producto") references productos ("id_producto"),
    foreign key ("id_cliente") references clientes ("id_cliente"),
    foreign key ("id_usuario") references usuarios ("id_usuario")
);

create table recogidas(
    id_recogida serial primary key,
    id_producto integer not null,
    id_cliente integer not null,
    id_usuario integer not null,
    fecha_recogida date,
    hora_recogida time,
    cantidad_recogida numeric,
    motivo varchar,
    observaciones varchar,
    foreign key ("id_producto") references productos ("id_producto"),
    foreign key ("id_cliente") references clientes ("id_cliente"),
    foreign key ("id_usuario") references usuarios ("id_usuario")
);



INSERT INTO clientes (id_tipo_cliente, nombre_empresa, nombre_representante_empresa, telefono, correo, ubicaciones)
VALUES (1, 'Empresa XYZ', 'Juan Pérez', '123456789', 'juan.perez@xyz.com', 'Calle Mayor 123');

INSERT INTO productos (nombre_producto, valor_actual, caracteristicas_producto)
VALUES ('Producto A', 100.00, 'Descripción del producto A');

INSERT INTO usuarios (nombres_usuario, apellidos_usuario, correo_usuario, telefono)
VALUES ('Ana García', 'García López', 'ana.garcia@gmail.com', '987654321');

INSERT INTO pedidos (id_producto, id_cliente, id_usuario, fecha_pedido, hora_pedido, cantidad_pedido)
VALUES (1, 1, 1, '2023-11-14', '10:00:00', 1);

INSERT INTO recogidas (id_producto, id_cliente, id_usuario, fecha_recogida, hora_recogida, cantidad_recogida, motivo, observaciones)
VALUES (1, 1, 1, '2023-11-15', '12:00:00', 1, 'Recogida en tienda', 'El cliente ha recogido el producto en la tienda');
