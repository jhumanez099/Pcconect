create database pcconect;

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