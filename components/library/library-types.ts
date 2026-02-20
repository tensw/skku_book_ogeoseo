/**
 * KDC Badge gradient definitions.
 * Each badge has a unique gradient for its face and border.
 * These use CSS custom properties from the design token system where feasible,
 * but some per-badge decorative stops are kept as explicit values since each
 * badge intentionally uses a distinct hue-shift within the green palette.
 */
export interface KDCBadgeGradient {
  id: string
  label: string
  gradient: string
  borderGradient: string
}

export const KDC_BADGE_GRADIENTS: KDCBadgeGradient[] = [
  { id: "000", label: "총류",     gradient: "linear-gradient(135deg, hsl(var(--brand-mid)) 0%, #0D7349 50%, #042F24 100%)",  borderGradient: "linear-gradient(135deg, #34D399, #6EE7B7, #10B981)" },
  { id: "100", label: "철학",     gradient: "linear-gradient(135deg, #042F24 0%, hsl(var(--brand-mid)) 50%, #021A14 100%)",  borderGradient: "linear-gradient(135deg, #6EE7B7, #A7F3D0, #34D399)" },
  { id: "200", label: "종교",     gradient: "linear-gradient(135deg, #1A3C34 0%, #2D5A4E 50%, #0F2820 100%)",                borderGradient: "linear-gradient(135deg, #86EFAC, #BBF7D0, #4ADE80)" },
  { id: "300", label: "사회과학", gradient: "linear-gradient(135deg, #047857 0%, hsl(var(--brand-light)) 50%, #065F46 100%)", borderGradient: "linear-gradient(135deg, #A7F3D0, #D1FAE5, #6EE7B7)" },
  { id: "400", label: "자연과학", gradient: "linear-gradient(135deg, #022C1E 0%, hsl(var(--brand-mid)) 50%, #011B12 100%)",  borderGradient: "linear-gradient(135deg, #34D399, #6EE7B7, #10B981)" },
  { id: "500", label: "기술과학", gradient: "linear-gradient(135deg, #14532D 0%, #166534 50%, #0A3B1E 100%)",                borderGradient: "linear-gradient(135deg, #4ADE80, #86EFAC, #22C55E)" },
  { id: "600", label: "예술",     gradient: "linear-gradient(135deg, #115E45 0%, #0D9065 50%, #0A4030 100%)",                borderGradient: "linear-gradient(135deg, #5EEAD4, #99F6E4, #2DD4BF)" },
  { id: "700", label: "언어",     gradient: "linear-gradient(135deg, #1A3A30 0%, #2D6B55 50%, #102820 100%)",                borderGradient: "linear-gradient(135deg, #6EE7B7, #A7F3D0, #34D399)" },
  { id: "800", label: "문학",     gradient: "linear-gradient(135deg, hsl(var(--brand-mid)) 0%, #10B981 50%, #022C22 100%)",  borderGradient: "linear-gradient(135deg, #6EE7B7, #D1FAE5, #34D399)" },
  { id: "900", label: "역사",     gradient: "linear-gradient(135deg, #1B4D3E 0%, #2F7A5E 50%, #0E3328 100%)",                borderGradient: "linear-gradient(135deg, #86EFAC, #D1FAE5, #4ADE80)" },
]

export type ProgramType = "bundok" | "free" | "classic100" | "general"

export const programLabels: Record<ProgramType, string> = {
  bundok: "번독",
  free: "자유 서평",
  classic100: "고전100선",
  general: "일반",
}

export const programColors: Record<ProgramType, { bg: string; text: string }> = {
  bundok: { bg: "bg-emerald", text: "text-white" },
  free: { bg: "bg-primary", text: "text-white" },
  classic100: { bg: "bg-tangerine", text: "text-white" },
  general: { bg: "bg-muted", text: "text-foreground" },
}

export interface MyReview {
  id: number
  badgeId: string
  program: ProgramType
  book: { title: string; author: string; cover: string }
  rating: number
  text: string
  likes: number
  comments: number
  timeAgo: string
}

