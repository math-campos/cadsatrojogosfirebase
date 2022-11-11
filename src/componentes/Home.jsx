import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, onSnapshot } from "firebase/firestore";

const Home = () => {

    const [listaObjetos, setListaObjetos] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'jogos'))
        onSnapshot(q, (querySnapshot) => {
            setListaObjetos(querySnapshot.docs.map(doc => ({
                id: doc.id,
                nome: doc.data().nome,
                produtora: doc.data().produtora,
                descricao: doc.data().descricao,
                usuario: doc.data().usuario,
                email: doc.data().email,
                uid: doc.data().uid
            })))
        })
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Cadastro de Jogos</h1>

            <div className="row">
                {listaObjetos.length === 0 && <h2>Nenhum registro encontrado</h2>}
                {listaObjetos.length > 0 && (

                    listaObjetos.map(objeto => (
                        <div className="col-sm-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{objeto.nome}</h5>
                                    <p className="card-text">{objeto.produtora}</p>
                                    <p className="card-text">{objeto.descricao}</p>
                                    <p className="card-text"><small className="text-muted">Usuário: {objeto.usuario}</small></p>
                                    <p className="card-text"><small className="text-muted">Email: {objeto.email}</small></p>
                                </div>
                            </div>
                        </div>
                    ))

                )}
            </div>
        </div>
    )
};

export default Home;