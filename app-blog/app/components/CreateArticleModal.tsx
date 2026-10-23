import { Article } from "@/types/article";
import React, { useState } from "react";

interface CreateArticleModalProps {
    onClose: () => void;
    onSubmit: (newArticle: Partial<Article>) => Promise<{success: boolean, message:string}>
}

export const CreateArticleModal: React.FC<CreateArticleModalProps> = ({onClose, onSubmit}) => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [image_url, setImageUrl] = useState('')
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            await onSubmit({title, content, image_url})
            onClose()
        }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gray-900 border border-devmoon-indigo/30 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-devmoon-indigo to-devmoon-accent bg-clip-text text-transparent">
                    Crear Nuevo Articulo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1">Titulo</label>
                            <input 
                            type="text"
                            className="w-full p-2 bg-gray-800 tex-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-devmoon-indigo"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1">Contenido</label>
                            <textarea 
                            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-devmoon-indigo min-h-[100px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1">URL de Imagen</label>
                            <input 
                            type="text"
                            className="w-full p-2 bg-gray-800 tex-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-devmoon-indigo"
                            value={image_url}
                            onChange={(e) => setImageUrl(e.target.value)}
                            required
                            />
                        </div>
                        <div className="flex justify-end">
                        <button 
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                        type="button"
                        onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button 
                        className="bg-devmoon-indigo hover:bg-devmoon-purple text-white px-4 py-2 rounded transition-colors"
                        type="submit"
                        >
                            Crear
                        </button>
                        </div>
                    </form>
            </div>
        </div>
    )
}