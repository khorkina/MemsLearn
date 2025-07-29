import { Brain } from "lucide-react";
import { MemeFeed } from "@/components/meme-feed";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-primary">MemsLearn</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#feed" className="text-primary hover:text-primary/80 transition-colors">
                Feed
              </a>
              <a href="#progress" className="text-gray-500 hover:text-primary transition-colors">
                Progress
              </a>
              <a href="#saved" className="text-gray-500 hover:text-primary transition-colors">
                Saved
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <MemeFeed />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-primary">MemsLearn</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Learn English through the power of memes and humor
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              All meme content is sourced from Reddit with proper attribution
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}