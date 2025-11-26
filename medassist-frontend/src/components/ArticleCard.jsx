import React from 'react';
// Import necessary Lucide icons
import { ChevronRight, TrendingUp, Target, Zap, User, BookOpen } from 'lucide-react';

// Map icon names (strings) to actual React components
const IconMap = { TrendingUp, Target, Zap };

export default function ArticleCard({ title, summary, link, icon, author, source }) {
    // Select the appropriate icon component
    const IconComponent = IconMap[icon] || ChevronRight;

    return (
        <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            // Styling with Tailwind CSS for a professional look: white background, shadow, and blue border bottom
            className="flex flex-col p-4 mb-3 bg-white border-b-4 border-blue-400 rounded-xl transition duration-300 ease-in-out shadow-md hover:shadow-lg hover:border-blue-600 cursor-pointer"
        >
            {/* Header: Icon and Title */}
            <div className="flex items-start mb-2">
                <div className="flex-shrink-0 mr-3 mt-1">
                    <IconComponent className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {title}
                </h3>
            </div>
            
            {/* Summary */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {summary}
            </p>

            {/* Source and Author details (to build trust) */}
            <div className="mt-auto pt-2 border-t border-gray-100 space-y-1">
                 {/* Source */}
                 <div className="flex items-center text-xs text-gray-500">
                    <BookOpen size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-700 truncate">{source}</span>
                </div>
                {/* Author */}
                <div className="flex items-center text-xs text-gray-500">
                    <User size={14} className="mr-1 text-gray-400 flex-shrink-0" />
                    <span>Tác giả: <span className="italic">{author}</span></span>
                </div>
                
            </div>
            
            {/* Detailed link button */}
            <span className="text-xs font-semibold text-blue-600 mt-2 self-start hover:underline">
                Đọc toàn bộ bài viết <ChevronRight size={14} className="inline-block translate-y-[-1px]"/>
            </span>
        </a>
    );
}
