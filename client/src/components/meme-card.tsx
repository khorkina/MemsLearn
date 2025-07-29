import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";
import { Meme } from "@shared/schema";

interface MemeCardProps {
  meme: Meme;
  onClick: () => void;
}

export function MemeCard({ meme, onClick }: MemeCardProps) {
  const formatUpvotes = (upvotes: number) => {
    if (upvotes >= 1000) {
      return `${(upvotes / 1000).toFixed(1)}k`;
    }
    return upvotes.toString();
  };

  return (
    <Card 
      className="meme-card cursor-pointer overflow-hidden shadow-lg hover:shadow-xl"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={meme.url} 
          alt={meme.title}
          className="w-full h-64 object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback for broken images
            e.currentTarget.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400";
          }}
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
          {meme.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="truncate">{meme.subreddit}</span>
          <span className="flex items-center gap-1 text-primary">
            <ArrowUp className="w-3 h-3" />
            {formatUpvotes(meme.upvotes)}
          </span>
        </div>
        
        <a 
          href={meme.permalink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline mt-2 block truncate"
          onClick={(e) => e.stopPropagation()}
        >
          Source: {meme.permalink.replace('https://', '')}
        </a>
      </CardContent>
    </Card>
  );
}