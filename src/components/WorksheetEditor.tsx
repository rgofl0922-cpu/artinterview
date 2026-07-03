import React from "react";
import { Artist, Worksheet } from "../types.ts";
import { 
  FileText, 
  HelpCircle, 
  Palette, 
  Search, 
  Sparkles, 
  AlertCircle, 
  Bookmark,
  Printer,
  RotateCcw
} from "lucide-react";

interface WorksheetEditorProps {
  artist: Artist;
  worksheet: Worksheet;
  onUpdateWorksheet: (fields: Partial<Worksheet>) => void;
  onPrint: () => void;
  onReset: () => void;
}

export default function WorksheetEditor({
  artist,
  worksheet,
  onUpdateWorksheet,
  onPrint,
  onReset
}: WorksheetEditorProps) {

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateWorksheet({ [name]: value });
  };

  return (
    <div className="bg-white border-4 border-black shadow-brutalist p-6 space-y-6" id="worksheet-editor-container">
      {/* Worksheet Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b-4 border-black gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-yellow border-2 border-black text-black shadow-brutalist-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-black font-display uppercase italic tracking-tight">나의 현대 미술 탐구 활동지</h2>
            <p className="text-xs font-bold text-black opacity-60">인터뷰와 추가 조사를 마친 후 기록하는 나만의 생각 노트</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-black bg-brand-yellow hover:bg-[#ffe875] border-2 border-black shadow-brutalist-sm hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>인쇄 / PDF 저장</span>
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-red-600 bg-white hover:bg-red-50 border-2 border-black shadow-brutalist-sm hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
            title="활동지 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>
        </div>
      </div>

      {/* Information Scaffold Warning (Tilted Post-it Style) */}
      <div className="flex items-start gap-2.5 p-4 border-4 border-black bg-blue-500 text-white -rotate-1 shadow-brutalist-sm text-xs leading-relaxed">
        <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
        <div>
          <span className="font-black uppercase tracking-wider block mb-1">Teacher's Hint:</span>
          작가의 생몰년도와 기본 정보는 인터뷰를 통해 찾아낸 후, 인터넷이나 미술책, 백과사전 등을 추가로 검색해 보고 보고서를 더 풍성하게 검증해 보렴!
        </div>
      </div>

      {/* Inputs Form */}
      <div className="space-y-5">
        {/* Row 1: Artist Basic Info References */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-black text-red-600 mb-1.5 tracking-wider flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>작가 이름 및 생몰년도</span>
            </label>
            <div className="px-3 py-2 bg-brand-sand border-2 border-black text-sm font-black text-black shadow-brutalist-sm">
              {artist.name} ({artist.years})
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-black text-red-600 mb-1.5 tracking-wider flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>주요 미술 사조</span>
            </label>
            <div className="px-3 py-2 bg-brand-sand border-2 border-black text-sm font-black text-black shadow-brutalist-sm">
              {artist.era}
            </div>
          </div>
        </div>

        {/* Value Area */}
        <div>
          <label className="block text-xs font-black text-black mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>1. 작가가 그림을 통해 전하고 싶었던 가치관 (생각)</span>
            </span>
            <span className="text-[9px] font-black uppercase border border-black px-1.5 py-0.5 bg-red-500 text-white shadow-brutalist-sm">필수 기록</span>
          </label>
          <textarea
            name="values"
            value={worksheet.values}
            onChange={handleChange}
            placeholder="인터뷰를 진행하면서 작가가 세상에 알리고자 한 가치, 인생의 철학, 혹은 감정이 무엇인지 느낀 점을 적어 보세요.&#10;(예: 뭉크는 마음에 찾아오는 불안과 외로움을 숨기지 않고 그림을 통해 정직하게 소통하고자 했어요.)"
            rows={3}
            className="w-full px-3 py-2.5 text-sm border-2 border-black bg-white focus:outline-none text-black font-serif italic placeholder:text-black/30 shadow-brutalist-sm"
          />
        </div>

        {/* Expression Area */}
        <div>
          <label className="block text-xs font-black text-black mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-red-600" />
              <span>2. 작가의 독특한 표현 방법과 특징 (스타일)</span>
            </span>
            <span className="text-[9px] font-black uppercase border border-black px-1.5 py-0.5 bg-red-500 text-white shadow-brutalist-sm">필수 기록</span>
          </label>
          <textarea
            name="expression"
            value={worksheet.expression}
            onChange={handleChange}
            placeholder="작가가 이 가치관을 표현하기 위해 사용한 미술 기법, 붓터치, 색채 조합, 혹은 구도가 무엇인지 정리해 보세요.&#10;(예: 쇠라는 색을 팔레트에서 섞지 않고 원색의 작은 점들을 수없이 찍어서 입체적이고 밝게 보이게 만들었어요.)"
            rows={3}
            className="w-full px-3 py-2.5 text-sm border-2 border-black bg-white focus:outline-none text-black font-serif italic placeholder:text-black/30 shadow-brutalist-sm"
          />
        </div>

        {/* Secondary Masterpieces Area */}
        <div>
          <label className="block text-xs font-black text-black mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-red-600" />
              <span>3. 직접 조사하여 더 찾은 대표 걸작들</span>
            </span>
            <span className="text-[9px] font-black uppercase border border-black px-1.5 py-0.5 bg-brand-sand text-black shadow-brutalist-sm">인터넷 및 도서 연계</span>
          </label>
          <textarea
            name="representativeWorks"
            value={worksheet.representativeWorks}
            onChange={handleChange}
            placeholder="기본 대표작 외에 구글 아트나 책에서 새롭게 찾아낸 멋진 대표 걸작들의 제목을 적어 보세요!&#10;(예: 뭉크의 '불안', '사춘기', '생의 춤' 등)"
            rows={2}
            className="w-full px-3 py-2.5 text-sm border-2 border-black bg-white focus:outline-none text-black font-serif italic placeholder:text-black/30 shadow-brutalist-sm"
          />
        </div>

        {/* Verification and Supplement Area */}
        <div>
          <label className="block text-xs font-black text-black mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-red-600" />
              <span>4. 인공지능 답변 검증 및 추가 탐구로 보완한 내용</span>
            </span>
            <span className="text-[9px] font-black uppercase border border-black px-1.5 py-0.5 bg-brand-sand text-black shadow-brutalist-sm">자기주도 학습</span>
          </label>
          <textarea
            name="verification"
            value={worksheet.verification}
            onChange={handleChange}
            placeholder="캐릭터봇이 준 힌트 외에 백과사전이나 다른 책에서 사실 관계를 확인해 본 내용이 있나요? 새롭게 덧붙이고 싶은 이야기나 사실이 있다면 적어보세요.&#10;(예: 쿠사마 야요이 할머니는 어릴 때 정신적인 착시와 환각 증세를 겪었고, 지금도 병원과 작업실을 오가며 창작하고 있다는 것을 책에서 더 알게 되었습니다.)"
            rows={3}
            className="w-full px-3 py-2.5 text-sm border-2 border-black bg-white focus:outline-none text-black font-serif italic placeholder:text-black/30 shadow-brutalist-sm"
          />
        </div>

        {/* Deep Questions Area */}
        <div>
          <label className="block text-xs font-black text-black mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-red-600" />
              <span>5. 더 탐구해보고 싶거나, 해결되지 않은 궁금한 질문 리스트</span>
            </span>
            <span className="text-[9px] font-black uppercase border border-black px-1.5 py-0.5 bg-brand-sand text-black shadow-brutalist-sm">궁금증 적기</span>
          </label>
          <textarea
            name="questions"
            value={worksheet.questions}
            onChange={handleChange}
            placeholder="인터뷰와 조사를 하면서 더 물어보고 싶었거나, 아직 궁금증이 풀리지 않아 추가로 공부하고 싶은 질문들을 모아 보세요.&#10;(예: 마그리트는 상식을 파괴하는 법을 어떻게 매번 떠올릴 수 있었을까? 실제 벨기에에 마그리트의 집이 미술관으로 꾸며져 있다는데 가보고 싶다.)"
            rows={2}
            className="w-full px-3 py-2.5 text-sm border-2 border-black bg-white focus:outline-none text-black font-serif italic placeholder:text-black/30 shadow-brutalist-sm"
          />
        </div>
      </div>
    </div>
  );
}
