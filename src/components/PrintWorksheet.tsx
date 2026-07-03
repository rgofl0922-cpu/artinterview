import { Artist, Worksheet } from "../types.ts";
import { Award, Palette, Calendar, Search, HelpCircle, FileText } from "lucide-react";

interface PrintWorksheetProps {
  artist: Artist;
  worksheet: Worksheet;
}

export default function PrintWorksheet({ artist, worksheet }: PrintWorksheetProps) {
  return (
    <div className="bg-white p-8 max-w-[800px] mx-auto border-4 border-black space-y-6 text-black font-sans" id="printable-worksheet">
      {/* School details / Identification boxes for paper handout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b-4 border-black gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-black font-black font-mono">Art Class Worksheet</span>
          <h1 className="text-2xl font-black text-black flex items-center gap-1.5 mt-0.5 font-display italic">
            <FileText className="w-6 h-6 text-red-600" />
            현대 미술 거장 탐구 결과 보고서
          </h1>
        </div>
        
        {/* Class/Number/Name Grid for handwritten or typed paper handout */}
        <div className="grid grid-cols-3 border-2 border-black text-center text-xs divide-x-2 divide-black h-11 w-64 bg-brand-sand">
          <div className="flex flex-col justify-between p-1">
            <span className="text-[10px] text-black font-black uppercase">학년 반</span>
            <span className="font-bold border-t border-black/30 pt-0.5 text-xs">   학년    반</span>
          </div>
          <div className="flex flex-col justify-between p-1">
            <span className="text-[10px] text-black font-black uppercase">번호</span>
            <span className="font-bold border-t border-black/30 pt-0.5 text-xs">       번</span>
          </div>
          <div className="flex flex-col justify-between p-1">
            <span className="text-[10px] text-black font-black uppercase">이름</span>
            <span className="font-bold border-t border-black/30 pt-0.5 text-xs"></span>
          </div>
        </div>
      </div>

      {/* Target Masterpiece Basic Information Block */}
      <div className="bg-brand-sand border-2 border-black p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center border-2 border-black text-base font-black ${artist.avatarColor}`}>
            {artist.name.slice(0, 2)}
          </div>
          <div>
            <div className="text-[9px] text-black/60 font-black uppercase">탐구 대상 화가</div>
            <div className="text-sm font-black text-black">{artist.name}</div>
            <div className="text-[10px] text-red-600 font-mono font-bold uppercase">{artist.englishName}</div>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1 text-black font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>생몰년도:</span>
          </div>
          <div className="text-black font-black pl-4.5">{artist.years}</div>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1 text-black font-bold">
            <Palette className="w-3.5 h-3.5" />
            <span>미술 사조:</span>
          </div>
          <div className="text-black font-black pl-4.5">{artist.era}</div>
        </div>
      </div>

      {/* Worksheet Content Sections */}
      <div className="space-y-5">
        
        {/* 1. Values Section */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-black text-black flex items-center gap-1.5 font-display">
            <span className="flex items-center justify-center w-5 h-5 border-2 border-black bg-brand-yellow text-black text-xs font-black">1</span>
            화가가 세상에 드러내고자 한 예술 가치관 (생각)
          </h3>
          <div className="min-h-[100px] p-3 border-2 border-black text-sm leading-relaxed whitespace-pre-wrap bg-white font-serif italic">
            {worksheet.values || <span className="text-black/40 italic text-xs">여기에 작가가 전하고 싶었던 깊은 메시지와 생각을 적어보세요.</span>}
          </div>
        </div>

        {/* 2. Expression Methods Section */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-black text-black flex items-center gap-1.5 font-display">
            <span className="flex items-center justify-center w-5 h-5 border-2 border-black bg-brand-yellow text-black text-xs font-black">2</span>
            화가만의 독특한 표현 기법과 특징적인 기법 (기법)
          </h3>
          <div className="min-h-[100px] p-3 border-2 border-black text-sm leading-relaxed whitespace-pre-wrap bg-white font-serif italic">
            {worksheet.expression || <span className="text-black/40 italic text-xs">여기에 화가가 어떤 고유의 표현 방식과 스타일을 사용했는지 정리해 보세요.</span>}
          </div>
        </div>

        {/* 3. Masterpieces Found */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-black text-black flex items-center gap-1.5 font-display">
            <span className="flex items-center justify-center w-5 h-5 border-2 border-black bg-brand-yellow text-black text-xs font-black">3</span>
            인터넷 및 미술 서적 조사를 통해 더 찾아낸 대표작들
          </h3>
          <div className="min-h-[70px] p-3 border-2 border-black text-sm leading-relaxed whitespace-pre-wrap bg-white font-serif italic">
            {worksheet.representativeWorks || <span className="text-black/40 italic text-xs">인터넷 혹은 미술 백과사전에서 찾아본 작가의 숨겨진 마스터피스들을 적어보세요.</span>}
          </div>
        </div>

        {/* 4. Secondary Verification and Supplement */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-black text-black flex items-center gap-1.5 font-display">
            <span className="flex items-center justify-center w-5 h-5 border-2 border-black bg-brand-yellow text-black text-xs font-black">4</span>
            인공지능 대화 확인 및 추가 보완한 학습 내용
          </h3>
          <div className="min-h-[100px] p-3 border-2 border-black text-sm leading-relaxed whitespace-pre-wrap bg-white font-serif italic">
            {worksheet.verification || <span className="text-black/40 italic text-xs">캐릭터봇이 준 정보를 인터넷 백과사전으로 검증해 보았거나 추가로 알게 된 지식을 보완해 보세요.</span>}
          </div>
        </div>

        {/* 5. Future Questions */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-black text-black flex items-center gap-1.5 font-display">
            <span className="flex items-center justify-center w-5 h-5 border-2 border-black bg-brand-yellow text-black text-xs font-black">5</span>
            앞으로 더 깊이 알아보고 싶은 수수께끼 질문들
          </h3>
          <div className="min-h-[70px] p-3 border-2 border-black text-sm leading-relaxed whitespace-pre-wrap bg-white font-serif italic">
            {worksheet.questions || <span className="text-black/40 italic text-xs">탐구를 진행하면서 미처 해결하지 못했거나 새롭게 샘솟은 궁금증들을 적어보세요.</span>}
          </div>
        </div>
      </div>

      {/* Teacher grading and feedback section */}
      <div className="mt-8 pt-6 border-t-2 border-dashed border-black flex justify-between gap-6">
        <div className="flex-1 border-2 border-black p-3 bg-brand-sand">
          <div className="text-[10px] font-black uppercase text-black tracking-widest flex items-center gap-1 mb-1">
            <Award className="w-3.5 h-3.5 text-red-600" />
            <span>선생님의 격려와 학습 피드백</span>
          </div>
          <div className="h-16 flex flex-col justify-between">
            <div className="border-b border-dashed border-black h-6"></div>
            <div className="border-b border-dashed border-black h-6"></div>
          </div>
        </div>

        <div className="w-32 border-2 border-black p-3 flex flex-col justify-between items-center bg-brand-sand">
          <span className="text-[10px] font-black text-black uppercase">평가 도장</span>
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-red-600 text-red-600 flex items-center justify-center text-[9px] font-black rotate-12">
            참 잘했어요!
          </div>
        </div>
      </div>
    </div>
  );
}
