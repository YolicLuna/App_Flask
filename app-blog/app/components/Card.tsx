import React from "react";
import Link from "next/link";

interface CardProps{
    id: number;
    title: string;
    content: string;
    image_url: string;
}

const Card: React.FC<CardProps> = ({id, title, content, image_url}) => {
    return (
        <div className="bg-gray-100 shadow-lg overflow-hidden hover:shadow-xl
        transition-shadow duration-300">
            {
                image_url && (
                    <img src={image_url} alt={title} className="w-full h-48 object-cover"/>
                )
            }
            <div className="p-6">
                <h2 className="text-2xl font-bold text-devmoon-indigo mb-2">{title}</h2>
                <p className="text-gray-700">{content.slice(0,100)}...</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-devmoon-indigo to-devmoon-purple text-center">
            <Link href={`/article/${id}`}>
                <span className="text-white font-semibold hover:text-devmoon-accent cursor-pointer">
                    Leer mas
                </span>
            </Link>
            </div>
        </div>
    )
}

export default Card;