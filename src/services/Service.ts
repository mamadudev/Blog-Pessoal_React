
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000, // 10 seconds timeout
});

type ApiResponseHandler<T = unknown> = (data: T) => void;

export const cadastrarUsuario = async <T>(
    url: string,
    dados: object,
    setDados: ApiResponseHandler<T>
): Promise<void> => {
    try {
        const resposta: AxiosResponse<T> = await api.post(url, dados);
        setDados(resposta.data);
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        throw error; // Re-throw or handle as needed
    }
};

export const login = async <T>(
    url: string,
    dados: object,
    setDados: ApiResponseHandler<T>
): Promise<void> => {
    try {
        const resposta: AxiosResponse<T> = await api.post(url, dados);
        setDados(resposta.data);
    } catch (error) {
        console.error("Erro no login:", error);
        throw error;
    }
};

export const buscar = async <T>(
    url: string,
    setDados: ApiResponseHandler<T>,
    config?: AxiosRequestConfig
): Promise<void> => {
    try {
        const resposta: AxiosResponse<T> = await api.get(url, config);
        setDados(resposta.data);
    } catch (error) {
        console.error("Erro na busca:", error);
        throw error;
    }
};

export const cadastrar = async <T>(
    url: string,
    dados: object,
    setDados?: ApiResponseHandler<T>,
    config?: AxiosRequestConfig
): Promise<T> => {
    try {
        const resposta: AxiosResponse<T> = await api.post(url, dados, config);
        if (setDados) setDados(resposta.data);
        return resposta.data;
    } catch (error) {
        console.error("Erro no cadastro:", error);
        throw error;
    }
};

// Similar improvements for atualizar and deletar...

export const atualizar = async <T>(
    url: string,
    dados: object,
    setDados?: ApiResponseHandler<T>,
     config?: AxiosRequestConfig
 ): Promise<T> => {
     try {
         const resposta: AxiosResponse<T> = await api.put(url, dados, config);
         if (setDados) setDados(resposta.data);
         return resposta.data;
     } catch (error) {
         console.error("Erro na atualização:", error);
         throw error;
     }
 };

export const deletar = async (
     url: string,
     config?: AxiosRequestConfig
 ): Promise<void> => {
     try {
         await api.delete(url, config);
     } catch (error) {
         console.error("Erro ao deletar:", error);
         throw error;
     }
 };
