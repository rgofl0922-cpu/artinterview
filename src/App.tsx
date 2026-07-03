import { useState, useEffect } from "react";
import { Artist, Worksheet, Message } from "./types.ts";
import { ARTISTS } from "./artists.ts";
import ArtistCard from "./components/ArtistCard.tsx";
import InterviewChat from "./components/InterviewChat.tsx";
import WorksheetEditor from "./components/WorksheetEditor.tsx";
import PrintWorksheet from "./components/PrintWorksheet.tsx";
import { 
  Palette, 
  Search, 
  Sparkles, 
  ArrowLeft, 
  MessageSquare, 
  FileEdit,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  BookOpen
} from "lucide-react";

export default function App() {
  // State for active views and selection
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEra, setSelectedEra] = useState<string>("전체");
  
  // Mobile active tab: 'interview' | 'worksheet'
  const [mobileTab, setMobileTab] = useState<'interview' | 'worksheet'>('interview');

  // Worksheets dictionary: artistId -> Worksheet
  const [worksheets, setWorksheets] = useState<Record<string, Worksheet>>({});
  
  // Chats dictionary: artistId -> Message[]
  const [chats, setChats] = useState<Record<string, Message[]>>({});
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Load worksheets from local storage on mount
  useEffect(() => {
    const savedWorksheets = localStorage.getItem("modern_art_worksheets");
    if (savedWorksheets) {
      try {
        setWorksheets(JSON.parse(savedWorksheets));
      } catch (e) {
        console.error("Error parsing worksheets from localStorage", e);
      }
    }
  }, []);

  // Save worksheets to local storage whenever they change
  const saveWorksheetsToLocalStorage = (newWorksheets: Record<string, Worksheet>) => {
    localStorage.setItem("modern_art_worksheets", JSON.stringify(newWorksheets));
  };

  // Helper to check if an artist's exploration is "completed"
  const isArtistCompleted = (artistId: string): boolean => {
    const sheet = worksheets[artistId];
    if (!sheet) return false;
    // Complete if both fields are populated with some minimal text (e.g., 10+ characters)
    return sheet.values.trim().length >= 10 && sheet.expression.trim().length >= 10;
  };

  // List of eras for filter buttons
  const eraCategories = [
    "전체",
    "인상주의",
    "초현실주의",
    "입체주의",
    "팝 아트",
    "한국미술 및 기타"
  ];

  // Map era names for flexible grouping
  const getArtistCategory = (era: string): string => {
    if (era.includes("인상주의")) return "인상주의";
    if (era.includes("초현실주의")) return "초현실주의";
    if (era.includes("입체주의")) return "입체주의";
    if (era.includes("팝 아트") || era.includes("현대 미술")) return "팝 아트";
    return "한국미술 및 기타";
  };

  // Filtered artists based on query & selected category
  const filteredArtists = ARTISTS.filter((artist) => {
    const matchesSearch = 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.era.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedEra === "전체") return matchesSearch;
    return getArtistCategory(artist.era) === selectedEra && matchesSearch;
  });

  // Count progress
  const completedCount = ARTISTS.filter(a => isArtistCompleted(a.id)).length;

  // Select an artist and initialize chat greeting
  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setMobileTab('interview');

    // Initialize chat with artist's custom greeting if not already done
    if (!chats[artist.id]) {
      const initialGreeting: Message = {
        id: "welcome",
        role: "assistant",
        content: artist.greeting,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => ({
        ...prev,
        [artist.id]: [initialGreeting]
      }));
    }
  };

  // Send a message to the server-side API proxy
  const handleSendMessage = async (content: string) => {
    if (!selectedArtist) return;
    const artistId = selectedArtist.id;
    
    // User message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages history locally
    const currentHistory = chats[artistId] || [];
    const updatedHistory = [...currentHistory, userMessage];
    setChats(prev => ({
      ...prev,
      [artistId]: updatedHistory
    }));

    setIsChatLoading(true);

    try {
      // Call secure full-stack API route to talk to Gemini API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistId,
          messages: updatedHistory
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "답변을 가져오는 중 오류가 발생했습니다.");
      }

      // Assistant response message
      const botMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prev => ({
        ...prev,
        [artistId]: [...updatedHistory, botMessage]
      }));
    } catch (error: any) {
      console.error(error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `⚠️ 오류가 발생했단다: ${error?.message || "네트워크 연결을 확인하고 다시 시도해 보렴."}`,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => ({
        ...prev,
        [artistId]: [...updatedHistory, errorMessage]
      }));
    } finally {
      setIsChatLoading(false);
    }
  };

  // Get active worksheet for the selected artist
  const getActiveWorksheet = (): Worksheet => {
    if (!selectedArtist) return {} as Worksheet;
    return worksheets[selectedArtist.id] || {
      artistId: selectedArtist.id,
      artistName: selectedArtist.name,
      lifespan: selectedArtist.years,
      values: "",
      expression: "",
      representativeWorks: "",
      verification: "",
      questions: ""
    };
  };

  // Update a field in the worksheet
  const handleUpdateWorksheet = (fields: Partial<Worksheet>) => {
    if (!selectedArtist) return;
    const artistId = selectedArtist.id;
    const activeSheet = getActiveWorksheet();
    const updatedSheet = { ...activeSheet, ...fields };
    
    const newWorksheets = {
      ...worksheets,
      [artistId]: updatedSheet
    };
    
    setWorksheets(newWorksheets);
    saveWorksheetsToLocalStorage(newWorksheets);
  };

  // Reset current worksheet
  const handleResetWorksheet = () => {
    if (!selectedArtist) return;
    if (confirm("정말로 이 작가의 활동지를 처음부터 다시 기록할래?")) {
      const artistId = selectedArtist.id;
      const emptySheet = {
        artistId,
        artistName: selectedArtist.name,
        lifespan: selectedArtist.years,
        values: "",
        expression: "",
        representativeWorks: "",
        verification: "",
        questions: ""
      };
      
      const newWorksheets = {
        ...worksheets,
        [artistId]: emptySheet
      };
      
      setWorksheets(newWorksheets);
      saveWorksheetsToLocalStorage(newWorksheets);
    }
  };

  // Reset entire application progress (for a new class activity)
  const handleResetAllProgress = () => {
    if (confirm("🚨 주의: 우리 반 친구들의 모든 작가 탐구 활동지를 전부 삭제하고 새로 시작할래?")) {
      setWorksheets({});
      setChats({});
      localStorage.removeItem("modern_art_worksheets");
      alert("모든 데이터가 완벽하게 초기화되었습니다. 새로운 탐구를 시작해 보세요!");
    }
  };

  // Trigger browser print dialog for the current worksheet
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-brand-cream text-black flex flex-col font-sans border-8 border-black" id="root-container">
      {/* 1. Main View Header with Artistic Bold Styling */}
      <header className="no-print sticky top-0 z-40 bg-brand-yellow border-b-4 border-black px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-black p-2 border-2 border-black text-white shadow-brutalist-sm">
              <Palette className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight flex items-center gap-1.5 font-display italic uppercase">
                현대 미술 거장 인터뷰 & 탐구대
                <span className="hidden sm:inline text-xs font-black px-2 py-0.5 border-2 border-black bg-white text-black shadow-brutalist-sm">어린이 미술 교실</span>
              </h1>
              <p className="text-xs font-bold text-black opacity-80">인공지능 캐릭터봇과 대화하고 직접 검증하며 나만의 멋진 보고서를 만드세요!</p>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="flex items-center gap-4 bg-white border-4 border-black p-2.5 px-4 shadow-brutalist-sm">
            <div className="text-right">
              <div className="text-[9px] text-black font-black uppercase tracking-wider">우리 반 탐구 진도</div>
              <div className="text-sm font-black text-black">
                총 <span className="text-red-600 font-black">{completedCount}</span> / 18명 완료
              </div>
            </div>
            
            {/* Visual Circular/Linear Progress bar */}
            <div className="w-24 sm:w-32 bg-white border-2 border-black h-4 overflow-hidden rounded-none">
              <div 
                className="bg-green-400 h-full border-r border-black transition-all duration-500"
                style={{ width: `${(completedCount / 18) * 100}%` }}
              />
            </div>

            {completedCount > 0 && (
              <button 
                onClick={handleResetAllProgress}
                className="p-1.5 bg-white border-2 border-black hover:bg-red-500 hover:text-white text-black shadow-brutalist-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                title="모든 탐구 초기화"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="no-print flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {!selectedArtist ? (
          /* =========================================================
             2. ARTIST SELECTION GRID VIEW (Main Screen)
             ========================================================= */
          <div className="space-y-6 animate-fade-in">
            {/* Search and Era categories Filter bar */}
            <div className="bg-brand-sand border-4 border-black p-6 shadow-brutalist space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-black flex items-center gap-1.5 font-display italic">
                    <BookOpen className="w-5 h-5 text-red-600" />
                    인터뷰하고 싶은 화가를 선택해 볼까요?
                  </h2>
                  <p className="text-xs font-bold text-black opacity-60 mt-0.5">우리 반 학생 18명에 맞추어 유명 현대 미술 작가 18명이 준비되어 있어요.</p>
                </div>

                {/* Search field */}
                <div className="relative max-w-md w-full border-2 border-black bg-white shadow-brutalist-sm">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-black">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="작가 이름, 작품명, 사조를 입력해 보세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white focus:outline-none font-mono text-black placeholder:text-black/40"
                  />
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-black/10">
                <span className="text-xs font-black text-black mr-2">미술 사조 분류:</span>
                {eraCategories.map((era) => (
                  <button
                    key={era}
                    onClick={() => setSelectedEra(era)}
                    className={`px-3 py-1.5 text-xs font-black border-2 border-black cursor-pointer shadow-brutalist-sm transition-all ${
                      selectedEra === era
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-brand-yellow hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                  >
                    {era}
                  </button>
                ))}
              </div>
            </div>

            {/* Zero Results */}
            {filteredArtists.length === 0 ? (
              <div className="bg-white border-4 border-black p-12 text-center shadow-brutalist">
                <Search className="w-10 h-10 text-black mx-auto mb-3" />
                <h3 className="text-base font-black text-black">검색 결과가 없어요</h3>
                <p className="text-xs font-bold text-black opacity-60 mt-1">다른 화가 이름이나 다른 카테고리를 눌러 선택해 보세요.</p>
              </div>
            ) : (
              /* Artists Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    onSelect={handleSelectArtist}
                    isCompleted={isArtistCompleted(artist.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* =========================================================
             3. ACTIVE DETAIL VIEW: CHAT + WORKSHEET EDITOR
             ========================================================= */
          <div className="space-y-5 animate-fade-in">
            {/* Back to Home & Details Subheader */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => setSelectedArtist(null)}
                className="inline-flex items-center gap-1.5 text-xs font-black text-black uppercase tracking-wider bg-white hover:bg-brand-yellow border-4 border-black p-2.5 px-4 shadow-brutalist hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>화가 리스트로 돌아가기</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-black text-black bg-green-400 border-4 border-black px-4 py-2.5 shadow-brutalist">
                <CheckCircle2 className={`w-4 h-4 ${isArtistCompleted(selectedArtist.id) ? "text-black" : "text-black animate-pulse"}`} />
                <span>
                  {isArtistCompleted(selectedArtist.id) 
                    ? "🎉 축하합니다! 탐구 활동지가 성공적으로 작성되었습니다." 
                    : "✍️ 가치관과 표현 방식을 10자 이상 적어 탐구를 완성해 보세요."
                  }
                </span>
              </div>
            </div>

            {/* Layout Switch: Split Screen on Large Screens, Tabbed view on Mobile */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-stretch">
              
              {/* Tab Selector for Mobile Devices only */}
              <div className="lg:hidden flex border-4 border-black bg-white mb-4 shadow-brutalist overflow-hidden p-1">
                <button
                  onClick={() => setMobileTab('interview')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black uppercase border-2 transition-colors cursor-pointer ${
                    mobileTab === 'interview' 
                      ? "bg-brand-yellow text-black border-black" 
                      : "border-transparent text-black/60 hover:text-black"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>캐릭터봇 인터뷰</span>
                </button>
                <button
                  onClick={() => setMobileTab('worksheet')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black uppercase border-2 transition-colors cursor-pointer ${
                    mobileTab === 'worksheet' 
                      ? "bg-brand-yellow text-black border-black" 
                      : "border-transparent text-black/60 hover:text-black"
                  }`}
                >
                  <FileEdit className="w-4 h-4" />
                  <span>나의 탐구 활동지</span>
                </button>
              </div>

              {/* Left Column: AI Character Bot Interview Chat (Grid: Col-span 5) */}
              <div className={`lg:col-span-5 h-[580px] lg:h-[680px] ${mobileTab === 'interview' ? 'block' : 'hidden lg:block'}`}>
                <InterviewChat
                  artist={selectedArtist}
                  messages={chats[selectedArtist.id] || []}
                  isLoading={isChatLoading}
                  onSendMessage={handleSendMessage}
                />
              </div>

              {/* Right Column: Exploration Worksheet Editor (Grid: Col-span 7) */}
              <div className={`lg:col-span-7 ${mobileTab === 'worksheet' ? 'block' : 'hidden lg:block'}`}>
                <WorksheetEditor
                  artist={selectedArtist}
                  worksheet={getActiveWorksheet()}
                  onUpdateWorksheet={handleUpdateWorksheet}
                  onPrint={handlePrint}
                  onReset={handleResetWorksheet}
                />
              </div>

            </div>
          </div>
        )}
      </main>

      {/* 4. HIDDEN PRINT VIEW (ONLY VISIBLE VIA SYSTEM PRINT DIALOG) */}
      {selectedArtist && (
        <div id="printable-worksheet-wrapper" className="hidden">
          <PrintWorksheet 
            artist={selectedArtist} 
            worksheet={getActiveWorksheet()} 
          />
        </div>
      )}
    </div>
  );
}
