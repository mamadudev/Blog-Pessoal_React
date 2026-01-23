import { useState, useContext, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import type Postagem from "../../../models/Postagem"
import { buscar, deletar } from "../../../services/Service"
import { ClipLoader } from "react-spinners"

function DeletarPostagem() {

  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  const [isLoading, setIsLoading] = useState(false)
  const [postagem, setPostagem] = useState<Postagem>({} as Postagem)

  const buscarPorId = useCallback(async () => {
    try {
      await buscar(`/postagens/${id}`, setPostagem, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error: unknown) {
      if (error instanceof Error && error.toString().includes("401")) {
        handleLogout()
      }
    }
  }, [id, token, handleLogout])

  useEffect(() => {
    if (!token) {
      alert("Você precisa estar logado")
      navigate("/")
    }
  }, [token, navigate])

  useEffect(() => {
    if (id) {
      buscarPorId()
    }
  }, [id, buscarPorId])

  async function deletarPostagem() {
    setIsLoading(true)

    try {
      await deletar(`/postagens/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      alert("Postagem apagada com sucesso")
      navigate("/home")

    } catch (error: unknown) {
      if (error instanceof Error && error.toString().includes("401")) {
        handleLogout()
      } else {
        alert("Erro ao deletar a postagem")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4">
      <h1 className="text-4xl text-center my-6">Deletar Postagem</h1>

      <p className="text-center font-semibold mb-6">
        Você tem certeza de que deseja apagar a postagem a seguir?
      </p>

      <div className="border flex flex-col rounded-2xl overflow-hidden">
        <header className="py-2 px-6 bg-indigo-600 text-white font-bold text-2xl">
          Postagem
        </header>

        <div className="p-4">
          {postagem.id ? (
            <>
              <p className="text-xl font-semibold">{postagem.titulo}</p>
              <p className="mt-2">{postagem.texto}</p>
            </>
          ) : (
            <p>Carregando postagem...</p>
          )}
        </div>

        <div className="flex">
          <button
            type="button"
            className="w-full bg-red-400 hover:bg-red-600 text-white py-2"
            onClick={() => navigate("/home")}
          >
            Não
          </button>

          <button
            type="button"
            className="w-full bg-indigo-400 hover:bg-indigo-600 text-white flex items-center justify-center"
            onClick={deletarPostagem}
          >
            {isLoading ? <ClipLoader color="#fff" size={24} /> : "Sim"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletarPostagem
