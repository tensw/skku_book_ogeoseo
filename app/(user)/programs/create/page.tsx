"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  BookOpen,
  MapPin,
  Wifi,
  Monitor,
  Clock,
  Users,
  Tag,
  X,
  Zap,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSharedData } from "@/lib/shared-data-context"

const STEPS = [
  { label: "주제", icon: Zap },
  { label: "도서", icon: BookOpen },
  { label: "형식", icon: MapPin },
  { label: "장소", icon: MapPin },
  { label: "시간", icon: Clock },
  { label: "인원", icon: Users },
]

const AI_RECOMMENDED_BOOKS = [
  { title: "사피엔스", author: "유발 하라리" },
  { title: "데미안", author: "헤르만 헤세" },
  { title: "정의란 무엇인가", author: "마이클 샌델" },
  { title: "미움받을 용기", author: "기시미 이치로" },
  { title: "코스모스", author: "칼 세이건" },
]

// 성균관대학교 캠퍼스 건물 목록
const CAMPUS_BUILDINGS = [
  { name: "중앙학술정보관 스터디룸 2-1", category: "도서관" },
  { name: "중앙학술정보관 스터디룸 2-2", category: "도서관" },
  { name: "중앙학술정보관 스터디룸 3-1", category: "도서관" },
  { name: "중앙학술정보관 스터디룸 3-2", category: "도서관" },
  { name: "중앙학술정보관 스터디룸 4-1", category: "도서관" },
  { name: "삼성학술정보관 B1 세미나실", category: "도서관" },
  { name: "삼성학술정보관 스터디룸", category: "도서관" },
  { name: "학생회관 소회의실", category: "학생회관" },
  { name: "학생회관 대회의실", category: "학생회관" },
  { name: "호암관 세미나실", category: "강의동" },
  { name: "수선관 라운지", category: "강의동" },
  { name: "다산경제관 스터디룸", category: "강의동" },
  { name: "국제관 라운지", category: "강의동" },
  { name: "경영관 스터디룸", category: "강의동" },
  { name: "퇴계인문관 세미나실", category: "강의동" },
  { name: "제2공학관 라운지", category: "공학동" },
  { name: "산학협력센터 카페", category: "기타" },
  { name: "혜화문 카페거리", category: "교외" },
]

const ONLINE_TOOLS = ["Zoom", "Google Meet", "Discord"]

const TAG_OPTIONS = [
  "문학", "인문", "철학", "과학", "역사", "경제",
  "사회과학", "에세이", "고전", "자기계발", "심리학", "예술",
]

