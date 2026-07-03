export interface Artist {
  id: string;
  name: string;
  englishName: string;
  years: string;
  era: string;
  values: string;
  expression: string;
  works: string[];
  avatarColor: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  greeting: string;
  suggestedQuestions: string[];
  systemPrompt: string;
}

export interface Worksheet {
  artistId: string;
  artistName: string;
  lifespan: string;
  values: string;       // 작가가 드러내고자 한 생각/가치관
  expression: string;   // 독특한 표현 방법과 스타일
  representativeWorks: string; // 더 찾은 대표작들
  verification: string; // 인터넷/책 등으로 직접 찾아보고 검증/보완한 내용
  questions: string;    // 더 궁금한 질문이나 내용
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
