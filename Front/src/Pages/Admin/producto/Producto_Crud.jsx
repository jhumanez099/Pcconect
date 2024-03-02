import Title from "../../../components/Title"
import InputField from "../../../components/InputField"
import Buttons from "../../../components/Buttons"
import Grid_Producto from "./Grid_Prodcuto";
import Axios from 'axios'
import { useState, useEffect } from "react";
import Modal from 'react-modal';


export default function Producto_Crud() {

    const [productsList, setProductsList] = useState([])

    useEffect(() => {
        getProducts()
    }, [])

    const [id_producto, setId_producto] = useState(0)
    const [nombre_producto, setNombre_producto] = useState("")
    const [valor_actual, setValor_actual] = useState(0)
    const [caracteristicas_producto, setCaracteristicas_producto] = useState("")

    const createProducts = () => {
        Axios.post("http://localhost:3000/createProducts", {
            id_producto: id_producto,
            nombre_producto: nombre_producto,
            valor_actual: valor_actual,
            caracteristicas_producto: caracteristicas_producto
        })
            .then(() => {
                getProducts()
                console.log("Producto creado")
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const getProducts = () => {
        Axios.get("http://localhost:3000/getProducts")
            .then((respond) => {
                setProductsList(respond.data)
                console.log("Productos consultados")
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const getOnlyProducts = (id_producto) => {
        Axios.get(`http://localhost:3000/getOnlyProducts/${id_producto}`)
            .then((respond) => {
                setProductsList(respond.data)
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const handleIdChange = (e) => {
        const updatedEditingProducts = {
            ...editingProducts, id_producto: e.target.value
        };
        setEditingProducts(updatedEditingProducts);
    };

    const handleNombreChange = (e) => {
        const updatedEditingProducts = {
            ...editingProducts, nombre_producto: e.target.value
        };
        setEditingProducts(updatedEditingProducts);
    };

    const handleValorChange = (e) => {
        const updatedEditingProducts = {
            ...editingProducts, valor_actual: e.target.value
        };
        setEditingProducts(updatedEditingProducts);
    };

    const handleCaracteristicasChange = (e) => {
        const updatedEditingProducts = {
            ...editingProducts, caracteristicas_producto: e.target.value
        };
        setEditingProducts(updatedEditingProducts);
    };


    const updateProducts = () => {
        Axios.put(`http://localhost:3000/updateProducts/${editingProducts.id_producto}`, {
            id_producto: editingProducts.id_producto,
            nombre_producto: editingProducts.nombre_producto,
            valor_actual: editingProducts.valor_actual,
            caracteristicas_producto: editingProducts.caracteristicas_producto
        })
            .then(() => {
                closeModal();
                getProducts()
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const handleDelete = (id_producto) => {
        Axios.delete(`http://localhost:3000/deleteProducts/${id_producto}`)
            .then(() => {
                getProducts()
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProducts, setEditingProducts] = useState({});

    const openModal = (productos) => {
        setEditingProducts(productos);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    //console.log(editingProducts)

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div class="row ">
                <div className="mb-5 d-flex justify-content-center">
                    <Title title="Productos" />
                </div>
                <div className="row">
                    <div className="col-10">
                        <InputField
                            label="ID del producto"
                            type=""
                            id="id-producto"
                            onChange={(e) => setId_producto(e.target.value)}
                        />
                    </div>
                    <div className='col-2'>
                        <Buttons title='Consultar' colorbutton='black' color='white' onClick={() => (id_producto.length === 0 ? getProducts() : getOnlyProducts(id_producto))} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-10">
                        <InputField
                            label="Nombre del producto"
                            type="text"
                            id="nombre-producto"
                            onChange={(e) => setNombre_producto(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-10">
                        <InputField
                            label="Valor actual del producto"
                            type="number"
                            id="valor-producto"
                            onChange={(e) => setValor_actual(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-10">
                        <InputField
                            label="Caracteristicas del producto"
                            type="text"
                            id="caracteristicas-producto"
                            onChange={(e) => setCaracteristicas_producto(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Grid_Producto
                            List={productsList} handleDelete={handleDelete} handleEdit={openModal} />
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel='Editar'
                    >
                        <h2 className="text-primary">Editar Producto</h2>
                        <div className='col-12'>
                            <InputField
                                label='Id'
                                type="number"
                                id='id-producto'
                                value={editingProducts.id_producto || ''}
                                onChange={handleIdChange}
                            />
                        </div>
                        <div className="col-12">
                            <InputField
                                label='Nombre del producto'
                                type="text"
                                id='nombre-producto'
                                value={editingProducts.nombre_producto || ''}
                                onChange={handleNombreChange}
                            />
                        </div>
                        <div className="col-12">
                            <InputField
                                label='Valor del producto'
                                type="number"
                                id='valor-producto'
                                value={editingProducts.valor_actual || ''}
                                onChange={handleValorChange}
                            />
                        </div>
                        <div className="col-12">
                            <InputField
                                label='Caracteristicas del producto'
                                type="text"
                                id='caracteristica-producto'
                                value={editingProducts.caracteristicas_producto || ''}
                                onChange={handleCaracteristicasChange}
                            />
                        </div>
                        {/* Agregar campos para otros atributos (dirección, teléfono, etc.) */}
                        <div className='container-fluid mt-4 d-flex justify-content-center'>
                            <div className='col-4 d-flex justify-content-center'>
                                <Buttons title='Guardar Cambios' color='white' onClick={updateProducts} colorbutton='black' />
                            </div>
                        </div>
                        <button onClick={closeModal}>Cerrar</button>
                    </Modal>
                    <div className="container-fluid mt-4 d-flex justify-content-center">
                        <div className="col-12">
                            <Buttons
                                title="Guardar"
                                color="white"
                                colorbutton='black'
                                onClick={createProducts} />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
