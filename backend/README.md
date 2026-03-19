# Backend

카페 리워드 dApp의 NestJS 백엔드입니다.

## 주요 역할

- 메뉴 데이터 조회
- 주문 요청 처리
- 주문 서명 생성
- 주문 히스토리 조회
- 잔디판 데이터 집계
- 브랜드별 주문 수 집계
- PostgreSQL + Prisma 연동

## Tech Stack

- NestJS
- Prisma
- PostgreSQL
- ethers.js

## 환경변수

`.env`에 아래 값이 필요합니다.

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kamin"
PRIVATE_KEY=YOUR_SIGNER_PRIVATE_KEY
STARBUCKS_MARKET_ADDRESS=0xb80A6060e3611a0A8A410E2db76B91dC08a5F9b9
TWOSOME_MARKET_ADDRESS=0xB4e6d4c228e5bfd99271eC2E4D664092a429fA4F
MEGA_MARKET_ADDRESS=0x85F1cA2B89C26fe613a010b83456594C4a742C53
HOLLYS_MARKET_ADDRESS=0x70e98e267f365137157C0E7e5AdD36318Db5502B
KAMIN_ADDRESS=0x8911C397ABc19635fe0b6B7bD93071d463e67573
```

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. Prisma 준비

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. 개발 서버 실행

```bash
npm run start:dev
```

기본 포트는 `3001`입니다.

## Architecture

```mermaid
flowchart LR
    U[User]
    FE[Frontend<br/>Next.js + wagmi + RainbowKit]
    BE[Backend<br/>NestJS + Prisma]
    DB[(PostgreSQL)]

    subgraph CHAIN[Sepolia]
        K[Kamin Contract]
        M[CafeMarket Contracts<br/>Starbucks / Twosome / Mega / Hollys]
    end

    U -->|wallet connect / order request| FE
    FE -->|GET menus / history / grass / summary| BE
    BE -->|read / write| DB
    BE -->|orderId, rewardAmount, signature| FE
    FE -->|confirmOrder| K
    K -->|recordOrder| M
    K -->|mint KAMIN| U
```

## Order Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as PostgreSQL
    participant K as Kamin
    participant M as CafeMarket

    U->>FE: 주문 요청
    FE->>BE: POST /order
    BE->>DB: 주문 저장
    BE-->>FE: orderId, rewardAmount, signature
    FE->>K: confirmOrder
    K->>M: recordOrder
    K-->>U: KAMIN mint
```

## API

### `GET /order/menus?brand=starbucks`

브랜드별 메뉴 조회

### `POST /order`

주문 생성 및 서명 응답

요청 예시:

```json
{
  "user": "0xUserAddress",
  "market": "0xMarketAddress",
  "menuName": "Americano"
}
```

응답 예시:

```json
{
  "orderId": 1742470000,
  "rewardAmount": 120,
  "signature": "0x..."
}
```

### `GET /order/history?user=0x...`

사용자 주문 히스토리 조회

### `GET /order/grass?user=0x...`

잔디판용 날짜별 주문 수 조회

### `GET /order/summary?user=0x...`

브랜드별 주문 수 요약 조회

## 참고

- 프론트는 직접 서명을 만들지 않고, backend가 생성한 `signature`를 받아 `confirmOrder`를 호출합니다.
- 브랜드/메뉴 데이터는 Prisma seed를 통해 초기화됩니다.
