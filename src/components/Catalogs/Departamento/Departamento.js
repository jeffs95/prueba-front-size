import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import NavbarComponent from '../../NavbarComponent';
import { Container, Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import {
    getListaDepartamento,
    crearDepartamento,
    EditarDepartamento,
    EliminarDepartamento,
} from '../../../services/departamento';
import ModalForm from './components/ModalForm';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Departamento = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getListaDepartamento();
            console.log('[response]', response);
            
            setData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error('Error al obtener Departamentos:', error);
        }
    };

    const handleOpenModal = (DepartamentoData = null) => {
        setSelectedDepartamento(DepartamentoData);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedDepartamento(null);
        setShowModal(false);
    };

    const handleSubmitColaborador = async (DepartamentoData, idDepartamento) => {
        try {
            const { nombre, descripcion } = DepartamentoData;
            const dataToSend = { nombre, descripcion };
            
            if (idDepartamento) {
                await EditarDepartamento(idDepartamento, dataToSend);
                toast.success('Registro Actualizado!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
            } else {
                await crearDepartamento(dataToSend);
                toast.success('Registro Agregado!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
            }
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error('Error al guardar DepartamentoData:', error);
            toast.error('Ocurrió un problema!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        }
    };
    
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filtered = data.filter(item =>
            item.id.toString().includes(value) ||
            item.nombre.toLowerCase().includes(value)
        );
        setFilteredData(filtered);
    };
    
        const handleEliminated = (row) => {
            const toastId = toast.warn(
                <div>
                    <p>¿Seguro que deseas eliminar este registro?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <Button variant="danger" size="sm" onClick={() => confirmDelete(row.id, toastId)}>Sí</Button>
                        <Button variant="secondary" size="sm" onClick={() => toast.dismiss(toastId)}>No</Button>
                    </div>
                </div>,
                {
                    position: "top-center",
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                    hideProgressBar: true
                }
            );
        };
        
        const confirmDelete = async (id, toastId) => {
            try {
                await EliminarDepartamento(id);
                toast.dismiss(toastId);
                toast.success("Registro eliminado con éxito!", {
                    position: "top-center",
                    autoClose: 3000
                });
                fetchData();
            } catch (error) {
                console.error('Error al eliminar:', error);
                toast.error("Error al eliminar el registro", {
                    position: "top-center",
                    autoClose: 3000
                });
            }
        };

    const columns = [
        { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Nombre', selector: row => row.nombre, sortable: true },
        { name: 'Descripcion', selector: row => row.descripcion, sortable: true },
        {
            name: 'ACCIONES',
            cell: row => (
                <>
                    <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleOpenModal(row)}
                        style={{ color: 'black', fontSize: '20px', padding: '5px' }}
                    >
                        <FaEdit />
                    </Button>
                    <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleEliminated(row)}
                        style={{ color: 'black', fontSize: '20px', padding: '5px' }}
                    >
                        <FaTrash />
                    </Button>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "150px"
        },
    ];

    const customStyles = {
        table: {
            style: {
                backgroundColor: '#ffffff',
            }
        },
        headRow: {
            style: {
                backgroundColor: '#17c3a2',
                color: 'white',
                fontWeight: 'bold',
            },
        },
        rows: {
            style: {
                backgroundColor: '#f8f9fa',
                '&:nth-of-type(odd)': {
                    backgroundColor: '#e9ecef',
                },
                '&:hover': {
                    backgroundColor: '#d6d8db',
                    cursor: 'pointer',
                },
                borderBottom: '1px solid #dee2e6',
            },
        },
        pagination: {
            style: {
                backgroundColor: '#ffffff',
            }
        }
    };


    return (
        <div
            style={{
                backgroundColor: '#f0f2f5',
                padding: '20px',
            }}
        >
            <ToastContainer position="top-center" autoClose={5000} theme="light" transition={Bounce} />
            <NavbarComponent />
            <div>
                <Container 
                className="mt-4"
                style={{
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    padding: '20px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: 'none',
                }}
                >
                    <div style={{ backgroundColor: '#007bff', padding: '10px', borderRadius: '5px', marginBottom: '15px', color: '#fff', fontWeight: 'bold', fontSize: '120%' }}>
                        Catálogo Departamento
                    </div>

                    <Button variant="primary" onClick={handleOpenModal}>
                        Agregar nuevo registro
                    </Button>

                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        fixedHeader
                        fixedHeaderScrollHeight="400px"
                        subHeader
                        subHeaderComponent={
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="form-control w-25"
                                value={searchText}
                                onChange={handleSearch}
                            />
                        }
                        customStyles={customStyles}
                    />

                    <ModalForm
                        show={showModal}
                        handleClose={handleCloseModal}
                        idDepartamento={selectedDepartamento?.id || null}
                        DepartamentoData={selectedDepartamento}
                        onSubmit={handleSubmitColaborador}
                    />
                </Container>
            </div>
        </div>
    );
};

export default Departamento;
