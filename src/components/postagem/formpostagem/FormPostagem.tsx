import { useContext, useEffect, useState, useCallback, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../../../contexts/AuthContext";
import type Postagem from "../../../models/Postagem";
import type Tema from "../../../models/Tema";
import { atualizar, buscar, cadastrar } from "../../../services/Service";
import { ToastAlerta } from "../../../utils/ToastAletrta";

function FormPostagem() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [temas, setTemas] = useState<Tema[]>([])

    const [tema, setTema] = useState<Tema>({ id: 0, descricao: '', })
    
    const [postagem, setPostagem] = useState<Postagem>({} as Postagem)

    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    const { id } = useParams<{ id: string }>()

    const buscarPostagemPorId = useCallback(async (id: string) => {
        try {
            await buscar(`/postagens/${id}`, setPostagem, {
                headers: { Authorization: token }
            })
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'toString' in error && typeof error.toString === 'function' && error.toString().includes('401')) {
                handleLogout()
            }
        }
    }, [token, handleLogout]);

    async function buscarTemaPorId(id: string) {
        try {
            await buscar(`/temas/${id}`, setTema, {
                headers: { Authorization: token }
            })
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'toString' in error && typeof error.toString === 'function' && error.toString().includes('401')) {
                handleLogout()
            }
        }
    }

    const buscarTemas = useCallback(async () => {
        try {
            await buscar('/temas', setTemas, {
                headers: { Authorization: token }
            })
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'toString' in error && typeof error.toString === 'function' && error.toString().includes('401')) {
                handleLogout()
            }
        }
    }, [token, handleLogout]);

    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado', 'info');
            navigate('/');
        }
    }, [navigate, token])

    useEffect(() => {
        buscarTemas()

        if (id !== undefined) {
            buscarPostagemPorId(id)
        }
    }, [buscarPostagemPorId, buscarTemas, id])



    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setPostagem({
            ...postagem,
            [e.target.name]: e.target.value,
            usuario: usuario,
        });
    }

    function handleTemaChange(e: ChangeEvent<HTMLSelectElement>) {
        const temaId = e.currentTarget.value;
        buscarTemaPorId(temaId);
        setPostagem((prev) => ({
            ...prev,
            tema: temas.find((t) => String(t.id) === temaId) || prev.tema,
        }));
    }

    function retornar() {
        navigate('/postagens');
    }

    async function gerarNovaPostagem(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        if (id !== undefined) {
            try {
                await atualizar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                });

                ToastAlerta('Postagem atualizada com sucesso', 'sucesso')

            } catch (error: unknown) {
                if (error && typeof error === 'object' && 'toString' in error && typeof error.toString === 'function' && error.toString().includes('401')) {
                    handleLogout()
                } else {
                    ToastAlerta('Erro ao atualizar a Postagem', 'erro')
                }
            }

        } else {
            try {
                await cadastrar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                })

                ToastAlerta('Postagem cadastrada com sucesso', 'sucesso');

            } catch (error: unknown) {
                if (error && typeof error === 'object' && 'toString' in error && typeof error.toString === 'function' && error.toString().includes('401')) {
                    handleLogout()
                } else {
                    ToastAlerta('Erro ao cadastrar a Postagem', 'erro');
                }
            }
        }

        setIsLoading(false)
        retornar()
    }

    const carregandoTema = tema.descricao === '';


    return (
        <div className="container flex flex-col mx-auto items-center">
            <h1 className="text-4xl text-center my-8">
                 {id !== undefined ? 'Editar Postagem' : 'Cadastrar Postagem'}
            </h1>

            <form className="flex flex-col w-1/2 gap-4"
                onSubmit={gerarNovaPostagem}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Título da Postagem</label>
                    <input
                        type="text"
                        placeholder="Titulo"
                        name="titulo"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={postagem.titulo}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Texto da Postagem</label>
                    <input
                        type="text"
                        placeholder="Texto"
                        name="texto"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                         value={postagem.texto}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="tema">Tema da Postagem</label>
                    <select
                        name="tema"
                        id="tema"
                        className='border p-2 border-slate-800 rounded'
                        onChange={handleTemaChange}
                        value={postagem.tema?.id || ''}
                    >
                        <option value="" disabled>Selecione um Tema</option>
                        {temas.map((tema) => (
                            <option value={tema.id} key={tema.id}>{tema.descricao}</option>
                        ))}
                    </select>
                </div>
                <button 
                    type='submit' 
                    className='rounded disabled:bg-slate-200 bg-indigo-400 hover:bg-indigo-800
                               text-white font-bold w-1/2 mx-auto py-2 flex justify-center'
                               disabled={carregandoTema}
                >
                    { isLoading ? 
                            <ClipLoader 
                                color="#ffffff" 
                                size={24}
                            /> : 
                           <span>{id === undefined ? 'Cadastrar' : 'Atualizar'}</span>
                    }

                </button>
            </form>
        </div>
    );
}

export default FormPostagem;