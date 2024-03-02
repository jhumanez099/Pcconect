import React from 'react';
import Button from "../../../components/Buttons"
import Title from '../../../components/Title';
import InputField from '../../../components/InputField';

export default function Cliente_actualizar() {
    return (

        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="row">
                <div className="mb-5 d-flex justify-content-center">
                    <Title title="PRODUCTOS" />
                </div>
                <div className="row">
                    <div className="col-10">
                        <InputField
                            label="Nombre"
                            type="text"
                            id="nombre"
                            placeholder="Nombre de la facultad"
                            onChange={(e) => setnombre(e.target.value)}
                        />
                    </div>
                    <div className="col-2">
                        <Button
                            title="Consultar"
                            color="white"
                            colorbutton="black"
                            onClick={() =>
                                nombre.length === 0 ? getFaculties() : getOnlyFaculties(nombre)
                            }
                        />
                        <div />
                    </div>

                </div>

            </div>

    </div> 
            )
                            
}