export default function BundokCreatePage() {
  const router = useRouter()
  const { addBundok } = useSharedData()

  const [step, setStep] = useState(0)

  // Step 1: 주제
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // Step 2: 도서
  const [selectedBook, setSelectedBook] = useState<{ title: string; author: string } | null>(null)
  const [customBookTitle, setCustomBookTitle] = useState("")
  const [customBookAuthor, setCustomBookAuthor] = useState("")
  const [useCustomBook, setUseCustomBook] = useState(false)

  // Step 3: 형식
  const [format, setFormat] = useState<"offline" | "online" | "hybrid" | "">("")

  // Step 4: 장소
  const [location, setLocation] = useState("")
  const [locationSearch, setLocationSearch] = useState("")
  const [directInput, setDirectInput] = useState(false)
  const [directLocation, setDirectLocation] = useState("")

  // Step 5: 시간
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState(90)

  // Step 6: 인원 & 태그
  const [maxMembers, setMaxMembers] = useState(4)
  const [tags, setTags] = useState<string[]>([])

  const filteredBuildings = useMemo(() => {
    if (!locationSearch.trim()) return CAMPUS_BUILDINGS
    const q = locationSearch.toLowerCase()
    return CAMPUS_BUILDINGS.filter(
      (b) => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    )
  }, [locationSearch])

  const canProceed = () => {
    switch (step) {
      case 0: return title.trim().length > 0
      case 1: return selectedBook !== null || (useCustomBook && customBookTitle.trim().length > 0)
      case 2: return format !== ""
      case 3: return location.trim().length > 0
      case 4: return date !== "" && time !== ""
      case 5: return tags.length > 0
      default: return false
    }
  }

  const handleSubmit = () => {
    const book = useCustomBook
      ? { title: customBookTitle, author: customBookAuthor }
      : selectedBook!

    addBundok({
      title,
      book: book.title,
      bookAuthor: book.author || "미상",
      bookCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop",
      host: "나",
      hostNickname: "나",
      hostAvatar: "https://picsum.photos/seed/me/80/80",
      format: format as "offline" | "online" | "hybrid",
      location,
      date,
      time,
      duration,
      currentMembers: 1,
      maxMembers,
      tags,
      status: "recruiting",
    })

    router.push("/programs")
  }

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 5 ? [...prev, tag] : prev
    )
  }

  return (
    <div className="flex flex-col pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 sm:px-8">
        <button
          onClick={() => (step > 0 ? setStep(step - 1) : router.back())}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-amber-600 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <h1 className="text-base font-bold text-foreground">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">번독</span> 개설
          </h1>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mt-4 px-5 sm:px-8">
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  "h-1.5 w-full rounded-full transition-all",
                  i < step
                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                    : i === step
                      ? "bg-amber-400 animate-pulse"
                      : "bg-muted"
                )}
              />
              <span className={cn(
                "text-xs font-semibold transition-colors",
                i <= step ? "text-amber-600" : "text-muted-foreground"
              )}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mt-6 px-5 sm:px-8">
        {/* Step 1: 주제 */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                <Zap size={20} className="mb-0.5 mr-1 inline text-amber-500" fill="currentColor" />
                어떤 주제로 모일까요?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">번독 모임의 주제와 간단한 소개를 적어주세요.</p>
            </div>
            <div>
              <label className="text-sm font-bold text-foreground">모임 주제</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 카페에서 읽는 데미안"
                className="mt-1.5 w-full rounded-xl border border-amber-200 bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                maxLength={50}
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">{title.length}/50</p>
            </div>
            <div>
              <label className="text-sm font-bold text-foreground">간단 소개 (선택)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="모임에 대해 간단히 소개해주세요."
                rows={3}
                className="mt-1.5 w-full resize-none rounded-xl border border-amber-200 bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                maxLength={200}
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">{description.length}/200</p>
            </div>
          </div>
        )}

        {/* Step 2: 도서 선택 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                <BookOpen size={20} className="mb-0.5 mr-1 inline text-amber-500" />
                어떤 책을 읽을까요?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">AI가 추천하는 도서를 선택하거나 직접 검색하세요.</p>
            </div>

            {!useCustomBook && (
              <>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-500" />
                  <span className="text-sm font-bold text-foreground">AI 추천 도서</span>
                </div>
                <div className="flex flex-col gap-2">
                  {AI_RECOMMENDED_BOOKS.map((book) => (
                    <button
                      key={book.title}
                      onClick={() => setSelectedBook(book)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                        selectedBook?.title === book.title
                          ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400"
                          : "border-border bg-card hover:border-amber-300"
                      )}
                    >
                      <BookOpen size={16} className={cn(
                        selectedBook?.title === book.title ? "text-amber-600" : "text-muted-foreground"
                      )} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{book.title}</p>
                        <p className="text-[10px] text-muted-foreground">{book.author}</p>
                      </div>
                      {selectedBook?.title === book.title && (
                        <Check size={16} className="ml-auto text-amber-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              onClick={() => {
                setUseCustomBook(!useCustomBook)
                setSelectedBook(null)
              }}
              className="text-xs font-semibold text-amber-600 hover:underline"
            >
              {useCustomBook ? "← AI 추천에서 선택" : "직접 도서 입력하기"}
            </button>

            {useCustomBook && (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-bold text-foreground">도서명</label>
                  <input
                    type="text"
                    value={customBookTitle}
                    onChange={(e) => setCustomBookTitle(e.target.value)}
                    placeholder="도서명을 입력하세요"
                    className="mt-1.5 w-full rounded-xl border border-amber-200 bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground">저자 (선택)</label>
                  <input
                    type="text"
                    value={customBookAuthor}
                    onChange={(e) => setCustomBookAuthor(e.target.value)}
                    placeholder="저자를 입력하세요"
                    className="mt-1.5 w-full rounded-xl border border-amber-200 bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: 형식 선택 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                <Monitor size={20} className="mb-0.5 mr-1 inline text-amber-500" />
                어떤 형식으로 만날까요?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">모임 진행 방식을 선택해주세요.</p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { value: "offline", icon: MapPin, label: "오프라인", desc: "학교 건물에서 직접 만나요" },
                { value: "online", icon: Wifi, label: "온라인", desc: "Zoom/Google Meet으로 만나요" },
                { value: "hybrid", icon: Monitor, label: "하이브리드", desc: "오프라인 + 온라인 동시 진행" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setFormat(opt.value as typeof format)
                    setLocation("")
                    setLocationSearch("")
                  }}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                    format === opt.value
                      ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400"
                      : "border-border bg-card hover:border-amber-300"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    format === opt.value ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-muted"
                  )}>
                    <opt.icon size={18} className={cn(
                      format === opt.value ? "text-white" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                  </div>
                  {format === opt.value && <Check size={18} className="ml-auto text-amber-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: 장소 선택 */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                <MapPin size={20} className="mb-0.5 mr-1 inline text-amber-500" />
                어디서 만날까요?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {format === "online" ? "사용할 온라인 도구를 선택하세요." : "건물명을 검색하여 장소를 선택하세요."}
              </p>
            </div>

            {(format === "offline" || format === "hybrid") && (
              <>
                {/* 검색 + 직접 입력 토글 */}
                <div className="flex gap-2">
                  {!directInput ? (
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                      <input
                        type="text"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        placeholder="건물명 검색 (예: 학술정보관, 호암관...)"
                        className="w-full rounded-xl border border-amber-200 bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>
                  ) : (
                    <div className="relative flex-1">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                      <input
                        type="text"
                        value={directLocation}
                        onChange={(e) => {
                          setDirectLocation(e.target.value)
                          setLocation(e.target.value)
                        }}
                        placeholder="장소를 직접 입력하세요 (예: 홍대 카페 OOO)"
                        className="w-full rounded-xl border border-amber-200 bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setDirectInput(!directInput)
                      setLocation("")
                      setDirectLocation("")
                      setLocationSearch("")
                    }}
                    className={cn(
                      "flex-shrink-0 rounded-xl border px-3 py-3 text-xs font-semibold transition-all",
                      directInput
                        ? "border-amber-400 bg-amber-50 text-amber-700"
                        : "border-border bg-card text-muted-foreground hover:border-amber-300 hover:text-amber-600"
                    )}
                  >
                    {directInput ? "건물 선택" : "직접 입력"}
                  </button>
                </div>

                {/* 선택된 장소 */}
                {location && (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5">
                    <MapPin size={14} className="text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700">{location}</span>
                    <button onClick={() => { setLocation(""); setDirectLocation("") }} className="ml-auto text-amber-400 hover:text-amber-600">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* 건물 목록 (건물 선택 모드일 때만) */}
                {!directInput && (
                  <div className="max-h-64 space-y-1.5 overflow-y-auto">
                    {filteredBuildings.map((building) => (
                      <button
                        key={building.name}
                        onClick={() => setLocation(format === "hybrid" ? `${building.name} / Zoom` : building.name)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                          location.includes(building.name)
                            ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400"
                            : "border-border bg-card hover:border-amber-300"
                        )}
                      >
                        <MapPin size={14} className={cn(
                          location.includes(building.name) ? "text-amber-600" : "text-muted-foreground"
                        )} />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-foreground">{building.name}</span>
                          <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">{building.category}</span>
                        </div>
                        {location.includes(building.name) && <Check size={14} className="text-amber-600" />}
                      </button>
                    ))}
                    {filteredBuildings.length === 0 && (
                      <p className="py-6 text-center text-sm text-muted-foreground">검색 결과가 없습니다</p>
                    )}
                  </div>
                )}
              </>
            )}

            {format === "online" && (
              <>
                <span className="text-sm font-bold text-foreground">온라인 도구</span>
                <div className="flex flex-col gap-2">
                  {ONLINE_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      onClick={() => setLocation(tool)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                        location === tool
                          ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400"
                          : "border-border bg-card hover:border-amber-300"
                      )}
                    >
                      <Wifi size={14} className={cn(
                        location === tool ? "text-amber-600" : "text-muted-foreground"
                      )} />
                      <span className="text-sm font-medium text-foreground">{tool}</span>
                      {location === tool && <Check size={14} className="ml-auto text-amber-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 5: 시간 선택 */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                <Clock size={20} className="mb-0.5 mr-1 inline text-amber-500" />
                언제 만날까요?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">날짜와 시간을 선택하세요.</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-bold text-foreground">날짜</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1.5 w-full rounded-xl border border-amber-200 bg-card px-3 py-2.5 text-sm text-foreground focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-bold text-foreground">시간</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-amber-200 bg-card px-3 py-2.5 text-sm text-foreground focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-foreground">소요 시간</label>
              <div className="mt-2 flex gap-2">
                {[60, 90, 120].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={cn(
                      "flex-1 rounded-xl border py-3 text-sm font-medium transition-all",
                      duration === d
                        ? "border-amber-400 bg-amber-50 text-amber-700 ring-1 ring-amber-400"
                        : "border-border bg-card text-foreground hover:border-amber-300"
                    )}
                  >
                    {d}분
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: 인원 & 태그 */}
        {step === 5 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                <Users size={20} className="mb-0.5 mr-1 inline text-amber-500" />
                마지막 설정!
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">인원과 태그를 설정하세요.</p>
            </div>

            <div className="flex gap-4">
              {/* 좌측: 최대 인원 */}
              <div className="flex flex-col items-center rounded-2xl border border-amber-200/60 bg-amber-50/30 p-4">
                <label className="text-sm font-bold text-foreground">최대 인원</label>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => setMaxMembers(Math.max(2, maxMembers - 1))}
                    disabled={maxMembers <= 2}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 text-amber-600 transition-all hover:bg-amber-100 disabled:opacity-30"
                  >
                    <span className="text-base font-bold">−</span>
                  </button>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-200/40">
                    <span className="text-lg font-bold text-white">{maxMembers}</span>
                  </div>
                  <button
                    onClick={() => setMaxMembers(Math.min(5, maxMembers + 1))}
                    disabled={maxMembers >= 5}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 text-amber-600 transition-all hover:bg-amber-100 disabled:opacity-30"
                  >
                    <span className="text-base font-bold">+</span>
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">2-5명</p>
              </div>

              {/* 우측: 태그 */}
              <div className="flex-1">
                <label className="flex items-center gap-1 text-sm font-bold text-foreground">
                  <Tag size={14} />
                  태그 (1~5개 선택)
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                        tags.includes(tag)
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-amber-50 hover:text-amber-700"
                      )}
                    >
                      {tag}
                      {tags.includes(tag) && <X size={10} className="ml-0.5 inline" />}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{tags.length}/5개 선택됨</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-amber-200/50 bg-card/95 px-5 py-3 backdrop-blur-md sm:bottom-0">
        <div className="mx-auto flex max-w-lg gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="rounded-full border border-amber-200 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-amber-50"
            >
              이전
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-200/40 transition-all hover:shadow-lg hover:brightness-110 disabled:opacity-40 disabled:shadow-none"
            >
              다음
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-200/40 transition-all hover:shadow-lg hover:brightness-110 disabled:opacity-40 disabled:shadow-none"
            >
              <Zap size={14} fill="currentColor" />
              번독 개설하기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
