import React from 'react';

import Button from "../../../components/Buttons"
import Label from '../../../components/Label';
import { Form, Container, FormControl, InputGroup } from 'react-bootstrap';



export default function Cliente_actualizar() {
    return (
        <div className="App">
            <Container className="mt-5 bg-primary text-white p-4 rounded">
                <div>
                    <h1 className="text-center mb-4">Clientes</h1>
                </div>

                <div>

                    <Container className="my-4 "  >
                        <Form >
                            <Form.Group className="mb-3 " >
                                <FormControl
                                    type="text"
                                    placeholder="Buscar..."
                                    size="lg"
                                    
                                    
                                />
                                
                            </Form.Group>
                            <br/>
                            <Button 
                                title="Guardar"
                                color="#de5252"
                                colorbutton="black"
                                type="submit" >
                                Actualizar
                            </Button>
                        </Form>
                    </Container>
                    
                </div>
                
                <br/>
                <div>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="name" placeholder="Ingrese su nombre" />
                        </Form.Group>
                        <br />
                        <Form.Group className="mb-3">
                            <Form.Label>Persona a cargo</Form.Label>
                            <Form.Control content='text-align center' type="p_cargo" placeholder="Ingrese una persona a cargo" color="white" />
                        </Form.Group>
                        <br />
                        <Form.Group className="mb-3">
                            <Form.Label>Telefono</Form.Label>
                            <Form.Control type="phone" placeholder="Ingrese un telefono" />
                        </Form.Group>
                        <br />
                        <Form.Group className="mb-3">
                            <Form.Label>Direccion</Form.Label>
                            <Form.Control type="direccion" placeholder="Ingrese una direccion" />
                        </Form.Group>
                    </Form>
                </div>
                <br />

                <div>
                    <Button 
                        title="Actualizar"
                        color="#de5252"
                        colorbutton="#201c1c"
                        type="submit" >
                        
                    </Button>
                </div>
            </Container>
        </div>
    );
}