# 오거서 백엔드 개발 명세서

**버전**: 2.0
**작성일**: 2026년 2월 11일
**대상**: 백엔드 개발자
**작성자**: PO

---

## 목차

1. [시스템 개요](#1-시스템-개요)
2. [ERD (데이터베이스 설계)](#2-erd-데이터베이스-설계)
3. [테이블 상세 스키마](#3-테이블-상세-스키마)
4. [API 명세서](#4-api-명세서)
5. [비즈니스 로직 (Pseudo Code)](#5-비즈니스-로직-pseudo-code)
6. [인증 및 권한](#6-인증-및-권한)
7. [외부 API 연동](#7-외부-api-연동)
8. [개발 우선순위](#8-개발-우선순위)

---

## 1. 시스템 개요

### 1.1 서비스 설명
**오거서**는 성균관대학교 독서 플랫폼으로, 독서모임(독모), 독서토론회(독토), 서평 작성, SNS(Talk) 기능을 제공합니다.

### 1.2 주요 도메인
```
┌─────────────────────────────────────────────────────────────┐
│                         오거서                               │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│    독모     │    독토      │    서평     │     Talk        │
│ (ReadingGroup)│(Discussion) │  (Review)   │   (TalkPost)    │
├─────────────┼─────────────┼─────────────┼─────────────────┤
│ - 여명독    │ - 학생주도   │ - KDC분류   │ - 게시물        │
│ - 윤슬독    │ - 교수주도   │ - 별점      │ - 좋아요        │
│ - 달빛독    │ - 작가주도   │ - 스탬프    │ - 댓글          │
└─────────────┴─────────────┴─────────────┴─────────────────┘
```

### 1.3 기술 스택 권장
- **Backend**: Node.js (Express/NestJS) 또는 Python (FastAPI/Django)
- **Database**: PostgreSQL 또는 MySQL
- **Cache**: Redis (세션, 실시간 데이터)
- **Storage**: AWS S3 또는 Firebase Storage (이미지)
- **Authentication**: JWT + OAuth (학교 SSO 연동 고려)
- **Rich Text Editor**: TipTap 또는 Quill (이미지, 링크 지원)
- **PDF Generation**: Puppeteer 또는 PDFKit
- **Excel Export**: ExcelJS 또는 SheetJS
- **External APIs**: 알라딘 API (도서 검색), 카피킬러 API (표절 검사)

---

## 2. ERD (데이터베이스 설계)

### 2.1 ERD 다이어그램 (텍스트)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    User      │       │    Book      │       │   Classic    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ email        │       │ title        │       │ book_id (FK) │
│ name         │       │ author       │       │ year         │
│ avatar_url   │       │ cover_url    │       │ category     │
│ role         │       │ category     │       └──────────────┘
│ created_at   │       │ publisher    │
└──────┬───────┘       │ isbn         │
       │               └──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Review     │       │  Discussion  │       │ ReadingGroup │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ user_id (FK) │       │ title        │       │ name         │
│ book_id (FK) │       │ book_id (FK) │       │ description  │
│ program_type │       │ leader_name  │       │ type         │
│ rating       │       │ leader_type  │       └──────┬───────┘
│ content      │       │ max_members  │              │
│ kdc_code     │       │ schedule     │              │ 1:N
│ created_at   │       │ tags         │              ▼
└──────────────┘       └──────┬───────┘       ┌──────────────┐
                              │               │  TimeSlot    │
                              │ N:M           ├──────────────┤
                              ▼               │ id (PK)      │
                       ┌──────────────┐       │ group_id(FK) │
                       │DiscussionUser│       │ time         │
                       ├──────────────┤       │ location     │
                       │ discussion_id│       └──────────────┘
                       │ user_id      │
                       │ joined_at    │
                       └──────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  TalkPost    │       │   Comment    │       │    Like      │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ user_id (FK) │       │ post_id (FK) │       │ user_id (FK) │
│ content      │       │ user_id (FK) │       │ target_type  │
│ book_mention │       │ content      │       │ target_id    │
│ photos[]     │       │ created_at   │       │ created_at   │
│ created_at   │       └──────────────┘       └──────────────┘
└──────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ DokmoSession │       │ WeeklyBook   │       │   Notice     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ user_id (FK) │       │ week_number  │       │ title        │
│ group_id (FK)│       │ year         │       │ content      │
│ time_slot_id │       │ yeomyeong_id │       │ type         │
│ date         │       │ dalbit_id    │       │ is_pinned    │
│ created_at   │       │ created_at   │       │ created_at   │
└──────────────┘       └──────────────┘       └──────────────┘

┌──────────────┐       ┌──────────────┐
│   Badge      │       │  UserBadge   │
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ user_id (FK) │
│ kdc_code     │       │ badge_id(FK) │
│ name         │       │ earned_at    │
│ icon         │       │ count        │
└──────────────┘       └──────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ ReviewMedia  │       │ ExternalBook │       │PlagiarismLog │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ review_id(FK)│       │ isbn (UK)    │       │ review_id(FK)│
│ user_id (FK) │       │ title        │       │ checked_by   │
│ media_type   │       │ author       │       │ similarity   │
│ url          │       │ source       │       │ status       │
│ alt_text     │       │ aladin_id    │       │ created_at   │
└──────────────┘       └──────────────┘       └──────────────┘
```

### 2.2 관계 설명

| 관계 | 설명 |
|------|------|
| User : Review | 1:N - 한 사용자가 여러 서평 작성 |
| User : Discussion | N:M - 여러 사용자가 여러 독토 참여 |
| User : DokmoSession | 1:N - 한 사용자가 여러 독모 세션 신청 |
| User : TalkPost | 1:N - 한 사용자가 여러 게시물 작성 |
| User : Badge | N:M - 여러 사용자가 여러 뱃지 획득 |
| ReadingGroup : TimeSlot | 1:N - 한 그룹에 여러 시간대 |
| Book : Review | 1:N - 한 책에 여러 서평 |
| TalkPost : Comment | 1:N - 한 게시물에 여러 댓글 |
| Review : ReviewMedia | 1:N - 한 서평에 여러 이미지/링크 |
| Review : PlagiarismLog | 1:N - 한 서평에 여러 표절검사 이력 |

---

## 3. 테이블 상세 스키마

### 3.1 User (사용자)
```sql
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),          -- OAuth 사용 시 nullable
    name            VARCHAR(100) NOT NULL,
    avatar_url      VARCHAR(500),
    role            VARCHAR(20) DEFAULT 'user',  -- 'user', 'admin'
    student_id      VARCHAR(20),           -- 학번 (선택)
    department      VARCHAR(100),          -- 학과 (선택)
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
```

### 3.2 Book (도서)
```sql
CREATE TABLE books (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    author          VARCHAR(255) NOT NULL,
    cover_url       VARCHAR(500),
    category        VARCHAR(100),
    publisher       VARCHAR(100),
    published_year  INTEGER,
    isbn            VARCHAR(20),
    description     TEXT,
    kdc_code        VARCHAR(10),           -- KDC 분류코드 (000-900)
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### 3.3 Review (서평)
```sql
CREATE TABLE reviews (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id         INTEGER REFERENCES books(id) ON DELETE CASCADE,
    program_type    VARCHAR(20) NOT NULL,  -- 'dokmo', 'dokto', 'general'
    rating          INTEGER CHECK (rating >= 1 AND rating <= 5),
    title           VARCHAR(255),          -- 글 제목
    content         TEXT NOT NULL,         -- 리치 텍스트 (HTML 형식)
    content_plain   TEXT,                  -- 순수 텍스트 (검색/글자수용)
    word_count      INTEGER DEFAULT 0,     -- 글자수
    kdc_code        VARCHAR(10),           -- 뱃지 획득용
    likes_count     INTEGER DEFAULT 0,
    comments_count  INTEGER DEFAULT 0,

    -- 표절 검사 관련
    plagiarism_checked  BOOLEAN DEFAULT FALSE,
    plagiarism_score    DECIMAL(5,2),      -- 표절률 (%)
    plagiarism_report   JSONB,             -- 카피킬러 결과 상세
    plagiarism_checked_at TIMESTAMP,

    -- 심사 관련
    year            INTEGER,               -- 작성 연도 (심사용)
    is_eligible     BOOLEAN DEFAULT TRUE,  -- 심사 대상 여부

    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- 연도별 심사대상 조회 인덱스
CREATE INDEX idx_reviews_year_eligible ON reviews(year, is_eligible);
```

### 3.4 Discussion (독토)
```sql
CREATE TABLE discussions (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    book_id         INTEGER REFERENCES books(id),
    leader_name     VARCHAR(100) NOT NULL,
    leader_type     VARCHAR(20) NOT NULL,  -- 'student', 'professor', 'author'
    leader_dept     VARCHAR(100),
    leader_message  TEXT,
    max_members     INTEGER DEFAULT 10,
    current_members INTEGER DEFAULT 0,
    schedule        VARCHAR(100),          -- "매주 화 20:00"
    tags            VARCHAR(255)[],        -- ARRAY type
    cover_url       VARCHAR(500),
    vibe_image_url  VARCHAR(500),
    rating          DECIMAL(2,1) DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### 3.5 DiscussionUser (독토 참여자) - 중간 테이블
```sql
CREATE TABLE discussion_users (
    id              SERIAL PRIMARY KEY,
    discussion_id   INTEGER REFERENCES discussions(id) ON DELETE CASCADE,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status          VARCHAR(20) DEFAULT 'active',  -- 'active', 'completed', 'cancelled'
    joined_at       TIMESTAMP DEFAULT NOW(),
    UNIQUE(discussion_id, user_id)
);
```

### 3.6 ReadingGroup (독모 그룹)
```sql
CREATE TABLE reading_groups (
    id              VARCHAR(20) PRIMARY KEY,  -- 'yeomyeong', 'yunseul', 'dalbit'
    name            VARCHAR(50) NOT NULL,      -- '여명독', '윤슬독', '달빛독'
    description     VARCHAR(255),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO reading_groups VALUES
    ('yeomyeong', '여명독', '아침 독서모임 (6-9시)'),
    ('yunseul', '윤슬독', '점심 독서모임 (12-14시)'),
    ('dalbit', '달빛독', '저녁 독서모임 (17-22시)');
```

### 3.7 TimeSlot (독모 시간대)
```sql
CREATE TABLE time_slots (
    id              SERIAL PRIMARY KEY,
    group_id        VARCHAR(20) REFERENCES reading_groups(id),
    time            VARCHAR(10) NOT NULL,      -- '06:00', '07:00', ...
    display_time    VARCHAR(50),               -- '오전 6:00 - 7:00'
    location        VARCHAR(100),              -- '스터디룸 2-1'
    UNIQUE(group_id, time)
);
```

### 3.8 DokmoSession (독모 신청)
```sql
CREATE TABLE dokmo_sessions (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    group_id        VARCHAR(20) REFERENCES reading_groups(id),
    time_slot_id    INTEGER REFERENCES time_slots(id),
    session_date    DATE NOT NULL,
    status          VARCHAR(20) DEFAULT 'active',  -- 'active', 'completed', 'cancelled'
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, group_id, time_slot_id, session_date)
);
```

### 3.9 WeeklyBook (주차별 도서 배정)
```sql
CREATE TABLE weekly_books (
    id              SERIAL PRIMARY KEY,
    year            INTEGER NOT NULL,
    week_number     INTEGER NOT NULL,          -- 1-52
    yeomyeong_book_id INTEGER REFERENCES books(id),  -- 여명독/윤슬독 공통
    dalbit_book_id    INTEGER REFERENCES books(id),  -- 달빛독
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(year, week_number)
);
```

### 3.10 TalkPost (Talk 게시물)
```sql
CREATE TABLE talk_posts (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    book_mention    VARCHAR(255),              -- 언급된 책 제목
    photos          VARCHAR(500)[],            -- 이미지 URL 배열
    likes_count     INTEGER DEFAULT 0,
    comments_count  INTEGER DEFAULT 0,
    shares_count    INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
```

### 3.11 Comment (댓글)
```sql
CREATE TABLE comments (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id         INTEGER REFERENCES talk_posts(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    likes_count     INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### 3.12 Like (좋아요)
```sql
CREATE TABLE likes (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    target_type     VARCHAR(20) NOT NULL,      -- 'review', 'post', 'comment'
    target_id       INTEGER NOT NULL,
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);
```

### 3.13 Badge (뱃지)
```sql
CREATE TABLE badges (
    id              SERIAL PRIMARY KEY,
    kdc_code        VARCHAR(10) UNIQUE NOT NULL,  -- '000', '100', ... '900'
    name            VARCHAR(50) NOT NULL,          -- '총류', '철학', ...
    icon            VARCHAR(50),
    gradient        VARCHAR(255)
);

-- 초기 데이터
INSERT INTO badges (kdc_code, name) VALUES
    ('000', '총류'), ('100', '철학'), ('200', '종교'),
    ('300', '사회과학'), ('400', '자연과학'), ('500', '기술과학'),
    ('600', '예술'), ('700', '언어'), ('800', '문학'), ('900', '역사');
```

### 3.14 UserBadge (사용자 뱃지)
```sql
CREATE TABLE user_badges (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id        INTEGER REFERENCES badges(id),
    count           INTEGER DEFAULT 1,         -- 해당 분류 서평 수
    earned_at       TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);
```

### 3.15 Notice (공지사항)
```sql
CREATE TABLE notices (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    content         TEXT NOT NULL,
    type            VARCHAR(20) DEFAULT 'notice',  -- 'notice', 'event', 'update'
    is_pinned       BOOLEAN DEFAULT false,
    views_count     INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
```

### 3.16 Classic100 (고전 100선)
```sql
CREATE TABLE classic_100 (
    id              SERIAL PRIMARY KEY,
    book_id         INTEGER REFERENCES books(id),
    year            INTEGER NOT NULL,          -- 선정 연도
    category        VARCHAR(50) NOT NULL,      -- '문학·예술', '인문·사회', '자연과학'
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(book_id, year)
);
```

### 3.17 ReviewMedia (서평 미디어)
```sql
-- 서평 내 이미지 관리 (리치 텍스트 에디터용)
CREATE TABLE review_media (
    id              SERIAL PRIMARY KEY,
    review_id       INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    media_type      VARCHAR(20) NOT NULL,      -- 'image', 'link'
    url             VARCHAR(500) NOT NULL,     -- 이미지 URL 또는 링크 URL
    alt_text        VARCHAR(255),              -- 이미지 대체 텍스트
    original_name   VARCHAR(255),              -- 원본 파일명
    file_size       INTEGER,                   -- 파일 크기 (bytes)
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_review_media_review ON review_media(review_id);
```

### 3.18 ExternalBook (외부 도서 - 알라딘 API)
```sql
-- 알라딘 API에서 가져온 도서 정보 캐싱
CREATE TABLE external_books (
    id              SERIAL PRIMARY KEY,
    isbn            VARCHAR(20) UNIQUE NOT NULL,
    title           VARCHAR(255) NOT NULL,
    author          VARCHAR(255),
    publisher       VARCHAR(100),
    published_date  DATE,
    cover_url       VARCHAR(500),
    description     TEXT,
    price           INTEGER,
    category        VARCHAR(100),
    aladin_item_id  VARCHAR(50),               -- 알라딘 상품ID
    source          VARCHAR(20) DEFAULT 'aladin',
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_external_books_isbn ON external_books(isbn);
CREATE INDEX idx_external_books_title ON external_books USING gin(to_tsvector('korean', title));
```

### 3.19 PlagiarismLog (표절 검사 로그)
```sql
-- 표절 검사 이력 관리
CREATE TABLE plagiarism_logs (
    id              SERIAL PRIMARY KEY,
    review_id       INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    checked_by      INTEGER REFERENCES users(id),  -- 검사 실행한 관리자
    similarity_score DECIMAL(5,2),             -- 유사도 (%)
    matched_sources JSONB,                     -- 매칭된 소스 목록
    api_response    JSONB,                     -- 카피킬러 API 전체 응답
    status          VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'completed', 'failed'
    error_message   TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_plagiarism_logs_review ON plagiarism_logs(review_id);
```

---

## 4. API 명세서

### 4.1 인증 API

#### POST /api/auth/login
로그인
```json
// Request
{
    "email": "user@skku.edu",
    "password": "password123"
}

// Response 200
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "user": {
            "id": 1,
            "email": "user@skku.edu",
            "name": "홍길동",
            "role": "user"
        }
    }
}
```

#### POST /api/auth/register
회원가입
```json
// Request
{
    "email": "user@skku.edu",
    "password": "password123",
    "name": "홍길동",
    "studentId": "2024123456",  // optional
    "department": "컴퓨터공학과"  // optional
}

// Response 201
{
    "success": true,
    "message": "회원가입이 완료되었습니다."
}
```

---

### 4.2 독토 (Discussion) API

#### GET /api/discussions
독토 목록 조회
```json
// Query Parameters
// ?leaderType=student&page=1&limit=10

// Response 200
{
    "success": true,
    "data": {
        "discussions": [
            {
                "id": 1,
                "title": "숨겨둔 내 안의 이야기",
                "book": {
                    "id": 1,
                    "title": "아무튼, 메모",
                    "author": "작가명",
                    "coverUrl": "https://..."
                },
                "leaderName": "OOO 학생",
                "leaderType": "student",
                "currentMembers": 5,
                "maxMembers": 8,
                "schedule": "매주 화 20:00",
                "tags": ["에세이", "자기탐색"],
                "rating": 4.8,
                "isJoined": false
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 3,
            "totalCount": 25
        }
    }
}
```

#### GET /api/discussions/:id
독토 상세 조회
```json
// Response 200
{
    "success": true,
    "data": {
        "id": 1,
        "title": "숨겨둔 내 안의 이야기",
        "book": { ... },
        "leader": {
            "name": "OOO 학생",
            "type": "student",
            "dept": "중국어학과",
            "message": "감정을 메모하는 습관이..."
        },
        "currentMembers": 5,
        "maxMembers": 8,
        "schedule": ["3/10 (화) 20:00", "3/24 (화) 20:00"],
        "assignments": [
            { "week": "1주차", "task": "일상 속 감정에 이름 붙이기..." }
        ],
        "tags": ["에세이", "자기탐색"],
        "isJoined": false
    }
}
```

#### POST /api/discussions/:id/join
독토 참여 신청
```json
// Headers: Authorization: Bearer {token}

// Response 200
{
    "success": true,
    "message": "독토 참여 신청이 완료되었습니다."
}

// Response 400 (정원 초과)
{
    "success": false,
    "error": "정원이 초과되었습니다."
}

// Response 409 (이미 신청)
{
    "success": false,
    "error": "이미 참여 중인 독토입니다."
}
```

#### POST /api/discussions (관리자)
독토 생성
```json
// Headers: Authorization: Bearer {admin_token}

// Request
{
    "title": "새로운 독토",
    "bookId": 1,
    "leaderName": "리더명",
    "leaderType": "student",
    "maxMembers": 10,
    "schedule": "매주 금 19:00",
    "tags": ["철학", "토론"]
}

// Response 201
{
    "success": true,
    "data": { "id": 5 }
}
```

---

### 4.3 독모 (Reading Group) API

#### GET /api/reading-groups
독모 그룹 목록 조회
```json
// Response 200
{
    "success": true,
    "data": [
        {
            "id": "yeomyeong",
            "name": "여명독",
            "description": "아침 독서모임 (6-9시)",
            "timeSlots": [
                { "id": 1, "time": "06:00", "displayTime": "오전 6:00 - 7:00", "location": "스터디룸 2-1" },
                { "id": 2, "time": "07:00", "displayTime": "오전 7:00 - 8:00", "location": "스터디룸 2-1" }
            ],
            "currentBook": {
                "id": 1,
                "title": "이번 주 도서",
                "author": "저자명",
                "coverUrl": "https://..."
            }
        }
    ]
}
```

#### POST /api/dokmo-sessions
독모 세션 신청
```json
// Headers: Authorization: Bearer {token}

// Request
{
    "groupId": "yeomyeong",
    "timeSlotId": 1,
    "sessionDate": "2026-02-15"
}

// Response 201
{
    "success": true,
    "message": "독모 신청이 완료되었습니다."
}
```

#### GET /api/users/me/dokmo-sessions
내가 신청한 독모 목록
```json
// Headers: Authorization: Bearer {token}

// Response 200
{
    "success": true,
    "data": [
        {
            "id": 1,
            "group": { "id": "yeomyeong", "name": "여명독" },
            "timeSlot": { "time": "06:00", "displayTime": "오전 6:00 - 7:00", "location": "스터디룸 2-1" },
            "sessionDate": "2026-02-15",
            "book": { "title": "도서명", "author": "저자명" },
            "status": "active"
        }
    ]
}
```

---

### 4.4 서평 (Review) API

#### GET /api/reviews
서평 목록 조회
```json
// Query: ?kdcCode=800&page=1&limit=10

// Response 200
{
    "success": true,
    "data": {
        "reviews": [
            {
                "id": 1,
                "user": { "id": 1, "name": "홍길동", "avatarUrl": "..." },
                "book": { "id": 1, "title": "도서명", "author": "저자명", "coverUrl": "..." },
                "programType": "dokmo",
                "rating": 5,
                "content": "서평 내용...",
                "kdcCode": "800",
                "likesCount": 42,
                "commentsCount": 7,
                "isLiked": false,
                "createdAt": "2026-02-10T10:00:00Z"
            }
        ],
        "pagination": { ... }
    }
}
```

#### POST /api/reviews
서평 작성
```json
// Headers: Authorization: Bearer {token}

// Request
{
    "bookId": 1,
    "programType": "dokmo",
    "rating": 5,
    "content": "서평 내용...",
    "kdcCode": "800"
}

// Response 201
{
    "success": true,
    "data": {
        "reviewId": 10,
        "stampCount": 11,  // 현재 스탬프 수
        "badgeEarned": { "kdcCode": "800", "name": "문학" }  // 새로 획득한 뱃지 (있는 경우)
    }
}
```

#### GET /api/users/me/reviews
내 서평 목록
```json
// Headers: Authorization: Bearer {token}
// Query: ?programType=dokmo

// Response 200
{
    "success": true,
    "data": {
        "reviews": [ ... ],
        "stats": {
            "total": 10,
            "byProgram": { "dokmo": 5, "dokto": 3, "general": 2 }
        }
    }
}
```

---

### 4.5 Talk API

#### GET /api/talk/posts
Talk 게시물 목록
```json
// Query: ?page=1&limit=10

// Response 200
{
    "success": true,
    "data": {
        "posts": [
            {
                "id": 1,
                "user": { "id": 1, "name": "홍길동", "avatarUrl": "..." },
                "content": "게시물 내용...",
                "bookMention": "채식주의자",
                "photos": ["https://...", "https://..."],
                "likesCount": 56,
                "commentsCount": 12,
                "sharesCount": 7,
                "isLiked": false,
                "createdAt": "2026-02-10T10:00:00Z"
            }
        ],
        "pagination": { ... }
    }
}
```

#### POST /api/talk/posts
게시물 작성
```json
// Headers: Authorization: Bearer {token}

// Request (multipart/form-data)
{
    "content": "게시물 내용",
    "bookMention": "책 제목",  // optional
    "photos": [File, File]     // optional, 이미지 파일
}

// Response 201
{
    "success": true,
    "data": { "id": 10 }
}
```

#### POST /api/talk/posts/:id/like
좋아요 토글
```json
// Headers: Authorization: Bearer {token}

// Response 200
{
    "success": true,
    "data": {
        "isLiked": true,
        "likesCount": 57
    }
}
```

---

### 4.6 내 서재 (Library) API

#### GET /api/users/me/library
내 서재 정보 조회
```json
// Headers: Authorization: Bearer {token}

// Response 200
{
    "success": true,
    "data": {
        "user": { "id": 1, "name": "홍길동" },
        "stats": {
            "badgesEarned": 8,
            "totalBadges": 10,
            "reviewsWritten": 12,
            "stampsCollected": 12
        },
        "radarData": [
            { "kdcCode": "000", "label": "총류", "value": 30 },
            { "kdcCode": "100", "label": "철학", "value": 75 },
            ...
        ],
        "badges": [
            { "kdcCode": "800", "name": "문학", "earned": true, "count": 3 },
            ...
        ],
        "preferredCategory": { "kdcCode": "800", "name": "문학" },
        "recentReviews": [ ... ],
        "myDokmo": [ ... ],
        "myDokto": [ ... ]
    }
}
```

---

### 4.7 관리자 API

#### GET /api/admin/programs/weekly-books
주차별 도서 배정 조회
```json
// Headers: Authorization: Bearer {admin_token}

// Response 200
{
    "success": true,
    "data": {
        "currentWeek": 7,
        "assignments": [
            {
                "weekNumber": 7,
                "yeomyeongBook": { "id": 1, "title": "...", "author": "..." },
                "dalbitBook": { "id": 2, "title": "...", "author": "..." }
            }
        ]
    }
}
```

#### PUT /api/admin/programs/weekly-books/:weekNumber
주차별 도서 배정 수정
```json
// Headers: Authorization: Bearer {admin_token}

// Request
{
    "yeomyeongBookId": 1,
    "dalbitBookId": 2
}

// Response 200
{
    "success": true,
    "message": "도서 배정이 완료되었습니다."
}
```

---

### 4.8 관리자 서평 관리 API (신규)

#### GET /api/admin/reviews/export/excel
**심사대상 서평 엑셀 추출**
```json
// Headers: Authorization: Bearer {admin_token}
// Query: ?year=2026&programType=dokmo

// Response 200 (Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
// 파일 다운로드: 심사대상_서평_2026.xlsx

// 엑셀 컬럼:
// | 아이디(학번) | 전공 | 이름 | 글제목 | 서지사항(책제목/저자/출판사) | 글자수 | 글쓴 날짜 |
```

#### GET /api/admin/reviews/export/pdf
**사용자별 서평 모음 PDF 추출**
```json
// Headers: Authorization: Bearer {admin_token}
// Query: ?userId=123&year=2026

// Response 200 (Content-Type: application/pdf)
// 파일 다운로드: 홍길동_서평모음_2026.pdf

// PDF 포맷:
// - 표지: 사용자명, 기간
// - 각 서평: 제목, 도서정보, 본문, 작성일
```

#### POST /api/admin/reviews/export/pdf/batch
**다중 사용자 PDF 일괄 생성**
```json
// Headers: Authorization: Bearer {admin_token}

// Request
{
    "userIds": [1, 2, 3, 4, 5],
    "year": 2026
}

// Response 200
{
    "success": true,
    "data": {
        "zipUrl": "https://storage.../서평모음_2026.zip",
        "filesCount": 5,
        "expiresAt": "2026-02-12T00:00:00Z"  // 24시간 후 만료
    }
}
```

#### POST /api/admin/reviews/:id/plagiarism-check
**표절 검사 실행 (단건)**
```json
// Headers: Authorization: Bearer {admin_token}

// Response 200
{
    "success": true,
    "data": {
        "reviewId": 1,
        "similarityScore": 12.5,
        "status": "completed",
        "matchedSources": [
            {
                "source": "네이버 블로그",
                "url": "https://...",
                "matchRate": 8.2
            },
            {
                "source": "교보문고 리뷰",
                "url": "https://...",
                "matchRate": 4.3
            }
        ],
        "checkedAt": "2026-02-11T10:30:00Z"
    }
}
```

#### POST /api/admin/reviews/plagiarism-check/batch
**표절 검사 일괄 실행**
```json
// Headers: Authorization: Bearer {admin_token}

// Request
{
    "year": 2026,
    "programType": "dokmo"  // optional, 전체는 생략
}

// Response 202 (Accepted - 백그라운드 처리)
{
    "success": true,
    "data": {
        "jobId": "plagiarism-check-20260211-001",
        "totalReviews": 150,
        "estimatedTime": "약 30분",
        "statusUrl": "/api/admin/jobs/plagiarism-check-20260211-001"
    }
}
```

#### GET /api/admin/reviews/plagiarism-report
**표절 검사 결과 리포트**
```json
// Headers: Authorization: Bearer {admin_token}
// Query: ?year=2026&threshold=20  // 20% 이상만 조회

// Response 200
{
    "success": true,
    "data": {
        "totalChecked": 150,
        "flaggedCount": 12,  // threshold 이상
        "reviews": [
            {
                "id": 45,
                "user": { "id": 1, "name": "홍길동", "studentId": "2024123456" },
                "title": "서평 제목",
                "similarityScore": 35.2,
                "checkedAt": "2026-02-11T10:30:00Z"
            }
        ]
    }
}
```

---

### 4.9 도서 검색 API (알라딘 연동)

#### GET /api/books/search
**도서 검색 (알라딘 API 연동)**
```json
// Headers: Authorization: Bearer {token}
// Query: ?query=채식주의자&searchType=title&page=1

// searchType: 'title', 'author', 'isbn'

// Response 200
{
    "success": true,
    "data": {
        "books": [
            {
                "isbn": "9788936434120",
                "title": "채식주의자",
                "author": "한강",
                "publisher": "창비",
                "publishedDate": "2007-10-30",
                "coverUrl": "https://image.aladin.co.kr/...",
                "description": "2016년 맨부커상 수상작...",
                "price": 13000,
                "source": "aladin",
                "isLibraryOwned": false  // 도서관 소장 여부
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalResults": 5,
            "hasMore": false
        }
    }
}
```

#### POST /api/books/import
**외부 도서 등록 (서평 작성 시)**
```json
// Headers: Authorization: Bearer {token}

// Request
{
    "isbn": "9788936434120",
    "source": "aladin"  // 'aladin', 'manual'
}

// Response 201
{
    "success": true,
    "data": {
        "bookId": 125,
        "title": "채식주의자",
        "author": "한강",
        "coverUrl": "https://..."
    }
}
```

---

### 4.10 리치 텍스트 에디터 API

#### POST /api/uploads/image
**에디터 이미지 업로드**
```json
// Headers: Authorization: Bearer {token}
// Content-Type: multipart/form-data

// Request
{
    "image": File,          // 이미지 파일
    "reviewId": 1           // optional, 서평에 연결
}

// Response 201
{
    "success": true,
    "data": {
        "url": "https://storage.../uploads/2026/02/image-abc123.jpg",
        "thumbnailUrl": "https://storage.../uploads/2026/02/thumb-image-abc123.jpg",
        "mediaId": 45
    }
}

// 허용 파일: jpg, jpeg, png, gif, webp
// 최대 크기: 5MB
// 이미지 최적화: 자동 리사이징 (최대 1920px)
```

#### POST /api/reviews (서평 작성 - 리치 텍스트 지원)
**리치 텍스트 서평 작성**
```json
// Headers: Authorization: Bearer {token}

// Request
{
    "bookId": 1,
    "programType": "dokmo",
    "rating": 5,
    "title": "감동적인 책이었습니다",
    "content": "<p>이 책은 정말 <strong>감동적</strong>이었습니다.</p><img src=\"https://storage.../image.jpg\" alt=\"책 사진\"><p>특히 <a href=\"https://...\">이 부분</a>이 인상 깊었습니다.</p>",
    "kdcCode": "800"
}

// Response 201
{
    "success": true,
    "data": {
        "reviewId": 10,
        "wordCount": 156,      // 자동 계산된 글자수
        "stampCount": 11,
        "badgeEarned": { "kdcCode": "800", "name": "문학" }
    }
}
```

---

## 5. 비즈니스 로직 (Pseudo Code)

### 5.1 독토 참여 신청

```
FUNCTION joinDiscussion(userId, discussionId):

    // 1. 독토 존재 확인
    discussion = DB.findDiscussion(discussionId)
    IF discussion IS NULL:
        RETURN Error("존재하지 않는 독토입니다")

    // 2. 활성 상태 확인
    IF discussion.isActive IS FALSE:
        RETURN Error("마감된 독토입니다")

    // 3. 정원 확인
    IF discussion.currentMembers >= discussion.maxMembers:
        RETURN Error("정원이 초과되었습니다")

    // 4. 중복 신청 확인
    existingJoin = DB.findDiscussionUser(discussionId, userId)
    IF existingJoin IS NOT NULL:
        RETURN Error("이미 참여 중인 독토입니다")

    // 5. 참여 등록
    DB.createDiscussionUser(discussionId, userId)

    // 6. 현재 인원 증가
    DB.incrementDiscussionMembers(discussionId)

    RETURN Success("참여 신청 완료")
```

### 5.2 서평 작성 및 스탬프/뱃지 처리

```
FUNCTION createReview(userId, bookId, programType, rating, content, kdcCode):

    // 1. 입력 검증
    IF rating < 1 OR rating > 5:
        RETURN Error("별점은 1-5 사이여야 합니다")

    IF LENGTH(content) < 10:
        RETURN Error("서평은 10자 이상 작성해주세요")

    // 2. 서평 저장
    review = DB.createReview({
        userId, bookId, programType, rating, content, kdcCode
    })

    // 3. 스탬프 증가 (서평 수 카운트)
    stampCount = DB.countUserReviews(userId)

    // 4. 뱃지 처리
    badgeEarned = NULL
    existingBadge = DB.findUserBadge(userId, kdcCode)

    IF existingBadge IS NULL:
        // 새 뱃지 획득
        badge = DB.findBadgeByKdcCode(kdcCode)
        DB.createUserBadge(userId, badge.id)
        badgeEarned = badge
    ELSE:
        // 기존 뱃지 카운트 증가
        DB.incrementUserBadgeCount(userId, kdcCode)

    // 5. 스탬프 보상 확인
    IF stampCount == 10:
        TRIGGER sendReward(userId, "스타벅스 기프티콘")
    ELSE IF stampCount == 20:
        TRIGGER sendReward(userId, "도서 상품권")

    RETURN Success({
        reviewId: review.id,
        stampCount: stampCount,
        badgeEarned: badgeEarned
    })
```

### 5.3 독모 세션 신청

```
FUNCTION applyDokmoSession(userId, groupId, timeSlotId, sessionDate):

    // 1. 그룹 존재 확인
    group = DB.findReadingGroup(groupId)
    IF group IS NULL:
        RETURN Error("존재하지 않는 독모 그룹입니다")

    // 2. 시간대 유효성 확인
    timeSlot = DB.findTimeSlot(timeSlotId)
    IF timeSlot IS NULL OR timeSlot.groupId != groupId:
        RETURN Error("유효하지 않은 시간대입니다")

    // 3. 날짜 유효성 확인 (과거 날짜 불가)
    IF sessionDate < TODAY:
        RETURN Error("과거 날짜는 신청할 수 없습니다")

    // 4. 중복 신청 확인
    existing = DB.findDokmoSession(userId, groupId, timeSlotId, sessionDate)
    IF existing IS NOT NULL:
        RETURN Error("이미 신청한 세션입니다")

    // 5. 세션 생성
    session = DB.createDokmoSession({
        userId, groupId, timeSlotId, sessionDate
    })

    RETURN Success({
        sessionId: session.id,
        message: "독모 신청 완료"
    })
```

### 5.4 좋아요 토글

```
FUNCTION toggleLike(userId, targetType, targetId):

    // 1. 대상 존재 확인
    IF targetType == "review":
        target = DB.findReview(targetId)
    ELSE IF targetType == "post":
        target = DB.findTalkPost(targetId)
    ELSE IF targetType == "comment":
        target = DB.findComment(targetId)

    IF target IS NULL:
        RETURN Error("대상을 찾을 수 없습니다")

    // 2. 기존 좋아요 확인
    existingLike = DB.findLike(userId, targetType, targetId)

    IF existingLike IS NOT NULL:
        // 좋아요 취소
        DB.deleteLike(existingLike.id)
        DB.decrementLikesCount(targetType, targetId)
        isLiked = FALSE
    ELSE:
        // 좋아요 추가
        DB.createLike(userId, targetType, targetId)
        DB.incrementLikesCount(targetType, targetId)
        isLiked = TRUE

    newLikesCount = DB.getLikesCount(targetType, targetId)

    RETURN Success({
        isLiked: isLiked,
        likesCount: newLikesCount
    })
```

### 5.5 내 서재 레이더 데이터 계산

```
FUNCTION calculateRadarData(userId):

    // 1. 사용자의 모든 서평 조회
    reviews = DB.findReviewsByUser(userId)

    // 2. KDC 코드별 카운트
    kdcCounts = {}
    FOR EACH review IN reviews:
        kdcCode = review.kdcCode
        IF kdcCode IN kdcCounts:
            kdcCounts[kdcCode] += 1
        ELSE:
            kdcCounts[kdcCode] = 1

    // 3. 최대값 찾기 (정규화용)
    maxCount = MAX(kdcCounts.values()) OR 1

    // 4. 레이더 데이터 생성 (0-100 스케일)
    radarData = []
    FOR EACH kdc IN ["000", "100", "200", ..., "900"]:
        count = kdcCounts[kdc] OR 0
        value = (count / maxCount) * 100
        radarData.append({
            kdcCode: kdc,
            label: KDC_LABELS[kdc],
            value: ROUND(value)
        })

    // 5. 선호 카테고리 찾기
    preferredKdc = KEY_WITH_MAX_VALUE(kdcCounts)

    RETURN {
        radarData: radarData,
        preferredCategory: {
            kdcCode: preferredKdc,
            name: KDC_LABELS[preferredKdc]
        }
    }
```

### 5.6 심사대상 서평 엑셀 추출

```
FUNCTION exportReviewsToExcel(year, programType = NULL):

    // 1. 심사대상 서평 조회
    query = SELECT
        u.student_id AS "아이디",
        u.department AS "전공",
        u.name AS "이름",
        r.title AS "글제목",
        CONCAT(b.title, ' / ', b.author, ' / ', b.publisher) AS "서지사항",
        r.word_count AS "글자수",
        r.created_at AS "글쓴 날짜"
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN books b ON r.book_id = b.id
    WHERE r.year = year AND r.is_eligible = TRUE

    IF programType IS NOT NULL:
        query += AND r.program_type = programType

    reviews = DB.execute(query)

    // 2. 엑셀 워크북 생성
    workbook = ExcelJS.createWorkbook()
    sheet = workbook.addSheet("심사대상 서평")

    // 3. 헤더 설정
    sheet.addRow([
        "아이디(학번)", "전공", "이름",
        "글제목", "서지사항", "글자수", "글쓴 날짜"
    ])
    sheet.setHeaderStyle(bold: true, backgroundColor: '#EEEEEE')

    // 4. 데이터 추가
    FOR EACH review IN reviews:
        sheet.addRow([
            review.아이디,
            review.전공,
            review.이름,
            review.글제목,
            review.서지사항,
            review.글자수,
            FORMAT_DATE(review.글쓴_날짜, 'YYYY-MM-DD')
        ])

    // 5. 컬럼 너비 자동 조정
    sheet.autoFitColumns()

    // 6. 파일 생성 및 반환
    filename = "심사대상_서평_" + year + ".xlsx"
    buffer = workbook.toBuffer()

    RETURN {
        filename: filename,
        buffer: buffer,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
```

### 5.7 사용자별 서평 PDF 생성

```
FUNCTION generateUserReviewsPDF(userId, year):

    // 1. 사용자 정보 조회
    user = DB.findUser(userId)
    IF user IS NULL:
        RETURN Error("사용자를 찾을 수 없습니다")

    // 2. 해당 연도 서평 조회
    reviews = DB.findReviews({
        userId: userId,
        year: year,
        orderBy: 'created_at ASC'
    })

    IF reviews.length == 0:
        RETURN Error("해당 연도에 작성된 서평이 없습니다")

    // 3. PDF 문서 생성
    pdf = PDFDocument.create({
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
    })

    // 4. 표지 페이지
    pdf.addPage()
    pdf.setFont("NanumGothic", 24, bold: true)
    pdf.addText("서평 모음집", centerAlign: true)
    pdf.addLineBreak(2)
    pdf.setFont("NanumGothic", 18)
    pdf.addText(user.name, centerAlign: true)
    pdf.addText(user.department, centerAlign: true)
    pdf.addLineBreak()
    pdf.addText(year + "년", centerAlign: true)

    // 5. 각 서평 추가
    FOR EACH review IN reviews:
        pdf.addPage()

        // 서평 제목
        pdf.setFont("NanumGothic", 16, bold: true)
        pdf.addText(review.title OR "무제")
        pdf.addLineBreak()

        // 도서 정보
        pdf.setFont("NanumGothic", 10, color: '#666666')
        pdf.addText("도서: " + review.book.title + " / " + review.book.author)
        pdf.addText("작성일: " + FORMAT_DATE(review.created_at, 'YYYY년 MM월 DD일'))
        pdf.addText("글자수: " + review.word_count + "자")
        pdf.addLineBreak()
        pdf.addHorizontalLine()
        pdf.addLineBreak()

        // 본문 (HTML → PDF 변환)
        pdf.setFont("NanumGothic", 12)
        pdf.addRichText(review.content)  // HTML 파싱하여 스타일 적용

    // 6. 파일 생성
    filename = user.name + "_서평모음_" + year + ".pdf"
    buffer = pdf.toBuffer()

    RETURN {
        filename: filename,
        buffer: buffer,
        contentType: "application/pdf"
    }
```

### 5.8 표절 검사 (카피킬러 API 연동)

```
FUNCTION checkPlagiarism(reviewId, adminUserId):

    // 1. 서평 조회
    review = DB.findReview(reviewId)
    IF review IS NULL:
        RETURN Error("서평을 찾을 수 없습니다")

    // 2. 이미 검사 중인지 확인
    pendingLog = DB.findPlagiarismLog({
        reviewId: reviewId,
        status: 'pending'
    })
    IF pendingLog IS NOT NULL:
        RETURN Error("이미 검사가 진행 중입니다")

    // 3. 검사 로그 생성
    log = DB.createPlagiarismLog({
        reviewId: reviewId,
        checkedBy: adminUserId,
        status: 'pending'
    })

    TRY:
        // 4. 카피킬러 API 호출
        // 순수 텍스트만 전송 (HTML 태그 제거)
        plainText = STRIP_HTML_TAGS(review.content)

        response = HTTP.POST(COPYKILLER_API_URL, {
            headers: {
                "Authorization": "Bearer " + COPYKILLER_API_KEY,
                "Content-Type": "application/json"
            },
            body: {
                "text": plainText,
                "title": review.title,
                "checkOption": {
                    "webSearch": true,
                    "academicDB": true
                }
            }
        })

        // 5. 결과 파싱
        result = response.json()
        similarityScore = result.similarity
        matchedSources = result.sources.map(s => ({
            source: s.name,
            url: s.url,
            matchRate: s.matchPercentage
        }))

        // 6. 검사 결과 저장
        DB.updatePlagiarismLog(log.id, {
            status: 'completed',
            similarityScore: similarityScore,
            matchedSources: matchedSources,
            apiResponse: result
        })

        // 7. 서평에 결과 업데이트
        DB.updateReview(reviewId, {
            plagiarismChecked: true,
            plagiarismScore: similarityScore,
            plagiarismReport: matchedSources,
            plagiarismCheckedAt: NOW()
        })

        RETURN Success({
            reviewId: reviewId,
            similarityScore: similarityScore,
            matchedSources: matchedSources,
            status: 'completed'
        })

    CATCH error:
        // 8. 에러 처리
        DB.updatePlagiarismLog(log.id, {
            status: 'failed',
            errorMessage: error.message
        })

        RETURN Error("표절 검사 중 오류가 발생했습니다: " + error.message)
```

### 5.9 도서 검색 (알라딘 API 연동)

```
FUNCTION searchBooks(query, searchType = 'title', page = 1):

    // 1. 캐시 확인 (동일 검색어 재사용)
    cacheKey = "book_search:" + searchType + ":" + query + ":" + page
    cached = CACHE.get(cacheKey)
    IF cached IS NOT NULL:
        RETURN cached

    // 2. 알라딘 API 호출
    aladinParams = {
        ttbkey: ALADIN_API_KEY,
        Query: query,
        QueryType: SEARCH_TYPE_MAP[searchType],  // 'Title', 'Author', 'ISBN'
        MaxResults: 20,
        start: (page - 1) * 20 + 1,
        SearchTarget: 'Book',
        output: 'js',
        Version: '20131101',
        Cover: 'Big'
    }

    response = HTTP.GET(ALADIN_API_URL, aladinParams)
    aladinData = response.json()

    // 3. 데이터 변환
    books = []
    FOR EACH item IN aladinData.item:
        book = {
            isbn: item.isbn13 OR item.isbn,
            title: item.title,
            author: item.author,
            publisher: item.publisher,
            publishedDate: item.pubDate,
            coverUrl: item.cover,
            description: TRUNCATE(item.description, 500),
            price: item.priceSales,
            source: 'aladin',
            aladinItemId: item.itemId
        }

        // 4. 도서관 소장 여부 확인
        libraryBook = DB.findBookByISBN(book.isbn)
        book.isLibraryOwned = (libraryBook IS NOT NULL)
        IF libraryBook IS NOT NULL:
            book.libraryBookId = libraryBook.id

        books.append(book)

    result = {
        books: books,
        pagination: {
            currentPage: page,
            totalResults: aladinData.totalResults,
            hasMore: (page * 20 < aladinData.totalResults)
        }
    }

    // 5. 결과 캐싱 (10분)
    CACHE.set(cacheKey, result, TTL: 600)

    RETURN result
```

### 5.10 서평 작성 (리치 텍스트 처리)

```
FUNCTION createReviewWithRichText(userId, bookId, programType, rating, title, htmlContent, kdcCode):

    // 1. 입력 검증
    IF rating < 1 OR rating > 5:
        RETURN Error("별점은 1-5 사이여야 합니다")

    // 2. HTML 정제 (XSS 방지)
    sanitizedContent = SANITIZE_HTML(htmlContent, {
        allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3',
                      'ul', 'ol', 'li', 'a', 'img', 'blockquote'],
        allowedAttributes: {
            'a': ['href', 'target'],
            'img': ['src', 'alt', 'width', 'height']
        },
        allowedSchemes: ['http', 'https']
    })

    // 3. 순수 텍스트 추출 및 글자수 계산
    plainText = STRIP_HTML_TAGS(sanitizedContent)
    wordCount = LENGTH(plainText.replace(/\s/g, ''))  // 공백 제외

    IF wordCount < 100:
        RETURN Error("서평은 100자 이상 작성해주세요")

    // 4. 도서 확인 (외부 도서면 등록)
    book = DB.findBook(bookId)
    IF book IS NULL:
        RETURN Error("도서를 찾을 수 없습니다")

    // 5. 서평 저장
    currentYear = YEAR(NOW())
    review = DB.createReview({
        userId: userId,
        bookId: bookId,
        programType: programType,
        rating: rating,
        title: title,
        content: sanitizedContent,
        contentPlain: plainText,
        wordCount: wordCount,
        kdcCode: kdcCode,
        year: currentYear,
        isEligible: true
    })

    // 6. 스탬프/뱃지 처리 (기존 로직)
    stampCount = DB.countUserReviews(userId)
    badgeEarned = processBadge(userId, kdcCode)

    RETURN Success({
        reviewId: review.id,
        wordCount: wordCount,
        stampCount: stampCount,
        badgeEarned: badgeEarned
    })
```

---

## 6. 인증 및 권한

### 6.1 인증 방식
- **JWT (JSON Web Token)** 사용
- Access Token: 1시간 유효
- Refresh Token: 7일 유효

### 6.2 토큰 구조
```json
{
    "userId": 1,
    "email": "user@skku.edu",
    "role": "user",
    "iat": 1707638400,
    "exp": 1707642000
}
```

### 6.3 권한 레벨

| 역할 | 권한 |
|------|------|
| **user** | 조회, 신청, 서평작성, 게시물작성 |
| **admin** | 모든 user 권한 + 콘텐츠 관리(CRUD) |

### 6.4 API 권한 매트릭스

| API | user | admin |
|-----|------|-------|
| GET /api/discussions | ✅ | ✅ |
| POST /api/discussions | ❌ | ✅ |
| PUT /api/discussions/:id | ❌ | ✅ |
| DELETE /api/discussions/:id | ❌ | ✅ |
| POST /api/discussions/:id/join | ✅ | ✅ |
| POST /api/reviews | ✅ | ✅ |
| DELETE /api/reviews/:id | 본인만 | ✅ |

---

## 7. 외부 API 연동

### 7.1 알라딘 API

도서관 소장 도서 외 일반 도서 검색을 위한 알라딘 Open API 연동

**API 정보**
- API 문서: https://www.aladin.co.kr/ttb/api/ItemSearch.aspx
- 인증: TTBKey (API 키 발급 필요)
- 요청 제한: 일 5,000건

**환경 변수**
```env
ALADIN_API_KEY=ttbxxxxxxxxxxxxxx
ALADIN_API_URL=http://www.aladin.co.kr/ttb/api/ItemSearch.aspx
```

**사용 엔드포인트**
| 기능 | API | 설명 |
|------|-----|------|
| 도서 검색 | ItemSearch | 제목/저자/ISBN 검색 |
| 도서 상세 | ItemLookUp | ISBN으로 상세 정보 |

**주의사항**
- 이미지 URL은 HTTP 프로토콜 → HTTPS로 변환 필요
- 검색 결과 캐싱 권장 (Redis, 10분)
- 저작권 표시: "알라딘 제공"

---

### 7.2 카피킬러 API (표절 검사)

서평 표절 검사를 위한 카피킬러 API 연동

**API 정보**
- 공식 사이트: https://www.copykiller.co.kr/
- API 문의: 별도 계약 필요 (학교 라이선스 확인)
- 대안: 직접 구현 또는 다른 서비스 검토

**환경 변수**
```env
COPYKILLER_API_KEY=xxxxxxxxxxxxxxxx
COPYKILLER_API_URL=https://api.copykiller.co.kr/v1/check
COPYKILLER_CALLBACK_URL=https://ogeoseo.skku.edu/api/webhook/plagiarism
```

**API 사용 방식**
```
1. 텍스트 제출 → Job ID 반환
2. 비동기 처리 (수 분 소요)
3. Webhook 또는 폴링으로 결과 수신
```

**대안 검토**
| 서비스 | 장점 | 단점 |
|--------|------|------|
| 카피킬러 | 국내 DB 풍부 | 비용 높음 |
| Turnitin | 학술 DB 강점 | 외국 서비스 |
| 자체 구현 | 비용 없음 | 정확도 낮음 |

**카피킬러 API 미지원 시 대안**:
- 수동 검사 링크 제공
- 관리자가 카피킬러 웹에서 직접 검사
- 결과를 시스템에 수동 입력

---

### 7.3 이미지 저장소 (S3/Firebase)

서평 에디터 이미지 업로드용 저장소

**AWS S3 설정**
```env
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=ogeoseo-uploads
```

**폴더 구조**
```
ogeoseo-uploads/
├── reviews/
│   └── {year}/{month}/{filename}
├── profiles/
│   └── {user_id}/{filename}
└── temp/
    └── {upload_id}/{filename}
```

**이미지 처리**
- 업로드 시 리사이징: 최대 1920px (가로)
- 썸네일 생성: 400px
- 포맷 최적화: WebP 변환
- CDN 연동 권장: CloudFront

---

### 7.4 PDF 생성 (Puppeteer/PDFKit)

**권장 라이브러리**
```javascript
// Node.js
const puppeteer = require('puppeteer');  // HTML → PDF (리치 텍스트 유지)
const PDFKit = require('pdfkit');        // 프로그래밍 방식 생성
const ExcelJS = require('exceljs');      // 엑셀 생성
```

**PDF 생성 옵션**
```javascript
const pdfOptions = {
    format: 'A4',
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size:10px;text-align:center;">오거서 서평 모음집</div>',
    footerTemplate: '<div style="font-size:10px;text-align:center;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
};
```

**한글 폰트**
- Puppeteer: 시스템 폰트 사용 (나눔고딕 설치 필요)
- PDFKit: 폰트 파일 임베드 필요
```javascript
pdf.registerFont('NanumGothic', './fonts/NanumGothic.ttf');
```

---

## 8. 개발 우선순위

### Phase 1: 핵심 기능 (2주)
1. ✅ 사용자 인증 (회원가입, 로그인)
2. ✅ 독토 조회/참여
3. ✅ 독모 조회/신청
4. ✅ 서평 CRUD

### Phase 2: 부가 기능 (2주)
5. Talk 게시물 CRUD
6. 좋아요/댓글
7. 내 서재 (뱃지, 스탬프)

### Phase 3: 관리 기능 (1주)
8. 관리자 독토 관리
9. 관리자 도서/공지 관리
10. 주차별 도서 배정

### Phase 4: 고도화 - 에디터/도서검색 (1주) ⭐ 신규
11. **리치 텍스트 에디터** 서평 작성
12. **알라딘 API 연동** 도서 검색
13. **이미지 업로드** (S3/Firebase)

### Phase 5: 관리자 도구 (1주) ⭐ 신규
14. **엑셀 추출** (심사대상 리스트)
15. **PDF 생성** (사용자별 서평 모음)
16. **표절 검사** (카피킬러 연동)

### Phase 6: 최적화 (1주)
17. 검색 최적화 (Elasticsearch 검토)
18. 알림 기능 (Push/Email)
19. 캐싱 고도화

---

## 부록: 참고 사항

### A. 현재 프론트엔드 데이터 구조

현재 프론트엔드는 `SharedDataContext`를 사용하여 클라이언트 사이드에서 상태를 관리합니다. 백엔드 연동 시 이 Context의 데이터를 API 호출로 대체해야 합니다.

**파일 위치**: `lib/shared-data-context.tsx`

### B. 환경 변수 예시

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ogeoseo

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=ogeoseo-uploads

# Server
PORT=3001
NODE_ENV=development
```

### C. 연락처

- **PO**: [이름] - [이메일]
- **프론트엔드**: [이름] - [이메일]
- **문의**: ogeoseo@skku.edu

---

---

## 부록 D: 프론트엔드 변경 사항

### D.1 리치 텍스트 에디터 통합

**권장 라이브러리**: TipTap (React/Vue) 또는 Quill

**필요 기능**
- 기본 서식: 굵게, 기울임, 밑줄
- 제목: H1, H2, H3
- 리스트: 순서/비순서
- 링크: URL 삽입
- 이미지: 업로드 및 삽입
- 인용구

**구현 파일**
```
components/
├── rich-text-editor/
│   ├── Editor.tsx          # 에디터 컴포넌트
│   ├── Toolbar.tsx         # 툴바 (서식 버튼)
│   ├── ImageUpload.tsx     # 이미지 업로드 모달
│   └── LinkInput.tsx       # 링크 입력 모달
```

**이미지 업로드 플로우**
```
1. 사용자가 이미지 버튼 클릭
2. 파일 선택 또는 드래그앤드롭
3. /api/uploads/image 호출
4. 반환된 URL을 에디터에 삽입
5. 서평 저장 시 content에 <img> 태그 포함
```

---

### D.2 도서 검색 UI

**서평 작성 시 도서 검색**
```
components/
├── book-search/
│   ├── BookSearchModal.tsx    # 검색 모달
│   ├── BookSearchInput.tsx    # 검색 입력
│   ├── BookSearchResults.tsx  # 검색 결과 목록
│   └── BookCard.tsx           # 개별 도서 카드
```

**검색 플로우**
```
1. 서평 작성 버튼 클릭
2. 도서 검색 모달 표시
3. 검색어 입력 (제목/저자/ISBN)
4. 알라딘 API 검색 결과 표시
5. 도서 선택 → bookId 획득
6. 서평 작성 폼으로 이동
```

**UI 요구사항**
- 도서관 소장 도서: 초록색 뱃지 "소장"
- 외부 도서: 파란색 뱃지 "알라딘"
- 검색 결과: 표지 이미지, 제목, 저자, 출판사

---

### D.3 관리자 페이지 추가 기능

**신규 관리자 메뉴**
```
pages/admin/
├── reviews/
│   ├── index.tsx           # 서평 관리 목록
│   ├── export.tsx          # 엑셀/PDF 추출 페이지
│   └── plagiarism.tsx      # 표절 검사 페이지
```

**엑셀 추출 UI**
- 연도 선택 드롭다운
- 프로그램 필터 (독모/독토/일반)
- "엑셀 다운로드" 버튼
- 다운로드 진행률 표시

**PDF 추출 UI**
- 사용자 검색/선택 (다중 선택 가능)
- 연도 선택
- "PDF 생성" 버튼
- 일괄 생성 시: ZIP 다운로드

**표절 검사 UI**
- 서평 목록 (체크박스 선택)
- "표절 검사" 버튼
- 검사 진행률 표시
- 결과: 유사도 % 및 색상 (20% 이상: 빨강)
- 상세 보기: 매칭된 소스 목록

---

### D.4 기존 코드 수정 필요 사항

**서평 작성 폼 수정**
```typescript
// 기존: 단순 textarea
// 변경: 리치 텍스트 에디터

// components/pages/review-write-page.tsx
- <textarea value={content} onChange={...} />
+ <RichTextEditor
+   value={content}
+   onChange={setContent}
+   onImageUpload={handleImageUpload}
+ />
```

**서평 상세 보기 수정**
```typescript
// 기존: 단순 텍스트 표시
// 변경: HTML 렌더링

- <p>{review.content}</p>
+ <div
+   className="prose"
+   dangerouslySetInnerHTML={{ __html: sanitizeHtml(review.content) }}
+ />
```

**도서 선택 컴포넌트 수정**
```typescript
// 기존: 도서관 소장 도서만
// 변경: 알라딘 검색 통합

- <LibraryBookSelect onSelect={setBookId} />
+ <BookSearchSelect
+   onSelect={handleBookSelect}
+   includeExternal={true}  // 알라딘 포함
+ />
```

---

*본 문서는 오거서 백엔드 개발을 위한 명세서입니다. 변경 사항 발생 시 PO에게 문의해주세요.*