export const myReviews: MyReview[] = [
  {
    id: 1,
    badgeId: "800",
    program: "bundok",
    book: { title: "미드나이트 라이브러리", author: "매트 헤이그", cover: "https://picsum.photos/seed/rev4/100/140" },
    rating: 5,
    text: "살아보지 못한 삶들을 돌아보며 지금 이 순간의 소중함을 다시 느끼게 해준 책. 매트 헤이그의 따뜻한 문장들이 마음속에 오래 남았습니다.",
    likes: 42,
    comments: 7,
    timeAgo: "2일 전",
  },
  {
    id: 2,
    badgeId: "800",
    program: "free",
    book: { title: "1984", author: "조지 오웰", cover: "https://picsum.photos/seed/rev6/100/140" },
    rating: 5,
    text: "디스토피아의 고전을 다시 읽으니 소름이 돋을 정도로 현실과 겹치는 부분이 많았어요. 필독서 중의 필독서.",
    likes: 67,
    comments: 23,
    timeAgo: "5일 전",
  },
  {
    id: 3,
    badgeId: "300",
    program: "bundok",
    book: { title: "아주 작은 습관의 힘", author: "제임스 클리어", cover: "https://picsum.photos/seed/rev3/100/140" },
    rating: 4,
    text: "습관을 '정체성의 변화'로 바라보는 시선이 인상 깊었어요. 내가 어떤 사람이 되고 싶은지에서 출발하는 접근이 실천력을 높여주네요.",
    likes: 38,
    comments: 12,
    timeAgo: "1주 전",
  },
  {
    id: 4,
    badgeId: "900",
    program: "free",
    book: { title: "사피엔스", author: "유발 하라리", cover: "https://picsum.photos/seed/rev2/100/140" },
    rating: 5,
    text: "인류 역사를 전혀 새로운 관점에서 풀어낸 책. 농업혁명이 오히려 인류를 불행하게 만들었다는 주장은 충격적이면서도 설득력 있었어요.",
    likes: 56,
    comments: 18,
    timeAgo: "1주 전",
  },
  {
    id: 5,
    badgeId: "100",
    program: "general",
    book: { title: "생각에 관한 생각", author: "대니얼 카너먼", cover: "https://picsum.photos/seed/rev5/100/140" },
    rating: 4,
    text: "시스템1과 시스템2의 개념을 알고 나면 일상에서 내 생각의 오류가 보이기 시작합니다. 재독할 가치가 충분한 명저!",
    likes: 31,
    comments: 9,
    timeAgo: "2주 전",
  },
  {
    id: 6,
    badgeId: "000",
    program: "bundok",
    book: { title: "정보의 세계사", author: "제임스 글릭", cover: "https://picsum.photos/seed/rev7/100/140" },
    rating: 4,
    text: "정보라는 개념이 인류 문명에 미친 영향을 방대하게 조망한 책. 아날로그에서 디지털까지의 여정이 흥미롭습니다.",
    likes: 19,
    comments: 5,
    timeAgo: "3주 전",
  },
  {
    id: 7,
    badgeId: "400",
    program: "free",
    book: { title: "코스모스", author: "칼 세이건", cover: "https://picsum.photos/seed/rev8/100/140" },
    rating: 5,
    text: "우주의 광활함 앞에서 인간의 존재를 다시 생각하게 만드는 명저. 칼 세이건의 시적인 문체가 과학에 아름다움을 더합니다.",
    likes: 44,
    comments: 14,
    timeAgo: "3주 전",
  },
  {
    id: 8,
    badgeId: "500",
    program: "general",
    book: { title: "클린 코드", author: "로버트 C. 마틴", cover: "https://picsum.photos/seed/rev9/100/140" },
    rating: 4,
    text: "개발자라면 한 번쯤 읽어야 할 책. 깨끗한 코드 작성의 원칙과 실전 사례가 유익했어요.",
    likes: 27,
    comments: 8,
    timeAgo: "1달 전",
  },
  {
    id: 9,
    badgeId: "600",
    program: "bundok",
    book: { title: "미술관에 간 화학자", author: "전창림", cover: "https://picsum.photos/seed/rev10/100/140" },
    rating: 4,
    text: "화학적 시선으로 명화를 분석하는 독특한 접근. 예술과 과학의 만남이 신선합니다.",
    likes: 22,
    comments: 6,
    timeAgo: "1달 전",
  },
  {
    id: 10,
    badgeId: "300",
    program: "free",
    book: { title: "정의란 무엇인가", author: "마이클 샌델", cover: "https://picsum.photos/seed/rev11/100/140" },
    rating: 5,
    text: "정의에 대한 철학적 논쟁을 현실 사례와 엮어 풀어내는 샌델 교수의 필력이 돋보입니다.",
    likes: 53,
    comments: 20,
    timeAgo: "1달 전",
  },
]
