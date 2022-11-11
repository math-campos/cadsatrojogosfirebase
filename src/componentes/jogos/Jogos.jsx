import { useState, useEffect } from 'react';
import Tabela from './Tabela';
import JogosContext from './JogosContext';
import Formulario from './Formulario';
import { auth, db } from '../../firebaseConfig';
import { useAuthState } from "react-firebase-hooks/auth";
import {
    doc, addDoc, collection, query, onSnapshot, updateDoc,
    deleteDoc, where
} from "firebase/firestore";

function Predios() {
    const [user, loading, error] = useAuthState(auth);
    const [listaObjetos, setListaObjetos] = useState([]);
    const [alerta, setAlerta] = useState({
        status: "", message: ""
    });

    const [objeto, setObjeto] = useState({
        id: "", nome: "", descricao: "",
        uid: user?.uid, usuario: user?.displayName, email:
            user?.email
    });

    const novoObjeto = () => {
        setObjeto({
            id: 0, nome: "", descricao: "",
            uid: user?.uid, usuario: user?.displayName, email:
                user?.email
        });
    }

    useEffect(() => {
        if (user?.uid != null) {
            const uid = user?.uid;
            const colRef = collection(db, "jogos");
            const q = query(colRef, where("uid", "==", uid))
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
        }
    }, [user]);

    const [editar, setEditar] = useState(false);
    const acaoCadastrar = async (e) => {
        e.preventDefault();
        if (editar) {
            try {
                const jogoDocRef = doc(db, 'jogos', objeto.id)
                await updateDoc(jogoDocRef, {
                    nome: objeto.nome,
                    produtora: objeto.produtora,
                    descricao: objeto.descricao,
                    uid: objeto.uid,
                    usuario: objeto.usuario,
                    email: objeto.email
                })
                setAlerta({
                    status: "success", message: "Jogo atualizado com sucesso"
                });
            } catch (err) {
                setAlerta({
                    status: "error", message: "Erro ao atualizar o Jogo: " + err
                });
            }
        } else { // novo
            try {
                addDoc(collection(db, 'jogos'),
                    {
                        nome: objeto.nome,
                        produtora: objeto.produtora,
                        descricao: objeto.descricao,
                        uid: objeto.uid,
                        usuario: objeto.usuario,
                        email: objeto.email
                    }).then(function (docRef) {
                        setObjeto({ ...objeto, id: docRef.id });
                    })
                setEditar(true);
                setAlerta({
                    status: "success", message: "Jogo criado com sucesso"
                });
            } catch (err) {
                setAlerta({
                    status: "error", message: "Erro ao criar o Jogo: " + err
                });
            }
        }
    };

    const acaoRemover = async (objeto) => {
        if (window.confirm("Remover este objeto?")) {
            try {
                const jogoDocRef = doc(db, 'jogos', objeto.id)
                await deleteDoc(jogoDocRef);
                setAlerta({
                    status: "success", message: "Jogo removido com sucesso!"
                });
            } catch (err) {
                setAlerta({
                    status: "error", message: "Erro ao remover: " + err
                });
            }
        }
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }
    return (
        <JogosContext.Provider value={
            {
                listaObjetos, setListaObjetos, acaoRemover,
                alerta, setAlerta,
                objeto, setObjeto,
                editar, setEditar,
                acaoCadastrar, handleChange, novoObjeto
            }}>
            <Tabela />
            <Formulario />
        </JogosContext.Provider>
    );
}
export default Predios;